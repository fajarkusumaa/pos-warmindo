import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Load .env.local terlebih dahulu, lalu fallback ke .env
config({ path: '.env.local' });
config({ path: '.env' });

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.NEON_DATABASE_URL ||
  '';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
});
