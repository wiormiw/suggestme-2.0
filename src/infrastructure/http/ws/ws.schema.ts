import { Static, t } from 'elysia';

const SubmitCommentAction = t.Object({
  type: t.Literal('submit_comment'),
  payload: t.Object({
    foodId: t.String(),
    content: t.String(),
  }),
});

const RateFoodAction = t.Object({
  type: t.Literal('rate_food'),
  payload: t.Object({
    foodId: t.String(),
    rating: t.Integer(),
  }),
});

const SubscribeAction = t.Object({
  type: t.Literal('subscribe'),
  payload: t.Object({
    foodId: t.String(),
  }),
});

const UnsubscribeAction = t.Object({
  type: t.Literal('unsubscribe'),
  payload: t.Object({
    foodId: t.String(),
  }),
});

export const NewCommentBroadcast = t.Object({
  type: t.Literal('new_comment'),
  id: t.String(),
  foodId: t.String(),
  content: t.String(),
  createdAt: t.String(),
  user: t.Object({
    id: t.String(),
    username: t.String(),
  }),
});

export const NewRatingBroadcast = t.Object({
  type: t.Literal('new_rating'),
  foodId: t.String(),
  averageRating: t.Number(),
  totalRatings: t.Number(),
});

export const AckResponse = t.Object({
  type: t.Literal('ack'),
  action: t.String(),
  status: t.String(),
  message: t.Optional(t.String()),
});

export const WebsocketSchema = t.Union([
  SubmitCommentAction,
  RateFoodAction,
  SubscribeAction,
  UnsubscribeAction,
]);

export const WebSocketResponseSchema = t.Union([
  NewCommentBroadcast,
  NewRatingBroadcast,
  AckResponse,
]);

export type WebsocketPayload = Static<typeof WebsocketSchema>;
export type WebSocketResponse = Static<typeof WebSocketResponseSchema>;
