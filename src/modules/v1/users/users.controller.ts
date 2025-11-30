import { Elysia, t } from 'elysia';

import { AppError } from '@/common/errors/app.error';
import { uuidParamSchema } from '@/common/schemas/common.schema';
import { ResponseFactory } from '@/common/utils/response.factory';
import { auth } from '@/http/middlewares/auth.middleware';

import { updateUserSchema, userResponseSchema } from './users.schema';
import { UserService } from './users.service';

export const usersController = new Elysia({ prefix: '/users', tags: ['Users'] })
  .use(auth)
  .get(
    '/me',
    async ({ user }) => {
      if (!user) throw new AppError('UNAUTHORIZED', 'Authentication required', 401);

      const result = await UserService.getProfile(user.id);
      if (!result.success) throw result.error;
      return ResponseFactory.success(result.data, 'Profile retrieved');
    },
    {
      isAuth: true,
      response: ResponseFactory.createApiResponse(userResponseSchema),
      detail: { summary: 'Get current user profile' },
    },
  )
  .get(
    '/',
    async () => {
      const result = await UserService.getAllUsers();
      if (!result.success) throw result.error;
      return ResponseFactory.success(result.data, 'Users retrieved');
    },
    {
      isAuth: true,
      isAdmin: true,
      response: ResponseFactory.createApiResponse(t.Array(userResponseSchema)),
      detail: { summary: 'Get all users (Admin only)' },
    },
  )
  .patch(
    '/:id',
    async ({ params: { id }, body }) => {
      const result = await UserService.updateUser(id, body);
      if (!result.success) throw result.error;
      return ResponseFactory.success(result.data, 'User updated');
    },
    {
      isAuth: true,
      isAdmin: true,
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
      return ResponseFactory.success(result.data, 'User deleted');
    },
    {
      isAuth: true,
      isAdmin: true,
      params: uuidParamSchema,
      response: ResponseFactory.createApiResponse(),
      detail: { summary: 'Delete user (Admin only)' },
    },
  );
