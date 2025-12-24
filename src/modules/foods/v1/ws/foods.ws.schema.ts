import { Static, t } from 'elysia';

export const SubscribeAction = t.Object({
  type: t.Literal('subscribe'),
  payload: t.Object({
    foodId: t.String(),
  }),
});

export const UnsubscribeAction = t.Object({
  type: t.Literal('unsubscribe'),
  payload: t.Object({
    foodId: t.String(),
  }),
});

export const SubmitCommentAction = t.Object({
  type: t.Literal('submit_comment'),
  payload: t.Object({
    foodId: t.String(),
    content: t.String(),
  }),
});

export const RateFoodAction = t.Object({
  type: t.Literal('rate_food'),
  payload: t.Object({
    foodId: t.String(),
    rating: t.Integer(),
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

export const FoodWsSchema = t.Union([
  SubmitCommentAction,
  RateFoodAction,
  SubscribeAction,
  UnsubscribeAction,
]);

export const FoodWsResponseSchema = t.Union([NewCommentBroadcast, NewRatingBroadcast, AckResponse]);

export type FoodWebsocketPayload = Static<typeof FoodWsSchema>;
export type FoodWebSocketResponse = Static<typeof FoodWsResponseSchema>;
