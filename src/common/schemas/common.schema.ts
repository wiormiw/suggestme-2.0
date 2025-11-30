import { Static, t } from 'elysia';

export const idResponseSchema = t.Object({
  id: t.String(),
});

export const messageResponseSchema = t.Object({
  success: t.Boolean(),
  message: t.String(),
});

export const uuidParamSchema = t.Object({
  id: t.String({ format: 'uuid' }),
});

export const jwtPayloadSchema = t.Object({
  id: t.String(),
  email: t.String(),
  username: t.String(),
  role: t.Union([t.Literal('admin'), t.Literal('user')]),
});

export const refreshTokenSchema = t.Object({
  id: t.String(),
  type: t.Literal('refresh'),
});

export type IdResponse = Static<typeof idResponseSchema>;
export type MessageResponse = Static<typeof messageResponseSchema>;
export type AuthUser = Static<typeof jwtPayloadSchema>;
export type RefreshToken = Static<typeof refreshTokenSchema>;
