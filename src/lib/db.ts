import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    let sslOptions: any = null;

    if (process.env.DATABASE_SSL_CA) {
      sslOptions = {
        ca: process.env.DATABASE_SSL_CA,
      };
    } else {
      try {
        const certPath = path.join(process.cwd(), 'sertifika.pem');
        if (fs.existsSync(certPath)) {
          sslOptions = {
            ca: fs.readFileSync(certPath),
          };
        }
      } catch (err) {
        console.warn('SSL certificate could not be loaded:', err);
      }
    }

    const host =
      process.env.DATABASE_HOST ||
      process.env.DB_HOST ||
      '102.220.160.109';

    const user =
      process.env.DATABASE_USER ||
      process.env.DB_USER ||
      'dimitri';

    const password =
      process.env.DATABASE_PASSWORD ||
      process.env.DB_PASSWORD ||
      'Losete00*';

    const database =
      process.env.DATABASE_NAME ||
      process.env.DB_NAME ||
      'dimitri';

    const port =
      Number(process.env.DATABASE_PORT || process.env.DB_PORT) || 21011;

    pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      ssl: sslOptions,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  return pool;
}

export async function query<T>(sql: string, params?: unknown[]): Promise<T> {
  const pool = getPool();
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}

export default { getPool, query };
