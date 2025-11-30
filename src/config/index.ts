import { z } from 'zod';

// Schema
const appEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DB_URL: z.url().default('postgresql://myuser:mypassword@localhost:5432/suggestme'),
  JWT_SECRET: z.string().default('secret'),
  REFRESH_SECRET: z.string().default('refresh-secret'),
});

// Parsing
const _env = appEnvSchema.safeParse(Bun.env);

if (!_env.success) {
  console.error('Invalid environment variables:', z.treeifyError(_env.error));
  process.exit(1);
}

// Safe used env
export const appEnv = _env.data;
