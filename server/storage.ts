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

export interface IStorage {
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
    
    // Initialize with sample data
    this.initializeData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now,
      avatar: insertUser.avatar || null,
      bio: insertUser.bio || null
    };
    this.users.set(id, user);
    return user;
  }
  
  // Poem operations
  async getPoems(limit?: number): Promise<Poem[]> {
    const poems = Array.from(this.poems.values());
    poems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return limit ? poems.slice(0, limit) : poems;
  }
  
  async getPoemById(id: number): Promise<Poem | undefined> {
    return this.poems.get(id);
  }
  
  async getPoemsByCulturalOrigin(origin: string): Promise<Poem[]> {
    return Array.from(this.poems.values()).filter(
      (poem) => poem.culturalOrigin === origin
    );
  }
  
  async createPoem(insertPoem: InsertPoem): Promise<Poem> {
    const id = this.poemIdCounter++;
    const now = new Date();
    const poem: Poem = { 
      ...insertPoem, 
      id, 
      likes: 0, 
      comments: 0, 
      rating: 0, 
      ratingCount: 0, 
      createdAt: now,
      coverImage: insertPoem.coverImage || null
    };
    this.poems.set(id, poem);
    return poem;
  }
  
  async updatePoemStats(id: number, likes?: number, comments?: number, rating?: number, ratingCount?: number): Promise<void> {
    const poem = this.poems.get(id);
    if (poem) {
      if (likes !== undefined) poem.likes = likes;
      if (comments !== undefined) poem.comments = comments;
      if (rating !== undefined) poem.rating = rating;
      if (ratingCount !== undefined) poem.ratingCount = ratingCount;
      this.poems.set(id, poem);
    }
  }
  
  // Book operations
  async getBooks(limit?: number, category?: string): Promise<Book[]> {
    let books = Array.from(this.books.values());
    
    if (category && category !== 'All Categories') {
      books = books.filter(book => book.category === category);
    }
    
    books.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return limit ? books.slice(0, limit) : books;
  }
  
  async getBookById(id: number): Promise<Book | undefined> {
    return this.books.get(id);
  }
  
  async getBooksByCulturalOrigin(origin: string): Promise<Book[]> {
    return Array.from(this.books.values()).filter(
      (book) => book.culturalOrigin === origin
    );
  }
  
  async createBook(insertBook: InsertBook): Promise<Book> {
    const id = this.bookIdCounter++;
    const now = new Date();
    const book: Book = { 
      ...insertBook, 
      id, 
      rating: 0, 
      ratingCount: 0, 
      createdAt: now,
      coverImage: insertBook.coverImage || null,
      culturalOrigin: insertBook.culturalOrigin || null,
      description: insertBook.description || null
    };
    this.books.set(id, book);
    return book;
  }
  
  async updateBookRating(id: number, rating: number, ratingCount: number): Promise<void> {
    const book = this.books.get(id);
    if (book) {
      book.rating = rating;
      book.ratingCount = ratingCount;
      this.books.set(id, book);
    }
  }
  
  // Discussion operations
  async getDiscussions(limit?: number): Promise<Discussion[]> {
    const discussions = Array.from(this.discussions.values());
    discussions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return limit ? discussions.slice(0, limit) : discussions;
  }
  
  async getDiscussionById(id: number): Promise<Discussion | undefined> {
    return this.discussions.get(id);
  }
  
  async createDiscussion(insertDiscussion: InsertDiscussion): Promise<Discussion> {
    const id = this.discussionIdCounter++;
    const now = new Date();
    const discussion: Discussion = { 
      ...insertDiscussion, 
      id, 
      replies: 0, 
      views: 0, 
      createdAt: now,
      authorAvatar: insertDiscussion.authorAvatar || null
    };
    this.discussions.set(id, discussion);
    return discussion;
  }
  
  async updateDiscussionStats(id: number, replies?: number, views?: number): Promise<void> {
    const discussion = this.discussions.get(id);
    if (discussion) {
      if (replies !== undefined) discussion.replies = replies;
      if (views !== undefined) discussion.views = views;
      this.discussions.set(id, discussion);
    }
  }
  
  // Chat message operations
  async getChatMessages(limit?: number): Promise<ChatMessage[]> {
    const messages = Array.from(this.chatMessages.values());
    messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    return limit ? messages.slice(0, limit) : messages;
  }
  
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageIdCounter++;
    const now = new Date();
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      createdAt: now,
      userAvatar: insertMessage.userAvatar || null 
    };
    this.chatMessages.set(id, message);
    return message;
  }
  
  // Event operations
  async getEvents(limit?: number): Promise<Event[]> {
    const events = Array.from(this.events.values());
    events.sort((a, b) => a.date.getTime() - b.date.getTime());
    return limit ? events.slice(0, limit) : events;
  }
  
  async getEventById(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }
  
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const now = new Date();
    const event: Event = { 
      ...insertEvent, 
      id, 
      attendees: 0, 
      createdAt: now,
      coverImage: insertEvent.coverImage || null,
      isVirtual: insertEvent.isVirtual || false
    };
    this.events.set(id, event);
    return event;
  }
  
  async updateEventAttendees(id: number, attendees: number): Promise<void> {
    const event = this.events.get(id);
    if (event) {
      event.attendees = attendees;
      this.events.set(id, event);
    }
  }
  
  // Cultural category operations
  async getCulturalCategories(): Promise<CulturalCategory[]> {
    return Array.from(this.culturalCategories.values());
  }
  
  async getCulturalCategoryByName(name: string): Promise<CulturalCategory | undefined> {
    return Array.from(this.culturalCategories.values()).find(
      (category) => category.name === name
    );
  }
  
  async createCulturalCategory(insertCategory: InsertCulturalCategory): Promise<CulturalCategory> {
    const id = this.culturalCategoryIdCounter++;
    const category: CulturalCategory = { 
      ...insertCategory, 
      id, 
      workCount: 0,
      imageUrl: insertCategory.imageUrl || null
    };
    this.culturalCategories.set(id, category);
    return category;
  }
  
  async updateCategoryWorkCount(id: number, workCount: number): Promise<void> {
    const category = this.culturalCategories.get(id);
    if (category) {
      category.workCount = workCount;
      this.culturalCategories.set(id, category);
    }
  }
  
  // Academic resource operations
  async getAcademicResources(type?: string): Promise<AcademicResource[]> {
    let resources = Array.from(this.academicResources.values());
    if (type) {
      resources = resources.filter(resource => resource.type === type);
    }
    return resources;
  }
  
  async getAcademicResourceById(id: number): Promise<AcademicResource | undefined> {
    return this.academicResources.get(id);
  }
  
  async createAcademicResource(insertResource: InsertAcademicResource): Promise<AcademicResource> {
    const id = this.academicResourceIdCounter++;
    const now = new Date();
    const resource: AcademicResource = { ...insertResource, id, createdAt: now };
    this.academicResources.set(id, resource);
    return resource;
  }
  
  // Reading progress operations
  async getReadingProgress(userId: number, bookId: number): Promise<ReadingProgress | undefined> {
    return this.readingProgresses.get(`${userId}-${bookId}`);
  }
  
  async createOrUpdateReadingProgress(insertProgress: InsertReadingProgress): Promise<ReadingProgress> {
    const progressId = 'id' in insertProgress ? insertProgress.id : this.readingProgressIdCounter++;
    const now = new Date();
    const progress: ReadingProgress = { 
      ...insertProgress, 
      id: progressId, 
      lastRead: now,
      currentPage: insertProgress.currentPage || 0
    };
    
    // Use a composite key to ensure uniqueness per user/book combination
    this.readingProgresses.set(`${progress.userId}-${progress.bookId}`, progress);
    
    if (!('id' in insertProgress)) {
      this.readingProgressIdCounter = progressId + 1;
    }
    
    return progress;
  }
  
  // Comment operations
  async getCommentsByPoemId(poemId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.poemId === poemId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  
  async getCommentsByBookId(bookId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.bookId === bookId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  
  async getCommentsByDiscussionId(discussionId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.discussionId === discussionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  
  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.commentIdCounter++;
    const now = new Date();
    const comment: Comment = { 
      ...insertComment, 
      id, 
      createdAt: now,
      userAvatar: insertComment.userAvatar || null,
      bookId: insertComment.bookId || null,
      poemId: insertComment.poemId || null,
      discussionId: insertComment.discussionId || null
    };
    this.comments.set(id, comment);
    
    // Update comment counts
    if (comment.poemId) {
      const poem = this.poems.get(comment.poemId);
      if (poem) {
        poem.comments += 1;
        this.poems.set(poem.id, poem);
      }
    } else if (comment.discussionId) {
      const discussion = this.discussions.get(comment.discussionId);
      if (discussion) {
        discussion.replies += 1;
        this.discussions.set(discussion.id, discussion);
      }
    }
    
    return comment;
  }
  
  // Rating operations
  async getRatingByUserAndPoem(userId: number, poemId: number): Promise<Rating | undefined> {
    return Array.from(this.ratings.values()).find(
      (rating) => rating.userId === userId && rating.poemId === poemId
    );
  }
  
  async getRatingByUserAndBook(userId: number, bookId: number): Promise<Rating | undefined> {
    return Array.from(this.ratings.values()).find(
      (rating) => rating.userId === userId && rating.bookId === bookId
    );
  }
  
  async createOrUpdateRating(insertRating: InsertRating): Promise<Rating> {
    // Check if rating already exists
    let existingRating: Rating | undefined;
    
    if (insertRating.poemId) {
      existingRating = await this.getRatingByUserAndPoem(insertRating.userId, insertRating.poemId);
    } else if (insertRating.bookId) {
      existingRating = await this.getRatingByUserAndBook(insertRating.userId, insertRating.bookId);
    }
    
    if (existingRating) {
      // Update existing rating
      existingRating.rating = insertRating.rating;
      this.ratings.set(existingRating.id, existingRating);
      
      // Update aggregate rating
      this.updateAggregateRating(existingRating);
      
      return existingRating;
    } else {
      // Create new rating
      const id = this.ratingIdCounter++;
      const now = new Date();
      const rating: Rating = { 
        ...insertRating, 
        id, 
        createdAt: now,
        bookId: insertRating.bookId || null,
        poemId: insertRating.poemId || null
      };
      this.ratings.set(id, rating);
      
      // Update aggregate rating
      this.updateAggregateRating(rating);
      
      return rating;
    }
  }
  
  // Helper method to update aggregate ratings
  private async updateAggregateRating(rating: Rating): Promise<void> {
    if (rating.poemId) {
      const poemRatings = Array.from(this.ratings.values()).filter(r => r.poemId === rating.poemId);
      const ratingSum = poemRatings.reduce((sum, r) => sum + r.rating, 0);
      const ratingCount = poemRatings.length;
      const averageRating = ratingCount > 0 ? ratingSum / ratingCount : 0;
      
      await this.updatePoemStats(rating.poemId, undefined, undefined, averageRating, ratingCount);
    } else if (rating.bookId) {
      const bookRatings = Array.from(this.ratings.values()).filter(r => r.bookId === rating.bookId);
      const ratingSum = bookRatings.reduce((sum, r) => sum + r.rating, 0);
      const ratingCount = bookRatings.length;
      const averageRating = ratingCount > 0 ? ratingSum / ratingCount : 0;
      
      await this.updateBookRating(rating.bookId, averageRating, ratingCount);
    }
  }

  // Initialize sample data
  private initializeData(): void {
    // Sample user
    const user: InsertUser = {
      username: 'demo',
      password: 'password',
      email: 'demo@example.com',
      displayName: 'Demo User',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      bio: 'Poetry enthusiast and cultural explorer.',
    };
    this.createUser(user);
    
    // Sample cultural categories
    const categories = [
      { name: 'African', imageUrl: 'https://images.unsplash.com/photo-1566994616471-37ba78208f53?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', workCount: 215 },
      { name: 'Asian', imageUrl: 'https://images.unsplash.com/photo-1535139262971-c51845709a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', workCount: 189 },
      { name: 'European', imageUrl: 'https://images.unsplash.com/photo-1524729429516-485db0307e59?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', workCount: 243 },
      { name: 'Latin American', imageUrl: 'https://images.unsplash.com/photo-1547995886-6dc09384c6e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', workCount: 178 },
      { name: 'Middle Eastern', imageUrl: 'https://images.unsplash.com/photo-1563506644863-444710d1f416?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', workCount: 156 },
      { name: 'Oceanic', imageUrl: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', workCount: 124 }
    ];
    categories.forEach(async (cat) => {
      const category = await this.createCulturalCategory({ name: cat.name, imageUrl: cat.imageUrl });
      this.updateCategoryWorkCount(category.id, cat.workCount);
    });
    
    // Sample poems
    const poems = [
      {
        title: "The Baobab's Wisdom",
        content: "Ancient sentinel of the savanna,\nYour branches reach to heavens above,\nKeeper of stories untold...",
        authorId: 1,
        authorName: "Chinua Ademola",
        culturalOrigin: "African",
        coverImage: "https://images.unsplash.com/photo-1605722625766-a4c989c747a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        readTime: 5,
        likes: 124,
        comments: 32,
        rating: 4.5,
        ratingCount: 54
      },
      {
        title: "Lanterns of Hope",
        content: "Paper lanterns drift skyward,\nCarrying wishes on glowing wings,\nAncestors guide the way...",
        authorId: 1,
        authorName: "Li Wei Ming",
        culturalOrigin: "Asian",
        coverImage: "https://images.unsplash.com/photo-1565073624548-9f9967bb4be4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        readTime: 4,
        likes: 89,
        comments: 17,
        rating: 4.0,
        ratingCount: 41
      },
      {
        title: "Danza de Espíritus",
        content: "Vibrant colors spin through village streets,\nDrums beating heart rhythms of ancestors,\nDance of spirits remembered...",
        authorId: 1,
        authorName: "Isabella Martínez",
        culturalOrigin: "Latin",
        coverImage: "https://images.unsplash.com/photo-1516515429572-bf32372f2409?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        readTime: 6,
        likes: 156,
        comments: 42,
        rating: 4.9,
        ratingCount: 68
      }
    ];
    poems.forEach(async (p) => {
      const poem = await this.createPoem({
        title: p.title,
        content: p.content,
        authorId: p.authorId,
        authorName: p.authorName,
        culturalOrigin: p.culturalOrigin,
        coverImage: p.coverImage,
        readTime: p.readTime
      });
      this.updatePoemStats(poem.id, p.likes, p.comments, p.rating, p.ratingCount);
    });
    
    // Sample books
    const books = [
      {
        title: "Ancestral Rhythms",
        author: "Kofi Amoah",
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        category: "Cultural Studies",
        culturalOrigin: "African",
        description: "A collection of African poetry exploring traditional rhythms and cultural heritage.",
        rating: 4.1,
        ratingCount: 56
      },
      {
        title: "Sakura Memories",
        author: "Haruki Tanaka",
        coverImage: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        category: "Poetry Collections",
        culturalOrigin: "Asian",
        description: "Poems celebrating Japanese cultural traditions through the symbol of cherry blossoms.",
        rating: 4.7,
        ratingCount: 82
      },
      {
        title: "Ancient Paths",
        author: "Elena Vasquez",
        coverImage: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        category: "Traditional Tales",
        culturalOrigin: "Latin American",
        description: "A journey through indigenous storytelling traditions of Latin America.",
        rating: 4.9,
        ratingCount: 43
      },
      {
        title: "Celtic Whispers",
        author: "Fiona O'Brien",
        coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        category: "Historical",
        culturalOrigin: "European",
        description: "Poems inspired by Celtic mythology and oral traditions from Ireland.",
        rating: 3.5,
        ratingCount: 28
      },
      {
        title: "Desert Songs",
        author: "Amina Khalil",
        coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        category: "Poetry Collections",
        culturalOrigin: "Middle Eastern",
        description: "A collection exploring Bedouin poetry forms and desert cultural traditions.",
        rating: 4.2,
        ratingCount: 37
      }
    ];
    books.forEach(async (b) => {
      const book = await this.createBook({
        title: b.title,
        author: b.author,
        coverImage: b.coverImage,
        category: b.category,
        culturalOrigin: b.culturalOrigin,
        description: b.description
      });
      this.updateBookRating(book.id, b.rating, b.ratingCount);
    });
    
    // Sample discussions
    const discussions = [
      {
        title: "The Influence of Oral Traditions on Modern Poetry",
        content: "I've been researching how ancient oral traditions have shaped contemporary poetic forms. Would love to hear thoughts from those familiar with different cultural traditions...",
        authorId: 1,
        authorName: "Maya Johnson",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
        replies: 28,
        views: 142,
        status: "Active"
      },
      {
        title: "Translating Cultural Poetry: Challenges and Approaches",
        content: "As a translator working with indigenous poetry, I'm curious about others' experiences with preserving cultural context while making work accessible to new audiences...",
        authorId: 1,
        authorName: "Daniel Chen",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
        replies: 46,
        views: 203,
        status: "Hot"
      },
      {
        title: "Book Club: \"Ancestral Rhythms\" by Kofi Amoah",
        content: "Our monthly book club selection is Kofi Amoah's collection of poetry exploring West African cultural traditions. Join us for the discussion starting next week...",
        authorId: 1,
        authorName: "Sarah Williams",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
        replies: 12,
        views: 87,
        status: "New"
      }
    ];
    discussions.forEach(async (d) => {
      const discussion = await this.createDiscussion({
        title: d.title,
        content: d.content,
        authorId: d.authorId,
        authorName: d.authorName,
        authorAvatar: d.authorAvatar,
        status: d.status
      });
      this.updateDiscussionStats(discussion.id, d.replies, d.views);
    });
    
    // Sample chat messages
    const chatMessages = [
      {
        content: "Has anyone read \"Desert Songs\" by Amina Khalil? I'm fascinated by her use of traditional Bedouin poetry structures.",
        userId: 1,
        username: "Aisha N.",
        userAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      },
      {
        content: "Yes! I loved how she incorporated traditional qasida form while addressing contemporary themes. The rhythm is mesmerizing.",
        userId: 1,
        username: "Michael T.",
        userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      },
      {
        content: "I'm new to Arabic poetry forms. Could someone explain what makes qasida different from Western poetry structures?",
        userId: 1,
        username: "Elena V.",
        userAvatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      }
    ];
    chatMessages.forEach(async (m) => {
      await this.createChatMessage(m);
    });
    
    // Sample events
    const today = new Date();
    const events = [
      {
        title: "East African Poetry Night",
        description: "Join us for an evening celebrating the rich poetic traditions of East Africa with readings from established and emerging voices.",
        date: new Date(today.getFullYear(), 5, 15), // June 15
        location: "Nairobi Cultural Center",
        isVirtual: false,
        startTime: "7:00 PM",
        endTime: "9:00 PM",
        coverImage: "https://images.unsplash.com/photo-1527979856943-6da635f05aea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        attendees: 42,
        month: "Jun",
        day: "15"
      },
      {
        title: "Global Poetry Translation Workshop",
        description: "Learn about the art of translating poetry while preserving cultural nuances with award-winning translators from around the world.",
        date: new Date(today.getFullYear(), 5, 21), // June 21
        location: "Virtual Event",
        isVirtual: true,
        startTime: "6:00 PM",
        endTime: "7:30 PM",
        coverImage: "https://images.unsplash.com/photo-1543269664-76bc3997d9ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        attendees: 89,
        month: "Jun",
        day: "21"
      },
      {
        title: "Book Launch: \"Celtic Whispers\"",
        description: "Join author Fiona O'Brien for the launch of her new collection of poetry inspired by Celtic mythology and oral traditions.",
        date: new Date(today.getFullYear(), 5, 28), // June 28
        location: "Riverfront Library, Main Hall",
        isVirtual: false,
        startTime: "3:00 PM",
        endTime: "5:00 PM",
        coverImage: "https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        attendees: 35,
        month: "Jun",
        day: "28"
      }
    ];
    events.forEach(async (e) => {
      const event = await this.createEvent({
        title: e.title,
        description: e.description,
        date: e.date,
        location: e.location,
        isVirtual: e.isVirtual,
        startTime: e.startTime,
        endTime: e.endTime,
        coverImage: e.coverImage,
        month: e.month,
        day: e.day
      });
      this.updateEventAttendees(event.id, e.attendees);
    });
    
    // Sample academic resources
    const academicResources = [
      {
        title: "Research Papers",
        description: "Access peer-reviewed research papers exploring cultural literary traditions and their evolution over time.",
        type: "Research",
        icon: "fas fa-graduation-cap",
        link: "/academics/research-papers"
      },
      {
        title: "Video Lectures",
        description: "Watch lectures from leading professors and cultural scholars on various forms of traditional poetry.",
        type: "Video",
        icon: "fas fa-video",
        link: "/academics/video-lectures"
      },
      {
        title: "Study Guides",
        description: "Download comprehensive guides to help understand and analyze cultural poetry from various traditions.",
        type: "Guide",
        icon: "fas fa-book-open",
        link: "/academics/study-guides"
      },
      {
        title: "Discussion Groups",
        description: "Join moderated academic discussion groups focused on specific cultural literary traditions.",
        type: "Community",
        icon: "fas fa-users",
        link: "/academics/discussion-groups"
      },
      {
        title: "Writing Resources",
        description: "Access tools and guides for writing in traditional poetic forms from different cultures.",
        type: "Resource",
        icon: "fas fa-pen-fancy",
        link: "/academics/writing-resources"
      },
      {
        title: "Certificates",
        description: "Earn certificates in cultural poetry studies through our partnership with leading universities.",
        type: "Certificate",
        icon: "fas fa-certificate",
        link: "/academics/certificates"
      }
    ];
    academicResources.forEach(async (r) => {
      await this.createAcademicResource(r);
    });
  }
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const userData = {
      ...insertUser,
      avatar: insertUser.avatar || null,
      bio: insertUser.bio || null
    };
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  
  // Poem operations
  async getPoems(limit?: number): Promise<Poem[]> {
    const query = db.select().from(poems).orderBy(desc(poems.createdAt));
    if (limit) {
      query.limit(limit);
    }
    return await query;
  }
  
  async getPoemById(id: number): Promise<Poem | undefined> {
    const [poem] = await db.select().from(poems).where(eq(poems.id, id));
    return poem || undefined;
  }
  
  async getPoemsByCulturalOrigin(origin: string): Promise<Poem[]> {
    return await db.select().from(poems).where(eq(poems.culturalOrigin, origin));
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
    const [poem] = await db.insert(poems).values(poemData).returning();
    return poem;
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
    
    return await query;
  }
  
  async getBookById(id: number): Promise<Book | undefined> {
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book || undefined;
  }
  
  async getBooksByCulturalOrigin(origin: string): Promise<Book[]> {
    return await db.select().from(books).where(eq(books.culturalOrigin, origin));
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
    const [book] = await db.insert(books).values(bookData).returning();
    return book;
  }
  
  async updateBookRating(id: number, rating: number, ratingCount: number): Promise<void> {
    await db.update(books)
      .set({ rating, ratingCount })
      .where(eq(books.id, id));
  }
  
  // Discussion operations
  async getDiscussions(limit?: number): Promise<Discussion[]> {
    const query = db.select().from(discussions).orderBy(desc(discussions.createdAt));
    if (limit) {
      query.limit(limit);
    }
    return await query;
  }
  
  async getDiscussionById(id: number): Promise<Discussion | undefined> {
    const [discussion] = await db.select().from(discussions).where(eq(discussions.id, id));
    return discussion || undefined;
  }
  
  async createDiscussion(insertDiscussion: InsertDiscussion): Promise<Discussion> {
    const discussionData = {
      ...insertDiscussion,
      replies: 0,
      views: 0,
      authorAvatar: insertDiscussion.authorAvatar || null
    };
    const [discussion] = await db.insert(discussions).values(discussionData).returning();
    return discussion;
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
    const query = db.select().from(chatMessages).orderBy(asc(chatMessages.createdAt));
    if (limit) {
      query.limit(limit);
    }
    return await query;
  }
  
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const messageData = {
      ...insertMessage,
      userAvatar: insertMessage.userAvatar || null
    };
    const [message] = await db.insert(chatMessages).values(messageData).returning();
    return message;
  }
  
  // Event operations
  async getEvents(limit?: number): Promise<Event[]> {
    const query = db.select().from(events).orderBy(asc(events.date));
    if (limit) {
      query.limit(limit);
    }
    return await query;
  }
  
  async getEventById(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }
  
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const eventData = {
      ...insertEvent,
      attendees: 0,
      coverImage: insertEvent.coverImage || null,
      isVirtual: insertEvent.isVirtual || false
    };
    const [event] = await db.insert(events).values(eventData).returning();
    return event;
  }
  
  async updateEventAttendees(id: number, attendees: number): Promise<void> {
    await db.update(events)
      .set({ attendees })
      .where(eq(events.id, id));
  }
  
  // Cultural category operations
  async getCulturalCategories(): Promise<CulturalCategory[]> {
    return await db.select().from(culturalCategories);
  }
  
  async getCulturalCategoryByName(name: string): Promise<CulturalCategory | undefined> {
    const [category] = await db.select().from(culturalCategories).where(eq(culturalCategories.name, name));
    return category || undefined;
  }
  
  async createCulturalCategory(insertCategory: InsertCulturalCategory): Promise<CulturalCategory> {
    const categoryData = {
      ...insertCategory,
      workCount: 0,
      imageUrl: insertCategory.imageUrl || null
    };
    const [category] = await db.insert(culturalCategories).values(categoryData).returning();
    return category;
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
    return await query;
  }
  
  async getAcademicResourceById(id: number): Promise<AcademicResource | undefined> {
    const [resource] = await db.select().from(academicResources).where(eq(academicResources.id, id));
    return resource || undefined;
  }
  
  async createAcademicResource(insertResource: InsertAcademicResource): Promise<AcademicResource> {
    const [resource] = await db.insert(academicResources).values(insertResource).returning();
    return resource;
  }
  
  // Reading progress operations
  async getReadingProgress(userId: number, bookId: number): Promise<ReadingProgress | undefined> {
    const [progress] = await db.select().from(readingProgress)
      .where(and(
        eq(readingProgress.userId, userId),
        eq(readingProgress.bookId, bookId)
      ));
    return progress || undefined;
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
      const [updated] = await db.update(readingProgress)
        .set({ 
          currentPage: progressData.currentPage,
          lastRead: new Date()
        })
        .where(eq(readingProgress.id, existingProgress.id))
        .returning();
      return updated;
    } else {
      // Create new record
      const [progress] = await db.insert(readingProgress).values({
        ...progressData,
        lastRead: new Date()
      }).returning();
      return progress;
    }
  }
  
  // Comment operations
  async getCommentsByPoemId(poemId: number): Promise<Comment[]> {
    return await db.select().from(comments)
      .where(eq(comments.poemId, poemId))
      .orderBy(asc(comments.createdAt));
  }
  
  async getCommentsByBookId(bookId: number): Promise<Comment[]> {
    return await db.select().from(comments)
      .where(eq(comments.bookId, bookId))
      .orderBy(asc(comments.createdAt));
  }
  
  async getCommentsByDiscussionId(discussionId: number): Promise<Comment[]> {
    return await db.select().from(comments)
      .where(eq(comments.discussionId, discussionId))
      .orderBy(asc(comments.createdAt));
  }
  
  async createComment(insertComment: InsertComment): Promise<Comment> {
    const commentData = {
      ...insertComment,
      userAvatar: insertComment.userAvatar || null,
      bookId: insertComment.bookId || null,
      poemId: insertComment.poemId || null,
      discussionId: insertComment.discussionId || null
    };
    
    const [comment] = await db.insert(comments).values(commentData).returning();
    
    // Update comment counts
    if (comment.poemId) {
      const [poem] = await db.select().from(poems).where(eq(poems.id, comment.poemId));
      if (poem) {
        await this.updatePoemStats(poem.id, undefined, poem.comments + 1);
      }
    } else if (comment.discussionId) {
      const [discussion] = await db.select().from(discussions).where(eq(discussions.id, comment.discussionId));
      if (discussion) {
        await this.updateDiscussionStats(discussion.id, discussion.replies + 1);
      }
    }
    
    return comment;
  }
  
  // Rating operations
  async getRatingByUserAndPoem(userId: number, poemId: number): Promise<Rating | undefined> {
    const [rating] = await db.select().from(ratings)
      .where(and(
        eq(ratings.userId, userId),
        eq(ratings.poemId, poemId)
      ));
    return rating || undefined;
  }
  
  async getRatingByUserAndBook(userId: number, bookId: number): Promise<Rating | undefined> {
    const [rating] = await db.select().from(ratings)
      .where(and(
        eq(ratings.userId, userId),
        eq(ratings.bookId, bookId)
      ));
    return rating || undefined;
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
    
    if (existingRating) {
      // Update existing rating
      const [updated] = await db.update(ratings)
        .set({ rating: ratingData.rating })
        .where(eq(ratings.id, existingRating.id))
        .returning();
      
      await this.updateAggregateRating(updated);
      return updated;
    } else {
      // Create new rating
      const [rating] = await db.insert(ratings).values(ratingData).returning();
      await this.updateAggregateRating(rating);
      return rating;
    }
  }
  
  private async updateAggregateRating(rating: Rating): Promise<void> {
    if (rating.poemId) {
      const allRatings = await db.select().from(ratings).where(eq(ratings.poemId, rating.poemId));
      const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
      await this.updatePoemStats(rating.poemId, undefined, undefined, avgRating, allRatings.length);
    } else if (rating.bookId) {
      const allRatings = await db.select().from(ratings).where(eq(ratings.bookId, rating.bookId));
      const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
      await this.updateBookRating(rating.bookId, avgRating, allRatings.length);
    }
  }
}

// Change from MemStorage to DatabaseStorage
export const storage = new DatabaseStorage();
