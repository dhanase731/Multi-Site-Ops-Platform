import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const run = async () => {
  try {
    const schemaPath = resolve(__dirname, '../sql/schema.sql');
    const seedPath = resolve(__dirname, '../sql/seed.sql');

    const schemaSql = await readFile(schemaPath, 'utf8');
    const seedSql = await readFile(seedPath, 'utf8');

    await pool.query(schemaSql);
    await pool.query(seedSql);

    console.log('Database schema and seed applied successfully.');
  } catch (error) {
    console.error('Failed to initialize database:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

run();
