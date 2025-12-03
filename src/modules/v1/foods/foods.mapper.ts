import { Food } from '@/infrastructure/db/schema/foods.ts';

import { FoodBaseResponseDto, FoodResponseDto } from '@/modules/v1/foods/foods.schema.ts';

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
}
