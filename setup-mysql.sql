-- MySQL Setup Script for VerseFountain
-- This script will create the database, tables, and populate with sample data

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS versefountain;
USE versefountain;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS reading_progress;
DROP TABLE IF EXISTS academic_resources;
DROP TABLE IF EXISTS cultural_categories;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS discussions;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS poems;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS sessions;

-- Create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  displayName VARCHAR(255) NOT NULL,
  avatar VARCHAR(255) NULL,
  bio TEXT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create poems table
CREATE TABLE poems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  authorId INT NOT NULL,
  authorName VARCHAR(255) NOT NULL,
  culturalOrigin VARCHAR(255) NOT NULL,
  coverImage VARCHAR(255) NULL,
  readTime INT NOT NULL DEFAULT 0,
  likes INT NOT NULL DEFAULT 0,
  comments INT NOT NULL DEFAULT 0,
  rating FLOAT NOT NULL DEFAULT 0,
  ratingCount INT NOT NULL DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create books table
CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  culturalOrigin VARCHAR(255) NULL,
  coverImage VARCHAR(255) NULL,
  category VARCHAR(255) NOT NULL,
  description TEXT NULL,
  rating FLOAT NOT NULL DEFAULT 0,
  ratingCount INT NOT NULL DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create discussions table
CREATE TABLE discussions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  authorId INT NOT NULL,
  authorName VARCHAR(255) NOT NULL,
  authorAvatar VARCHAR(255) NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'active',
  replies INT NOT NULL DEFAULT 0,
  views INT NOT NULL DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create chat_messages table
CREATE TABLE chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  userId INT NOT NULL,
  username VARCHAR(255) NOT NULL,
  userAvatar VARCHAR(255) NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create events table
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(255) NOT NULL,
  isVirtual BOOLEAN NOT NULL DEFAULT 0,
  coverImage VARCHAR(255) NULL,
  startTime VARCHAR(50) NOT NULL,
  endTime VARCHAR(50) NOT NULL,
  attendees INT NOT NULL DEFAULT 0,
  month VARCHAR(50) NOT NULL,
  day VARCHAR(50) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cultural_categories table
CREATE TABLE cultural_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  imageUrl VARCHAR(255) NULL,
  workCount INT NOT NULL DEFAULT 0
);

-- Create academic_resources table
CREATE TABLE academic_resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  link VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  icon VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reading_progress table
CREATE TABLE reading_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  bookId INT NOT NULL,
  currentPage INT NOT NULL DEFAULT 0,
  totalPages INT NOT NULL,
  lastRead TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE KEY (userId, bookId)
);

-- Create comments table
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  userId INT NOT NULL,
  username VARCHAR(255) NOT NULL,
  userAvatar VARCHAR(255) NULL,
  bookId INT NULL,
  poemId INT NULL,
  discussionId INT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY (poemId) REFERENCES poems(id) ON DELETE CASCADE,
  FOREIGN KEY (discussionId) REFERENCES discussions(id) ON DELETE CASCADE
);

-- Create ratings table
CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rating INT NOT NULL,
  userId INT NOT NULL,
  bookId INT NULL,
  poemId INT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY (poemId) REFERENCES poems(id) ON DELETE CASCADE,
  UNIQUE KEY (userId, bookId),
  UNIQUE KEY (userId, poemId)
);

-- Create sessions table for authentication
CREATE TABLE sessions (
  session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
  expires INT(11) UNSIGNED NOT NULL,
  data TEXT COLLATE utf8mb4_bin,
  PRIMARY KEY (session_id)
);

-- Sample data

