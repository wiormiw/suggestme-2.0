import { relations } from 'drizzle-orm';

import { foodComments, foodRating, foods } from './foods';
import { users } from './users';

export const foodsRelations = relations(foods, ({ many }) => ({
  comments: many(foodComments),
  ratings: many(foodRating),
}));

export const foodCommentsRelations = relations(foodComments, ({ one }) => ({
  food: one(foods, {
    fields: [foodComments.foodId],
    references: [foods.id],
  }),
  user: one(users, {
    fields: [foodComments.userId],
    references: [users.id],
  }),
}));

export const foodRatingRelations = relations(foodRating, ({ one }) => ({
  food: one(foods, {
    fields: [foodRating.foodId],
    references: [foods.id],
  }),
  user: one(users, {
    fields: [foodRating.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  comments: many(foodComments),
  ratings: many(foodRating),
}));
