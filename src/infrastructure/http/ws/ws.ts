import { Elysia } from 'elysia';
import { auth } from '@/infrastructure/http/plugins/auth.plugins';

import { log } from '@/common/utils/standalone.logger';

import { WebSocketController } from './ws.controller';
import { WebSocketResponseSchema, WebsocketSchema } from './ws.schema';

export const ws = new Elysia({ name: 'ws-handler' }).use(auth).ws('/ws', {
  body: WebsocketSchema,
  response: WebSocketResponseSchema,
  open(ws) {
    const { user } = ws.data;
    const userId = user?.id ?? 'guest';
    const username = user?.username ?? 'Guest';

    log.info(
      {
        wsId: ws.id,
        userId,
        username,
      },
      '[WS] Client Connected',
    );
  },
  message(ws, data) {
    switch (data.type) {
      case 'subscribe':
        WebSocketController.onSubscribe(ws, data);
        break;
      case 'unsubscribe':
        WebSocketController.onUnsubscribe(ws, data);
        break;
      case 'rate_food':
        WebSocketController.onRateFood(ws, data);
        break;
      case 'submit_comment':
        WebSocketController.onComment(ws, data);
        break;
      default:
        ws.send({
          type: 'ack',
          action: 'unknown',
          status: 'error',
          message: 'Unknown action type',
        });
    }
  },
  close(ws) {
    const { user } = ws.data;
    const username = user?.username ?? 'Guest';

    log.info(
      {
        wsId: ws.id,
        username,
      },
      '[WS] Client Disconnected',
    );
  },
});
