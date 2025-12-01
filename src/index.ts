import { appEnv } from '@/config';
import { pool } from '@/infrastructure/db';
import { createApp } from '@/infrastructure/http/app';

import { log } from '@/common/utils/standalone.logger';

const server = createApp();

server.listen(appEnv.PORT);
log.info(`🦊 SuggestMe v2.0 Powered By Elysia is running at ${server.server?.hostname}:${server.server?.port}`);

const shutdown = async () => {
  log.info('🛑 Shutting down gracefully...');
  await pool.end();
  await server.stop();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