-- Users
INSERT INTO users (username, email, password, displayName, avatar, bio) VALUES
('johndoe', 'john@example.com', '$2b$10$2aXmMM6t6MZyP5TyryMgCePWBGZdgt7YchV.NC0jbDzz0IFOk2aCG', 'John Doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=john', 'Cultural enthusiast and avid reader'),
('janedoe', 'jane@example.com', '$2b$10$2aXmMM6t6MZyP5TyryMgCePWBGZdgt7YchV.NC0jbDzz0IFOk2aCG', 'Jane Doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane', 'Passionate about indigenous storytelling'),
('alikhan', 'ali@example.com', '$2b$10$2aXmMM6t6MZyP5TyryMgCePWBGZdgt7YchV.NC0jbDzz0IFOk2aCG', 'Ali Khan', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ali', 'Poetry lover and cultural historian');

-- Cultural Categories
INSERT INTO cultural_categories (name, imageUrl, workCount) VALUES
('African', 'https://images.unsplash.com/photo-1516421417223-a0df314c681b?w=800&auto=format&fit=crop', 12),
('Latin American', 'https://images.unsplash.com/photo-1518712246946-2d3e860b7e68?w=800&auto=format&fit=crop', 8),
('Asian', 'https://images.unsplash.com/photo-1535139262971-c51845709a48?w=800&auto=format&fit=crop', 15),
('Indigenous', 'https://images.unsplash.com/photo-1590522267963-f18afe6ca5e2?w=800&auto=format&fit=crop', 10),
('Middle Eastern', 'https://images.unsplash.com/photo-1584546369435-4a8748e8c7b7?w=800&auto=format&fit=crop', 7);

-- Poems
INSERT INTO poems (title, content, authorId, authorName, culturalOrigin, coverImage, readTime, likes, comments, rating, ratingCount) VALUES
('The Ancient Baobab', 'Standing tall through ages past,\nRoots deep in African soil so vast.\nWisdom carrier, life sustainer,\nStories held within its weathered container.', 1, 'John Doe', 'African', 'https://images.unsplash.com/photo-1516509088420-5b2df5c3de0f?w=800', 2, 24, 3, 4.7, 6),
('Amazonian Whispers', 'Verdant canopies hide ancient secrets,\nWhispered tales of tribes long gone.\nRivers flow with memories eternal,\nIn the heart of the rainforest, wisdom lives on.', 2, 'Jane Doe', 'Latin American', 'https://images.unsplash.com/photo-1535120927435-d448f992cf8e?w=800', 3, 18, 2, 4.5, 4),
('Cherry Blossom Dreams', 'Pink petals dance in spring''s gentle breeze,\nEphemeral beauty, a moment to seize.\nCycles of life in delicate form,\nAs ancestors watch with hearts still warm.', 3, 'Ali Khan', 'Asian', 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800', 2, 32, 5, 4.8, 9);

-- Books
INSERT INTO books (title, author, culturalOrigin, coverImage, category, description, rating, ratingCount) VALUES
('Things Fall Apart', 'Chinua Achebe', 'African', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800', 'Fiction', 'A classic novel about the colonization of Nigeria and its impact on traditional Igbo society.', 4.8, 125),
('One Hundred Years of Solitude', 'Gabriel García Márquez', 'Latin American', 'https://images.unsplash.com/photo-1585813755910-0f0547615d76?w=800', 'Fiction', 'A landmark magical realist novel that tells the multi-generational story of the Buendía family.', 4.9, 142),
('Pachinko', 'Min Jin Lee', 'Asian', 'https://images.unsplash.com/photo-1592496001020-d31bd830f5dc?w=800', 'Historical Fiction', 'An epic historical novel following four generations of a Korean family in Japan.', 4.7, 98),
('Ceremony', 'Leslie Marmon Silko', 'Indigenous', 'https://images.unsplash.com/photo-1598618350638-6dd3df12dd46?w=800', 'Fiction', 'A novel about a Native American World War II veteran and his struggle to find himself.', 4.6, 78),
('The Kite Runner', 'Khaled Hosseini', 'Middle Eastern', 'https://images.unsplash.com/photo-1534470397273-a1f8e333c01a?w=800', 'Fiction', 'A moving tale of friendship, betrayal, and redemption set against the backdrop of Afghanistan''s tumultuous history.', 4.7, 156);

-- Discussions
INSERT INTO discussions (title, content, authorId, authorName, authorAvatar, status, replies, views) VALUES
('The Role of Oral Traditions in African Literature', 'I''ve been reading about how oral storytelling traditions have influenced written African literature. What examples have you encountered that show this connection?', 1, 'John Doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=john', 'active', 5, 42),
('Magical Realism in Latin American Writing', 'Let''s discuss how magical realism emerged as a unique literary style in Latin America and how it reflects cultural worldviews.', 2, 'Jane Doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane', 'active', 7, 63),
('Representations of Family in Asian Literature', 'How are family dynamics portrayed across different Asian literary traditions? I''d love to explore similarities and differences.', 3, 'Ali Khan', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ali', 'active', 4, 38);

-- Chat Messages
INSERT INTO chat_messages (content, userId, username, userAvatar) VALUES
('Has anyone read "Things Fall Apart"? I\'d love to discuss it!', 1, 'John Doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'),
('I just finished it last week! What aspects interested you most?', 2, 'Jane Doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane'),
('I was particularly struck by how it portrays the clash between tradition and change.', 1, 'John Doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'),
('Yes, and Achebe\'s language is so powerful in conveying that tension.', 3, 'Ali Khan', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ali'),
('Would anyone be interested in a virtual book club focusing on indigenous authors?', 2, 'Jane Doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane'),
('That sounds good. I\'d definitely join!', 3, 'Ali Khan', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ali');

-- Events
INSERT INTO events (title, description, date, location, isVirtual, coverImage, startTime, endTime, attendees, month, day) VALUES
('Virtual Latin American Book Club', 'Join us for a discussion of "One Hundred Years of Solitude" by Gabriel García Márquez. Open to readers of all backgrounds.', '2025-04-15', 'Zoom', 1, 'https://images.unsplash.com/photo-1585813755910-0f0547615d76?w=800', '7:00 PM', '8:30 PM', 18, 'APR', '15'),
('African Poetry Reading', 'Local poets share original works inspired by traditional African poetic forms. Refreshments will be served.', '2025-04-20', 'Cultural Heritage Center, Room 202', 0, 'https://images.unsplash.com/photo-1489367874814-f5d040621dd8?w=800', '5:30 PM', '7:00 PM', 25, 'APR', '20'),
('Asian Literature Film Adaptation Festival', 'A weekend of film screenings featuring adaptations of classic and contemporary Asian literary works.', '2025-05-10', 'Community Arts Theater', 0, 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800', '12:00 PM', '8:00 PM', 42, 'MAY', '10'),
('Indigenous Storytelling Workshop', 'Learn about Indigenous oral traditions and storytelling techniques from native practitioners.', '2025-05-18', 'Community Center Auditorium', 0, 'https://images.unsplash.com/photo-1526920929362-5b26677c148c?w=800', '10:00 AM', '2:00 PM', 15, 'MAY', '18');

-- Academic Resources
INSERT INTO academic_resources (title, description, link, type, icon) VALUES
('Oral Traditions in West African Cultures', 'A comprehensive study of various oral storytelling techniques and their significance in West African societies.', 'https://example.com/resource1', 'Research Paper', 'file-text'),
('Symbolism in Latin American Magical Realism', 'Analysis of common symbols and their cultural meanings in magical realist literature from Latin America.', 'https://example.com/resource2', 'Article', 'book-open'),
('Indigenous Narrative Structures Database', 'A searchable collection of narrative patterns and structures from Indigenous storytelling traditions worldwide.', 'https://example.com/resource3', 'Database', 'database'),
('Middle Eastern Oral Poetry: Historical Evolution', 'A historical overview of oral poetic traditions in the Middle East from ancient to modern times.', 'https://example.com/resource4', 'E-Book', 'book'),
('Asian Folk Tales: Comparative Analysis', 'A cross-cultural comparison of motifs and themes in folk stories from various Asian traditions.', 'https://example.com/resource5', 'Research Paper', 'file-text');

-- Comments
INSERT INTO comments (content, userId, username, userAvatar, poemId, bookId, discussionId) VALUES
('The imagery of the baobab as a keeper of history is so powerful!', 2, 'Jane Doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane', 1, NULL, NULL),
('This perfectly captures the ephemeral nature of cherry blossoms in Japanese culture.', 1, 'John Doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=john', 3, NULL, NULL),
('The themes in this book resonated deeply with my own family''s immigrant experience.', 3, 'Ali Khan', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ali', NULL, 3, NULL),
('Achebe''s portrayal of Okonkwo''s struggle between tradition and change is masterful.', 2, 'Jane Doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane', NULL, 1, NULL),
('I''ve been researching griots in West African traditions and their role is fascinating.', 3, 'Ali Khan', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ali', NULL, NULL, 1),
('García Márquez was inspired by his grandmother''s storytelling style - a perfect example of oral influence!', 1, 'John Doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=john', NULL, NULL, 2);

-- Ratings
INSERT INTO ratings (rating, userId, bookId, poemId) VALUES
(5, 1, 1, NULL),
(4, 2, 1, NULL),
(5, 3, 2, NULL),
(4, 1, 3, NULL),
(5, 2, 4, NULL),
(5, 1, NULL, 1),
(4, 2, NULL, 1),
(5, 3, NULL, 2),
(5, 1, NULL, 3),
(4, 2, NULL, 3);

-- Reading Progress
INSERT INTO reading_progress (userId, bookId, currentPage, totalPages, lastRead) VALUES
(1, 1, 127, 304, NOW()),
(2, 2, 214, 417, NOW()),
(3, 3, 98, 352, NOW()),
(1, 4, 52, 262, NOW()),
(2, 5, 175, 371, NOW());

-- Display success message
SELECT 'MySQL setup complete. Database and tables created with sample data.' AS Result;
