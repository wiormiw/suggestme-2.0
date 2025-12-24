import { Elysia, t } from 'elysia';
import { auth } from '@/infrastructure/http/plugins/auth.plugins';

import { log } from '@/common/utils/standalone.logger';
import { FoodWsHandler } from '@/modules/foods/v1/ws/foods.ws.handler';
import { FoodWsResponseSchema, FoodWsSchema } from '@/modules/foods/v1/ws/foods.ws.schema';
import { WSContext } from '@/types/context';

const GlobalWsSchema = t.Union([
  FoodWsSchema,
  // Other schema
]);

const GlobalWsResponse = t.Union([
  FoodWsResponseSchema,
  t.Object({
    type: t.Literal('ack'),
    action: t.String(),
    status: t.String(),
    message: t.Optional(t.String()),
  }),
  // Other response
]);

export const wsV1 = new Elysia({ name: 'ws-v1' }).use(auth).ws('/ws/v1', {
  body: GlobalWsSchema,
  response: GlobalWsResponse,

  open(ws) {
    const { user } = ws.data;
    const userId = user?.id ?? 'guest';
    const username = user?.username ?? 'Guest';

    log.info({ wsId: ws.id, userId, username }, '[WS V1] Client Connected');
  },

  async message(ws, data) {
    const context = ws as unknown as WSContext;

    // Try Food Module
    if (await FoodWsHandler.handle(context, data)) return;

    // Define other module if any

    ws.send({
      type: 'ack',
      action: 'unknown',
      status: 'error',
      message: 'Unknown action type',
    });
  },

  close(ws) {
    const { user } = ws.data;
    const username = user?.username ?? 'Guest';
    log.info({ wsId: ws.id, username }, '[WS V1] Client Disconnected');
  },
});
