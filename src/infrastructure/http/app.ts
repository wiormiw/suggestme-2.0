import { Elysia } from 'elysia';
import { helmet } from 'elysia-helmet';
import cookie from '@elysiajs/cookie';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { ApiFailure } from '@/types/api';

import { AppError } from '@/common/errors/app.error';
import { v1 } from '@/modules/v1';

import { appEnv } from '../../config';

export function createApp() {
  return new Elysia()
    .use(
      appEnv.NODE_ENV !== 'production'
        ? swagger({
            path: '/docs',
            documentation: {
              info: {
                title: 'SuggestMe API v2.0',
                version: '1.0.0',
              },
              components: {
                securitySchemes: {
                  bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                  },
                },
              },
            },
          })
        : (app) => app,
    )
    .use(
      cors({
        origin: appEnv.CORS_ORIGIN,
        credentials: true,
        exposeHeaders: appEnv.CORS_EXPOSED_HEADERS,
        allowedHeaders: appEnv.CORS_ALLOWED_HEADERS,
        methods: appEnv.CORS_ALLOWED_METHODS,
      }),
    )
    .use(cookie())
    .use(helmet())
    .onError(({ code, error, set }): ApiFailure => {
      let statusCode = 500;
      let response: ApiFailure = {
        success: false,
        code: 'INTERNAL_ERROR',
        message: 'An unexpected problem occured.',
      };
      if (error instanceof AppError) {
        statusCode = error.statusCode;
        response = {
          success: false,
          code: error.code,
          message: error.message,
          detail: error.detail,
        };
      } else if (code === 'VALIDATION') {
        statusCode = 422;
        response = {
          success: false,
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data.',
          detail: { form_errors: error.all },
        };
      }

      set.status = statusCode;
      return response;
    })
    .get('/', () => ({ message: 'SuggestMe API v2.0' }))
    .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))
    .use(v1)
    .all('*', () => {
      return Response.json(
        {
          success: false,
          code: 'NOT_FOUND',
          message: 'The requested resource or path was not found.',
        },
        { status: 404 },
      );
    });
}
