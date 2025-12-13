import { appEnv } from '@/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as foodSchema from './schema/foods';
import * as relations from './schema/relation';
import * as userSchema from './schema/users';

export { mapPostgresError as mapDbError } from './postgres/error.map.ts';

export const schema = {
  ...userSchema,
  ...foodSchema,
  ...relations,
};

export const pool = new Pool({
  connectionString: appEnv?.DB_URL,
  options: '-c TimeZone=UTC',
});

export const db = drizzle(pool, {
  schema,
  logger: appEnv?.NODE_ENV === 'development',
});

export type DBSchema = typeof schema;
