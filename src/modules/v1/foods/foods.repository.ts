import { db } from '@/infrastructure/db';
import {
  Food,
  FoodComment,
  foodComments,
  FoodRating,
  foodRating,
  foods,
  NewFood,
  NewFoodComment,
  NewFoodRating,
} from '@/infrastructure/db/schema/foods.ts';
import {
  FoodCommentWithUser,
  FoodEntityWithInteractions,
  FoodRatingWithUser,
} from '@/infrastructure/db/types/composite';
import { Direction } from '@/types/paginated';
import { desc, eq, sql } from 'drizzle-orm';

import { Mood } from '@/common/constants/foods.constants.ts';

export abstract class FoodsRepository {
  static async create(food: NewFood): Promise<{ id: string } | undefined> {
    const [newFood] = await db.insert(foods).values(food).returning({ id: foods.id });
    return newFood;
  }

  static async findRandomByMood(mood: Mood): Promise<Food | undefined> {
    return await db.query.foods.findFirst({
      where: eq(foods.mood, mood),
      orderBy: sql`RANDOM()`,
    });
  }

  static async findAll(
    limit: number,
    cursor?: string,
    direction: Direction = 'next',
  ): Promise<Food[]> {
    return await db.query.foods.findMany({
      limit: limit + 1,
      orderBy: (foods, { asc, desc }) => [direction === 'prev' ? desc(foods.id) : asc(foods.id)],
      where: (foods, { gt, lt }) => {
        if (!cursor) return undefined;
        return direction === 'prev' ? lt(foods.id, cursor) : gt(foods.id, cursor);
      },
    });
  }

  static async findSampleForAI(): Promise<Food[]> {
    return await db.query.foods.findMany({
      limit: 100,
      where: (foods, { eq }) => eq(foods.isAvailable, true),
      orderBy: sql`RANDOM()`,
    });
  }

  static async findById(id: string): Promise<Food | undefined> {
    return await db.query.foods.findFirst({ where: eq(foods.id, id) });
  }

  static async update(id: string, data: Partial<NewFood>): Promise<Food | undefined> {
    const [updated] = await db.update(foods).set(data).where(eq(foods.id, id)).returning();
    return updated;
  }

  static async delete(id: string): Promise<void> {
    await db.delete(foods).where(eq(foods.id, id));
  }

  static async createComments(data: NewFoodComment): Promise<FoodComment | undefined> {
    const [newComment] = await db.insert(foodComments).values(data).returning();
    return newComment;
  }

  static async findFoodWithCommentsByFoodId(foodId: string): Promise<FoodCommentWithUser[]> {
    const rows = await db.query.foodComments.findMany({
      where: eq(foodComments.foodId, foodId),
      orderBy: [desc(foodComments.createdAt)],
      with: {
        user: {
          columns: {
            id: true,
            username: true,
          },
        },
      },
    });

    return rows as FoodCommentWithUser[];
  }

  static async upsertFoodWithRating(data: NewFoodRating): Promise<FoodRating | undefined> {
    const [savedRating] = await db
      .insert(foodRating)
      .values(data)
      .onConflictDoUpdate({
        target: [foodRating.foodId, foodRating.userId],
        set: { rating: data.rating },
      })
      .returning();
    return savedRating;
  }

  static async findFoodWithRatingByFoodId(foodId: string): Promise<FoodRatingWithUser[]> {
    const rows = await db.query.foodRating.findMany({
      where: eq(foodRating.foodId, foodId),
      with: {
        user: {
          columns: {
            id: true,
            username: true,
          },
        },
      },
    });
    return rows as FoodRatingWithUser[];
  }

  static async findByIdWithInteractions(
    id: string,
  ): Promise<FoodEntityWithInteractions | undefined> {
    const result = await db.query.foods.findFirst({
      where: eq(foods.id, id),
      with: {
        comments: {
          orderBy: [desc(foodComments.createdAt)],
          with: {
            user: {
              columns: { id: true, username: true },
            },
          },
        },
        ratings: {
          with: {
            user: {
              columns: { id: true, username: true },
            },
          },
        },
      },
    });

    return result as FoodEntityWithInteractions | undefined;
  }
}
