// Script to install MySQL dependencies
const { execSync } = require('child_process');
const fs = require('fs');

console.log('Installing MySQL dependencies...');

try {
  // Install MySQL dependencies
  console.log('📦 Installing mysql2 and express-mysql-session...');
  execSync('npm install mysql2 express-mysql-session @types/express-mysql-session --save', { stdio: 'inherit' });
  
  console.log('✅ MySQL dependencies installed successfully!');
  
  // Instructions for switching to MySQL
  console.log('\nTo complete the MySQL setup:');
  console.log('1. Run the database setup script: node setup-db.js');
  console.log('2. Replace server/storage.ts with mysql-storage.ts');
  console.log('3. Update the .env file to use MySQL environment variables');
  console.log('4. Restart the application');
  
} catch (error) {
  console.error('❌ Error installing MySQL dependencies:', error.message);
}