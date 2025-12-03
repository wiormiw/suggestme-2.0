import { pool } from '../src/infrastructure/db';
import { seedFoods } from './seed-foods';
import { seedSuperAdmin } from './seed-superadmin';

async function main() {
  try {
    console.log('🚀 Starting database seed...');

    await Promise.all([seedSuperAdmin(), seedFoods()]);

    console.log('🎉 All seeding completed successfully!');
  } catch (error) {
    console.error('🛑 Database seeding failed:', error);
  } finally {
    await pool.end();
  }
}

main();
