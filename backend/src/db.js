import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: process.env.ENV_FILE || '../.env', override: true });

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is missing. Add it to the project root .env file.');
}

export const pool = new Pool({
  connectionString,
});

export const runQuery = async (text, params = []) => {
  const result = await pool.query(text, params);
  return result;
};

export const getClient = async () => {
  return pool.connect();
};
