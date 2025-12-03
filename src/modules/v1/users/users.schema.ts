import { Static, t } from 'elysia';

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

export type RegisterDto = Static<typeof registerSchema>;
export type LoginDto = Static<typeof loginSchema>;
export type UpdateUserDto = Static<typeof updateUserSchema>;
export type UserResponseDto = Static<typeof userResponseSchema>;
export type AuthResponseDto = Static<typeof authResponseSchema>;
