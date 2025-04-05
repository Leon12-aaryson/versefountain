import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertPoemSchema, insertBookSchema, insertDiscussionSchema, insertChatMessageSchema, insertEventSchema, insertCulturalCategorySchema, insertAcademicResourceSchema, insertReadingProgressSchema, insertCommentSchema, insertRatingSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth";

// WS clients
const clients = new Map<string, WebSocket>();

// Helper function to validate request body
function validateBody<T extends z.ZodTypeAny>(
  schema: T,
  body: unknown
): z.infer<T> {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new Error(`Invalid request body: ${result.error.message}`);
  }
  return result.data;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  
  const httpServer = createServer(app);
  
  // WebSocket server for chat functionality
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws, req) => {
    const id = Date.now().toString();
    clients.set(id, ws);
    
    console.log(`WebSocket connected: ${id}`);
    
    ws.on('message', async (messageBuffer) => {
      try {
        const messageString = messageBuffer.toString();
        const message = JSON.parse(messageString);
        
        if (message.type === 'chat') {
          // Store the message in database
          const chatMessage = await storage.createChatMessage({
            content: message.content,
            userId: message.userId,
            username: message.username,
            userAvatar: message.userAvatar
          });
          
          // Broadcast to all connected clients
          const outboundMessage = JSON.stringify({
            type: 'chat',
            message: chatMessage
          });
          
          clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(outboundMessage);
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      clients.delete(id);
      console.log(`WebSocket disconnected: ${id}`);
    });
  });
  
  // User routes
  app.post('/api/users', async (req: Request, res: Response) => {
    try {
      const userData = validateBody(insertUserSchema, req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  app.get('/api/users/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  // Poem routes
  app.get('/api/poems', async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const poems = await storage.getPoems(limit);
      res.json(poems);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  app.get('/api/poems/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const poem = await storage.getPoemById(id);
      
      if (!poem) {
        return res.status(404).json({ message: 'Poem not found' });
      }
      
      res.json(poem);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  app.get('/api/poems/culture/:origin', async (req: Request, res: Response) => {
    try {
      const origin = req.params.origin;
      const poems = await storage.getPoemsByCulturalOrigin(origin);
      res.json(poems);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  app.post('/api/poems', async (req: Request, res: Response) => {
    try {
      const poemData = validateBody(insertPoemSchema, req.body);
      const poem = await storage.createPoem(poemData);
      res.status(201).json(poem);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  // Book routes
  app.get('/api/books', async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const category = req.query.category as string | undefined;
      const books = await storage.getBooks(limit, category);
      res.json(books);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  app.get('/api/books/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const book = await storage.getBookById(id);
      
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      
      res.json(book);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  app.get('/api/books/culture/:origin', async (req: Request, res: Response) => {
    try {
      const origin = req.params.origin;
      const books = await storage.getBooksByCulturalOrigin(origin);
      res.json(books);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  app.post('/api/books', async (req: Request, res: Response) => {
    try {
      const bookData = validateBody(insertBookSchema, req.body);
      const book = await storage.createBook(bookData);
      res.status(201).json(book);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  // Discussion routes
  app.get('/api/discussions', async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const discussions = await storage.getDiscussions(limit);
      res.json(discussions);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  app.get('/api/discussions/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const discussion = await storage.getDiscussionById(id);
      
      if (!discussion) {
        return res.status(404).json({ message: 'Discussion not found' });
      }
      
      // Increment view count
      await storage.updateDiscussionStats(id, undefined, discussion.views + 1);
      
      res.json({
        ...discussion,
        views: discussion.views + 1
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  app.post('/api/discussions', async (req: Request, res: Response) => {
    try {
      const discussionData = validateBody(insertDiscussionSchema, req.body);
      const discussion = await storage.createDiscussion(discussionData);
      res.status(201).json(discussion);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  // Chat message routes
  app.get('/api/chat-messages', async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const messages = await storage.getChatMessages(limit);
      res.json(messages);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  app.post('/api/chat-messages', async (req: Request, res: Response) => {
    try {
      const messageData = validateBody(insertChatMessageSchema, req.body);
      const message = await storage.createChatMessage(messageData);
      
      // Broadcast to WebSocket clients
      const outboundMessage = JSON.stringify({
        type: 'chat',
        message
      });
      
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(outboundMessage);
        }
      });
      
      res.status(201).json(message);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  // Event routes
  app.get('/api/events', async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const events = await storage.getEvents(limit);
      res.json(events);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  app.get('/api/events/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEventById(id);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      res.json(event);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  app.post('/api/events', async (req: Request, res: Response) => {
    try {
      const eventData = validateBody(insertEventSchema, req.body);
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  app.post('/api/events/:id/attend', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEventById(id);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      await storage.updateEventAttendees(id, event.attendees + 1);
      
      res.json({
        success: true,
        attendees: event.attendees + 1
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  // Cultural category routes
  app.get('/api/cultural-categories', async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCulturalCategories();
      res.json(categories);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  app.post('/api/cultural-categories', async (req: Request, res: Response) => {
    try {
      const categoryData = validateBody(insertCulturalCategorySchema, req.body);
      const category = await storage.createCulturalCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  // Academic resource routes
  app.get('/api/academic-resources', async (req: Request, res: Response) => {
    try {
      const type = req.query.type as string | undefined;
      const resources = await storage.getAcademicResources(type);
      res.json(resources);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  app.post('/api/academic-resources', async (req: Request, res: Response) => {
    try {
      const resourceData = validateBody(insertAcademicResourceSchema, req.body);
      const resource = await storage.createAcademicResource(resourceData);
      res.status(201).json(resource);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  // Reading progress routes
  app.get('/api/reading-progress/:userId/:bookId', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const bookId = parseInt(req.params.bookId);
      const progress = await storage.getReadingProgress(userId, bookId);
      
      if (!progress) {
        return res.status(404).json({ message: 'Reading progress not found' });
      }
      
      res.json(progress);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  app.post('/api/reading-progress', async (req: Request, res: Response) => {
    try {
      const progressData = validateBody(insertReadingProgressSchema, req.body);
      const progress = await storage.createOrUpdateReadingProgress(progressData);
      res.status(201).json(progress);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  // Comment routes
  app.get('/api/comments/poem/:poemId', async (req: Request, res: Response) => {
    try {
      const poemId = parseInt(req.params.poemId);
      const comments = await storage.getCommentsByPoemId(poemId);
      res.json(comments);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  app.get('/api/comments/book/:bookId', async (req: Request, res: Response) => {
    try {
      const bookId = parseInt(req.params.bookId);
      const comments = await storage.getCommentsByBookId(bookId);
      res.json(comments);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  app.get('/api/comments/discussion/:discussionId', async (req: Request, res: Response) => {
    try {
      const discussionId = parseInt(req.params.discussionId);
      const comments = await storage.getCommentsByDiscussionId(discussionId);
      res.json(comments);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  app.post('/api/comments', async (req: Request, res: Response) => {
    try {
      const commentData = validateBody(insertCommentSchema, req.body);
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  // Rating routes
  app.post('/api/ratings', async (req: Request, res: Response) => {
    try {
      const ratingData = validateBody(insertRatingSchema, req.body);
      const rating = await storage.createOrUpdateRating(ratingData);
      res.status(201).json(rating);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });

  // ==== PROTECTED ROUTES FOR AUTHENTICATED MEMBERS ONLY ====
  // These routes are only accessible to users who are logged in
  
  // Authentication Middleware for Protected Routes
  const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    next();
  };
  
  // Create new book (members only)
  app.post('/api/create/book', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = req.user as Express.User;
      const bookData = validateBody(insertBookSchema, {
        ...req.body,
        authorId: user.id,
        authorName: user.displayName || user.username
      });
      
      const book = await storage.createBook(bookData);
      res.status(201).json(book);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  // Create new poem (members only)
  app.post('/api/create/poem', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = req.user as Express.User;
      const poemData = validateBody(insertPoemSchema, {
        ...req.body,
        authorId: user.id,
        authorName: user.displayName || user.username
      });
      
      const poem = await storage.createPoem(poemData);
      res.status(201).json(poem);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  // Create new event (members only)
  app.post('/api/create/event', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = req.user as Express.User;
      // Add organizer information from authenticated user
      const eventData = validateBody(insertEventSchema, {
        ...req.body,
        organizerId: user.id,
        organizerName: user.displayName || user.username
      });
      
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  // Create new discussion (members only)
  app.post('/api/create/discussion', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = req.user as Express.User;
      // Add author information from authenticated user
      const discussionData = validateBody(insertDiscussionSchema, {
        ...req.body,
        authorId: user.id,
        authorName: user.displayName || user.username,
        authorAvatar: user.avatar
      });
      
      const discussion = await storage.createDiscussion(discussionData);
      res.status(201).json(discussion);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  // Create new cultural category (members only)
  app.post('/api/create/cultural-category', authMiddleware, async (req: Request, res: Response) => {
    try {
      const categoryData = validateBody(insertCulturalCategorySchema, req.body);
      const category = await storage.createCulturalCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });
  
  // Create new academic resource (members only)
  app.post('/api/create/academic-resource', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = req.user as Express.User;
      // Add author information
      const resourceData = validateBody(insertAcademicResourceSchema, {
        ...req.body,
        authorId: user.id,
        authorName: user.displayName || user.username
      });
      
      const resource = await storage.createAcademicResource(resourceData);
      res.status(201).json(resource);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message });
    }
  });

  return httpServer;
}
