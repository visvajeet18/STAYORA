import { checkConnection, query } from './src/config/db.js';

const alterTable = async () => {
  try {
    await checkConnection();
    await query('ALTER TABLE hotels ALTER COLUMN image TYPE TEXT;');
    console.log('Successfully changed image column to TEXT');
  } catch (err) {
    console.error('Failed to alter table:', err);
  }
  process.exit(0);
};

alterTable();
