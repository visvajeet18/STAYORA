import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: 'postgresql://stayora_user:2Rbh6LhZPWNlOjmOsqjAuNAdbdh8KSqp@dpg-daqcna3ncjis739gku10-a.ohio-postgres.render.com/stayora',
  ssl: { rejectUnauthorized: false }
});

const alterTable = async () => {
  try {
    const client = await pool.connect();
    await client.query('ALTER TABLE hotels ALTER COLUMN image TYPE TEXT;');
    console.log('Successfully changed image column to TEXT on Render');
    client.release();
  } catch (err) {
    console.error('Failed to alter table:', err);
  }
  process.exit(0);
};

alterTable();
