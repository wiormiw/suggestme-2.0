import { pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { ROLE_LIST } from '@/common/constants/users.constants.ts';

import { auditSchema } from './_columns';

export const roleEnum = pgEnum('role', [...ROLE_LIST]);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  role: roleEnum('role').default('user').notNull(),
  ...auditSchema,
});

// Infer Types
export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type UserList = User[];
