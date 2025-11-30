import { mapDbError } from '@/infrastructure/db';

import { AppError } from '@/common/errors/app.error';
import { AuthUtil } from '@/common/utils/auth.util';
import { err, ok, Result } from '@/common/utils/result';

import { UserMapper } from './users.mapper';
import { UserRepository } from './users.repository';
import { LoginDto, RegisterDto, UpdateUserDto, UserResponseDto } from './users.schema';

export abstract class UserService {
  static async register(dto: RegisterDto): Promise<Result<UserResponseDto, AppError>> {
    try {
      const existing = await UserRepository.findByEmail(dto.email);
      if (existing) {
        return err(new AppError('CONFLICT', 'Email already registered', 409));
      }

      const hashedPassword = await AuthUtil.hashPassword(dto.password);
      const user = await UserRepository.create({
        id: Bun.randomUUIDv7(),
        email: dto.email,
        username: dto.username,
        password: hashedPassword,
        role: 'user',
      });

      if (!user) {
        return err(new AppError('INTERNAL_ERROR', 'Failed to create user', 500));
      }

      return ok(UserMapper.toDto(user));
    } catch (e) {
      return err(mapDbError(e));
    }
  }

  static async login(dto: LoginDto): Promise<Result<UserResponseDto, AppError>> {
    try {
      const user = await UserRepository.findByEmail(dto.email);
      if (!user) {
        return err(new AppError('UNAUTHORIZED', 'Invalid credentials', 401));
      }

      const isValid = await AuthUtil.verifyPassword(dto.password, user.password);
      if (!isValid) {
        return err(new AppError('UNAUTHORIZED', 'Invalid credentials', 401));
      }

      return ok(UserMapper.toDto(user));
    } catch (e) {
      return err(mapDbError(e));
    }
  }

  static async getById(id: string): Promise<Result<UserResponseDto, AppError>> {
    try {
      const user = await UserRepository.findById(id);
      if (!user) {
        return err(new AppError('UNAUTHORIZED', 'User not found', 401));
      }
      return ok(UserMapper.toDto(user));
    } catch (e) {
      return err(mapDbError(e));
    }
  }

  static async getProfile(userId: string): Promise<Result<UserResponseDto, AppError>> {
    try {
      const user = await UserRepository.findById(userId);
      if (!user) {
        return err(new AppError('NOT_FOUND', 'User not found', 404));
      }
      return ok(UserMapper.toDto(user));
    } catch (e) {
      return err(mapDbError(e));
    }
  }

  static async getAllUsers(): Promise<Result<UserResponseDto[], AppError>> {
    try {
      const users = await UserRepository.findAll();
      return ok(UserMapper.toDtoList(users));
    } catch (e) {
      return err(mapDbError(e));
    }
  }

  static async updateUser(
    id: string,
    dto: UpdateUserDto,
  ): Promise<Result<UserResponseDto, AppError>> {
    try {
      const user = await UserRepository.update(id, dto);
      if (!user) {
        return err(new AppError('NOT_FOUND', 'User not found', 404));
      }
      return ok(UserMapper.toDto(user));
    } catch (e) {
      return err(mapDbError(e));
    }
  }

  static async deleteUser(id: string): Promise<Result<void, AppError>> {
    try {
      await UserRepository.delete(id);
      return ok(undefined);
    } catch (e) {
      return err(mapDbError(e));
    }
  }
}
