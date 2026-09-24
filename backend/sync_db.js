import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const localPool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'stayora',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

const remotePool = new Pool({
  connectionString: 'postgresql://stayora_user:2Rbh6LhZPWNlOjmOsqjAuNAdbdh8KSqp@dpg-daqcna3ncjis739gku10-a.ohio-postgres.render.com/stayora',
  ssl: { rejectUnauthorized: false }
});

const sync = async () => {
  try {
    console.log('Fetching local data...');
    const localRes = await localPool.query('SELECT * FROM hotels ORDER BY id ASC');
    const localHotels = localRes.rows;
    console.log(`Found ${localHotels.length} hotels in local database.`);

    const remoteClient = await remotePool.connect();
    
    console.log('Truncating remote database...');
    await remoteClient.query('TRUNCATE hotels RESTART IDENTITY');

    console.log('Uploading local data to remote...');
    for (const h of localHotels) {
      await remoteClient.query(
        'INSERT INTO hotels (title, description, latitude, longitude, price, image) VALUES ($1, $2, $3, $4, $5, $6)',
        [h.title, h.description, h.latitude, h.longitude, h.price, h.image]
      );
    }
    
    console.log('Sync complete! Remote database now perfectly matches local database.');
    remoteClient.release();
  } catch (error) {
    console.error('Error during sync:', error);
  }
  process.exit();
};

sync();
