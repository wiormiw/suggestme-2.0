import { db } from '@/infrastructure/db';
import { Food, foods, NewFood } from '@/infrastructure/db/schema/foods.ts';
import { Direction } from '@/types/paginated';
import { eq, sql } from 'drizzle-orm';

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
}
