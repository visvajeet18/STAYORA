import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = async (text, params) => {
  return await pool.query(text, params);
};

export const checkConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL database');
    client.release();
    return true;
  } catch (err) {
    console.error('Failed to connect to PostgreSQL database:', err.message);
    return false;
  }
};
