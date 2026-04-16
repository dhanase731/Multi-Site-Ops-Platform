import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config({ path: '../.env' });

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
const db = await client.query('SELECT current_database() AS db, current_user AS usr');
console.log(JSON.stringify(db.rows, null, 2));
const result = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
console.log(JSON.stringify(result.rows, null, 2));
await client.end();
