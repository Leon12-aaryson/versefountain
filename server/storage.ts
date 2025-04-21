import { 
  User, 
  InsertUser, 
  Poem, 
  InsertPoem,
  Book,
  InsertBook,
  Event,
  InsertEvent,
  ChatRoom,
  InsertChatRoom,
  ChatMessage,
  InsertChatMessage,
  AcademicResource,
  InsertAcademicResource,
  Ticket,
  InsertTicket
} from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";
import { randomUUID } from "crypto";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUserAdminStatus(userId: number, isAdmin: boolean): Promise<User | undefined>;
  deleteUser(userId: number): Promise<boolean>;
  
  // Poetry operations
  getPoems(limit?: number): Promise<Poem[]>;
  getPoemById(id: number): Promise<Poem | undefined>;
  getPoemsByAuthorId(authorId: number): Promise<Poem[]>;
  createPoem(poem: InsertPoem, authorId: number): Promise<Poem>;
  approvePoem(id: number): Promise<Poem | undefined>;
  deletePoem(id: number): Promise<boolean>;
  getPendingPoems(): Promise<Poem[]>;
  ratePoem(poemId: number, userId: number, rating: number): Promise<void>;
  likePoem(poemId: number, userId: number): Promise<void>;
  unlikePoem(poemId: number, userId: number): Promise<void>;
  
  // Book operations
  getBooks(limit?: number): Promise<Book[]>;
  getBookById(id: number): Promise<Book | undefined>;
  createBook(book: InsertBook, uploadedById?: number): Promise<Book>;
  approveBook(id: number): Promise<Book | undefined>;
  deleteBook(id: number): Promise<boolean>;
  getPendingBooks(): Promise<Book[]>;
  
  // Event operations
  getEvents(limit?: number): Promise<Event[]>;
  getEventById(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Chat operations
  getChatRooms(): Promise<ChatRoom[]>;
  getChatRoomById(id: number): Promise<ChatRoom | undefined>;
  createChatRoom(chatRoom: InsertChatRoom, createdById: number): Promise<ChatRoom>;
  getChatMessagesByRoomId(roomId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage, userId: number): Promise<ChatMessage>;
  
  // Academic resources operations
  getAcademicResources(limit?: number): Promise<AcademicResource[]>;
  getAcademicResourceById(id: number): Promise<AcademicResource | undefined>;
  createAcademicResource(resource: InsertAcademicResource): Promise<AcademicResource>;
  
  // Ticket operations
  createTicket(eventId: number, userId: number): Promise<Ticket>;
  getTicketsByUserId(userId: number): Promise<Ticket[]>;
  getTicketById(id: number): Promise<Ticket | undefined>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private poems: Map<number, Poem>;
  private books: Map<number, Book>;
  private events: Map<number, Event>;
  private chatRooms: Map<number, ChatRoom>;
  private chatMessages: Map<number, ChatMessage>;
  private academicResources: Map<number, AcademicResource>;
  private tickets: Map<number, Ticket>;
  private userPoems: Map<string, { userId: number, poemId: number, rating?: number, liked: boolean }>;
  
  private userIdCounter: number;
  private poemIdCounter: number;
  private bookIdCounter: number;
  private eventIdCounter: number;
  private chatRoomIdCounter: number;
  private chatMessageIdCounter: number;
  private academicResourceIdCounter: number;
  private ticketIdCounter: number;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.poems = new Map();
    this.books = new Map();
    this.events = new Map();
    this.chatRooms = new Map();
    this.chatMessages = new Map();
    this.academicResources = new Map();
    this.tickets = new Map();
    this.userPoems = new Map();
    
    this.userIdCounter = 1;
    this.poemIdCounter = 1;
    this.bookIdCounter = 1;
    this.eventIdCounter = 1;
    this.chatRoomIdCounter = 1;
    this.chatMessageIdCounter = 1;
    this.academicResourceIdCounter = 1;
    this.ticketIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Prune expired entries every 24h
    });
    
    // Initialize with some data
    this.seedData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser & { isAdmin?: boolean }): Promise<User> {
    const id = this.userIdCounter++;
    // Use provided isAdmin value or default to false
    const user: User = { 
      ...insertUser, 
      id, 
      isAdmin: insertUser.isAdmin ?? false // Default to false if not specified
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserAdminStatus(userId: number, isAdmin: boolean): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, isAdmin };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async deleteUser(userId: number): Promise<boolean> {
    return this.users.delete(userId);
  }
  
  // Poetry operations
  async getPoems(limit?: number): Promise<Poem[]> {
    const poems = Array.from(this.poems.values())
      .filter(poem => poem.approved)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    if (limit) {
      return poems.slice(0, limit);
    }
    return poems;
  }
  
  async getPoemById(id: number): Promise<Poem | undefined> {
    return this.poems.get(id);
  }
  
  async getPoemsByAuthorId(authorId: number): Promise<Poem[]> {
    return Array.from(this.poems.values())
      .filter(poem => poem.authorId === authorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async createPoem(poem: InsertPoem, authorId: number): Promise<Poem> {
    const id = this.poemIdCounter++;
    const newPoem: Poem = {
      ...poem,
      id,
      authorId,
      createdAt: new Date(),
      approved: true, // Auto-approve all poems for development
    };
    this.poems.set(id, newPoem);
    return newPoem;
  }
  
  async approvePoem(id: number): Promise<Poem | undefined> {
    const poem = this.poems.get(id);
    if (poem) {
      const updatedPoem = { ...poem, approved: true };
      this.poems.set(id, updatedPoem);
      return updatedPoem;
    }
    return undefined;
  }
  
  async deletePoem(id: number): Promise<boolean> {
    return this.poems.delete(id);
  }
  
  async getPendingPoems(): Promise<Poem[]> {
    return Array.from(this.poems.values())
      .filter(poem => !poem.approved)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async ratePoem(poemId: number, userId: number, rating: number): Promise<void> {
    const key = `${userId}-${poemId}`;
    const userPoemEntry = this.userPoems.get(key) || { userId, poemId, liked: false };
    this.userPoems.set(key, { ...userPoemEntry, rating });
  }
  
  async likePoem(poemId: number, userId: number): Promise<void> {
    const key = `${userId}-${poemId}`;
    const userPoemEntry = this.userPoems.get(key) || { userId, poemId, rating: undefined };
    this.userPoems.set(key, { ...userPoemEntry, liked: true });
  }
  
  async unlikePoem(poemId: number, userId: number): Promise<void> {
    const key = `${userId}-${poemId}`;
    const userPoemEntry = this.userPoems.get(key) || { userId, poemId, rating: undefined };
    this.userPoems.set(key, { ...userPoemEntry, liked: false });
  }
  
  // Book operations
  async getBooks(limit?: number): Promise<Book[]> {
    const books = Array.from(this.books.values())
      .sort((a, b) => a.title.localeCompare(b.title));
    
    if (limit) {
      return books.slice(0, limit);
    }
    return books;
  }
  
  async getBookById(id: number): Promise<Book | undefined> {
    return this.books.get(id);
  }
  
  async createBook(book: InsertBook, uploadedById?: number): Promise<Book> {
    const id = this.bookIdCounter++;
    const newBook: Book = {
      ...book,
      id,
      uploadedById: uploadedById || null,
      approved: true, // Auto-approve all books for development
    };
    this.books.set(id, newBook);
    return newBook;
  }
  
  async approveBook(id: number): Promise<Book | undefined> {
    const book = this.books.get(id);
    if (book) {
      const updatedBook = { ...book, approved: true };
      this.books.set(id, updatedBook);
      return updatedBook;
    }
    return undefined;
  }
  
  async deleteBook(id: number): Promise<boolean> {
    return this.books.delete(id);
  }
  
  async getPendingBooks(): Promise<Book[]> {
    return Array.from(this.books.values())
      .filter(book => !book.approved)
      .sort((a, b) => a.title.localeCompare(b.title));
  }
  
  // Event operations
  async getEvents(limit?: number): Promise<Event[]> {
    const events = Array.from(this.events.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (limit) {
      return events.slice(0, limit);
    }
    return events;
  }
  
  async getEventById(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }
  
  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const newEvent: Event = {
      ...event,
      id,
    };
    this.events.set(id, newEvent);
    return newEvent;
  }
  
  // Chat operations
  async getChatRooms(): Promise<ChatRoom[]> {
    return Array.from(this.chatRooms.values());
  }
  
  async getChatRoomById(id: number): Promise<ChatRoom | undefined> {
    return this.chatRooms.get(id);
  }
  
  async createChatRoom(chatRoom: InsertChatRoom, createdById: number): Promise<ChatRoom> {
    const id = this.chatRoomIdCounter++;
    const newChatRoom: ChatRoom = {
      ...chatRoom,
      id,
      createdById,
    };
    this.chatRooms.set(id, newChatRoom);
    return newChatRoom;
  }
  
  async getChatMessagesByRoomId(roomId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.roomId === roomId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
  
  async createChatMessage(message: InsertChatMessage, userId: number): Promise<ChatMessage> {
    const id = this.chatMessageIdCounter++;
    const newMessage: ChatMessage = {
      ...message,
      id,
      userId,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, newMessage);
    return newMessage;
  }
  
  // Academic resources operations
  async getAcademicResources(limit?: number): Promise<AcademicResource[]> {
    const resources = Array.from(this.academicResources.values());
    
    if (limit) {
      return resources.slice(0, limit);
    }
    return resources;
  }
  
  async getAcademicResourceById(id: number): Promise<AcademicResource | undefined> {
    return this.academicResources.get(id);
  }
  
  async createAcademicResource(resource: InsertAcademicResource): Promise<AcademicResource> {
    const id = this.academicResourceIdCounter++;
    const newResource: AcademicResource = {
      ...resource,
      id,
    };
    this.academicResources.set(id, newResource);
    return newResource;
  }
  
  // Ticket operations
  async createTicket(eventId: number, userId: number): Promise<Ticket> {
    const id = this.ticketIdCounter++;
    const ticketCode = `TICKET-${randomUUID().substring(0, 8)}`;
    
    const newTicket: Ticket = {
      id,
      eventId,
      userId,
      purchaseDate: new Date(),
      ticketCode,
    };
    
    this.tickets.set(id, newTicket);
    return newTicket;
  }
  
  async getTicketsByUserId(userId: number): Promise<Ticket[]> {
    return Array.from(this.tickets.values())
      .filter(ticket => ticket.userId === userId);
  }
  
  async getTicketById(id: number): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }
  
  // Seed initial data for demonstration
  private seedData() {
    // Seed admin users with simple development password hashes
    // In production, we would use a stronger hashing algorithm
    const hashedPassword = 'dev-hash-password';
    
    this.users.set(1, {
      id: 1,
      username: 'admin',
      password: hashedPassword,
      email: 'admin@versefountain.com',
      isAdmin: true,
      createdAt: new Date().toISOString(),
    });
    
    // Sample admin user that's easier to remember
    this.users.set(2, {
      id: 2,
      username: 'leon',
      password: hashedPassword,
      email: 'aaron@techleopard.com',
      isAdmin: true,
      createdAt: new Date().toISOString(),
    });
    
    // New admin user
    this.users.set(3, {
      id: 3,
      username: 'aaronleon',
      password: hashedPassword,
      email: 'aaronleon@versefountain.com',
      isAdmin: true,
      createdAt: new Date().toISOString(),
    });
    
    this.userIdCounter = 4;
    
    // Seed chat rooms
    this.chatRooms.set(1, {
      id: 1,
      name: 'Poetry Discussion',
      description: 'General discussion about poetry and creative writing',
      createdById: 1,
      isPrivate: false,
    });
    
    this.chatRooms.set(2, {
      id: 2,
      name: 'Book Club',
      description: 'Discuss your favorite books and authors',
      createdById: 1,
      isPrivate: false,
    });
    this.chatRoomIdCounter = 3;
    
    // Seed academic resources
    this.academicResources.set(1, {
      id: 1,
      title: 'Poetry Analysis Guide',
      description: 'A comprehensive guide to analyzing and understanding poetry',
      type: 'study_guide',
      subject: 'Literature',
      gradeLevel: 'High School',
      language: 'English',
      resourceUrl: '/resources/poetry-analysis',
    });
    
    this.academicResources.set(2, {
      id: 2,
      title: 'Introduction to Creative Writing',
      description: 'Learn the basics of creative writing and storytelling',
      type: 'video',
      subject: 'Writing',
      gradeLevel: 'College',
      language: 'English',
      resourceUrl: '/resources/intro-creative-writing',
    });
    
    this.academicResources.set(3, {
      id: 3,
      title: 'Career Guide: Publishing Industry',
      description: 'Explore career paths in the publishing industry',
      type: 'career_guide',
      subject: 'Career Development',
      gradeLevel: 'College',
      language: 'English',
      resourceUrl: '/resources/publishing-careers',
    });
    this.academicResourceIdCounter = 4;
    
    // Seed events
    const futureDate1 = new Date();
    futureDate1.setDate(futureDate1.getDate() + 7);
    
    const futureDate2 = new Date();
    futureDate2.setDate(futureDate2.getDate() + 14);
    
    this.events.set(1, {
      id: 1,
      title: 'Poetry Slam Night',
      description: 'Join us for a night of passionate poetry performances',
      date: futureDate1,
      location: 'Virtual Event',
      ticketPrice: 0,
      organizer: 'Versefountain Team',
      isVirtual: true,
      streamUrl: 'https://zoom.us/j/123456789',
      isFree: true,
    });
    
    this.events.set(2, {
      id: 2,
      title: 'Author Meet & Greet',
      description: 'Meet your favorite authors and get your books signed',
      date: futureDate2,
      location: 'Central Library',
      ticketPrice: 1500, // $15.00
      organizer: 'Literary Association',
      isVirtual: false,
      streamUrl: null,
      isFree: false,
    });
    this.eventIdCounter = 3;
  }
}

// Import the new database storage implementation
import { DatabaseStorage } from './DatabaseStorage';

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();
