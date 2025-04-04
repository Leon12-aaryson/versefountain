Setting Up VerseFountain

Setting Up the Database Locally After Download
To set up the PostgreSQL database for VerseFountain after downloading the project to your local machine, follow these steps:
Step 1: Install PostgreSQL
First, make sure PostgreSQL is installed on your machine:
* Windows: Download and install from PostgreSQL website
* Mac: Use Homebrew: brew install postgresql
* Linux: Use your distribution's package manager, e.g., sudo apt install postgresql postgresql-contrib
Step 2: Create a Local Database
1. Start PostgreSQL service:
    * Windows: It should run as a service after installation
    * Mac: brew services start postgresql
    * Linux: sudo systemctl start postgresql
2. Create a database:psql -U postgresCREATE DATABASE versefountain;\q
3. Step 3: Configure Environment Variables
Create a .env file in the root directory with these variables:
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/versefountain
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=versefountain
PGPORT=5432

Replace your_password with your PostgreSQL password.
Step 4: Install Dependencies
Run this in the project directory:
npm install

Step 5: Push the Database Schema
The project uses Drizzle ORM for schema management. Run:
npm run db:push

This will create all the required tables in your database based on the schema defined in shared/schema.ts.
Step 6: Start the Application
Now you can start the application:
npm run dev

Optional: Populate with Sample Data
The application already has sample data in server/storage.ts. When first connecting to the database, this data should be automatically populated. If not, you can visit various API endpoints (like /api/cultural-categories) to trigger data creation.
Troubleshooting
* If you get database connection errors, check that your PostgreSQL service is running
* Ensure your .env variables match your local PostgreSQL setup
* If schema changes fail, you may need to drop tables (DROP TABLE table_name;) and run npm run db:push again
Let me know if you need any additional help with the setup!
