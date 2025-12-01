import { appEnv } from '@/config';
import { pool } from '@/infrastructure/db';
import { createApp } from '@/infrastructure/http/app';

import { log } from '@/common/utils/standalone.logger';

import { normalizeErrorLog } from './common/utils/log.util';

let isShuttingDown = false; // Shutdown flagging

// Shutdown function
const shutdown = async () => {
  if (isShuttingDown) {
    log.warn('🛑 Shutdown already in progress. Ignoring signal...');
    return;
  }

  isShuttingDown = true;
  log.info('🛑 Shutting down gracefully...');

  // DB Pool Cleanup
  try {
    log.info('⏳ Closing database pool...');
    await pool.end();
    log.info('✅ Database pool closed.');
  } catch (e) {
    normalizeErrorLog(e, '❌ Error closing database pool');
  }

  // HTTP Cleanup
  try {
    log.info('⏳ Stopping HTTP server...');
    await server.stop();
    log.info('✅ HTTP server stopped.');
  } catch (e) {
    normalizeErrorLog(e, '❌ Error stopping HTTP server');
  }

  log.info('👋 Shutdown complete. Exiting process...');
  process.exit(0);
};

let server: ReturnType<typeof createApp>;

// Start function
async function start() {
  server = createApp();
  server.listen(appEnv.PORT);
  log.info(
    `🦊 SuggestMe v2.0.0 Powered By Elysia is running at ${server.server?.hostname}:${server.server?.port}`,
  );

  // Signal handlers
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// Execute the start function and catch fatal errors
start().catch((e) => {
  normalizeErrorLog(e, '🚨 Fatal error during application startup');
  process.exit(1);
});
