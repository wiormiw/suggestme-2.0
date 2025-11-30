import Elysia from 'elysia';
import jwt from '@elysiajs/jwt';
import { appEnv } from '@/config';
import { ICookiesOptions } from '@/types/cookies';

import { jwtPayloadSchema, refreshTokenSchema } from '@/common/schemas/common.schema';

export const CookieOptions: ICookiesOptions = {
  accessToken: {
    httpOnly: true,
    secure: appEnv.NODE_ENV === 'production' ? true : false,
    sameSite: appEnv.NODE_ENV === 'production' ? 'lax' : 'none',
    maxAge: 60 * 15, // 15 minutes
    path: '/',
  },
  refreshToken: {
    httpOnly: true,
    secure: appEnv.NODE_ENV === 'production' ? true : false,
    sameSite: appEnv.NODE_ENV === 'production' ? 'lax' : 'none',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  },
};

export const jwtAccess = new Elysia({
  name: 'jwtAccess',
}).use(
  jwt({
    name: 'jwtAccess',
    secret: appEnv.JWT_SECRET,
    schema: jwtPayloadSchema,
    exp: '15m', // 15 minutes
  }),
);

export const jwtRefresh = new Elysia({
  name: 'jwtRefresh',
}).use(
  jwt({
    name: 'jwtRefresh',
    secret: appEnv.REFRESH_SECRET,
    schema: refreshTokenSchema,
    exp: '1d', // 1 day
  }),
);
