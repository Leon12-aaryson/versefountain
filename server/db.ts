import pg from 'pg';
const {Pool} = pg;

import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

let poolConfig;

if (databaseUrl) {
  console.log('Connecting to database using DATABASE_URL');
  poolConfig = {
    connectionString: databaseUrl,
  };
} else if (dbHost && dbPort && dbUser && dbPassword && dbName) {
  console.log('Connecting to database using individual connection parameters');
  poolConfig = {
    host: dbHost,
    port: parseInt(dbPort),
    user: dbUser,
    password: dbPassword,
    database: dbName,
  };
} else {
  throw new Error(
    'Database configuration is incomplete. Please provide either DATABASE_URL or all individual connection parameters (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME).'
  );
}

poolConfig = {
  ...poolConfig,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
};

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client:', err.message);
});

export const db = drizzle(pool, { schema });

console.log('Database connection initialized successfully');

pool.connect().catch((err) => {
  console.error('Failed to connect to database:', {
    message: err.message,
    stack: err.stack,
    databaseUrl: databaseUrl ? databaseUrl.replace(/:\/\//, '://<redacted>@') : 'Not provided',
  });
});