import { Food, FoodComment, FoodRating } from '@/infrastructure/db/schema/foods';
import { User } from '@/infrastructure/db/schema/users';

export type UserProfile = Pick<User, 'id' | 'username'>;

export type FoodCommentWithUser = FoodComment & { user: UserProfile };
export type FoodRatingWithUser = FoodRating & { user: UserProfile };
export type FoodEntityWithInteractions = Food & {
  comments: FoodCommentWithUser[];
  ratings: FoodRatingWithUser[];
};
