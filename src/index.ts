import { appEnv } from '@/config';
import { pool } from '@/infrastructure/db';
import { createApp } from '@/infrastructure/http/app';

import { log } from '@/common/utils/standalone.logger';

const server = createApp();

server.listen(appEnv.PORT);
log.info(`🦊 SuggestMe v2.0 Powered By Elysia is running at ${server.server?.hostname}:${server.server?.port}`);

let isShuttingDown = false; // Shutdown flagging

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
    if (e instanceof Error) {
      log.error({ error: e } , `❌ Error closing database pool: ${e.message}`);  
    } else {
        log.error({ error: e } , '❌ Error closing database pool: Unknown error');
    }
  }

  // HTTP Cleanup
  try {
    log.info('⏳ Stopping HTTP server...');
    await server.stop();
    log.info('✅ HTTP server stopped.');
  } catch (e) {
    if (e instanceof Error) {
      log.error({ error: e }, `❌ Error stopping HTTP server: ${e.message}`);
    } else {
        log.error({ error: e }, '❌ Error stopping HTTP server: Unknown error');
    }
  }

  log.info('👋 Shutdown complete. Exiting process...');
  process.exit(0); 
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
