import { t, TSchema } from 'elysia';
import { ApiSuccess } from '@/types/api';

import { createPaginatedSchema } from '@/common/schemas/common.schema';

export abstract class ResponseFactory {
  static success<T>(requestId: string, data: T, message: string): ApiSuccess<T> {
    return { requestId, success: true, message, data };
  }

  static createApiResponse = <T extends TSchema | undefined>(schema?: T) =>
    t.Object({
      requestId: t.String(),
      success: t.Boolean(),
      message: t.String(),
      data: schema ? schema : t.Optional(t.Undefined()),
    });

  static createPaginatedApiResponse = <T extends TSchema>(itemSchema: T) =>
    t.Object({
      requestId: t.String(),
      success: t.Boolean(),
      message: t.String(),
      data: createPaginatedSchema(itemSchema),
    });
}
