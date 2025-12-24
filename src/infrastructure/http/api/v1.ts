import { Elysia } from 'elysia';

import { authController } from '@/modules/auth/v1/auth.controller';
import { foodsController } from '@/modules/foods/v1/foods.controller';
import { usersController } from '@/modules/users/v1/users.controller';

export const v1 = new Elysia({ prefix: '/api/v1' })
  .use(authController)
  .use(foodsController)
  .use(usersController);
