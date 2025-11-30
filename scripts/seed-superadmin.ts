import { AuthUtil } from '../src/common/utils/auth.util';
import { db, pool } from '../src/infrastructure/db';
import { users } from '../src/infrastructure/db/schema/users';

async function seedSuperAdmin() {
  try {
    console.log('🌱 Seeding superadmin...');

    const email = 'admin@suggestme.com';
    const password = await AuthUtil.hashPassword('Admin123!');

    await db
      .insert(users)
      .values({
        id: Bun.randomUUIDv7(),
        email,
        username: 'superadmin',
        password,
        role: 'admin',
      })
      .onConflictDoNothing();

    console.log('✅ Superadmin seeded successfully');
    console.log('📧 Email:', email);
    console.log('🔑 Password: Admin123!');
  } catch (error) {
    console.error('❌ Error seeding superadmin:', error);
  } finally {
    await pool.end();
  }
}

seedSuperAdmin();
