import { Elysia } from 'elysia';
import { helmet } from 'elysia-helmet';
import cookie from '@elysiajs/cookie';
import { swagger } from '@elysiajs/swagger';
import { ApiFailure } from '@/types/api';

import { AppError } from '@/common/errors/app.error';
import { v1 } from '@/modules/v1';

import { appEnv } from './config';

export function createApp() {
  return new Elysia()
    .use(cookie())
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
    .use(helmet())
    .onError(({ code, error }) => {
      let statusCode = 500;
      let response: ApiFailure = {
        success: false,
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong',
      };

      // A. Handle Custom AppError
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
          message: 'Invalid request data',
          detail: { form_errors: error.all },
        };
      }

      return Response.json(response, { status: statusCode });
    })
    .get('/boom', () => {
      console.log('💥 Manual explosion triggered');
      throw new AppError('TEST', 'I should be JSON!', 400);
    })
    .get('/', () => ({ message: 'SuggestMe API v2.0' }))
    .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))
    .use(v1);
}
