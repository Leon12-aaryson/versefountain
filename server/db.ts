import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get database configuration from environment variables
const databaseUrl = process.env.DATABASE_URL;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

// Determine connection options based on available environment variables
let poolConfig: any;

// Prefer DATABASE_URL if available
if (databaseUrl) {
  console.log('Connecting to database using DATABASE_URL');
  poolConfig = { 
    connectionString: databaseUrl,
  };
} 
// Fall back to individual connection parameters
else if (dbHost && dbPort && dbUser && dbPassword && dbName) {
  console.log('Connecting to database using individual connection parameters');
  poolConfig = {
    host: dbHost,
    port: parseInt(dbPort),
    user: dbUser,
    password: dbPassword,
    database: dbName,
  };
} 
// No valid configuration available
else {
  throw new Error(
    "Database configuration is incomplete. Please provide either DATABASE_URL or all individual connection parameters (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)."
  );
}

// Add common pool configuration
poolConfig = {
  ...poolConfig,
  ssl: {
    rejectUnauthorized: false // Required for some PaaS providers
  },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection
};

// Create database connection pool with error handling
export const pool = new Pool(poolConfig);

// Set up error handling on the pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
  // Don't exit the process, just log the error
});

// Initialize Drizzle ORM
export const db = drizzle(pool, { schema });

// Log database connection
console.log('Database connection initialized successfully');