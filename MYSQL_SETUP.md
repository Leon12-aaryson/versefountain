# MySQL Setup Guide for VerseFountain

This guide will help you set up the VerseFountain application with a MySQL database.

## Prerequisites

- MySQL server installed and running
- Node.js and npm installed

## Installation Steps

### 1. Install MySQL Dependencies

Run the following command to install the required MySQL packages:

```bash
node install-mysql-deps.cjs
```

This will install:
- mysql2: MySQL client for Node.js
- express-mysql-session: Session store for Express using MySQL
- @types/express-mysql-session: TypeScript definitions

### 2. Set up MySQL Environment Variables

Update the `.env` file with your MySQL credentials:

```
# MySQL Database Connection
MYSQL_DATABASE_URL=mysql://username:password@localhost:3306/versefountain
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=versefountain
MYSQL_USER=username
MYSQL_PASSWORD=password
```

Replace `username` and `password` with your actual MySQL credentials.

### 3. Create Database and Load Schema

Run the setup script to create the database and load the schema with sample data:

```bash
node setup-db.js
```

This script:
- Creates the versefountain database
- Creates all required tables
- Populates tables with sample data

### 4. Replace Storage Implementation

Replace the current PostgreSQL-based storage implementation with the MySQL-compatible version:

```bash
cp mysql-storage.ts server/storage.ts
```

The MySQL-compatible version:
- Handles the lack of `.returning()` in MySQL by querying for the inserted/updated records
- Uses the proper MySQL connection parameters
- Works with Boolean values properly (MySQL uses 0/1 for false/true)

### 5. Restart the Application

Restart the application to apply all changes:

```bash
npm run dev
```

## Database Schema

The MySQL database includes the following tables:

- users: User accounts and profiles
- poems: Poetry content
- books: Book information
- discussions: Forum discussions
- chat_messages: Real-time chat messages
- events: Cultural events
- cultural_categories: Categories of cultural origins
- academic_resources: Research and academic materials
- reading_progress: User reading progress tracking
- comments: User comments on content
- ratings: User ratings for poems and books
- sessions: Authentication session data

## Troubleshooting

If you encounter issues:

1. **Connection Error**: Verify your MySQL server is running and credentials are correct
2. **Permission Issues**: Ensure your MySQL user has permission to create databases and tables
3. **Port Conflict**: Check if the default port (3306) is in use or blocked by a firewall
4. **Database Already Exists**: The script is designed to drop and recreate tables if they exist
5. **Node.js Errors**: Make sure all dependencies are installed correctly

For additional help, refer to the MySQL documentation or contact the development team.

## Next Steps

After setup:
- Add more content through the application interface
- Create additional user accounts
- Explore the cultural content from various traditions