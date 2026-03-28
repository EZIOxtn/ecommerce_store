import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const pool = postgres(process.env.DATABASE_URL, {
  ssl: false
});

export default pool;