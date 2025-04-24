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
  PoemComment,
  InsertPoemComment,
  Payment,
  InsertPayment,
  Ticket,
  InsertTicket,
  CommentReaction,
  InsertCommentReaction,
  PoetFollower,
  InsertPoetFollower
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
  updatePoem(id: number, updates: Partial<InsertPoem>): Promise<Poem | undefined>;
  approvePoem(id: number): Promise<Poem | undefined>;
  deletePoem(id: number): Promise<boolean>;
  getPendingPoems(): Promise<Poem[]>;
  ratePoem(poemId: number, userId: number, rating: number): Promise<void>;
  likePoem(poemId: number, userId: number): Promise<void>;
  unlikePoem(poemId: number, userId: number): Promise<void>;
  getUserPoemStatus(poemId: number, userId: number): Promise<{ liked: boolean, rating: number | null }>;
  getPoemLikeCount(poemId: number): Promise<number>;
  
  // Poem comments operations
  getPoemComments(poemId: number): Promise<PoemComment[]>;
  createPoemComment(comment: InsertPoemComment, userId: number): Promise<PoemComment>;
  deletePoemComment(commentId: number): Promise<boolean>;
  
  // Comment reactions operations
  getCommentReactions(commentId: number): Promise<CommentReaction[]>;
  getUserCommentReaction(commentId: number, userId: number): Promise<CommentReaction | undefined>;
  addCommentReaction(commentId: number, userId: number, reaction: string): Promise<CommentReaction>;
  updateCommentReaction(commentId: number, userId: number, reaction: string): Promise<CommentReaction | undefined>;
  removeCommentReaction(commentId: number, userId: number): Promise<boolean>;
  getCommentReactionCounts(commentId: number): Promise<{[reaction: string]: number}>;
  
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
  updateEvent(id: number, event: InsertEvent): Promise<Event | undefined>;
  
  // Chat operations
  getChatRooms(): Promise<ChatRoom[]>;
  getChatRoomById(id: number): Promise<ChatRoom | undefined>;
  createChatRoom(chatRoom: InsertChatRoom, createdById: number): Promise<ChatRoom>;
  getChatMessagesByRoomId(roomId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage, userId: number): Promise<ChatMessage>;
  getUserChatRooms(userId: number): Promise<ChatRoom[]>;
  joinChatRoom(userId: number, roomId: number): Promise<boolean>;
  leaveChatRoom(userId: number, roomId: number): Promise<boolean>;
  isUserInChatRoom(userId: number, roomId: number): Promise<boolean>;
  
  // Academic resources operations
  getAcademicResources(limit?: number): Promise<AcademicResource[]>;
  getAcademicResourceById(id: number): Promise<AcademicResource | undefined>;
  createAcademicResource(resource: InsertAcademicResource): Promise<AcademicResource>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentById(id: number): Promise<Payment | undefined>;
  getPaymentsByUserId(userId: number): Promise<Payment[]>;
  updatePaymentStatus(id: number, status: string): Promise<Payment | undefined>;
  updatePaymentRefundReason(id: number, reason: string): Promise<Payment | undefined>;
  
  // Ticket operations
  createTicket(eventId: number, userId: number, paymentId?: number): Promise<Ticket>;
  getTicketsByUserId(userId: number): Promise<Ticket[]>;
  getTicketById(id: number): Promise<Ticket | undefined>;
  updateTicketStatus(id: number, status: string): Promise<Ticket | undefined>;
  markTicketRefunded(id: number): Promise<Ticket | undefined>;
  getTicketsByEventId(eventId: number): Promise<Ticket[]>;
  
  // Poet follower operations
  followPoet(followerId: number, poetId: number): Promise<PoetFollower>;
  unfollowPoet(followerId: number, poetId: number): Promise<boolean>;
  getPoetFollowers(poetId: number): Promise<User[]>;
  getFollowedPoets(userId: number): Promise<User[]>;
  isFollowingPoet(followerId: number, poetId: number): Promise<boolean>;
  getFollowerCount(poetId: number): Promise<number>;
  
  // Session store
  sessionStore: any; // Using any for session store due to type compatibility issues
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
  private payments: Map<number, Payment>;
  private userPoems: Map<string, { userId: number, poemId: number, rating?: number, liked: boolean }>;
  private poemComments: Map<number, PoemComment>;
  private commentReactions: Map<number, CommentReaction>;
  private poetFollowers: Map<number, PoetFollower>;
  
  private userIdCounter: number;
  private poemIdCounter: number;
  private bookIdCounter: number;
  private eventIdCounter: number;
  private chatRoomIdCounter: number;
  private chatMessageIdCounter: number;
  private academicResourceIdCounter: number;
  private ticketIdCounter: number;
  private paymentIdCounter: number;
  private poemCommentIdCounter: number;
  private commentReactionIdCounter: number;
  private poetFollowerIdCounter: number;
  
  sessionStore: any; // Using any for session store due to type compatibility issues

  constructor() {
    this.users = new Map();
    this.poems = new Map();
    this.books = new Map();
    this.events = new Map();
    this.chatRooms = new Map();
    this.chatMessages = new Map();
    this.academicResources = new Map();
    this.tickets = new Map();
    this.payments = new Map();
    this.userPoems = new Map();
    this.userChatRooms = new Map();
    this.poemComments = new Map();
    this.commentReactions = new Map();
    this.poetFollowers = new Map();
    
    this.userIdCounter = 1;
    this.poemIdCounter = 1;
    this.bookIdCounter = 1;
    this.eventIdCounter = 1;
    this.chatRoomIdCounter = 1;
    this.chatMessageIdCounter = 1;
    this.academicResourceIdCounter = 1;
    this.ticketIdCounter = 1;
    this.paymentIdCounter = 1;
    this.poemCommentIdCounter = 1;
    this.commentReactionIdCounter = 1;
    this.poetFollowerIdCounter = 1;
    
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
  
  async updatePoem(id: number, updates: Partial<InsertPoem>): Promise<Poem | undefined> {
    const poem = this.poems.get(id);
    if (!poem) return undefined;
    
    const updatedPoem: Poem = {
      ...poem,
      ...updates,
      id, // Ensure ID doesn't change
      authorId: poem.authorId, // Ensure author doesn't change
      createdAt: poem.createdAt, // Ensure creation date doesn't change
      approved: poem.approved, // Ensure approval status doesn't change
    };
    
    this.poems.set(id, updatedPoem);
    return updatedPoem;
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
  
  async getUserPoemStatus(poemId: number, userId: number): Promise<{ liked: boolean, rating: number | null }> {
    const key = `${userId}-${poemId}`;
    const userPoemEntry = this.userPoems.get(key);
    
    if (userPoemEntry) {
      return {
        liked: userPoemEntry.liked || false,
        rating: userPoemEntry.rating || null
      };
    }
    
    return { liked: false, rating: null };
  }
  
  async getPoemLikeCount(poemId: number): Promise<number> {
    // Count all entries where the poem ID matches and liked is true
    let count = 0;
    for (const [key, entry] of this.userPoems.entries()) {
      if (entry.poemId === poemId && entry.liked) {
        count++;
      }
    }
    return count;
  }
  
  // Poem comments operations
  async getPoemComments(poemId: number): Promise<PoemComment[]> {
    return Array.from(this.poemComments.values())
      .filter(comment => comment.poemId === poemId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async createPoemComment(comment: InsertPoemComment, userId: number): Promise<PoemComment> {
    const id = this.poemCommentIdCounter++;
    const newComment: PoemComment = {
      ...comment,
      id,
      userId,
      createdAt: new Date(),
    };
    this.poemComments.set(id, newComment);
    return newComment;
  }
  
  async deletePoemComment(commentId: number): Promise<boolean> {
    return this.poemComments.delete(commentId);
  }
  
  // Comment reactions operations
  async getCommentReactions(commentId: number): Promise<CommentReaction[]> {
    return Array.from(this.commentReactions.values())
      .filter(reaction => reaction.commentId === commentId);
  }
  
  async getUserCommentReaction(commentId: number, userId: number): Promise<CommentReaction | undefined> {
    return Array.from(this.commentReactions.values())
      .find(reaction => reaction.commentId === commentId && reaction.userId === userId);
  }
  
  async addCommentReaction(commentId: number, userId: number, reaction: string): Promise<CommentReaction> {
    // Check if user already has a reaction to this comment
    const existingReaction = await this.getUserCommentReaction(commentId, userId);
    
    if (existingReaction) {
      // If already has the same reaction, return it
      if (existingReaction.reaction === reaction) {
        return existingReaction;
      }
      
      // Otherwise, update the reaction
      return this.updateCommentReaction(commentId, userId, reaction) as Promise<CommentReaction>;
    }
    
    // Create new reaction
    const id = this.commentReactionIdCounter++;
    const newReaction: CommentReaction = {
      id,
      commentId,
      userId,
      reaction,
      createdAt: new Date()
    };
    
    this.commentReactions.set(id, newReaction);
    return newReaction;
  }
  
  async updateCommentReaction(commentId: number, userId: number, reaction: string): Promise<CommentReaction | undefined> {
    const existingReaction = await this.getUserCommentReaction(commentId, userId);
    
    if (!existingReaction) {
      return undefined;
    }
    
    const updatedReaction: CommentReaction = {
      ...existingReaction,
      reaction,
    };
    
    this.commentReactions.set(existingReaction.id, updatedReaction);
    return updatedReaction;
  }
  
  async removeCommentReaction(commentId: number, userId: number): Promise<boolean> {
    const reaction = await this.getUserCommentReaction(commentId, userId);
    if (!reaction) return false;
    
    return this.commentReactions.delete(reaction.id);
  }
  
  async getCommentReactionCounts(commentId: number): Promise<{[reaction: string]: number}> {
    const reactions = await this.getCommentReactions(commentId);
    const counts: {[reaction: string]: number} = {};
    
    for (const reaction of reactions) {
      counts[reaction.reaction] = (counts[reaction.reaction] || 0) + 1;
    }
    
    return counts;
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
  
  async updateEvent(id: number, event: InsertEvent): Promise<Event | undefined> {
    const existingEvent = this.events.get(id);
    if (!existingEvent) return undefined;
    
    const updatedEvent: Event = {
      ...existingEvent,
      ...event,
      id
    };
    this.events.set(id, updatedEvent);
    return updatedEvent;
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
  
  // User chat room membership
  private userChatRooms: Map<string, { userId: number, roomId: number, joinedAt: Date }>;
  
  async getUserChatRooms(userId: number): Promise<ChatRoom[]> {
    // Find all entries where this user is a member
    const userRoomIds = Array.from(this.userChatRooms.values())
      .filter(entry => entry.userId === userId)
      .map(entry => entry.roomId);
    
    // Return the corresponding chat rooms
    return Array.from(this.chatRooms.values())
      .filter(room => userRoomIds.includes(room.id));
  }
  
  async joinChatRoom(userId: number, roomId: number): Promise<boolean> {
    // Check if room exists
    const room = this.chatRooms.get(roomId);
    if (!room) return false;
    
    // Check if already a member
    const key = `${userId}-${roomId}`;
    if (this.userChatRooms.has(key)) return true;
    
    // Add to membership
    this.userChatRooms.set(key, {
      userId,
      roomId,
      joinedAt: new Date()
    });
    
    return true;
  }
  
  async leaveChatRoom(userId: number, roomId: number): Promise<boolean> {
    const key = `${userId}-${roomId}`;
    return this.userChatRooms.delete(key);
  }
  
  async isUserInChatRoom(userId: number, roomId: number): Promise<boolean> {
    const key = `${userId}-${roomId}`;
    return this.userChatRooms.has(key);
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
  
  // Payment operations
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const id = this.paymentIdCounter++;
    const newPayment: Payment = {
      ...payment,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      paddlePaymentId: null,
      paddleTransactionId: null,
      refundReason: null,
    };
    
    this.payments.set(id, newPayment);
    return newPayment;
  }
  
  async getPaymentById(id: number): Promise<Payment | undefined> {
    return this.payments.get(id);
  }
  
  async getPaymentsByUserId(userId: number): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(payment => payment.userId === userId);
  }
  
  async updatePaymentStatus(id: number, status: string): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;
    
    const updatedPayment = { 
      ...payment, 
      status, 
      updatedAt: new Date() 
    };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }
  
  async updatePaymentRefundReason(id: number, reason: string): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;
    
    const updatedPayment = { 
      ...payment, 
      refundReason: reason,
      status: 'refunded',
      updatedAt: new Date() 
    };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }
  
  // Ticket operations
  async createTicket(eventId: number, userId: number, paymentId?: number): Promise<Ticket> {
    const id = this.ticketIdCounter++;
    const ticketCode = `TICKET-${randomUUID().substring(0, 8)}`;
    
    const newTicket: Ticket = {
      id,
      eventId,
      userId,
      purchaseDate: new Date(),
      ticketCode,
      status: 'active',
      paymentId: paymentId || null,
      isRefunded: false,
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
  
  async getTicketsByEventId(eventId: number): Promise<Ticket[]> {
    return Array.from(this.tickets.values())
      .filter(ticket => ticket.eventId === eventId);
  }
  
  async updateTicketStatus(id: number, status: string): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (!ticket) return undefined;
    
    const updatedTicket = { ...ticket, status };
    this.tickets.set(id, updatedTicket);
    return updatedTicket;
  }
  
  async markTicketRefunded(id: number): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (!ticket) return undefined;
    
    const updatedTicket = { 
      ...ticket, 
      status: 'refunded',
      isRefunded: true 
    };
    this.tickets.set(id, updatedTicket);
    return updatedTicket;
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
      email: 'admin@elibrary.com',
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
      organizer: 'eLibrary Team',
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
  
  // Poet follower operations
  async followPoet(followerId: number, poetId: number): Promise<PoetFollower> {
    // Check if already following
    const isAlreadyFollowing = await this.isFollowingPoet(followerId, poetId);
    if (isAlreadyFollowing) {
      // Find the existing follow relationship and return it
      const existingFollower = Array.from(this.poetFollowers.values())
        .find(pf => pf.followerId === followerId && pf.poetId === poetId);
      if (existingFollower) {
        return existingFollower;
      }
    }
    
    // Create new follow relationship
    const id = this.poetFollowerIdCounter++;
    const poetFollower: PoetFollower = {
      id,
      followerId,
      poetId,
      createdAt: new Date()
    };
    
    this.poetFollowers.set(id, poetFollower);
    return poetFollower;
  }
  
  async unfollowPoet(followerId: number, poetId: number): Promise<boolean> {
    // Find the follow relationship
    const poetFollower = Array.from(this.poetFollowers.values())
      .find(pf => pf.followerId === followerId && pf.poetId === poetId);
    
    if (!poetFollower) {
      return false; // Not following
    }
    
    // Remove the follow relationship
    return this.poetFollowers.delete(poetFollower.id);
  }
  
  async getPoetFollowers(poetId: number): Promise<User[]> {
    // Find all followers of the specified poet
    const followerIds = Array.from(this.poetFollowers.values())
      .filter(pf => pf.poetId === poetId)
      .map(pf => pf.followerId);
    
    // Get the user details for each follower
    const followers: User[] = [];
    for (const followerId of followerIds) {
      const user = this.users.get(followerId);
      if (user) {
        followers.push(user);
      }
    }
    
    return followers;
  }
  
  async getFollowedPoets(userId: number): Promise<User[]> {
    // Find all poets that the user is following
    const poetIds = Array.from(this.poetFollowers.values())
      .filter(pf => pf.followerId === userId)
      .map(pf => pf.poetId);
    
    // Get the user details for each poet
    const poets: User[] = [];
    for (const poetId of poetIds) {
      const user = this.users.get(poetId);
      if (user) {
        poets.push(user);
      }
    }
    
    return poets;
  }
  
  async isFollowingPoet(followerId: number, poetId: number): Promise<boolean> {
    // Check if the follower is following the poet
    return Array.from(this.poetFollowers.values())
      .some(pf => pf.followerId === followerId && pf.poetId === poetId);
  }
  
  async getFollowerCount(poetId: number): Promise<number> {
    // Count the number of followers for a poet
    return Array.from(this.poetFollowers.values())
      .filter(pf => pf.poetId === poetId)
      .length;
  }
}

// Import the new database storage implementation
import { DatabaseStorage } from './DatabaseStorage';

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();
