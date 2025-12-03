import { Static, t } from 'elysia';

import { MOOD_LIST } from '@/common/constants/foods.constants';
import { idResponseSchema } from '@/common/schemas/common.schema';

const foodMood = t.UnionEnum([...MOOD_LIST]);

export const createFoodSchema = t.Object({
  name: t.String({ minLength: 3 }),
  mood: foodMood,
});

export const createFoodResponseSchema = idResponseSchema;

export const foodResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  mood: foodMood,
  isAvailable: t.Boolean(),
});

export const suggestedFoodSchema = t.Object({
  suggestedName: t.String(),
});

// Infer Types
export type CreateFoodDto = Static<typeof createFoodSchema>;
export type CreateFoodResponseDto = Static<typeof createFoodResponseSchema>;
export type FoodResponseDto = Static<typeof foodResponseSchema>;
export type SuggestedFoodDto = Static<typeof suggestedFoodSchema>;
