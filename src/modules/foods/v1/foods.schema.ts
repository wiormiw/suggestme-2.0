import { Static, t } from 'elysia';

import { MOOD_LIST } from '@/common/constants/foods.constants';
import { idResponseSchema } from '@/common/schemas/common.schema';

const foodMood = t.UnionEnum([...MOOD_LIST]);

export const createFoodSchema = t.Object({
  name: t.String({ minLength: 3 }),
  mood: foodMood,
});

export const createFoodResponseSchema = idResponseSchema;

export const foodBaseResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  isAvailable: t.Boolean(),
});

export const foodResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  mood: foodMood,
  isAvailable: t.Boolean(),
});

export const suggestedFoodSchema = t.Object({
  suggestedName: t.String(),
});

export const createCommentSchema = t.Object({
  foodId: t.String(),
  content: t.String({ minLength: 1, maxLength: 500 }),
});

export const foodCommentResponseSchema = t.Object({
  id: t.String(),
  foodId: t.String(),
  content: t.String(),
  createdAt: t.String(),
  user: t.Object({
    id: t.String(),
    username: t.String(),
  }),
});

export const rateFoodSchema = t.Object({
  foodId: t.String(),
  rating: t.Integer({ minimum: 1, maximum: 5 }),
});

export const foodRatingResponseSchema = t.Object({
  foodId: t.String(),
  rating: t.Integer(),
  userId: t.String(),
});

export const foodDetailResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  mood: foodMood,
  isAvailable: t.Boolean(),
  averageRating: t.Number(),
  comments: t.Array(foodCommentResponseSchema),
  ratings: t.Array(
    t.Object({
      rating: t.Integer(),
      user: t.Object({
        id: t.String(),
        username: t.String(),
      }),
    }),
  ),
});

export const rateFoodResultSchema = t.Object({
  average: t.Number(),
  count: t.Number(),
});

// Infer Types
export type CreateFoodDto = Static<typeof createFoodSchema>;
export type CreateFoodResponseDto = Static<typeof createFoodResponseSchema>;
export type FoodBaseResponseDto = Static<typeof foodBaseResponseSchema>;
export type FoodResponseDto = Static<typeof foodResponseSchema>;
export type SuggestedFoodDto = Static<typeof suggestedFoodSchema>;
export type CreateCommentDto = Static<typeof createCommentSchema>;
export type FoodCommentResponseDto = Static<typeof foodCommentResponseSchema>;
export type RateFoodDto = Static<typeof rateFoodSchema>;
export type FoodRatingResponseDto = Static<typeof foodRatingResponseSchema>;
export type FoodDetailResponseDto = Static<typeof foodDetailResponseSchema>;
export type RateFoodResultDto = Static<typeof rateFoodResultSchema>;
