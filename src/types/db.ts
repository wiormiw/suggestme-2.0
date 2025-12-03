import { DBSchema } from '@/infrastructure/db';
import { ExtractTablesWithRelations } from 'drizzle-orm';
import { NodePgDatabase, NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import { PgTransaction } from 'drizzle-orm/pg-core';

export type DBType = NodePgDatabase<DBSchema>;
export type DBTransaction = PgTransaction<
  NodePgQueryResultHKT,
  DBSchema,
  ExtractTablesWithRelations<DBSchema>
>;
