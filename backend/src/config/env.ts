import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/shree_seva'),

  JWT_SECRET: z.string().default('shree_seva_dev_jwt_secret_key_32chars_min!'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  CLOUDINARY_CLOUD_NAME: z.string().default('shree-seva-dev'),
  CLOUDINARY_API_KEY: z.string().default('dev-api-key'),
  CLOUDINARY_API_SECRET: z.string().default('dev-api-secret'),

  OWNER_SETUP_KEY: z.string().default('shree_seva_owner_secret_2026'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

export type Env = z.infer<typeof envSchema>;
