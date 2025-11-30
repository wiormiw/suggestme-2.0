import { User } from '@/db/schema/users';

import { UserResponseDto } from './users.schema';

export abstract class UserMapper {
  static toDto(entity: User): UserResponseDto {
    return {
      id: entity.id,
      email: entity.email,
      username: entity.username,
      role: entity.role,
      createdAt: entity.createdAt,
    };
  }

  static toDtoList(entities: User[]): UserResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}
