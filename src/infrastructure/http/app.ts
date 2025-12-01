import { Elysia, ValidationError } from 'elysia';
import { helmet } from 'elysia-helmet';
import cookie from '@elysiajs/cookie';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { appEnv, logConfig } from '@/config';
import { requestIdPlugin } from '@/infrastructure/http/plugins/request.id.plugins';
import { ApiFailure } from '@/types/api';
import { InferContext, logger } from '@bogeychan/elysia-logger';

import { AppError } from '@/common/errors/app.error';
import { v1 } from '@/modules/v1';

const baseApp = new Elysia().use(requestIdPlugin);

type App = typeof baseApp;

export function createApp() {
  return baseApp
    .use(
      appEnv.NODE_ENV !== 'production'
        ? swagger({
            path: '/docs',
            documentation: {
              info: {
                title: 'SuggestMe API v2.0',
                version: '2.0.0',
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
      logger({
        customProps(ctx: InferContext<App>) {
          return {
            requestId: ctx.requestId,
          };
        },
        ...logConfig,
      }),
    )
    .use(
      cors({
        origin: ({ headers }) => {
          const incomingOrigin = headers.get('origin');

          if (!incomingOrigin) return true;

          const allowedOrigins = Array.isArray(appEnv.CORS_ORIGIN)
            ? appEnv.CORS_ORIGIN
            : [appEnv.CORS_ORIGIN];

          if (allowedOrigins.includes(incomingOrigin)) {
            return true;
          }
          throw new AppError(
            'CORS_ERROR',
            'The Origin is not allowed to access this resource.',
            403,
          );
        },
        credentials: true,
        exposeHeaders: appEnv.CORS_EXPOSED_HEADERS,
        allowedHeaders: appEnv.CORS_ALLOWED_HEADERS,
        methods: appEnv.CORS_ALLOWED_METHODS,
      }),
    )
    .use(cookie())
    .use(helmet())
    .onError(({ code, error, set, requestId }): ApiFailure => {
      const currentRequestId = requestId || 'N/A';
      let finalStatusCode = 500;
      let finalResponse: ApiFailure;

      if (error instanceof AppError) {
        finalStatusCode = error.statusCode;
        finalResponse = {
          requestId: currentRequestId,
          success: false,
          code: error.code,
          message: error.message,
          detail: error.detail,
        };
      } else if (code === 'VALIDATION') {
        finalStatusCode = 422;
        finalResponse = {
          requestId: currentRequestId,
          success: false,
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data.',
        };

        if (error instanceof ValidationError) {
          finalResponse = {
            ...finalResponse,
            detail: { form_errors: error.all },
          };
        }
      } else {
        finalStatusCode = 500;
        finalResponse = {
          requestId: currentRequestId,
          success: false,
          code: 'INTERNAL_ERROR',
          message: 'An unexpected problem occured.',
        };
      }

      set.status = finalStatusCode;
      return finalResponse;
    })
    .get('/', () => ({ message: 'SuggestMe API v2.0' }))
    .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString(), version: '2.0.0' }))
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
