import { db } from '@/infrastructure/db';
import { NewUser, User, users } from '@/infrastructure/db/schema/users';
import { eq } from 'drizzle-orm';

export abstract class UserRepository {
  static async create(user: NewUser): Promise<User | undefined> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  static async findById(id: string): Promise<User | undefined> {
    return await db.query.users.findFirst({ where: eq(users.id, id) });
  }

  static async findByEmail(email: string): Promise<User | undefined> {
    return await db.query.users.findFirst({ where: eq(users.email, email) });
  }

  static async findAll(limit: number, cursor?: string): Promise<User[]> {
    return await db.query.users.findMany({
      limit: limit + 1,
      orderBy: (users, { asc }) => [asc(users.id)],
      where: (users, { gt }) => (cursor ? gt(users.id, cursor) : undefined),
    });
  }

  static async update(id: string, data: Partial<NewUser>): Promise<User | undefined> {
    const [updated] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return updated;
  }

  static async delete(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
}
