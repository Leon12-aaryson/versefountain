import {
  mysqlTable,
  text,
  serial,
  int,
  tinyint,
  timestamp,
  float,
  varchar,
  boolean
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  avatar: varchar("avatar", { length: 255 }),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Poetry schema
export const poems = mysqlTable("poems", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  authorId: int("author_id").references(() => users.id).notNull(),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  culturalOrigin: varchar("cultural_origin", { length: 255 }).notNull(),
  coverImage: varchar("cover_image", { length: 255 }),
  readTime: int("read_time").notNull(), // in minutes
  likes: int("likes").default(0).notNull(),
  comments: int("comments").default(0).notNull(),
  rating: float("rating").default(0).notNull(),
  ratingCount: int("rating_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPoemSchema = createInsertSchema(poems).omit({
  id: true,
  likes: true,
  comments: true,
  rating: true,
  ratingCount: true,
  createdAt: true,
});

// Book schema
export const books = mysqlTable("books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  coverImage: varchar("cover_image", { length: 255 }),
  category: varchar("category", { length: 255 }).notNull(),
  culturalOrigin: varchar("cultural_origin", { length: 255 }),
  description: text("description"),
  rating: float("rating").default(0).notNull(),
  ratingCount: int("rating_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
  rating: true,
  ratingCount: true,
  createdAt: true,
});

// Discussion schema
export const discussions = mysqlTable("discussions", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  authorId: int("author_id").references(() => users.id).notNull(),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorAvatar: varchar("author_avatar", { length: 255 }),
  replies: int("replies").default(0).notNull(),
  views: int("views").default(0).notNull(),
  status: varchar("status", { length: 50 }).notNull(), // "Active", "Hot", "New", etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDiscussionSchema = createInsertSchema(discussions).omit({
  id: true,
  replies: true,
  views: true,
  createdAt: true,
});

// Chat message schema
export const chatMessages = mysqlTable("chat_messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: int("user_id").references(() => users.id).notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  userAvatar: varchar("user_avatar", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

// Event schema
export const events = mysqlTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  isVirtual: tinyint("is_virtual").default(0).notNull(),
  startTime: varchar("start_time", { length: 50 }).notNull(),
  endTime: varchar("end_time", { length: 50 }).notNull(),
  coverImage: varchar("cover_image", { length: 255 }),
  attendees: int("attendees").default(0).notNull(),
  month: varchar("month", { length: 20 }).notNull(),
  day: varchar("day", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  attendees: true,
  createdAt: true,
});

// Cultural Categories schema
export const culturalCategories = mysqlTable("cultural_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  imageUrl: varchar("image_url", { length: 255 }),
  workCount: int("work_count").default(0).notNull(),
});

export const insertCulturalCategorySchema = createInsertSchema(culturalCategories).omit({
  id: true,
  workCount: true,
});

// Academic Resources schema
export const academicResources = mysqlTable("academic_resources", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  type: varchar("type", { length: 100 }).notNull(), // "Research Paper", "Video Lecture", etc.
  icon: varchar("icon", { length: 255 }).notNull(),
  link: varchar("link", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAcademicResourceSchema = createInsertSchema(academicResources).omit({
  id: true,
  createdAt: true,
});

// Book reading progress tracking
export const readingProgress = mysqlTable("reading_progress", {
  id: serial("id").primaryKey(),
  userId: int("user_id").references(() => users.id).notNull(),
  bookId: int("book_id").references(() => books.id).notNull(),
  currentPage: int("current_page").default(0).notNull(),
  totalPages: int("total_pages").notNull(),
  lastRead: timestamp("last_read").defaultNow().notNull(),
});

export const insertReadingProgressSchema = createInsertSchema(readingProgress).omit({
  id: true,
  lastRead: true,
});

// Comments schema
export const comments = mysqlTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: int("user_id").references(() => users.id).notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  userAvatar: varchar("user_avatar", { length: 255 }),
  poemId: int("poem_id").references(() => poems.id),
  bookId: int("book_id").references(() => books.id),
  discussionId: int("discussion_id").references(() => discussions.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

// Ratings schema
export const ratings = mysqlTable("ratings", {
  id: serial("id").primaryKey(),
  userId: int("user_id").references(() => users.id).notNull(),
  poemId: int("poem_id").references(() => poems.id),
  bookId: int("book_id").references(() => books.id),
  rating: int("rating").notNull(), // 1-5
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRatingSchema = createInsertSchema(ratings).omit({
  id: true,
  createdAt: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Poem = typeof poems.$inferSelect;
export type InsertPoem = z.infer<typeof insertPoemSchema>;

export type Book = typeof books.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;

export type Discussion = typeof discussions.$inferSelect;
export type InsertDiscussion = z.infer<typeof insertDiscussionSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type CulturalCategory = typeof culturalCategories.$inferSelect;
export type InsertCulturalCategory = z.infer<typeof insertCulturalCategorySchema>;

export type AcademicResource = typeof academicResources.$inferSelect;
export type InsertAcademicResource = z.infer<typeof insertAcademicResourceSchema>;

export type ReadingProgress = typeof readingProgress.$inferSelect;
export type InsertReadingProgress = z.infer<typeof insertReadingProgressSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Rating = typeof ratings.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;
