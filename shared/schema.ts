import { pgTable, text, serial, integer, boolean, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  isAdmin: boolean("is_admin").default(false),
});

export const poems = pgTable("poems", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  isVideo: boolean("is_video").default(false),
  videoUrl: text("video_url"),
  approved: boolean("approved").default(false),
});

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  description: text("description"),
  coverImage: text("cover_image"),
  uploadedById: integer("uploaded_by_id").references(() => users.id),
  genre: text("genre"),
  approved: boolean("approved").default(true),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  ticketPrice: integer("ticket_price").default(0),
  organizer: text("organizer"),
  isVirtual: boolean("is_virtual").default(false),
  streamUrl: text("stream_url"),
  isFree: boolean("is_free").default(false),
});

export const chatRooms = pgTable("chat_rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdById: integer("created_by_id").references(() => users.id),
  isPrivate: boolean("is_private").default(false),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull().references(() => chatRooms.id),
  userId: integer("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const academicResources = pgTable("academic_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // e.g., "study_guide", "video", "career_guide"
  subject: text("subject"),
  gradeLevel: text("grade_level"),
  language: text("language").default("English"),
  resourceUrl: text("resource_url"),
});

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id),
  userId: integer("user_id").notNull().references(() => users.id),
  purchaseDate: timestamp("purchase_date").defaultNow(),
  ticketCode: text("ticket_code").notNull().unique(),
});

export const userPoems = pgTable("user_poems", {
  userId: integer("user_id").notNull().references(() => users.id),
  poemId: integer("poem_id").notNull().references(() => poems.id),
  rating: integer("rating"),
  liked: boolean("liked").default(false),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.poemId] }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  isAdmin: true,
}).extend({
  confirmPassword: z.string(),
});

export const loginUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertPoemSchema = createInsertSchema(poems).omit({
  id: true,
  authorId: true,
  createdAt: true,
  approved: true,
});

export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
  uploadedById: true,
  approved: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

export const insertChatRoomSchema = createInsertSchema(chatRooms).omit({
  id: true,
  createdById: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertAcademicResourceSchema = createInsertSchema(academicResources).omit({
  id: true,
});

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  purchaseDate: true,
  ticketCode: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type User = typeof users.$inferSelect;
export type Poem = typeof poems.$inferSelect;
export type InsertPoem = z.infer<typeof insertPoemSchema>;
export type Book = typeof books.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type ChatRoom = typeof chatRooms.$inferSelect;
export type InsertChatRoom = z.infer<typeof insertChatRoomSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type AcademicResource = typeof academicResources.$inferSelect;
export type InsertAcademicResource = z.infer<typeof insertAcademicResourceSchema>;
export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
