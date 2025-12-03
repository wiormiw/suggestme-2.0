import { Elysia, t } from 'elysia';
import { auth, ensureAdmin, ensureAuth } from '@/infrastructure/http/plugins/auth.plugins';
import { requestIdPlugin } from '@/infrastructure/http/plugins/request.id.plugins';

import { MOOD_LIST } from '@/common/constants/foods.constants';
import { paginatedQuery, uuidParamSchema } from '@/common/schemas/common.schema';
import { ResponseFactory } from '@/common/utils/response.factory';

import {
  createFoodResponseSchema,
  createFoodSchema,
  foodBaseResponseSchema,
  foodResponseSchema,
} from './foods.schema';
import { FoodService } from './foods.service';

export const foodsController = new Elysia({ prefix: '/foods', tags: ['Foods'] })
  .use(auth)
  .use(requestIdPlugin)
  .guard(
    {
      beforeHandle: ({ user }) => ensureAuth({ user }),
    },
    (app) =>
      app
        .get(
          '/suggest/:mood',
          async ({ requestId, params: { mood } }) => {
            const result = await FoodService.suggest(mood);
            if (!result.success) throw result.error;
            return ResponseFactory.success(requestId, result.data, 'Food suggestion.');
          },
          {
            params: t.Object({ mood: t.UnionEnum([...MOOD_LIST]) }),
            response: ResponseFactory.createApiResponse(foodBaseResponseSchema),
            detail: { summary: 'Get food suggestion by mood' },
          },
        )
        .get(
          '/',
          async ({ requestId, query: { limit, cursor, direction } }) => {
            const result = await FoodService.getAllFoods(limit, cursor, direction);
            if (!result.success) throw result.error;
            return ResponseFactory.success(requestId, result.data, 'Foods retrieved.');
          },
          {
            query: paginatedQuery,
            response: ResponseFactory.createPaginatedApiResponse(foodResponseSchema),
            detail: { summary: 'Get all foods' },
          },
        )
        .get(
          '/:id',
          async ({ requestId, params: { id } }) => {
            const result = await FoodService.getFoodById(id);
            if (!result.success) throw result.error;
            return ResponseFactory.success(requestId, result.data, 'Food retrieved.');
          },
          {
            params: uuidParamSchema,
            response: ResponseFactory.createApiResponse(foodResponseSchema),
            detail: { summary: 'Get food by ID' },
          },
        ),
  )
  .guard(
    {
      beforeHandle: ({ user }) => ensureAdmin({ user }),
    },
    (app) =>
      app
        .post(
          '/',
          async ({ requestId, body }) => {
            const result = await FoodService.addFood(body);
            if (!result.success) throw result.error;
            return ResponseFactory.success(requestId, result.data, 'Food created.');
          },
          {
            body: createFoodSchema,
            response: ResponseFactory.createApiResponse(createFoodResponseSchema),
            detail: { summary: 'Create food (Admin only)' },
          },
        )
        .patch(
          '/:id',
          async ({ requestId, params: { id }, body }) => {
            const result = await FoodService.updateFood(id, body);
            if (!result.success) throw result.error;
            return ResponseFactory.success(requestId, result.data, 'Food updated.');
          },
          {
            params: uuidParamSchema,
            body: t.Partial(createFoodSchema),
            response: ResponseFactory.createApiResponse(foodResponseSchema),
            detail: { summary: 'Update food (Admin only)' },
          },
        )
        .delete(
          '/:id',
          async ({ requestId, params: { id } }) => {
            const result = await FoodService.deleteFood(id);
            if (!result.success) throw result.error;
            return ResponseFactory.success(requestId, result.data, 'Food deleted.');
          },
          {
            params: uuidParamSchema,
            response: ResponseFactory.createApiResponse(),
            detail: { summary: 'Delete food (Admin only)' },
          },
        ),
  );
