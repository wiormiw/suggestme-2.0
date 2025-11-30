import { t } from 'elysia';

import { ROLE_LIST } from '@/common/constants/users.constants';

const roleEnum = t.UnionEnum([...ROLE_LIST]);

export const registerSchema = t.Object({
  email: t.String({ format: 'email' }),
  username: t.String({ minLength: 3, maxLength: 50 }),
  password: t.String({ minLength: 8 }),
});

export const loginSchema = t.Object({
  email: t.String({ format: 'email' }),
  password: t.String(),
});

export const updateUserSchema = t.Object({
  username: t.Optional(t.String({ minLength: 3, maxLength: 50 })),
  role: t.Optional(roleEnum),
});

export const userResponseSchema = t.Object({
  id: t.String(),
  email: t.String(),
  username: t.String(),
  role: roleEnum,
  createdAt: t.Date(),
});

export const authResponseSchema = t.Object({
  user: userResponseSchema,
  accessToken: t.String(),
  refreshToken: t.String(),
});

export type RegisterDto = typeof registerSchema.static;
export type LoginDto = typeof loginSchema.static;
export type UpdateUserDto = typeof updateUserSchema.static;
export type UserResponseDto = typeof userResponseSchema.static;
export type AuthResponseDto = typeof authResponseSchema.static;
