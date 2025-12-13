import { Elysia } from 'elysia';

import { authController } from './auth/auth.controller';
import { foodsController } from './foods/foods.controller';
import { usersController } from './users/users.controller';

export const v1 = new Elysia({ prefix: '/api/v1' })
  .use(authController)
  .use(foodsController)
  .use(usersController);
