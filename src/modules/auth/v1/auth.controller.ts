import { Elysia } from 'elysia';
import { auth, ensureAuth } from '@/infrastructure/http/plugins/auth.plugins';
import { requestIdPlugin } from '@/infrastructure/http/plugins/request.id.plugins';

import { AppError } from '@/common/errors/app.error';
import { ResponseFactory } from '@/common/utils/response.factory';
import { CookieOptions, jwtAccess, jwtRefresh } from '@/common/utils/setup.jwt';
import { authResponseSchema, loginSchema, registerSchema } from '@/modules/users/v1/users.schema';
import { UserService } from '@/modules/users/v1/users.service';

export const authController = new Elysia({ prefix: '/auth', tags: ['Auth'] })
  .use(requestIdPlugin)
  .use(jwtAccess)
  .use(jwtRefresh)
  .post(
    '/register',
    async ({ requestId, body, jwtAccess, jwtRefresh, cookie }) => {
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

      return ResponseFactory.success(requestId, authData, 'Registration successful.');
    },
    {
      body: registerSchema,
      response: ResponseFactory.createApiResponse(authResponseSchema),
      detail: { summary: 'Register new user' },
    },
  )
  .post(
    '/login',
    async ({ requestId, body, jwtAccess, jwtRefresh, cookie }) => {
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

      return ResponseFactory.success(requestId, authData, 'Login successful.');
    },
    {
      body: loginSchema,
      response: ResponseFactory.createApiResponse(authResponseSchema),
      detail: { summary: 'Login user' },
    },
  )
  .post(
    '/refresh',
    async ({ requestId, jwtAccess, jwtRefresh, cookie }) => {
      const refreshTokenCookie = cookie.refresh_token.value;
      if (!refreshTokenCookie) throw new AppError('UNAUTHORIZED', 'No refresh token.', 401);

      const token = refreshTokenCookie as string | undefined;
      const payload = await jwtRefresh.verify(token);

      if (!payload) {
        throw new AppError('UNAUTHORIZED', 'Invalid refresh token.', 401);
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

      return ResponseFactory.success(requestId, authData, 'Token refreshed.');
    },
    {
      response: ResponseFactory.createApiResponse(authResponseSchema),
      detail: { summary: 'Refresh access token' },
    },
  )
  .use(auth)
  .post(
    '/logout',
    ({ requestId, cookie: { access_token, refresh_token } }) => {
      access_token.remove();
      refresh_token.remove();

      return ResponseFactory.success(requestId, undefined, 'Logout successful.');
    },
    {
      beforeHandle: ({ user }) => ensureAuth({ user }),
      response: ResponseFactory.createApiResponse(),
      detail: { summary: 'Logout user' },
    },
  );
