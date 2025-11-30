import { Elysia, t } from 'elysia';

import { MOOD_LIST } from '@/common/constants/foods.constants';
import { uuidParamSchema } from '@/common/schemas/common.schema';
import { ResponseFactory } from '@/common/utils/response.factory';
import { auth } from '@/http/middlewares/auth.middleware'; // Import plugin

import { createFoodResponseSchema, createFoodSchema, foodResponseSchema } from './foods.schema';
import { FoodService } from './foods.service';

export const foodsController = new Elysia({ prefix: '/foods', tags: ['Foods'] })
  .use(auth)
  .get(
    '/suggest/:mood',
    async ({ params: { mood } }) => {
      const result = await FoodService.suggest(mood);
      if (!result.success) throw result.error;
      return ResponseFactory.success(result.data, 'Food suggestion');
    },
    {
      isAuth: true,
      params: t.Object({ mood: t.UnionEnum([...MOOD_LIST]) }),
      response: ResponseFactory.createApiResponse(foodResponseSchema),
      detail: { summary: 'Get food suggestion by mood' },
    },
  )
  .get(
    '/',
    async () => {
      const result = await FoodService.getAllFoods();
      if (!result.success) throw result.error;
      return ResponseFactory.success(result.data, 'Foods retrieved');
    },
    {
      response: ResponseFactory.createApiResponse(t.Array(foodResponseSchema)),
      detail: { summary: 'Get all foods' },
    },
  )
  .get(
    '/:id',
    async ({ params: { id } }) => {
      const result = await FoodService.getFoodById(id);
      if (!result.success) throw result.error;
      return ResponseFactory.success(result.data, 'Food retrieved');
    },
    {
      isAuth: true,
      params: uuidParamSchema,
      response: ResponseFactory.createApiResponse(foodResponseSchema),
      detail: { summary: 'Get food by ID' },
    },
  )
  .post(
    '/',
    async ({ body }) => {
      const result = await FoodService.addFood(body);
      if (!result.success) throw result.error;
      return ResponseFactory.success(result.data, 'Food created');
    },
    {
      isAuth: true,
      isAdmin: true,
      body: createFoodSchema,
      response: ResponseFactory.createApiResponse(createFoodResponseSchema),
      detail: { summary: 'Create food (Admin only)' },
    },
  )
  .patch(
    '/:id',
    async ({ params: { id }, body }) => {
      const result = await FoodService.updateFood(id, body);
      if (!result.success) throw result.error;
      return ResponseFactory.success(result.data, 'Food updated');
    },
    {
      isAuth: true,
      isAdmin: true,
      params: uuidParamSchema,
      body: t.Partial(createFoodSchema),
      response: ResponseFactory.createApiResponse(foodResponseSchema),
      detail: { summary: 'Update food (Admin only)' },
    },
  )
  .delete(
    '/:id',
    async ({ params: { id } }) => {
      const result = await FoodService.deleteFood(id);
      if (!result.success) throw result.error;
      return ResponseFactory.success(result.data, 'Food deleted');
    },
    {
      isAuth: true,
      isAdmin: true,
      params: uuidParamSchema,
      response: ResponseFactory.createApiResponse(),
      detail: { summary: 'Delete food (Admin only)' },
    },
  );
