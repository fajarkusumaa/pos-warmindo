import { neon } from '@neondatabase/serverless';

/**
 * Mengambil koneksi Neon Serverless SQL.
 * Saat menggunakan integrasi Neon di Vercel Marketplace, Vercel otomatis
 * menyediakan DATABASE_URL / POSTGRES_URL di Environment Variables.
 */
export function getSql() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL belum dikonfigurasi. Hubungkan Neon melalui tab Storage di Vercel atau isi file .env.local',
    );
  }

  return neon(connectionString);
}

export function isDbConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.NEON_DATABASE_URL,
  );
}
