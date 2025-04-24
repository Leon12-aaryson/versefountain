import { db } from './db';
import session from 'express-session';
import { pool } from './db';
import createMemoryStore from 'memorystore';
import { 
  User, InsertUser, 
  ChatRoom, InsertChatRoom, 
  ChatMessage, InsertChatMessage,
  users, poems, books, userPoems, events, academicResources, tickets, payments,
  chatRooms, chatMessages, userChatRooms, poemComments, poetFollowers,
  InsertPoem, InsertBook, InsertEvent, InsertAcademicResource, InsertTicket, InsertPayment,
  PoemComment, InsertPoemComment,
  Ticket, Payment, PoetFollower, InsertPoetFollower,
  CommentReaction, InsertCommentReaction, commentReactions
} from '@shared/schema';
import { IStorage } from './storage';
import { eq, desc, and, inArray } from 'drizzle-orm';

// Initialize memory store for session storage
const MemoryStore = createMemoryStore(session);

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Using any for session store due to type compatibility issues

  constructor() {
    // Use in-memory session store to avoid database conflicts
    this.sessionStore = new MemoryStore({ 
      checkPeriod: 86400000 // prune expired entries every 24h
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
  
  async getFeaturedPoets(limit: number = 5): Promise<any[]> {
    try {
      // Get all approved poems
      const approvedPoems = await db.select()
        .from(poems)
        .where(eq(poems.approved, true));
      
      // Count poems by author
      const authorCounts: Map<number, number> = new Map();
      approvedPoems.forEach(poem => {
        const count = authorCounts.get(poem.authorId) || 0;
        authorCounts.set(poem.authorId, count + 1);
      });
      
      // Convert to array and sort by count
      const authorCountArray = Array.from(authorCounts.entries())
        .map(([authorId, count]) => ({ authorId, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
      
      // Get user details for these authors
      const poetUsers = [];
      for (const { authorId, count } of authorCountArray) {
        const [user] = await db.select({
          id: users.id,
          username: users.username,
          email: users.email,
          isAdmin: users.isAdmin
        })
        .from(users)
        .where(eq(users.id, authorId));
        
        if (user) {
          poetUsers.push({
            ...user,
            poemCount: count
          });
        }
      }
      
      return poetUsers;
    } catch (error) {
      console.error("Error fetching featured poets:", error);
      return [];
    }
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
  
  async updatePoem(id: number, updates: Partial<InsertPoem>) {
    try {
      console.log("Updating poem with id:", id);
      console.log("Updates:", updates);
      
      const [updatedPoem] = await db.update(poems)
        .set(updates)
        .where(eq(poems.id, id))
        .returning();
      
      console.log("Poem updated successfully:", updatedPoem);
      return updatedPoem;
    } catch (error) {
      console.error("Error updating poem:", error);
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
  
  async getUserPoemStatus(poemId: number, userId: number) {
    const userPoemEntry = await db.select()
      .from(userPoems)
      .where(and(
        eq(userPoems.userId, userId),
        eq(userPoems.poemId, poemId)
      ));
      
    if (userPoemEntry.length > 0) {
      return {
        liked: userPoemEntry[0].liked || false,
        rating: userPoemEntry[0].rating
      };
    }
    
    return { liked: false, rating: null };
  }
  
  async getPoemLikeCount(poemId: number): Promise<number> {
    try {
      // Count all entries where the poem ID matches and liked is true
      const result = await db.select().from(userPoems)
        .where(and(
          eq(userPoems.poemId, poemId),
          eq(userPoems.liked, true)
        ));
      
      return result.length;
    } catch (error) {
      console.error("Error getting poem like count:", error);
      return 0;
    }
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
  
  async getEvents(limit?: number, category?: string) {
    let query = db.select().from(events);
    
    if (category) {
      query = query.where(eq(events.category, category));
    }
    
    const eventsResult = await query;
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

  async updateEvent(id: number, event: InsertEvent) {
    const [updatedEvent] = await db
      .update(events)
      .set(event)
      .where(eq(events.id, id))
      .returning();
    return updatedEvent;
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
  
  // Payment operations
  async createPayment(payment: InsertPayment): Promise<Payment> {
    try {
      const [newPayment] = await db.insert(payments).values({
        ...payment,
      }).returning();
      return newPayment;
    } catch (error) {
      console.error("Error creating payment:", error);
      throw error;
    }
  }
  
  async getPaymentById(id: number): Promise<Payment | undefined> {
    try {
      const [payment] = await db.select().from(payments).where(eq(payments.id, id));
      return payment;
    } catch (error) {
      console.error("Error getting payment by ID:", error);
      return undefined;
    }
  }
  
  async getPaymentsByUserId(userId: number): Promise<Payment[]> {
    try {
      return await db.select().from(payments).where(eq(payments.userId, userId));
    } catch (error) {
      console.error("Error getting payments by user ID:", error);
      return [];
    }
  }
  
  async updatePaymentStatus(id: number, status: string): Promise<Payment | undefined> {
    try {
      const [updatedPayment] = await db.update(payments)
        .set({ 
          status,
          updatedAt: new Date()
        })
        .where(eq(payments.id, id))
        .returning();
      return updatedPayment;
    } catch (error) {
      console.error("Error updating payment status:", error);
      return undefined;
    }
  }
  
  async updatePaymentRefundReason(id: number, reason: string): Promise<Payment | undefined> {
    try {
      const [updatedPayment] = await db.update(payments)
        .set({ 
          refundReason: reason,
          status: 'refunded',
          updatedAt: new Date()
        })
        .where(eq(payments.id, id))
        .returning();
      return updatedPayment;
    } catch (error) {
      console.error("Error updating payment refund reason:", error);
      return undefined;
    }
  }

  // Ticket operations
  async createTicket(eventId: number, userId: number, paymentId?: number): Promise<Ticket> { 
    try {
      // Generate a random ticket code
      const ticketCode = `TKT-${Math.floor(Math.random() * 10000)}-${Date.now().toString().slice(-4)}`;
      
      // Insert the ticket
      const [ticket] = await db.insert(tickets).values({
        eventId,
        userId,
        ticketCode,
        status: 'active',
        paymentId: paymentId || null,
        isRefunded: false
      }).returning();
      
      return ticket;
    } catch (error) {
      console.error("Error creating ticket:", error);
      throw error;
    }
  }
  
  async getTicketsByUserId(userId: number): Promise<Ticket[]> {
    try {
      return await db.select().from(tickets).where(eq(tickets.userId, userId));
    } catch (error) {
      console.error("Error getting tickets by user ID:", error);
      return [];
    }
  }
  
  async getTicketById(id: number): Promise<Ticket | undefined> {
    try {
      const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
      return ticket;
    } catch (error) {
      console.error("Error getting ticket by ID:", error);
      return undefined;
    }
  }
  
  async getTicketsByEventId(eventId: number): Promise<Ticket[]> {
    try {
      return await db.select().from(tickets).where(eq(tickets.eventId, eventId));
    } catch (error) {
      console.error("Error getting tickets by event ID:", error);
      return [];
    }
  }
  
  async updateTicketStatus(id: number, status: string): Promise<Ticket | undefined> {
    try {
      const [updatedTicket] = await db.update(tickets)
        .set({ status })
        .where(eq(tickets.id, id))
        .returning();
      return updatedTicket;
    } catch (error) {
      console.error("Error updating ticket status:", error);
      return undefined;
    }
  }
  
  async markTicketRefunded(id: number): Promise<Ticket | undefined> {
    try {
      const [updatedTicket] = await db.update(tickets)
        .set({ 
          status: 'refunded',
          isRefunded: true 
        })
        .where(eq(tickets.id, id))
        .returning();
      return updatedTicket;
    } catch (error) {
      console.error("Error marking ticket as refunded:", error);
      return undefined;
    }
  }
  
  // This function is now deprecated, using the implementation below instead
  // Keeping for compatibility
  private async _getUserChatRoomsOld(userId: number): Promise<ChatRoom[]> {
    try {
      // First get the IDs of rooms the user has joined
      const userRoomEntries = await db.select().from(userChatRooms)
        .where(eq(userChatRooms.userId, userId));
      
      if (!userRoomEntries.length) {
        return [];
      }
      
      // Then fetch the full chatroom details for each room
      const roomIds = userRoomEntries.map(entry => entry.roomId);
      return await db.select().from(chatRooms)
        .where(inArray(chatRooms.id, roomIds));
    } catch (error) {
      console.error("Error fetching user chat rooms:", error);
      return [];
    }
  }
  
  async joinChatRoom(userId: number, roomId: number): Promise<boolean> {
    try {
      // Check if the room exists
      const room = await this.getChatRoomById(roomId);
      if (!room) {
        return false;
      }
      
      // Check if user is already in the room
      const isAlreadyJoined = await this.isUserInChatRoom(userId, roomId);
      if (isAlreadyJoined) {
        return true; // Already joined, consider it a success
      }
      
      // Add user to room
      await db.insert(userChatRooms).values({
        userId,
        roomId
      });
      
      return true;
    } catch (error) {
      console.error("Error joining chat room:", error);
      return false;
    }
  }
  
  async leaveChatRoom(userId: number, roomId: number): Promise<boolean> {
    try {
      await db.delete(userChatRooms)
        .where(and(
          eq(userChatRooms.userId, userId),
          eq(userChatRooms.roomId, roomId)
        ));
      
      return true;
    } catch (error) {
      console.error("Error leaving chat room:", error);
      return false;
    }
  }
  
  async isUserInChatRoom(userId: number, roomId: number): Promise<boolean> {
    try {
      const membership = await db.select().from(userChatRooms)
        .where(and(
          eq(userChatRooms.userId, userId),
          eq(userChatRooms.roomId, roomId)
        ));
      
      return membership.length > 0;
    } catch (error) {
      console.error("Error checking chat room membership:", error);
      return false;
    }
  }
  
  async getUserChatRooms(userId: number): Promise<ChatRoom[]> {
    try {
      // Get all room IDs that the user is a member of
      const memberships = await db.select({ roomId: userChatRooms.roomId })
        .from(userChatRooms)
        .where(eq(userChatRooms.userId, userId));
      
      // If user isn't in any rooms, return empty array
      if (memberships.length === 0) {
        return [];
      }
      
      // Extract the room IDs
      const roomIds = memberships.map(m => m.roomId);
      
      // Get the actual chat rooms
      const rooms = await db.select()
        .from(chatRooms)
        .where(inArray(chatRooms.id, roomIds));
      
      return rooms;
    } catch (error) {
      console.error("Error fetching user chat rooms:", error);
      return [];
    }
  }
  
  // Poem comments operations
  async getPoemComments(poemId: number): Promise<PoemComment[]> {
    try {
      // Get comments with their associated users
      const comments = await db.select({
        id: poemComments.id,
        content: poemComments.content,
        poemId: poemComments.poemId,
        userId: poemComments.userId,
        createdAt: poemComments.createdAt,
        user: {
          id: users.id,
          username: users.username
        }
      })
      .from(poemComments)
      .leftJoin(users, eq(poemComments.userId, users.id))
      .where(eq(poemComments.poemId, poemId))
      .orderBy(desc(poemComments.createdAt));
      
      return comments;
    } catch (error) {
      console.error("Error fetching poem comments:", error);
      return [];
    }
  }
  
  async createPoemComment(comment: InsertPoemComment, userId: number): Promise<PoemComment> {
    try {
      const [newComment] = await db.insert(poemComments).values({
        ...comment,
        userId,
        createdAt: new Date()
      }).returning();
      
      // Get the user info for the response
      const user = await this.getUser(userId);
      
      // Return the comment with user info
      return {
        ...newComment,
        user: user ? { 
          id: user.id, 
          username: user.username 
        } : undefined
      };
    } catch (error) {
      console.error("Error creating poem comment:", error);
      throw error;
    }
  }
  
  async deletePoemComment(commentId: number): Promise<boolean> {
    try {
      await db.delete(poemComments).where(eq(poemComments.id, commentId));
      return true;
    } catch (error) {
      console.error("Error deleting poem comment:", error);
      return false;
    }
  }
  
  // Comment reactions operations
  async getCommentReactions(commentId: number): Promise<CommentReaction[]> {
    try {
      // Use the new poem_comment_reactions table
      return await db.select()
        .from(commentReactions)
        .where(eq(commentReactions.commentId, commentId));
    } catch (error) {
      console.error("Error getting comment reactions:", error);
      return [];
    }
  }
  
  async getUserCommentReaction(commentId: number, userId: number): Promise<CommentReaction | undefined> {
    try {
      const [reaction] = await db.select()
        .from(commentReactions)
        .where(and(
          eq(commentReactions.commentId, commentId),
          eq(commentReactions.userId, userId)
        ));
      return reaction;
    } catch (error) {
      console.error("Error getting user comment reaction:", error);
      return undefined;
    }
  }
  
  async addCommentReaction(commentId: number, userId: number, reaction: string): Promise<CommentReaction> {
    try {
      // Check if user already has a reaction to this comment
      const existingReaction = await this.getUserCommentReaction(commentId, userId);
      
      if (existingReaction) {
        // If already has the same reaction, return it
        if (existingReaction.reaction === reaction) {
          return existingReaction;
        }
        
        // Otherwise, update the reaction
        const updated = await this.updateCommentReaction(commentId, userId, reaction);
        if (updated) return updated;
        
        // Fallback if update fails
        throw new Error("Failed to update existing reaction");
      }
      
      // Create new reaction
      const [newReaction] = await db.insert(commentReactions).values({
        commentId,
        userId,
        reaction,
        createdAt: new Date()
      }).returning();
      
      return newReaction;
    } catch (error) {
      console.error("Error adding comment reaction:", error);
      throw error;
    }
  }
  
  async updateCommentReaction(commentId: number, userId: number, reaction: string): Promise<CommentReaction | undefined> {
    try {
      const [updatedReaction] = await db.update(commentReactions)
        .set({ reaction })
        .where(and(
          eq(commentReactions.commentId, commentId),
          eq(commentReactions.userId, userId)
        ))
        .returning();
      return updatedReaction;
    } catch (error) {
      console.error("Error updating comment reaction:", error);
      return undefined;
    }
  }
  
  async removeCommentReaction(commentId: number, userId: number): Promise<boolean> {
    try {
      await db.delete(commentReactions)
        .where(and(
          eq(commentReactions.commentId, commentId),
          eq(commentReactions.userId, userId)
        ));
      return true;
    } catch (error) {
      console.error("Error removing comment reaction:", error);
      return false;
    }
  }
  
  async getCommentReactionCounts(commentId: number): Promise<{[reaction: string]: number}> {
    try {
      const reactions = await this.getCommentReactions(commentId);
      const counts: {[reaction: string]: number} = {};
      
      for (const reaction of reactions) {
        counts[reaction.reaction] = (counts[reaction.reaction] || 0) + 1;
      }
      
      return counts;
    } catch (error) {
      console.error("Error getting comment reaction counts:", error);
      return {};
    }
  }
  
  // Poet follower operations
  async followPoet(followerId: number, poetId: number): Promise<PoetFollower> {
    try {
      // Check if already following
      const isAlreadyFollowing = await this.isFollowingPoet(followerId, poetId);
      
      if (isAlreadyFollowing) {
        // Find and return the existing follow relationship
        const [existingFollower] = await db.select()
          .from(poetFollowers)
          .where(and(
            eq(poetFollowers.followerId, followerId),
            eq(poetFollowers.poetId, poetId)
          ));
          
        return existingFollower;
      }
      
      // Create new follow relationship
      const [newFollower] = await db.insert(poetFollowers)
        .values({
          followerId,
          poetId,
          createdAt: new Date()
        })
        .returning();
        
      return newFollower;
    } catch (error) {
      console.error("Error following poet:", error);
      throw error;
    }
  }
  
  async unfollowPoet(followerId: number, poetId: number): Promise<boolean> {
    try {
      // Delete the follow relationship
      await db.delete(poetFollowers)
        .where(and(
          eq(poetFollowers.followerId, followerId),
          eq(poetFollowers.poetId, poetId)
        ));
        
      return true;
    } catch (error) {
      console.error("Error unfollowing poet:", error);
      return false;
    }
  }
  
  async getPoetFollowers(poetId: number): Promise<User[]> {
    try {
      // Join poet_followers with users to get follower details
      const followers = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        isAdmin: users.isAdmin
      })
      .from(poetFollowers)
      .innerJoin(users, eq(poetFollowers.followerId, users.id))
      .where(eq(poetFollowers.poetId, poetId));
      
      return followers;
    } catch (error) {
      console.error("Error getting poet followers:", error);
      return [];
    }
  }
  
  async getFollowedPoets(userId: number): Promise<User[]> {
    try {
      // Join poet_followers with users to get followed poet details
      const poets = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        isAdmin: users.isAdmin
      })
      .from(poetFollowers)
      .innerJoin(users, eq(poetFollowers.poetId, users.id))
      .where(eq(poetFollowers.followerId, userId));
      
      return poets;
    } catch (error) {
      console.error("Error getting followed poets:", error);
      return [];
    }
  }
  
  async isFollowingPoet(followerId: number, poetId: number): Promise<boolean> {
    try {
      // Check if the follower is following the poet
      const result = await db.select()
        .from(poetFollowers)
        .where(and(
          eq(poetFollowers.followerId, followerId),
          eq(poetFollowers.poetId, poetId)
        ));
        
      return result.length > 0;
    } catch (error) {
      console.error("Error checking if following poet:", error);
      return false;
    }
  }
  
  async getFollowerCount(poetId: number): Promise<number> {
    try {
      // Count the number of followers for a poet
      const result = await db.select()
        .from(poetFollowers)
        .where(eq(poetFollowers.poetId, poetId));
        
      return result.length;
    } catch (error) {
      console.error("Error getting follower count:", error);
      return 0;
    }
  }
}