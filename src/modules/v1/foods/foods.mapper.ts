import { Food, FoodComment, FoodRating } from '@/infrastructure/db/schema/foods.ts';
import { FoodEntityWithInteractions, UserProfile } from '@/infrastructure/db/types/composite';

import {
  FoodBaseResponseDto,
  FoodCommentResponseDto,
  FoodDetailResponseDto,
  FoodRatingResponseDto,
  FoodResponseDto,
} from '@/modules/v1/foods/foods.schema.ts';

export abstract class FoodMapper {
  static toDto(entity: Food): FoodResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      mood: entity.mood,
      isAvailable: entity.isAvailable,
    };
  }

  static toBaseDto(entity: Food): FoodBaseResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      isAvailable: entity.isAvailable,
    };
  }

  static toDtoList(entities: Food[]): FoodResponseDto[] {
    return entities.map((entity) => FoodMapper.toDto(entity));
  }

  static toBaseDtoList(entities: Food[]): FoodBaseResponseDto[] {
    return entities.map((entity) => FoodMapper.toBaseDto(entity));
  }

  static toCommentDtoFromParts(entity: FoodComment, user: UserProfile): FoodCommentResponseDto {
    return {
      id: entity.id,
      foodId: entity.foodId as string,
      content: entity.content,
      createdAt: entity.createdAt.toISOString(),
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  static toDetailDto(entity: FoodEntityWithInteractions): FoodDetailResponseDto {
    const avg =
      entity.ratings.length > 0
        ? entity.ratings.reduce((acc, curr) => acc + curr.rating, 0) / entity.ratings.length
        : 0;

    return {
      id: entity.id,
      name: entity.name,
      mood: entity.mood,
      isAvailable: entity.isAvailable,
      averageRating: Number(avg.toFixed(1)),

      comments: entity.comments.map((c) => ({
        id: c.id,
        foodId: c.foodId as string,
        content: c.content,
        createdAt: c.createdAt.toISOString(),
        user: { id: c.user.id, username: c.user.username },
      })),

      ratings: entity.ratings.map((r) => ({
        rating: r.rating,
        user: { id: r.user.id, username: r.user.username },
      })),
    };
  }
}
