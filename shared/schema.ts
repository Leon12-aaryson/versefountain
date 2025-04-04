import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Poetry schema
export const poems = pgTable("poems", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  authorName: text("author_name").notNull(),
  culturalOrigin: text("cultural_origin").notNull(),
  coverImage: text("cover_image"),
  readTime: integer("read_time").notNull(), // in minutes
  likes: integer("likes").default(0).notNull(),
  comments: integer("comments").default(0).notNull(),
  rating: real("rating").default(0).notNull(),
  ratingCount: integer("rating_count").default(0).notNull(),
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
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  coverImage: text("cover_image"),
  category: text("category").notNull(),
  culturalOrigin: text("cultural_origin"),
  description: text("description"),
  rating: real("rating").default(0).notNull(),
  ratingCount: integer("rating_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
  rating: true,
  ratingCount: true,
  createdAt: true,
});

// Discussion schema
export const discussions = pgTable("discussions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  authorName: text("author_name").notNull(),
  authorAvatar: text("author_avatar"),
  replies: integer("replies").default(0).notNull(),
  views: integer("views").default(0).notNull(),
  status: text("status").notNull(), // "Active", "Hot", "New", etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDiscussionSchema = createInsertSchema(discussions).omit({
  id: true,
  replies: true,
  views: true,
  createdAt: true,
});

// Chat message schema
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  username: text("username").notNull(),
  userAvatar: text("user_avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

// Event schema
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  isVirtual: boolean("is_virtual").default(false).notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  coverImage: text("cover_image"),
  attendees: integer("attendees").default(0).notNull(),
  month: text("month").notNull(),
  day: text("day").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  attendees: true,
  createdAt: true,
});

// Cultural Categories schema
export const culturalCategories = pgTable("cultural_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  imageUrl: text("image_url"),
  workCount: integer("work_count").default(0).notNull(),
});

export const insertCulturalCategorySchema = createInsertSchema(culturalCategories).omit({
  id: true,
  workCount: true,
});

// Academic Resources schema
export const academicResources = pgTable("academic_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // "Research Paper", "Video Lecture", etc.
  icon: text("icon").notNull(),
  link: text("link").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAcademicResourceSchema = createInsertSchema(academicResources).omit({
  id: true,
  createdAt: true,
});

// Book reading progress tracking
export const readingProgress = pgTable("reading_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bookId: integer("book_id").references(() => books.id).notNull(),
  currentPage: integer("current_page").default(0).notNull(),
  totalPages: integer("total_pages").notNull(),
  lastRead: timestamp("last_read").defaultNow().notNull(),
});

export const insertReadingProgressSchema = createInsertSchema(readingProgress).omit({
  id: true,
  lastRead: true,
});

// Comments schema
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  username: text("username").notNull(),
  userAvatar: text("user_avatar"),
  poemId: integer("poem_id").references(() => poems.id),
  bookId: integer("book_id").references(() => books.id),
  discussionId: integer("discussion_id").references(() => discussions.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

// Ratings schema
export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  poemId: integer("poem_id").references(() => poems.id),
  bookId: integer("book_id").references(() => books.id),
  rating: integer("rating").notNull(), // 1-5
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
