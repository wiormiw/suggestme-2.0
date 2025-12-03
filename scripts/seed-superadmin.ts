import { users } from '@/infrastructure/db/schema/users';
import { DBTransaction } from '@/types/db';

import { hashPassword } from '@/common/utils/auth.util';

export async function seedSuperAdmin(tx: DBTransaction) {
  try {
    console.log('🌱 Seeding superadmin...');

    const email = 'admin@suggestme.com';
    const password = await hashPassword('Admin123!');

    await tx
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
    throw error;
  }
}
