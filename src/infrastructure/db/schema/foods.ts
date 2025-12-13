import { boolean, integer, pgEnum, pgTable, text, unique, uuid } from 'drizzle-orm/pg-core';

import { MOOD_LIST } from '@/common/constants/foods.constants.ts';

import { auditSchema } from './_columns';
import { users } from './users';

export const moodEnum = pgEnum('mood', [...MOOD_LIST]);
export const foods = pgTable(
  'foods',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    mood: moodEnum('mood').notNull(),
    isAvailable: boolean('is_available').default(true).notNull(),
    ...auditSchema,
  },
  (table) => [unique().on(table.name)],
);

export const foodComments = pgTable('food_comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  foodId: uuid('food_id').references(() => foods.id),
  userId: uuid('user_id').references(() => users.id),
  content: text('content').notNull(),
  ...auditSchema,
});

export const foodRating = pgTable(
  'food_rating',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    foodId: uuid('food_id').references(() => foods.id),
    userId: uuid('user_id').references(() => users.id),
    rating: integer('rating').notNull(),
    ...auditSchema,
  },
  (table) => [unique().on(table.foodId, table.userId)],
);

// Infer Types
export type NewFood = typeof foods.$inferInsert;
export type Food = typeof foods.$inferSelect;
export type FoodList = Food[];
export type NewFoodComment = typeof foodComments.$inferInsert;
export type FoodComment = typeof foodComments.$inferSelect;
export type FoodCommentList = FoodComment[];
export type NewFoodRating = typeof foodRating.$inferInsert;
export type FoodRating = typeof foodRating.$inferSelect;
export type FoodRatingList = FoodRating[];
