import { DBTransaction } from '@/types/db';
import { sql } from 'drizzle-orm/sql';

export async function cleanDB(tx: DBTransaction) {
  try {
    console.log('🌱 Cleaning table before seeding...');

    await tx.execute(sql`TRUNCATE TABLE foods RESTART IDENTITY CASCADE;`);
    await tx.execute(sql`DELETE FROM users WHERE users.role = 'admin'`);

    console.log(`✅ cleanup DB success`);
  } catch (error) {
    console.error('❌ Error cleanup table:', error);
    throw error;
  }
}
