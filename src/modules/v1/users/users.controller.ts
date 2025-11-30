import { Elysia, t } from 'elysia';
import { auth, ensureAdmin, ensureAuth } from '@/infrastructure/http/middlewares/auth.middleware';

import { AppError } from '@/common/errors/app.error';
import { paginatedQuery, uuidParamSchema } from '@/common/schemas/common.schema';
import { ResponseFactory } from '@/common/utils/response.factory';

import { updateUserSchema, userResponseSchema } from './users.schema';
import { UserService } from './users.service';

export const usersController = new Elysia({ prefix: '/users', tags: ['Users'] })
  .use(auth)
  .get(
    '/me',
    async ({ user }) => {
      const result = await UserService.getProfile(user!.id);
      if (!result.success) throw result.error;
      return ResponseFactory.success(result.data, 'Profile retrieved.');
    },
    {
      beforeHandle: ({ user }) => ensureAuth({ user }),
      response: ResponseFactory.createApiResponse(userResponseSchema),
      detail: { summary: 'Get current user profile' },
    },
  )
  .guard(
    {
      beforeHandle: ({ user }) => ensureAdmin({ user }),
    },
    (app) =>
      app
        .get(
          '/',
          async ({ query: { limit, cursor, direction } }) => {
            const result = await UserService.getAllUsers(limit, cursor, direction);
            if (!result.success) throw result.error;
            return ResponseFactory.success(result.data, 'Users retrieved.');
          },
          {
            query: paginatedQuery,
            response: ResponseFactory.createPaginatedApiResponse(userResponseSchema),
            detail: { summary: 'Get all users (Admin only)' },
          },
        )
        .patch(
          '/:id',
          async ({ params: { id }, body }) => {
            const result = await UserService.updateUser(id, body);
            if (!result.success) throw result.error;
            return ResponseFactory.success(result.data, 'User updated.');
          },
          {
            params: uuidParamSchema,
            body: updateUserSchema,
            response: ResponseFactory.createApiResponse(userResponseSchema),
            detail: { summary: 'Update user (Admin only)' },
          },
        )
        .delete(
          '/:id',
          async ({ params: { id } }) => {
            const result = await UserService.deleteUser(id);
            if (!result.success) throw result.error;
            return ResponseFactory.success(result.data, 'User deleted.');
          },
          {
            params: uuidParamSchema,
            response: ResponseFactory.createApiResponse(),
            detail: { summary: 'Delete user (Admin only)' },
          },
        ),
  );
