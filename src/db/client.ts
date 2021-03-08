import pg from 'pg';
import { isDev, connectionString } from 'config/server';

export default async () => {
  const pgPool = new pg.Pool({
    connectionString,
    ssl: isDev ? false : { rejectUnauthorized: false },
  });

  // Test the connection
  const client = await pgPool.connect();
  const tableCountResp = await client.query(
    'select count(*) from information_schema.tables where table_schema = $1;',
    ['azdev'],
  );
  client.release();

  console.info(
    'Connected to PostgreSQL | Tables count:',
    tableCountResp.rows[0].count,
  );

  pgPool.on('error', (err) => {
    console.error('Unexpected PG client error', err);
    process.exit(-1);
  });

  return {
    pgPool,
    pgClose: async () => await pgPool.end(),
  };
};
