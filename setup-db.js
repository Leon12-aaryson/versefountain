// MySQL Setup Script for VerseFountain
// This script initializes the MySQL database using the SQL setup file
// and applies the MySQL compatible configuration

import fs from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MySQL connection config from environment variables
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'password',
  multipleStatements: true // Important for running multiple SQL statements
};

async function setupDatabase() {
  console.log('Starting database setup...');

  try {
    // Read the SQL setup file
    const sqlScript = fs.readFileSync('./setup-mysql.sql', 'utf8');
    
    // Create a connection
    console.log('Connecting to MySQL server...');
    const connection = await mysql.createConnection(dbConfig);
    
    // Execute the SQL script
    console.log('Executing setup script...');
    await connection.query(sqlScript);
    
    console.log('✅ Database setup complete!');
    console.log('✅ Schema and sample data have been loaded.');
    
    // Close the connection
    await connection.end();
    console.log('Database connection closed.');
    
    console.log('\nTo update the application to use MySQL:');
    console.log('1. Ensure that the MySQL service is running');
    console.log('2. Update the .env file with proper MySQL credentials');
    console.log('3. Fix the storage.ts file to handle returning() methods with MySQL');
    
  } catch (error) {
    console.error('❌ Error during database setup:', error);
    console.error('\nPossible issues:');
    console.error('- MySQL server is not running');
    console.error('- Invalid MySQL credentials in .env file');
    console.error('- Insufficient permissions to create database/tables');
  }
}

// Run the setup
setupDatabase();