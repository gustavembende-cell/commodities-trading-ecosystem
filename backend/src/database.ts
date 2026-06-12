import { Pool } from 'pg';
import logger from './utils/logger';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'commodities_trading',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
});

export async function initDatabase() {
  try {
    const res = await pool.query('SELECT NOW()');
    logger.info('Database connection successful:', res.rows[0]);
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
}

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug(`Query executed in ${duration}ms`);
    return res;
  } catch (error) {
    logger.error('Query error:', { text, params, error });
    throw error;
  }
}

export { pool };
