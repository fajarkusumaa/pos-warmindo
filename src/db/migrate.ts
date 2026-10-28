import { config } from 'dotenv';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { getDb } from './index';

config({ path: '.env.local' });
config({ path: '.env' });

async function runMigrate() {
  const skipIfNoEnv = process.argv.includes('--if-env');
  const hasUrl = Boolean(
    process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL,
  );

  if (!hasUrl && skipIfNoEnv) {
    console.log('ℹ️  [db:migrate] DATABASE_URL belum ditemukan, melewati auto-migrasi.');
    return;
  }

  console.log('🚀 Menjalankan migrasi Drizzle ORM ke Neon PostgreSQL...');
  const db = getDb();
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('✅ Migrasi Drizzle ORM berhasil dijalankan!');
}

runMigrate().catch((err) => {
  console.error('❌ Gagal menjalankan migrasi Drizzle:', err);
  process.exit(1);
});
