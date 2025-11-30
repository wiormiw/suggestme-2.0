import { Elysia } from 'elysia';

import { AppError } from '@/common/errors/app.error';
import { AuthUser } from '@/common/schemas/common.schema';
import { jwtAccess } from '@/common/utils/setup.jwt';

export const auth = new Elysia({ name: 'auth' })
  .use(jwtAccess)
  .resolve({ as: 'scoped' }, async ({ cookie: { access_token }, headers, jwtAccess }) => {
    let user: AuthUser | undefined;
    const accesTokenCookie = access_token?.value;
    const headerValue = headers.authorization?.slice(7);
    const token = (accesTokenCookie as string | undefined) || headerValue;

    if (token) {
      const payload = await jwtAccess.verify(token);
      if (payload) {
        user = payload as AuthUser;
      }
    }

    return { user };
  })
  .macro(({ onBeforeHandle }) => ({
    isAuth(enabled: boolean): void {
      if (!enabled) return;
      onBeforeHandle(({ user }: { user: AuthUser | undefined }) => {
        if (!user) throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
      });
    },
    isAdmin(enabled: boolean): void {
      if (!enabled) return;
      onBeforeHandle(({ user }: { user: AuthUser | undefined }) => {
        if (!user) throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
        if (user.role !== 'admin') throw new AppError('FORBIDDEN', 'Admin access required', 403);
      });
    },
  }));
