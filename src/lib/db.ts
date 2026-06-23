import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    const host = process.env.DATABASE_HOST || process.env.DB_HOST || 'mysql-1ff48a92-itoy2724-d356.d.aivencloud.com';
    const user = process.env.DATABASE_USER || process.env.DB_USER || 'avnadmin';
    const password = process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || 'AVNS_00WbvIaMHC0gqEbkojK';
    const database = process.env.DATABASE_NAME || process.env.DB_NAME || 'defaultdb';
    const port = Number(process.env.DATABASE_PORT || process.env.DB_PORT) || 18217;

    pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      ssl: { rejectUnauthorized: false },
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
