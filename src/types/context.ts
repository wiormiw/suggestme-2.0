import { AuthUser } from '@/common/schemas/common.schema';
import { FoodsWSContext } from '@/modules/foods/v1/ws/foods.ws.handler';

export type AuthContext = {
  user: AuthUser | undefined;
};

export type WSContext = FoodsWSContext; // use union if we need additional ws context types;