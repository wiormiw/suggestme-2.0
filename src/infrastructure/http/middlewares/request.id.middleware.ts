import { Elysia } from 'elysia';

export const requestIdPlugin = new Elysia({ name: 'request-id' })
  .decorate('requestId', '')
  .onRequest((ctx) => {
    const id = crypto.randomUUID();

    (ctx as any).requestId = id;
    ctx.set.headers['X-Request-ID'] = id;
  });
