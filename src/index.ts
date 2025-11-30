import { pool } from '@/infrastructure/db';

import { createApp } from './app';
import { appEnv } from './config';

const server = createApp();

server.listen(appEnv.PORT);
console.log(`🦊 Elysia is running at ${server.server?.hostname}:${server.server?.port}`);

const shutdown = async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await pool.end();
  await server.stop();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
