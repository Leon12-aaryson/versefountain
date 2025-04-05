import {
  users, type User, type InsertUser,
  poems, type Poem, type InsertPoem,
  books, type Book, type InsertBook,
  discussions, type Discussion, type InsertDiscussion,
  chatMessages, type ChatMessage, type InsertChatMessage,
  events, type Event, type InsertEvent,
  culturalCategories, type CulturalCategory, type InsertCulturalCategory,
  academicResources, type AcademicResource, type InsertAcademicResource,
  readingProgress, type ReadingProgress, type InsertReadingProgress,
  comments, type Comment, type InsertComment,
  ratings, type Rating, type InsertRating
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";
import session from "express-session";
import MySQLStoreFactory from "express-mysql-session";

export interface IStorage {
  // Session store for authentication
  sessionStore: session.Store;
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Poem operations
  getPoems(limit?: number): Promise<Poem[]>;
  getPoemById(id: number): Promise<Poem | undefined>;
  getPoemsByCulturalOrigin(origin: string): Promise<Poem[]>;
  createPoem(poem: InsertPoem): Promise<Poem>;
  updatePoemStats(id: number, likes?: number, comments?: number, rating?: number, ratingCount?: number): Promise<void>;
  
  // Book operations
  getBooks(limit?: number, category?: string): Promise<Book[]>;
  getBookById(id: number): Promise<Book | undefined>;
  getBooksByCulturalOrigin(origin: string): Promise<Book[]>;
  createBook(book: InsertBook): Promise<Book>;
  updateBookRating(id: number, rating: number, ratingCount: number): Promise<void>;
  
  // Discussion operations
  getDiscussions(limit?: number): Promise<Discussion[]>;
  getDiscussionById(id: number): Promise<Discussion | undefined>;
  createDiscussion(discussion: InsertDiscussion): Promise<Discussion>;
  updateDiscussionStats(id: number, replies?: number, views?: number): Promise<void>;
  
  // Chat message operations
  getChatMessages(limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Event operations
  getEvents(limit?: number): Promise<Event[]>;
  getEventById(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEventAttendees(id: number, attendees: number): Promise<void>;
  
  // Cultural category operations
  getCulturalCategories(): Promise<CulturalCategory[]>;
  getCulturalCategoryByName(name: string): Promise<CulturalCategory | undefined>;
  createCulturalCategory(category: InsertCulturalCategory): Promise<CulturalCategory>;
  updateCategoryWorkCount(id: number, workCount: number): Promise<void>;
  
  // Academic resource operations
  getAcademicResources(type?: string): Promise<AcademicResource[]>;
  getAcademicResourceById(id: number): Promise<AcademicResource | undefined>;
  createAcademicResource(resource: InsertAcademicResource): Promise<AcademicResource>;
  
  // Reading progress operations
  getReadingProgress(userId: number, bookId: number): Promise<ReadingProgress | undefined>;
  createOrUpdateReadingProgress(progress: InsertReadingProgress): Promise<ReadingProgress>;
  
  // Comment operations
  getCommentsByPoemId(poemId: number): Promise<Comment[]>;
  getCommentsByBookId(bookId: number): Promise<Comment[]>;
  getCommentsByDiscussionId(discussionId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Rating operations
  getRatingByUserAndPoem(userId: number, poemId: number): Promise<Rating | undefined>;
  getRatingByUserAndBook(userId: number, bookId: number): Promise<Rating | undefined>;
  createOrUpdateRating(rating: InsertRating): Promise<Rating>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private poems: Map<number, Poem>;
  private books: Map<number, Book>;
  private discussions: Map<number, Discussion>;
  private chatMessages: Map<number, ChatMessage>;
  private events: Map<number, Event>;
  private culturalCategories: Map<number, CulturalCategory>;
  private academicResources: Map<number, AcademicResource>;
  private readingProgresses: Map<string, ReadingProgress>;
  private comments: Map<number, Comment>;
  private ratings: Map<number, Rating>;
  
  readonly sessionStore: session.Store;
  
  private userIdCounter: number;
  private poemIdCounter: number;
  private bookIdCounter: number;
  private discussionIdCounter: number;
  private chatMessageIdCounter: number;
  private eventIdCounter: number;
  private culturalCategoryIdCounter: number;
  private academicResourceIdCounter: number;
  private readingProgressIdCounter: number;
  private commentIdCounter: number;
  private ratingIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.poems = new Map();
    this.books = new Map();
    this.discussions = new Map();
    this.chatMessages = new Map();
    this.events = new Map();
    this.culturalCategories = new Map();
    this.academicResources = new Map();
    this.readingProgresses = new Map();
    this.comments = new Map();
    this.ratings = new Map();
    
    this.userIdCounter = 1;
    this.poemIdCounter = 1;
    this.bookIdCounter = 1;
    this.discussionIdCounter = 1;
    this.chatMessageIdCounter = 1;
    this.eventIdCounter = 1;
    this.culturalCategoryIdCounter = 1;
    this.academicResourceIdCounter = 1;
    this.readingProgressIdCounter = 1;
    this.commentIdCounter = 1;
    this.ratingIdCounter = 1;
    
    // Initialize memory session store
    const MemoryStore = require('memorystore')(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize with some sample data
    this.initializeData();
  }
  
  // ... other methods remain the same
}

export class DatabaseStorage implements IStorage {
  readonly sessionStore: session.Store;
  
  constructor() {
    // Initialize MySQL session store
    const MySQLStore = MySQLStoreFactory(session);
    this.sessionStore = new MySQLStore({
      host: process.env.MYSQL_HOST || 'localhost',
      port: Number(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'versefountain',
      createDatabaseTable: true
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [rows] = await db.select().from(users).where(eq(users.id, id));
    return rows.length > 0 ? rows[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [rows] = await db.select().from(users).where(eq(users.username, username));
    return rows.length > 0 ? rows[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const userData = {
      ...insertUser,
      avatar: insertUser.avatar || null,
      bio: insertUser.bio || null
    };
    
    const result = await db.insert(users).values(userData);
    const insertId = result[0].insertId;
    const [newUser] = await db.select().from(users).where(eq(users.id, insertId));
    return newUser;
  }
  
  // Poem operations
  async getPoems(limit?: number): Promise<Poem[]> {
    let query = db.select().from(poems).orderBy(desc(poems.createdAt));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const [rows] = await query;
    return rows;
  }
  
  async getPoemById(id: number): Promise<Poem | undefined> {
    const [rows] = await db.select().from(poems).where(eq(poems.id, id));
    return rows.length > 0 ? rows[0] : undefined;
  }
  
  async getPoemsByCulturalOrigin(origin: string): Promise<Poem[]> {
    const [rows] = await db.select().from(poems).where(eq(poems.culturalOrigin, origin));
    return rows;
  }
  
  async createPoem(insertPoem: InsertPoem): Promise<Poem> {
    const poemData = {
      ...insertPoem,
      likes: 0,
      comments: 0,
      rating: 0,
      ratingCount: 0,
      coverImage: insertPoem.coverImage || null
    };
    
    const result = await db.insert(poems).values(poemData);
    const insertId = result[0].insertId;
    const [newPoem] = await db.select().from(poems).where(eq(poems.id, insertId));
    return newPoem;
  }
  
  async updatePoemStats(id: number, likes?: number, comments?: number, rating?: number, ratingCount?: number): Promise<void> {
    const updateValues: Partial<Poem> = {};
    if (likes !== undefined) updateValues.likes = likes;
    if (comments !== undefined) updateValues.comments = comments;
    if (rating !== undefined) updateValues.rating = rating;
    if (ratingCount !== undefined) updateValues.ratingCount = ratingCount;
    
    await db.update(poems)
      .set(updateValues)
      .where(eq(poems.id, id));
  }
  
  // Book operations
  async getBooks(limit?: number, category?: string): Promise<Book[]> {
    let query = db.select().from(books);
    
    if (category && category !== 'All Categories') {
      query = query.where(eq(books.category, category));
    }
    
    query = query.orderBy(desc(books.createdAt));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const [rows] = await query;
    return rows;
  }
  
  async getBookById(id: number): Promise<Book | undefined> {
    const [rows] = await db.select().from(books).where(eq(books.id, id));
    return rows.length > 0 ? rows[0] : undefined;
  }
  
  async getBooksByCulturalOrigin(origin: string): Promise<Book[]> {
    const [rows] = await db.select().from(books).where(eq(books.culturalOrigin, origin));
    return rows;
  }
  
  async createBook(insertBook: InsertBook): Promise<Book> {
    const bookData = {
      ...insertBook,
      rating: 0,
      ratingCount: 0,
      coverImage: insertBook.coverImage || null,
      culturalOrigin: insertBook.culturalOrigin || null,
      description: insertBook.description || null
    };
    
    const result = await db.insert(books).values(bookData);
    const insertId = result[0].insertId;
    const [newBook] = await db.select().from(books).where(eq(books.id, insertId));
    return newBook;
  }
  
  async updateBookRating(id: number, rating: number, ratingCount: number): Promise<void> {
    await db.update(books)
      .set({ rating, ratingCount })
      .where(eq(books.id, id));
  }
  
  // Discussion operations
  async getDiscussions(limit?: number): Promise<Discussion[]> {
    let query = db.select().from(discussions).orderBy(desc(discussions.createdAt));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const [rows] = await query;
    return rows;
  }
  
  async getDiscussionById(id: number): Promise<Discussion | undefined> {
    const [rows] = await db.select().from(discussions).where(eq(discussions.id, id));
    return rows.length > 0 ? rows[0] : undefined;
  }
  
  async createDiscussion(insertDiscussion: InsertDiscussion): Promise<Discussion> {
    const discussionData = {
      ...insertDiscussion,
      replies: 0,
      views: 0,
      authorAvatar: insertDiscussion.authorAvatar || null
    };
    
    const result = await db.insert(discussions).values(discussionData);
    const insertId = result[0].insertId;
    const [newDiscussion] = await db.select().from(discussions).where(eq(discussions.id, insertId));
    return newDiscussion;
  }
  
  async updateDiscussionStats(id: number, replies?: number, views?: number): Promise<void> {
    const updateValues: Partial<Discussion> = {};
    if (replies !== undefined) updateValues.replies = replies;
    if (views !== undefined) updateValues.views = views;
    
    await db.update(discussions)
      .set(updateValues)
      .where(eq(discussions.id, id));
  }
  
  // Chat message operations
  async getChatMessages(limit?: number): Promise<ChatMessage[]> {
    let query = db.select().from(chatMessages).orderBy(asc(chatMessages.createdAt));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const [rows] = await query;
    return rows;
  }
  
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const messageData = {
      ...insertMessage,
      userAvatar: insertMessage.userAvatar || null
    };
    
    const result = await db.insert(chatMessages).values(messageData);
    const insertId = result[0].insertId;
    const [newMessage] = await db.select().from(chatMessages).where(eq(chatMessages.id, insertId));
    return newMessage;
  }
  
  // Event operations
  async getEvents(limit?: number): Promise<Event[]> {
    let query = db.select().from(events).orderBy(asc(events.date));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const [rows] = await query;
    return rows;
  }
  
  async getEventById(id: number): Promise<Event | undefined> {
    const [rows] = await db.select().from(events).where(eq(events.id, id));
    return rows.length > 0 ? rows[0] : undefined;
  }
  
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const eventData = {
      ...insertEvent,
      attendees: 0,
      coverImage: insertEvent.coverImage || null,
      isVirtual: insertEvent.isVirtual ? 1 : 0
    };
    
    const result = await db.insert(events).values(eventData);
    const insertId = result[0].insertId;
    const [newEvent] = await db.select().from(events).where(eq(events.id, insertId));
    return newEvent;
  }
  
  async updateEventAttendees(id: number, attendees: number): Promise<void> {
    await db.update(events)
      .set({ attendees })
      .where(eq(events.id, id));
  }
  
  // Cultural category operations
  async getCulturalCategories(): Promise<CulturalCategory[]> {
    const [rows] = await db.select().from(culturalCategories);
    return rows;
  }
  
  async getCulturalCategoryByName(name: string): Promise<CulturalCategory | undefined> {
    const [rows] = await db.select().from(culturalCategories).where(eq(culturalCategories.name, name));
    return rows.length > 0 ? rows[0] : undefined;
  }
  
  async createCulturalCategory(insertCategory: InsertCulturalCategory): Promise<CulturalCategory> {
    const categoryData = {
      ...insertCategory,
      workCount: 0,
      imageUrl: insertCategory.imageUrl || null
    };
    
    const result = await db.insert(culturalCategories).values(categoryData);
    const insertId = result[0].insertId;
    const [newCategory] = await db.select().from(culturalCategories).where(eq(culturalCategories.id, insertId));
    return newCategory;
  }
  
  async updateCategoryWorkCount(id: number, workCount: number): Promise<void> {
    await db.update(culturalCategories)
      .set({ workCount })
      .where(eq(culturalCategories.id, id));
  }
  
  // Academic resource operations
  async getAcademicResources(type?: string): Promise<AcademicResource[]> {
    let query = db.select().from(academicResources);
    
    if (type) {
      query = query.where(eq(academicResources.type, type));
    }
    
    const [rows] = await query;
    return rows;
  }
  
  async getAcademicResourceById(id: number): Promise<AcademicResource | undefined> {
    const [rows] = await db.select().from(academicResources).where(eq(academicResources.id, id));
    return rows.length > 0 ? rows[0] : undefined;
  }
  
  async createAcademicResource(insertResource: InsertAcademicResource): Promise<AcademicResource> {
    const result = await db.insert(academicResources).values(insertResource);
    const insertId = result[0].insertId;
    const [newResource] = await db.select().from(academicResources).where(eq(academicResources.id, insertId));
    return newResource;
  }
  
  // Reading progress operations
  async getReadingProgress(userId: number, bookId: number): Promise<ReadingProgress | undefined> {
    const [rows] = await db.select().from(readingProgress)
      .where(and(
        eq(readingProgress.userId, userId),
        eq(readingProgress.bookId, bookId)
      ));
    
    return rows.length > 0 ? rows[0] : undefined;
  }
  
  async createOrUpdateReadingProgress(insertProgress: InsertReadingProgress): Promise<ReadingProgress> {
    // Check if the progress already exists
    const existingProgress = await this.getReadingProgress(insertProgress.userId, insertProgress.bookId);
    
    // Ensure currentPage has a value
    const progressData = {
      ...insertProgress,
      currentPage: insertProgress.currentPage || 0  // Default to 0 if undefined
    };
    
    if (existingProgress) {
      // Update existing record
      await db.update(readingProgress)
        .set({ 
          currentPage: progressData.currentPage,
          lastRead: new Date()
        })
        .where(eq(readingProgress.id, existingProgress.id));
      
      // Get the updated record
      const [updated] = await db.select().from(readingProgress).where(eq(readingProgress.id, existingProgress.id));
      return updated;
    } else {
      // Create new record
      const result = await db.insert(readingProgress).values({
        ...progressData,
        lastRead: new Date()
      });
      
      const insertId = result[0].insertId;
      const [newProgress] = await db.select().from(readingProgress).where(eq(readingProgress.id, insertId));
      return newProgress;
    }
  }
  
  // Comment operations
  async getCommentsByPoemId(poemId: number): Promise<Comment[]> {
    const [rows] = await db.select().from(comments)
      .where(eq(comments.poemId, poemId))
      .orderBy(asc(comments.createdAt));
    
    return rows;
  }
  
  async getCommentsByBookId(bookId: number): Promise<Comment[]> {
    const [rows] = await db.select().from(comments)
      .where(eq(comments.bookId, bookId))
      .orderBy(asc(comments.createdAt));
    
    return rows;
  }
  
  async getCommentsByDiscussionId(discussionId: number): Promise<Comment[]> {
    const [rows] = await db.select().from(comments)
      .where(eq(comments.discussionId, discussionId))
      .orderBy(asc(comments.createdAt));
    
    return rows;
  }
  
  async createComment(insertComment: InsertComment): Promise<Comment> {
    const commentData = {
      ...insertComment,
      userAvatar: insertComment.userAvatar || null,
      bookId: insertComment.bookId || null,
      poemId: insertComment.poemId || null,
      discussionId: insertComment.discussionId || null
    };
    
    const result = await db.insert(comments).values(commentData);
    const insertId = result[0].insertId;
    const [newComment] = await db.select().from(comments).where(eq(comments.id, insertId));
    
    // Update comment counts
    if (newComment.poemId) {
      const [poemRows] = await db.select().from(poems).where(eq(poems.id, newComment.poemId));
      if (poemRows.length > 0) {
        const poem = poemRows[0];
        await this.updatePoemStats(poem.id, undefined, poem.comments + 1);
      }
    } else if (newComment.discussionId) {
      const [discussionRows] = await db.select().from(discussions).where(eq(discussions.id, newComment.discussionId));
      if (discussionRows.length > 0) {
        const discussion = discussionRows[0];
        await this.updateDiscussionStats(discussion.id, discussion.replies + 1);
      }
    }
    
    return newComment;
  }
  
  // Rating operations
  async getRatingByUserAndPoem(userId: number, poemId: number): Promise<Rating | undefined> {
    const [rows] = await db.select().from(ratings)
      .where(and(
        eq(ratings.userId, userId),
        eq(ratings.poemId, poemId)
      ));
    
    return rows.length > 0 ? rows[0] : undefined;
  }
  
  async getRatingByUserAndBook(userId: number, bookId: number): Promise<Rating | undefined> {
    const [rows] = await db.select().from(ratings)
      .where(and(
        eq(ratings.userId, userId),
        eq(ratings.bookId, bookId)
      ));
    
    return rows.length > 0 ? rows[0] : undefined;
  }
  
  async createOrUpdateRating(insertRating: InsertRating): Promise<Rating> {
    // Check if rating already exists
    let existingRating: Rating | undefined;
    
    const ratingData = {
      ...insertRating,
      bookId: insertRating.bookId || null,
      poemId: insertRating.poemId || null
    };
    
    if (ratingData.poemId) {
      existingRating = await this.getRatingByUserAndPoem(ratingData.userId, ratingData.poemId);
    } else if (ratingData.bookId) {
      existingRating = await this.getRatingByUserAndBook(ratingData.userId, ratingData.bookId);
    }
    
    let rating: Rating;
    
    if (existingRating) {
      // Update existing rating
      await db.update(ratings)
        .set({ rating: ratingData.rating })
        .where(eq(ratings.id, existingRating.id));
      
      // Get updated rating
      const [updatedRating] = await db.select().from(ratings).where(eq(ratings.id, existingRating.id));
      rating = updatedRating;
    } else {
      // Create new rating
      const result = await db.insert(ratings).values(ratingData);
      const insertId = result[0].insertId;
      const [newRating] = await db.select().from(ratings).where(eq(ratings.id, insertId));
      rating = newRating;
    }
    
    await this.updateAggregateRating(rating);
    return rating;
  }
  
  private async updateAggregateRating(rating: Rating): Promise<void> {
    if (rating.poemId) {
      const [allRatings] = await db.select().from(ratings).where(eq(ratings.poemId, rating.poemId));
      if (allRatings.length > 0) {
        const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
        await this.updatePoemStats(rating.poemId, undefined, undefined, avgRating, allRatings.length);
      }
    } else if (rating.bookId) {
      const [allRatings] = await db.select().from(ratings).where(eq(ratings.bookId, rating.bookId));
      if (allRatings.length > 0) {
        const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
        await this.updateBookRating(rating.bookId, avgRating, allRatings.length);
      }
    }
  }
}

// Export the database storage
export const storage = new DatabaseStorage();