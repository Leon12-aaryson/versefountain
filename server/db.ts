import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "@shared/schema";
import dotenv from 'dotenv';
import { log } from './vite';

// Load environment variables from .env file
dotenv.config();

if (!process.env.MYSQL_DATABASE_URL) {
  throw new Error(
    "MYSQL_DATABASE_URL must be set. Did you forget to configure MySQL database?",
  );
}

// Log database connection info (without sensitive data)
log(`Connecting to MySQL database at ${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}/${process.env.MYSQL_DATABASE}`, 'database');

// Configure connection pool with details from environment variables
export const pool = mysql.createPool({
  uri: process.env.MYSQL_DATABASE_URL,
  // These are optional and will be used as fallbacks if included in the connection string
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD
});

export const db = drizzle(pool, { mode: 'default' });
