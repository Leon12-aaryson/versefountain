import { db } from './db';
import session from 'express-session';
import connectPg from 'connect-pg-simple';
import { pool } from './db';
import { 
  User, InsertUser, 
  ChatRoom, InsertChatRoom, 
  ChatMessage, InsertChatMessage,
  users, poems, books, userPoems, events, academicResources, tickets,
  chatRooms, chatMessages,
  InsertPoem, InsertBook, InsertEvent, InsertAcademicResource, InsertTicket,
  Ticket
} from '@shared/schema';
import { IStorage } from './storage';
import { eq, desc, and } from 'drizzle-orm';

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Using any for session store due to type compatibility issues

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
  async getPoems(limit?: number) { 
    const poemsResult = await db.select().from(poems).orderBy(desc(poems.createdAt));
    return limit ? poemsResult.slice(0, limit) : poemsResult;
  }
  
  async getPoemById(id: number) { 
    const [poem] = await db.select().from(poems).where(eq(poems.id, id));
    return poem;
  }
  
  async getPoemsByAuthorId(authorId: number) { 
    return db.select().from(poems).where(eq(poems.authorId, authorId));
  }
  
  async createPoem(poem: InsertPoem, authorId: number) { 
    console.log("Creating poem in DatabaseStorage with data:", poem);
    console.log("Author ID:", authorId);
    try {
      const [newPoem] = await db.insert(poems).values({
        ...poem,
        authorId,
        approved: true // Force auto-approval regardless of schema default
      }).returning();
      console.log("New poem created successfully:", newPoem);
      return newPoem;
    } catch (error) {
      console.error("Error in createPoem:", error);
      throw error;
    }
  }
  
  async approvePoem(id: number) { 
    const [updatedPoem] = await db.update(poems)
      .set({ approved: true })
      .where(eq(poems.id, id))
      .returning();
    return updatedPoem;
  }
  
  async deletePoem(id: number) { 
    await db.delete(poems).where(eq(poems.id, id));
    return true;
  }
  
  async getPendingPoems() { 
    return db.select().from(poems).where(eq(poems.approved, false));
  }
  
  async ratePoem(poemId: number, userId: number, rating: number) {
    await db.insert(userPoems)
      .values({ userId, poemId, rating })
      .onConflictDoUpdate({
        target: [userPoems.userId, userPoems.poemId],
        set: { rating }
      });
  }
  
  async likePoem(poemId: number, userId: number) {
    await db.insert(userPoems)
      .values({ userId, poemId, liked: true })
      .onConflictDoUpdate({
        target: [userPoems.userId, userPoems.poemId],
        set: { liked: true }
      });
  }
  
  async unlikePoem(poemId: number, userId: number) {
    await db.insert(userPoems)
      .values({ userId, poemId, liked: false })
      .onConflictDoUpdate({
        target: [userPoems.userId, userPoems.poemId],
        set: { liked: false }
      });
  }
  
  async getBooks(limit?: number) { 
    const booksResult = await db.select().from(books);
    return limit ? booksResult.slice(0, limit) : booksResult;
  }
  
  async getBookById(id: number) { 
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book;
  }
  
  async createBook(book: InsertBook, uploadedById?: number) { 
    const [newBook] = await db.insert(books).values({
      ...book,
      uploadedById: uploadedById || null,
      approved: true // Force auto-approval regardless of schema default
    }).returning();
    return newBook;
  }
  
  async approveBook(id: number) { 
    const [updatedBook] = await db.update(books)
      .set({ approved: true })
      .where(eq(books.id, id))
      .returning();
    return updatedBook;
  }
  
  async deleteBook(id: number) { 
    await db.delete(books).where(eq(books.id, id));
    return true;
  }
  
  async getPendingBooks() { 
    return db.select().from(books).where(eq(books.approved, false));
  }
  
  async getEvents(limit?: number) {
    const eventsResult = await db.select().from(events);
    return limit ? eventsResult.slice(0, limit) : eventsResult;
  }
  
  async getEventById(id: number) {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }
  
  async createEvent(event: InsertEvent) {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }
  
  async getAcademicResources(limit?: number) {
    const resourcesResult = await db.select().from(academicResources);
    return limit ? resourcesResult.slice(0, limit) : resourcesResult;
  }
  
  async getAcademicResourceById(id: number) {
    const [resource] = await db.select().from(academicResources).where(eq(academicResources.id, id));
    return resource;
  }
  
  async createAcademicResource(resource: InsertAcademicResource) {
    const [newResource] = await db.insert(academicResources).values(resource).returning();
    return newResource;
  }
  
  async createTicket(eventId: number, userId: number): Promise<Ticket> { 
    // Generate a random ticket code
    const ticketCode = `TKT-${Math.floor(Math.random() * 10000)}-${Date.now().toString().slice(-4)}`;
    
    // Insert the ticket with auto-approval
    const [ticket] = await db.insert(tickets).values({
      eventId,
      userId,
      ticketCode
    }).returning();
    
    return ticket;
  }
  
  async getTicketsByUserId(userId: number): Promise<Ticket[]> {
    return db.select().from(tickets).where(eq(tickets.userId, userId));
  }
  
  async getTicketById(id: number): Promise<Ticket | undefined> {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
    return ticket;
  }
}