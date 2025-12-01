import { boolean, pgEnum, pgTable, text, uuid, unique } from 'drizzle-orm/pg-core';

import { MOOD_LIST } from '@/common/constants/foods.constants.ts';

import { auditSchema } from './_columns';

export const moodEnum = pgEnum('mood', [...MOOD_LIST]);
export const foods = pgTable('foods', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  mood: moodEnum('mood').notNull(),
  isAvailable: boolean('is_available').default(true).notNull(),
  ...auditSchema,
}, (table) => [
  unique().on(table.name),
]);

// Infer Types
export type NewFood = typeof foods.$inferInsert;
export type Food = typeof foods.$inferSelect;
export type FoodList = Food[];
