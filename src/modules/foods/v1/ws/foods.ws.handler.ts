import { Static } from 'elysia';
import { AuthContext } from '@/types/context';

import { FoodService } from '../foods.service';
import {
  FoodWebsocketPayload,
  FoodWebSocketResponse,
  RateFoodAction,
  SubmitCommentAction,
  SubscribeAction,
  UnsubscribeAction,
} from './foods.ws.schema';

export type FoodsWSContext = {
  data: AuthContext;
  send: (data: FoodWebSocketResponse) => void;
  subscribe: (topic: string) => void;
  isSubscribed: (topic: string) => boolean;
  unsubscribe: (topic: string) => void;
  publish: (topic: string, data: any) => void;
  id: string;
};

export const FoodWsHandler = {
  async handle(ws: FoodsWSContext, data: FoodWebsocketPayload | { type: string }): Promise<boolean> {
    switch (data.type) {
      case 'subscribe':
        this.onSubscribe(ws, data as Static<typeof SubscribeAction>);
        return true;
      case 'unsubscribe':
        this.onUnsubscribe(ws, data as Static<typeof UnsubscribeAction>);
        return true;
      case 'rate_food':
        await this.onRateFood(ws, data as Static<typeof RateFoodAction>);
        return true;
      case 'submit_comment':
        await this.onComment(ws, data as Static<typeof SubmitCommentAction>);
        return true;
      default:
        return false;
    }
  },

  onSubscribe(ws: FoodsWSContext, data: Static<typeof SubscribeAction>) {
    const { foodId } = data.payload;

    ws.subscribe(`food-${foodId}`);
    ws.send({
      type: 'ack',
      action: 'subscribe',
      status: `Subscribed to food-${foodId}`,
    });
  },

  onUnsubscribe(ws: FoodsWSContext, data: Static<typeof UnsubscribeAction>) {
    const { foodId } = data.payload;
    if (ws.isSubscribed(`food-${foodId}`)) {
      ws.unsubscribe(`food-${foodId}`);
    }
  },

  async onRateFood(ws: FoodsWSContext, data: Static<typeof RateFoodAction>) {
    const user = ws.data.user;
    if (!user) {
      return ws.send({
        type: 'ack',
        action: 'rate_food',
        status: 'error',
        message: 'Unauthorized',
      });
    }

    const { foodId, rating } = data.payload;

    try {
      const result = await FoodService.rateFood(user, { foodId, rating });

      if (!result.success) {
        return ws.send({
          type: 'ack',
          action: 'rate_food',
          status: 'error',
          message: result.error.message || 'Rating failed',
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
      ws.send({
        type: 'ack',
        action: 'rate_food',
        status: 'error',
        message: 'Internal Error',
      });
    }
  },

  async onComment(ws: FoodsWSContext, data: Static<typeof SubmitCommentAction>) {
    const user = ws.data.user;
    if (!user) {
      return ws.send({
        type: 'ack',
        action: 'submit_comment',
        status: 'error',
        message: 'Unauthorized',
      });
    }

    const { foodId, content } = data.payload;

    try {
      const result = await FoodService.addComment(user, { foodId, content });
      if (!result.success) {
        return ws.send({
          type: 'ack',
          action: 'submit_comment',
          status: 'error',
          message: result.error.message || 'Comment failed',
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
      ws.send({
        type: 'ack',
        action: 'submit_comment',
        status: 'error',
        message: 'Internal Error',
      });
    }
  },
};
