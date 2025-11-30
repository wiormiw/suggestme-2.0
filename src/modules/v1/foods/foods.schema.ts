import { t } from 'elysia';

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

// Infer Types
export type CreateFoodDto = typeof createFoodSchema.static;
export type CreateFoodResponseDto = typeof createFoodResponseSchema.static;
export type FoodResponseDto = typeof foodResponseSchema.static;
