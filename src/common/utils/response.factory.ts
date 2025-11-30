import { t, TSchema } from 'elysia';
import { ApiSuccess } from '@/types/api';

export abstract class ResponseFactory {
  static success<T>(data: T | undefined, message: string): ApiSuccess<T | undefined> {
    return { success: true, message, data };
  }

  static createApiResponse = <T extends TSchema | undefined>(schema?: T) =>
    t.Object({
      success: t.Boolean(),
      message: t.String(),
      data: schema ? schema : t.Optional(t.Undefined()),
    });
}
