import { aiClient, appEnv } from '@/config';
import { mapDbError } from '@/infrastructure/db';
import { Direction, PaginatedList } from '@/types/paginated';

import { Mood } from '@/common/constants/foods.constants.ts';
import { AppError } from '@/common/errors/app.error';
import { foodSuggestionPrompt } from '@/common/utils/ai.prompt';
import { err, ok, Result } from '@/common/utils/result.ts';
import { FoodMapper } from '@/modules/v1/foods/foods.mapper.ts';
import { FoodsRepository } from '@/modules/v1/foods/foods.repository.ts';
import {
  CreateFoodDto,
  CreateFoodResponseDto,
  FoodResponseDto,
  suggestedFoodSchema,
} from '@/modules/v1/foods/foods.schema.ts';

export abstract class FoodService {
  static async addFood(food: CreateFoodDto): Promise<Result<CreateFoodResponseDto, AppError>> {
    try {
      const newFood = await FoodsRepository.create({
        id: Bun.randomUUIDv7(),
        isAvailable: true,
        ...food,
      });

      if (!newFood) {
        return err(
          new AppError(
            `FAILED_RETRIEVAL_AFTER_UPDATE`,
            'Failed to retrieve food id data after creation',
            500,
          ),
        );
      }

      return ok(newFood!);
    } catch (e) {
      return err(mapDbError(e));
    }
  }

  static async suggest(mood: Mood): Promise<Result<FoodResponseDto, AppError>> {
    try {
      const foodSampleList = await FoodsRepository.findSampleForAI();
      if (foodSampleList.length === 0) {
        return err(new AppError('NOT_FOUND', 'No available foods to suggest.', 404));
      }

      const foodNames = foodSampleList.map((f) => f.name).join(', ');

      const response = await aiClient.models.generateContent({
        model: appEnv.GEMINI_MODEL,
        contents: [
          {
            role: 'user',
            parts: [{ text: foodSuggestionPrompt(mood, foodNames) }],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseJsonSchema: suggestedFoodSchema,
        },
      });

      if (!response || !response.text) {
        return err(new AppError('LLM_ERROR', 'AI failed to generate a suggestion.', 500));
      }

      let jsonResponse = JSON.parse(response.text);
      try {
        jsonResponse = JSON.parse(response.text);
      } catch (e) {
        return err(new AppError('LLM_ERROR', 'AI returned malformed data.', 500));
      }

      if (!jsonResponse || typeof jsonResponse.suggestedName !== 'string') {
        return err(
          new AppError('LLM_ERROR', 'AI response is missing the required food name field.', 500),
        );
      }

      // Suggested name
      const suggestedFoodName = jsonResponse.suggestedName.trim();

      // Compare to our dataset
      let foodRaw = foodSampleList.find(
        (f) => f.name.toLowerCase() === suggestedFoodName.toLowerCase(),
      );

      // Fallback
      if (!foodRaw) {
        console.warn(
          `AI suggested unknown food: ${suggestedFoodName}. Falling back to random by mood.`,
        );

        foodRaw = await FoodsRepository.findRandomByMood(mood);

        if (!foodRaw) {
          return err(
            new AppError('NOT_FOUND', 'AI failed, and no mood-based fallback found.', 404),
          );
        }
      }

      const food = FoodMapper.toDto(foodRaw);
      return ok(food);
    } catch (e) {
      return err(mapDbError(e));
    }
  }

  static async getAllFoods(
    limit: number,
    cursor?: string,
    direction: Direction = 'next',
  ): Promise<Result<PaginatedList<FoodResponseDto>, AppError>> {
    try {
      const foods = await FoodsRepository.findAll(limit, cursor, direction);
      const hasMore = foods.length > limit;
      if (hasMore) {
        foods.pop();
      }

      if (direction === 'prev') {
        foods.reverse();
      }
      let nextCursor: string | null = null;
      let prevCursor: string | null = null;
      if (foods.length > 0) {
        nextCursor = foods[foods.length - 1].id;
        prevCursor = foods[0].id;
      }
      if (direction === 'next' && !cursor) {
        prevCursor = null;
      }
      if (direction === 'prev' && !hasMore) {
        prevCursor = null;
      }
      if (direction === 'next' && !hasMore) {
        nextCursor = null;
      }
      return ok({ items: FoodMapper.toDtoList(foods), nextCursor, prevCursor });
    } catch (e) {
      return err(mapDbError(e));
    }
  }

  static async getFoodById(id: string): Promise<Result<FoodResponseDto, AppError>> {
    try {
      const food = await FoodsRepository.findById(id);
      if (!food) {
        return err(new AppError('NOT_FOUND', 'Food not found', 404));
      }
      return ok(FoodMapper.toDto(food));
    } catch (e) {
      return err(mapDbError(e));
    }
  }

  static async updateFood(
    id: string,
    data: Partial<CreateFoodDto>,
  ): Promise<Result<FoodResponseDto, AppError>> {
    try {
      const food = await FoodsRepository.update(id, data);
      if (!food) {
        return err(new AppError('NOT_FOUND', 'Food not found', 404));
      }
      return ok(FoodMapper.toDto(food));
    } catch (e) {
      return err(mapDbError(e));
    }
  }

  static async deleteFood(id: string): Promise<Result<void, AppError>> {
    try {
      await FoodsRepository.delete(id);
      return ok(undefined);
    } catch (e) {
      return err(mapDbError(e));
    }
  }
}
