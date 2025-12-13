import { AuthContext } from '@/types/context';

import { log } from '@/common/utils/standalone.logger';
import { FoodService } from '@/modules/v1/foods/foods.service';

import { WebsocketPayload, WebSocketResponse } from './ws.schema';

type Context = AuthContext;

export type WSContext = {
  data: Context;
  send: (data: WebSocketResponse) => void;
  subscribe: (topic: string) => void;
  isSubscribed: (topic: string) => boolean;
  unsubscribe: (topic: string) => void;
  publish: (topic: string, data: any) => void;
  id: string;
};

export const WebSocketController = {
  onSubscribe(ws: WSContext, data: Extract<WebsocketPayload, { type: 'subscribe' }>) {
    const { foodId } = data.payload;

    ws.subscribe(`food-${foodId}`);
    ws.send({
      type: 'ack',
      action: 'subscribe',
      status: `Subscribed to food-${foodId}`,
    });
  },

  onUnsubscribe(ws: WSContext, data: Extract<WebsocketPayload, { type: 'unsubscribe' }>) {
    const { foodId } = data.payload;
    
    if (ws.isSubscribed(`food-${foodId}`)) {
      ws.unsubscribe(`food-${foodId}`);
    }
  },

  async onRateFood(ws: WSContext, data: Extract<WebsocketPayload, { type: 'rate_food' }>) {
    const user = ws.data.user;
    if (!user)
      return ws.send({
        type: 'ack',
        action: 'rate_food',
        status: 'error',
        message: 'Unauthorized',
      });

    const { foodId, rating } = data.payload;

    try {
      const result = await FoodService.rateFood(user, { foodId, rating });

      if (!result.success) {
        return ws.send({
          type: 'ack',
          action: 'rate_food',
          status: 'error',
          message: result.error.message,
        });
      }

      const { average, count } = result.data;

      const ratingUpdate = {
        type: 'new_rating' as const,
        foodId,
        averageRating: average,
        totalRatings: count,
      };

      ws.publish(`food-${foodId}`, ratingUpdate);
      ws.send(ratingUpdate);
      ws.send({ type: 'ack', action: 'rate_food', status: 'success' });
    } catch (e) {
      ws.send({ type: 'ack', action: 'rate_food', status: 'error' });
    }
  },

  async onComment(ws: WSContext, data: Extract<WebsocketPayload, { type: 'submit_comment' }>) {
    const user = ws.data.user;
    if (!user)
      return ws.send({
        type: 'ack',
        action: 'submit_comment',
        status: 'error',
        message: 'Unauthorized',
      });

    const { foodId, content } = data.payload;

    try {
      const result = await FoodService.addComment(user, { foodId, content });
      if (!result.success) {
        return ws.send({
          type: 'ack',
          action: 'submit_comment',
          status: 'error',
          message: result.error.message,
        });
      }

      const commentPayload = {
        type: 'new_comment' as const,
        ...result.data,
      };

      ws.publish(`food-${foodId}`, commentPayload);
      ws.send(commentPayload);
      ws.send({ type: 'ack', action: 'submit_comment', status: 'posted' });
    } catch (e) {
      ws.send({ type: 'ack', action: 'submit_comment', status: 'error' });
    }
  },
};
