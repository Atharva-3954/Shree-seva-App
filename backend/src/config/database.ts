import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from './env';
import * as schema from '../db/schema/index';

const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql, { schema });

export async function testConnection(): Promise<boolean> {
  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout (3s)')), 3000)
    );
    await Promise.race([sql`SELECT 1 as connected`, timeout]);
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', (error as Error).message || error);
    return false;
  }
}
