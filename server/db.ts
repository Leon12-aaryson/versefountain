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
    ssl: {
      rejectUnauthorized: false, // Required for Neon
    },
  };
} else if (dbHost && dbPort && dbUser && dbPassword && dbName) {
  console.log('Connecting to database using individual connection parameters');
  poolConfig = {
    host: dbHost,
    port: parseInt(dbPort),
    user: dbUser,
    password: dbPassword,
    database: dbName,
    ssl: dbHost === 'localhost' || dbHost === '127.0.0.1' ? false : { rejectUnauthorized: false }, // Disable SSL for local
  };
} else {
  throw new Error(
    'Database configuration is incomplete. Please provide either DATABASE_URL or all individual connection parameters (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME).'
  );
}

poolConfig = {
  ...poolConfig,
  max: 10, // Increased to handle concurrent connections



  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // Reduced for faster failure
  keepAlive: true, // Enable TCP keep-alive
};

export const pool = new Pool(poolConfig);

// Handle pool errors to prevent crashes
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle database client:', err.message, err.stack);
});

pool.on('connect', () => {
  console.log('Database pool connected');
});

pool.on('remove', () => {
  console.log('Database pool connection removed');
});

export const db = drizzle(pool, { schema });

console.log('Database connection initialized successfully');

// Test initial connection with retry
async function connectWithRetry(attempts = 3, delay = 5000) {
  for (let i = 0; i < attempts; i++) {
    try {
      const client = await pool.connect();
      console.log('Initial database connection successful');
      client.release();
      return;
    } catch (err) {
      console.error(`Connection attempt ${i + 1} failed:`, err.message, err.stack);
      if (i < attempts - 1) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  console.error('Failed to connect to database after retries');
}

connectWithRetry().catch((err) => {
  console.error('Connection retry failed:', {
    message: err.message,
    stack: err.stack,
    databaseUrl: databaseUrl ? databaseUrl.replace(/:\/\//, '://<redacted>@') : 'Not provided',
  });
});