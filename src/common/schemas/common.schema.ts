import { Static, t, TSchema } from 'elysia';

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

export const paginatedQuery = t.Object({
  limit: t.Numeric({ default: 10, maximum: 50 }),
  cursor: t.Optional(t.String()),
  direction: t.Optional(t.Union([t.Literal('next'), t.Literal('prev')])),
});

export const createPaginatedSchema = <T extends TSchema>(itemSchema: T) =>
  t.Object({
    items: t.Array(itemSchema),
    nextCursor: t.Union([t.String(), t.Null()]),
    prevCursor: t.Union([t.String(), t.Null()]),
  });

export type IdResponse = Static<typeof idResponseSchema>;
export type MessageResponse = Static<typeof messageResponseSchema>;
export type AuthUser = Static<typeof jwtPayloadSchema>;
export type RefreshToken = Static<typeof refreshTokenSchema>;
