import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

let dbCredentials;

if (databaseUrl) {
  console.log("Using DATABASE_URL for Drizzle configuration");
  dbCredentials = {
    url: databaseUrl,
  };
} else if (dbHost && dbPort && dbUser && dbPassword && dbName) {
  console.log("Using individual connection parameters for Drizzle configuration");
  dbCredentials = {
    host: dbHost,
    port: parseInt(dbPort),
    user: dbUser,
    password: dbPassword,
    database: dbName,
    ssl: dbHost === "localhost" || dbHost === "127.0.0.1" ? false : { rejectUnauthorized: false },
  };
} else {
  throw new Error(
    "Database configuration is incomplete. Provide either DATABASE_URL or all individual parameters (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)."
  );
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials,
});