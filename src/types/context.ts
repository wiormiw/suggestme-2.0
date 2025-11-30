import { AuthUser } from '@/common/schemas/common.schema';

export type AuthContext = {
  user: AuthUser | undefined;
};
