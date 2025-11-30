import { db } from '@/infrastructure/db';
import { Food, foods, NewFood } from '@/infrastructure/db/schema/foods.ts';
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

  static async findAll(): Promise<Food[]> {
    return await db.query.foods.findMany();
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
