import { checkConnection, query as localQuery } from './src/config/db.js';
import pkg from 'pg';
const { Pool } = pkg;

const remotePool = new Pool({
  connectionString: 'postgresql://stayora_user:2Rbh6LhZPWNlOjmOsqjAuNAdbdh8KSqp@dpg-daqcna3ncjis739gku10-a.ohio-postgres.render.com/stayora',
  ssl: { rejectUnauthorized: false }
});

const updatePrices = async () => {
  try {
    await checkConnection();
    await localQuery('UPDATE hotels SET price = floor(random() * (7500 - 1500 + 1) + 1500)');
    console.log('Local prices updated.');

    const remoteClient = await remotePool.connect();
    await remoteClient.query('UPDATE hotels SET price = floor(random() * (7500 - 1500 + 1) + 1500)');
    console.log('Remote prices updated.');
    remoteClient.release();
  } catch (err) {
    console.error(err);
  }
  process.exit();
};
updatePrices();
