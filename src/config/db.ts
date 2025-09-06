import config from './index';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema/index';

const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

export const db = drizzle(pool, {schema});
export const testConnection = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

export default {db, testConnection};