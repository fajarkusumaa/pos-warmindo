import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export function getDb(connectionString?: string) {
  const url =
    connectionString ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL;

  if (!url) {
    throw new Error(
      'DATABASE_URL belum ditemukan. Pastikan sudah mengatur DATABASE_URL di .env.local atau Vercel Storage.',
    );
  }

  const sql = neon(url);
  return drizzle(sql, { schema });
}
