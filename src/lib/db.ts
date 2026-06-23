import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host:     'mysql-1ff48a92-itoy2724-d356.d.aivencloud.com',
  user:     'avnadmin',
  password: 'AVNS_00WbvIaMHC0gqEbkojK',
  database: 'defaultdb',
  port:     18217,
  ssl:      {},
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query<T>(sql: string, params?: unknown[]): Promise<T> {
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}

export default pool;
