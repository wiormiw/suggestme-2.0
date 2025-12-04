import { db, pool } from '@/infrastructure/db';

import { cleanDB } from './cleanup';
import { seedFoods } from './seed-foods';
import { seedSuperAdmin } from './seed-superadmin';

async function main() {
  try {
    console.log('🚀 Starting database seed...');

    await db.transaction(async (tx) => {
      await cleanDB(tx);
      await Promise.all([seedSuperAdmin(tx), seedFoods(tx)]);
    });

    console.log('🎉 All seeding completed successfully :)');
  } catch (error) {
    console.error('🛑 Database seeding failed:', error);
  } finally {
    await pool.end();
  }
}

main();
