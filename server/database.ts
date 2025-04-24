import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
// Import hashPassword once it's defined (we'll import it in the seedSampleUsers function)

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize SQLite database
const dbPath = path.join(dataDir, 'versefountain.db');
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables if they don't exist
export function initDatabase() {
  console.log("Initializing database tables...");
  
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      is_admin INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Poems table
  db.exec(`
    CREATE TABLE IF NOT EXISTS poems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author_id INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      is_video INTEGER DEFAULT 0,
      video_url TEXT,
      approved INTEGER DEFAULT 0,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Books table
  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      description TEXT,
      cover_image TEXT,
      uploaded_by_id INTEGER,
      genre TEXT,
      approved INTEGER DEFAULT 0,
      FOREIGN KEY (uploaded_by_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Events table
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      location TEXT NOT NULL,
      is_virtual INTEGER DEFAULT 0,
      stream_url TEXT,
      is_free INTEGER DEFAULT 0,
      ticket_price REAL,
      organizer TEXT
    )
  `);

  // Chat rooms table
  db.exec(`
    CREATE TABLE IF NOT EXISTS chat_rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_by_id INTEGER,
      is_private INTEGER DEFAULT 0,
      FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Chat messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Academic resources table
  db.exec(`
    CREATE TABLE IF NOT EXISTS academic_resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL,
      subject TEXT,
      grade_level TEXT,
      language TEXT,
      resource_url TEXT
    )
  `);

  // Tickets table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      purchase_date TEXT DEFAULT CURRENT_TIMESTAMP,
      ticket_code TEXT UNIQUE NOT NULL,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // User-Poem relationships (ratings, likes)
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_poems (
      user_id INTEGER NOT NULL,
      poem_id INTEGER NOT NULL,
      rating INTEGER,
      liked INTEGER DEFAULT 0,
      PRIMARY KEY (user_id, poem_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (poem_id) REFERENCES poems(id) ON DELETE CASCADE
    )
  `);

  console.log("Database tables initialized successfully");
  
  // After initializing the tables, ensure admin users exist
  seedSampleUsers();
}

// Seed admin users
function seedSampleUsers() {
  // Check if we already have the test users
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  
  if (userCount.count === 0) {
    console.log("Seeding admin users...");
    try {
      // Using simple development hash format
      const hashedPassword = 'dev-hash-password';
      
      // Create admin user
      db.prepare(`
        INSERT INTO users (username, email, password, is_admin) 
        VALUES (?, ?, ?, 1)
      `).run('admin', 'admin@versefountain.com', hashedPassword);
      
      // Create leon user
      db.prepare(`
        INSERT INTO users (username, email, password, is_admin) 
        VALUES (?, ?, ?, 1)
      `).run('leon', 'aaron@techleopard.com', hashedPassword);
      
      // Create aaronleon user
      db.prepare(`
        INSERT INTO users (username, email, password, is_admin) 
        VALUES (?, ?, ?, 1)
      `).run('aaronleon', 'aaronleon@versefountain.com', hashedPassword);
      
      console.log("Admin users created successfully");
    } catch (error) {
      console.error("Error seeding admin users:", error);
    }
  }
}

// Initialize the database first
initDatabase();

// Create prepared statements for common operations
export const userStatements = {
  create: db.prepare(`
    INSERT INTO users (username, email, password) 
    VALUES (?, ?, ?)
  `),
  getById: db.prepare(`
    SELECT id, username, email, is_admin, created_at 
    FROM users 
    WHERE id = ?
  `),
  getByUsername: db.prepare(`
    SELECT * 
    FROM users 
    WHERE username = ?
  `),
  getByEmail: db.prepare(`
    SELECT * 
    FROM users 
    WHERE email = ?
  `)
};