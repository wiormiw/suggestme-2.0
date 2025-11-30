import { Elysia } from 'elysia';

import { AppError } from '@/common/errors/app.error';
import { ResponseFactory } from '@/common/utils/response.factory';
import { CookieOptions, jwtAccess, jwtRefresh } from '@/common/utils/setup.jwt';
import { authResponseSchema, loginSchema, registerSchema } from '@/modules/v1/users/users.schema';
import { UserService } from '@/modules/v1/users/users.service';

export const authController = new Elysia({ prefix: '/auth', tags: ['Auth'] })
  .use(jwtAccess)
  .use(jwtRefresh)
  .post(
    '/register',
    async ({ body, jwtAccess, jwtRefresh, cookie }) => {
      const result = await UserService.register(body);
      if (!result.success) throw result.error;

      const data = result.data;
      const accessToken = await jwtAccess.sign({
        id: data.id,
        email: data.email,
        username: data.username,
        role: data.role,
      });
      const refreshToken = await jwtRefresh.sign({
        id: data.id,
        type: 'refresh',
      });

      cookie.access_token.set({
        value: accessToken,
        ...CookieOptions.accessToken,
      });

      cookie.refresh_token.set({
        value: refreshToken,
        ...CookieOptions.refreshToken,
      });

      const authData = {
        user: result.data,
        accessToken,
        refreshToken,
      };

      return ResponseFactory.success(authData, 'Registration successful');
    },
    {
      body: registerSchema,
      response: ResponseFactory.createApiResponse(authResponseSchema),
      detail: { summary: 'Register new user' },
    },
  )
  .post(
    '/login',
    async ({ body, jwtAccess, jwtRefresh, cookie }) => {
      const result = await UserService.login(body);
      if (!result.success) throw result.error;

      const data = result.data;
      const accessToken = await jwtAccess.sign({
        id: data.id,
        email: data.email,
        username: data.username,
        role: data.role,
      });
      const refreshToken = await jwtRefresh.sign({
        id: data.id,
        type: 'refresh',
      });

      cookie.access_token.set({
        value: accessToken,
        ...CookieOptions.accessToken,
      });

      cookie.refresh_token.set({
        value: refreshToken,
        ...CookieOptions.refreshToken,
      });

      const authData = {
        user: result.data,
        accessToken,
        refreshToken,
      };

      return ResponseFactory.success(authData, 'Login successful');
    },
    {
      body: loginSchema,
      response: ResponseFactory.createApiResponse(authResponseSchema),
      detail: { summary: 'Login user' },
    },
  )
  .post(
    '/refresh',
    async ({ jwtAccess, jwtRefresh, cookie }) => {
      const refreshTokenCookie = cookie.refresh_token.value;
      if (!refreshTokenCookie) throw new AppError('UNAUTHORIZED', 'No refresh token', 401);

      const token = refreshTokenCookie as string | undefined;
      const payload = await jwtRefresh.verify(token);

      if (!payload) {
        throw new AppError('UNAUTHORIZED', 'Invalid refresh token', 401);
      }

      const result = await UserService.getById(payload.id);
      if (!result.success) throw result.error;

      const data = result.data;
      const accessToken = await jwtAccess.sign({
        id: data.id,
        email: data.email,
        username: data.username,
        role: data.role,
      });
      const refreshToken = await jwtRefresh.sign({
        id: data.id,
        type: 'refresh',
      });

      cookie.access_token.set({
        value: accessToken,
        ...CookieOptions.accessToken,
      });

      cookie.refresh_token.set({
        value: refreshToken,
        ...CookieOptions.refreshToken,
      });

      const authData = {
        user: result.data,
        accessToken,
        refreshToken,
      };

      return ResponseFactory.success(authData, 'Token refreshed');
    },
    {
      response: ResponseFactory.createApiResponse(authResponseSchema),
      detail: { summary: 'Refresh access token' },
    },
  )
  .post(
    '/logout',
    ({ cookie }) => {
      delete cookie.access_token;
      delete cookie.refresh_token;

      return ResponseFactory.success(undefined, 'Logout successful');
    },
    {
      isAuth: true,
      response: ResponseFactory.createApiResponse(),
      detail: { summary: 'Logout user' },
    },
  );
