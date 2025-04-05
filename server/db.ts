import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import dotenv from 'dotenv';
import { log } from './vite';

// Load environment variables from .env file
dotenv.config();

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Log database connection info (without sensitive data)
log(`Connecting to database at ${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`, 'database');

// Configure connection pool with details from environment variables
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // These are optional and will be used as fallbacks if included in the connection string
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD
});

export const db = drizzle({ client: pool, schema });
