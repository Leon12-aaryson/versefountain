import { z } from "zod";

export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  isAdmin: z.boolean().optional().default(false),
  confirmPassword: z.string(),
});

export const loginUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertPoemSchema = z.object({
  title: z.string(),
  content: z.string(),
  isVideo: z.boolean().optional().default(false),
  videoUrl: z.string().optional(),
});

export const insertBookSchema = z.object({
  title: z.string(),
  author: z.string(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  genre: z.string().optional(),
});

export const insertEventSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.string(), // Assuming date will be handled as string on frontend
  location: z.string(),
  ticketPrice: z.number().optional().default(0),
  organizer: z.string().optional(),
  isVirtual: z.boolean().optional().default(false),
  streamUrl: z.string().optional(),
  isFree: z.boolean().optional().default(true),
  category: z.enum(['poetry', 'book_launch', 'workshop', 'lecture', 'general']).default('general'),
});

export const insertChatRoomSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  isPrivate: z.boolean().optional().default(false),
});

export const insertChatMessageSchema = z.object({
  roomId: z.number(), // Assuming roomId is a number
  userId: z.number(), // Assuming userId is a number
  message: z.string(),
});

export const insertAcademicResourceSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.string(),
  subject: z.string().optional(),
  gradeLevel: z.string().optional(),
  language: z.string().optional().default("English"),
  resourceUrl: z.string().optional(),
});

export const insertPaymentSchema = z.object({
  userId: z.number(),
  eventId: z.number(),
  amount: z.number(),
  currency: z.string().optional().default("USD"),
  status: z.string(), // "pending", "completed", "refunded", "failed"
});

export const insertTicketSchema = z.object({
  eventId: z.number(),
  userId: z.number(),
  paymentId: z.number().optional(),
});

export const insertPoemCommentSchema = z.object({
  poemId: z.number(),
  content: z.string(),
});

export const insertCommentReactionSchema = z.object({
  commentId: z.number(),
  reaction: z.string(),
});

export const insertPoetFollowerSchema = z.object({
  followerId: z.number(),
  poetId: z.number(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
// export type User = typeof users.$inferSelect; // Removed
// export type Poem = typeof poems.$inferSelect; // Removed
export type InsertPoem = z.infer<typeof insertPoemSchema>;
// export type Book = typeof books.$inferSelect; // Removed
export type InsertBook = z.infer<typeof insertBookSchema>;
// export type Event = typeof events.$inferSelect; // Removed
export type InsertEvent = z.infer<typeof insertEventSchema>;
// export type ChatRoom = typeof chatRooms.$inferSelect; // Removed
export type InsertChatRoom = z.infer<typeof insertChatRoomSchema>;
// export type ChatMessage = typeof chatMessages.$inferSelect; // Removed
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
// export type AcademicResource = typeof academicResources.$inferSelect; // Removed
export type InsertAcademicResource = z.infer<typeof insertAcademicResourceSchema>;
// export type Payment = typeof payments.$inferSelect; // Removed
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
// export type Ticket = typeof tickets.$inferSelect; // Removed
export type InsertTicket = z.infer<typeof insertTicketSchema>;
// export type UserChatRoom = typeof userChatRooms.$inferSelect; // Removed
// export type PoemComment = typeof poemComments.$inferSelect; // Removed
export type InsertPoemComment = z.infer<typeof insertPoemCommentSchema>;
// export type CommentReaction = typeof commentReactions.$inferSelect; // Removed
export type InsertCommentReaction = z.infer<typeof insertCommentReactionSchema>;
// export type PoetFollower = typeof poetFollowers.$inferSelect; // Removed
export type InsertPoetFollower = z.infer<typeof insertPoetFollowerSchema>;
