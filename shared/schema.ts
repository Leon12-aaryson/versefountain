import { pgTable, text, serial, integer, boolean, timestamp, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  isAdmin: boolean("is_admin").default(false),
});

// Table for tracking poet followers
export const poetFollowers = pgTable('poet_followers', {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").notNull().references(() => users.id),
  poetId: integer("poet_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    followerPoetIndex: primaryKey({ columns: [table.followerId, table.poetId] }),
  };
});

export const poems = pgTable("poems", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  isVideo: boolean("is_video").default(false),
  videoUrl: text("video_url"),
  approved: boolean("approved").default(true), // Auto-approve all poems
});

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  description: text("description"),
  coverImage: text("cover_image"),
  uploadedById: integer("uploaded_by_id").references(() => users.id),
  genre: text("genre"),
  approved: boolean("approved").default(true), // Auto-approve all books
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
  createdById: integer("created_by_id").references(() => users.id),
  category: text("category").default("general"), // Added categories: poetry, book_launch, workshop, lecture, general
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

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  eventId: integer("event_id").notNull().references(() => events.id),
  amount: integer("amount").notNull(),
  currency: text("currency").default("USD"),
  status: text("status").notNull(), // "pending", "completed", "refunded", "failed"
  paddlePaymentId: text("paddle_payment_id"),
  paddleTransactionId: text("paddle_transaction_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  refundReason: text("refund_reason"),
});

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id),
  userId: integer("user_id").notNull().references(() => users.id),
  purchaseDate: timestamp("purchase_date").defaultNow(),
  ticketCode: text("ticket_code").notNull().unique(),
  status: text("status").default("active").notNull(), // "active", "cancelled", "used"
  paymentId: integer("payment_id").references(() => payments.id),
  isRefunded: boolean("is_refunded").default(false),
});

export const userPoems = pgTable("user_poems", {
  userId: integer("user_id").notNull().references(() => users.id),
  poemId: integer("poem_id").notNull().references(() => poems.id),
  rating: integer("rating"),
  liked: boolean("liked").default(false),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.poemId] }),
}));

export const userChatRooms = pgTable("user_chat_rooms", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  roomId: integer("room_id").notNull().references(() => chatRooms.id),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const poemComments = pgTable("poem_comments", {
  id: serial("id").primaryKey(),
  poemId: integer("poem_id").notNull().references(() => poems.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const commentReactions = pgTable("poem_comment_reactions", {
  id: serial("id").primaryKey(),
  commentId: integer("comment_id").notNull().references(() => poemComments.id),
  userId: integer("user_id").notNull().references(() => users.id),
  reaction: text("reaction").notNull(), // e.g., "like", "love", "laugh", "angry"
  createdAt: timestamp("created_at").defaultNow(),
});

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
}).extend({
  isVirtual: z.boolean().optional().default(false),
  isFree: z.boolean().optional().default(true),
  category: z.enum(['poetry', 'book_launch', 'workshop', 'lecture', 'general']).default('general'),
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

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  paddlePaymentId: true,
  paddleTransactionId: true,
  createdAt: true,
  updatedAt: true,
  refundReason: true,
});

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  purchaseDate: true,
  ticketCode: true,
  status: true,
  isRefunded: true,
});

export const insertPoemCommentSchema = createInsertSchema(poemComments).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertCommentReactionSchema = createInsertSchema(commentReactions).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertPoetFollowerSchema = createInsertSchema(poetFollowers).omit({
  id: true,
  createdAt: true,
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
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type UserChatRoom = typeof userChatRooms.$inferSelect;
export type PoemComment = typeof poemComments.$inferSelect;
export type InsertPoemComment = z.infer<typeof insertPoemCommentSchema>;
export type CommentReaction = typeof commentReactions.$inferSelect;
export type InsertCommentReaction = z.infer<typeof insertCommentReactionSchema>;
export type PoetFollower = typeof poetFollowers.$inferSelect;
export type InsertPoetFollower = z.infer<typeof insertPoetFollowerSchema>;
