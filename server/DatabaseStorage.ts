import { db } from './db';
import session from 'express-session';
import connectPg from 'connect-pg-simple';
import { pool } from './db';
import { 
  User, InsertUser, 
  ChatRoom, InsertChatRoom, 
  ChatMessage, InsertChatMessage
} from '@shared/schema';
import { IStorage } from './storage';
import { 
  users, 
  chatRooms, 
  chatMessages,
  poems,
  books,
  events,
  academicResources,
  tickets
} from '@shared/schema';
import { eq, desc, and } from 'drizzle-orm';

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // Chat room operations
  async getChatRooms(): Promise<ChatRoom[]> {
    return await db.select().from(chatRooms);
  }

  async getChatRoomById(id: number): Promise<ChatRoom | undefined> {
    const [room] = await db.select().from(chatRooms).where(eq(chatRooms.id, id));
    return room;
  }

  async createChatRoom(chatRoom: InsertChatRoom, createdById: number): Promise<ChatRoom> {
    const [newRoom] = await db.insert(chatRooms).values({
      ...chatRoom,
      createdById
    }).returning();
    return newRoom;
  }

  async getChatMessagesByRoomId(roomId: number): Promise<ChatMessage[]> {
    return await db.select()
      .from(chatMessages)
      .where(eq(chatMessages.roomId, roomId))
      .orderBy(chatMessages.createdAt);
  }

  async createChatMessage(message: InsertChatMessage, userId: number): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values({
      ...message,
      userId
    }).returning();
    return newMessage;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserAdminStatus(userId: number, isAdmin: boolean): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ isAdmin })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async deleteUser(userId: number): Promise<boolean> {
    await db.delete(users).where(eq(users.id, userId));
    return true;
  }

  // These methods are stubs - they would be implemented with actual DB queries
  // if you need them to be functional
  async getPoems() { return []; }
  async getPoemById() { return undefined; }
  async getPoemsByAuthorId() { return []; }
  async createPoem() { return {} as any; }
  async approvePoem() { return undefined; }
  async deletePoem() { return true; }
  async getPendingPoems() { return []; }
  async ratePoem() {}
  async likePoem() {}
  async unlikePoem() {}
  
  async getBooks() { return []; }
  async getBookById() { return undefined; }
  async createBook() { return {} as any; }
  async approveBook() { return undefined; }
  async deleteBook() { return true; }
  async getPendingBooks() { return []; }
  
  async getEvents() { return []; }
  async getEventById() { return undefined; }
  async createEvent() { return {} as any; }
  
  async getAcademicResources() { return []; }
  async getAcademicResourceById() { return undefined; }
  async createAcademicResource() { return {} as any; }
  
  async createTicket() { return {} as any; }
  async getTicketsByUserId() { return []; }
  async getTicketById() { return undefined; }
}