import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { setupWebSocketServer } from "./socketService";
import { z } from "zod";
import { 
  insertPoemSchema, 
  insertBookSchema, 
  insertEventSchema,
  insertChatRoomSchema,
  insertChatMessageSchema,
  insertAcademicResourceSchema 
} from "@shared/schema";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  const httpServer = createServer(app);
  
  // Set up WebSocket server for chat
  setupWebSocketServer(httpServer);
  
  // Check if user is authenticated middleware
  const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ message: "You must be logged in to perform this action" });
  };
  
  // Check if user is an admin middleware
  const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
      return next();
    }
    return res.status(403).json({ message: "You don't have permission to perform this action" });
  };

  // Poetry routes
  app.get("/api/poems", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const poems = await storage.getPoems(limit);
      
      // Get author details for each poem
      const poemsWithAuthors = await Promise.all(poems.map(async (poem) => {
        const author = await storage.getUser(poem.authorId);
        return {
          ...poem,
          author: author ? { 
            id: author.id, 
            username: author.username 
          } : null
        };
      }));
      
      res.json(poemsWithAuthors);
    } catch (error) {
      res.status(500).json({ message: "Error fetching poems" });
    }
  });
  
  app.get("/api/poems/user", isAuthenticated, async (req, res) => {
    try {
      const poems = await storage.getPoemsByAuthorId(req.user.id);
      
      if (!poems || poems.length === 0) {
        return res.status(404).json({ message: "Poem not found" });
      }
      
      // Get author details for each poem
      const poemsWithAuthors = await Promise.all(poems.map(async (poem) => {
        const author = await storage.getUser(poem.authorId);
        return {
          ...poem,
          author: author ? { 
            id: author.id, 
            username: author.username 
          } : null
        };
      }));
      
      res.json(poemsWithAuthors);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user poems" });
    }
  });

  app.get("/api/poems/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const poem = await storage.getPoemById(id);
      
      if (!poem) {
        return res.status(404).json({ message: "Poem not found" });
      }
      
      const author = await storage.getUser(poem.authorId);
      
      res.json({
        ...poem,
        author: author ? { 
          id: author.id, 
          username: author.username 
        } : null
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching poem" });
    }
  });
  
  app.post("/api/poems", isAuthenticated, async (req, res) => {
    try {
      const poemData = insertPoemSchema.parse(req.body);
      console.log("Creating poem with data:", poemData);
      console.log("User ID:", req.user.id);
      const poem = await storage.createPoem(poemData, req.user.id);
      
      res.status(201).json(poem);
    } catch (error) {
      console.error("Error creating poem:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid poem data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating poem" });
    }
  });
  
  app.post("/api/poems/:id/approve", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const poem = await storage.approvePoem(id);
      
      if (!poem) {
        return res.status(404).json({ message: "Poem not found" });
      }
      
      res.json(poem);
    } catch (error) {
      res.status(500).json({ message: "Error approving poem" });
    }
  });
  
  app.post("/api/poems/:id/rate", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const rating = parseInt(req.body.rating);
      
      if (isNaN(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }
      
      await storage.ratePoem(id, req.user.id, rating);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: "Error rating poem" });
    }
  });
  
  app.post("/api/poems/:id/like", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.likePoem(id, req.user.id);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: "Error liking poem" });
    }
  });
  
  app.post("/api/poems/:id/unlike", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.unlikePoem(id, req.user.id);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: "Error unliking poem" });
    }
  });
  
  // Book routes
  app.get("/api/books", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const books = await storage.getBooks(limit);
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: "Error fetching books" });
    }
  });
  
  app.get("/api/books/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const book = await storage.getBookById(id);
      
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: "Error fetching book" });
    }
  });
  
  app.post("/api/books", isAuthenticated, async (req, res) => {
    try {
      const bookData = insertBookSchema.parse(req.body);
      const book = await storage.createBook(bookData, req.user.id);
      
      res.status(201).json(book);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid book data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating book" });
    }
  });
  
  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const events = await storage.getEvents(limit);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Error fetching events" });
    }
  });
  
  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEventById(id);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Error fetching event" });
    }
  });
  
  // app.post("/api/events", isAuthenticated, async (req, res) => {
  //   try {
  //     const requestData = { ...req.body };
  //     if (requestData.date && typeof requestData.date === 'string') {
  //       requestData.date = new Date(requestData.date);
  //     }
      
  //     const eventData = insertEventSchema.parse(req.body);
  //     const event = await storage.createEvent(eventData);
      
  //     res.status(201).json(event);
  //   } catch (error) {
  //     console.error("Event creation error:", error);
  //     if (error instanceof z.ZodError) {
  //       return res.status(400).json({ message: "Invalid event data", errors: error.errors });
  //     }
  //     res.status(500).json({ message: "Error creating event" });
  //   }
  // });

  app.post("/api/events", isAuthenticated, async (req, res) => {
    // Clone and sanitize request body
    const requestData = { ...req.body };
  
    // Convert string date to Date object if needed
    if (requestData.date && typeof requestData.date === 'string') {
      requestData.date = new Date(requestData.date);
    }
  
    // Validate input using Zod
    const result = insertEventSchema.safeParse(requestData);
  
    if (!result.success) {
      console.error("Validation failed:", result.error.flatten());
      return res.status(400).json({
        message: "Invalid event data",
        errors: result.error.errors,
      });
    }
  
    try {
      // Insert validated event into storage
      const event = await storage.createEvent(result.data);
      res.status(201).json(event);
    } catch (error) {
      console.error("Event creation error:", error);
      res.status(500).json({ message: "Error creating event" });
    }
  });

  
  // Chat room routes
  app.get("/api/chat/rooms", async (req, res) => {
    try {
      const rooms = await storage.getChatRooms();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: "Error fetching chat rooms" });
    }
  });
  
  app.get("/api/chat/rooms/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const room = await storage.getChatRoomById(id);
      
      if (!room) {
        return res.status(404).json({ message: "Chat room not found" });
      }
      
      res.json(room);
    } catch (error) {
      res.status(500).json({ message: "Error fetching chat room" });
    }
  });
  
  app.post("/api/chat/rooms", isAuthenticated, async (req, res) => {
    try {
      const roomData = insertChatRoomSchema.parse(req.body);
      const room = await storage.createChatRoom(roomData, req.user.id);
      
      res.status(201).json(room);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid chat room data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating chat room" });
    }
  });
  
  app.get("/api/chat/rooms/:id/messages", isAuthenticated, async (req, res) => {
    try {
      const roomId = parseInt(req.params.id);
      const messages = await storage.getChatMessagesByRoomId(roomId);
      
      // Get user details for each message
      const messagesWithUsers = await Promise.all(messages.map(async (message) => {
        const user = await storage.getUser(message.userId);
        return {
          ...message,
          user: user ? { 
            id: user.id, 
            username: user.username 
          } : null
        };
      }));
      
      res.json(messagesWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching chat messages" });
    }
  });
  
  // Academic resources routes
  app.get("/api/academic-resources", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const resources = await storage.getAcademicResources(limit);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Error fetching academic resources" });
    }
  });
  
  app.get("/api/academic-resources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const resource = await storage.getAcademicResourceById(id);
      
      if (!resource) {
        return res.status(404).json({ message: "Academic resource not found" });
      }
      
      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: "Error fetching academic resource" });
    }
  });
  
  app.post("/api/academic-resources", isAdmin, async (req, res) => {
    try {
      const resourceData = insertAcademicResourceSchema.parse(req.body);
      const resource = await storage.createAcademicResource(resourceData);
      
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid academic resource data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating academic resource" });
    }
  });
  
  // Ticket routes
  app.post("/api/tickets/purchase", isAuthenticated, async (req, res) => {
    try {
      const { eventId } = req.body;
      
      if (!eventId) {
        return res.status(400).json({ message: "Event ID is required" });
      }
      
      const event = await storage.getEventById(parseInt(eventId));
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Basic ticket creation (in a real app, this would involve payment processing)
      const ticket = await storage.createTicket(parseInt(eventId), req.user.id);
      
      res.status(201).json(ticket);
    } catch (error) {
      res.status(500).json({ message: "Error purchasing ticket" });
    }
  });
  
  app.get("/api/tickets", isAuthenticated, async (req, res) => {
    try {
      const tickets = await storage.getTicketsByUserId(req.user.id);
      
      // Get event details for each ticket
      const ticketsWithEvents = await Promise.all(tickets.map(async (ticket) => {
        const event = await storage.getEventById(ticket.eventId);
        return {
          ...ticket,
          event
        };
      }));
      
      res.json(ticketsWithEvents);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tickets" });
    }
  });
  
  app.get("/api/tickets/user", isAuthenticated, async (req, res) => {
    try {
      const tickets = await storage.getTicketsByUserId(req.user.id);
      
      if (!tickets || tickets.length === 0) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      // Get event details for each ticket
      const ticketsWithEvents = await Promise.all(tickets.map(async (ticket) => {
        const event = await storage.getEventById(ticket.eventId);
        return {
          ...ticket,
          event
        };
      }));
      
      res.json(ticketsWithEvents);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user tickets" });
    }
  });
  
  app.get("/api/tickets/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ticket = await storage.getTicketById(id);
      
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      // Check if the ticket belongs to the user
      if (ticket.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "You don't have permission to view this ticket" });
      }
      
      const event = await storage.getEventById(ticket.eventId);
      
      res.json({
        ...ticket,
        event
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching ticket" });
    }
  });
  
  // Admin dashboard routes
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  app.patch("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { isAdmin: makeAdmin } = req.body;
      
      if (typeof makeAdmin !== 'boolean') {
        return res.status(400).json({ message: "Invalid request data" });
      }
      
      // Don't allow changing own admin status to prevent lockout
      if (userId === req.user.id && !makeAdmin) {
        return res.status(400).json({ message: "You cannot remove your own admin privileges" });
      }
      
      const updatedUser = await storage.updateUserAdminStatus(userId, makeAdmin);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user admin status:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  
  app.delete("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Don't allow deleting own account
      if (userId === req.user.id) {
        return res.status(400).json({ message: "You cannot delete your own account" });
      }
      
      const success = await storage.deleteUser(userId);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });
  
  app.get("/api/admin/pending/books", isAdmin, async (req, res) => {
    try {
      const pendingBooks = await storage.getPendingBooks();
      res.json(pendingBooks);
    } catch (error) {
      console.error("Error fetching pending books:", error);
      res.status(500).json({ message: "Failed to fetch pending books" });
    }
  });
  
  app.get("/api/admin/pending/poems", isAdmin, async (req, res) => {
    try {
      const pendingPoems = await storage.getPendingPoems();
      res.json(pendingPoems);
    } catch (error) {
      console.error("Error fetching pending poems:", error);
      res.status(500).json({ message: "Failed to fetch pending poems" });
    }
  });
  
  app.patch("/api/admin/books/:id/approve", isAdmin, async (req, res) => {
    try {
      const bookId = parseInt(req.params.id);
      const book = await storage.approveBook(bookId);
      
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      res.json(book);
    } catch (error) {
      console.error("Error approving book:", error);
      res.status(500).json({ message: "Failed to approve book" });
    }
  });
  
  app.delete("/api/admin/books/:id", isAdmin, async (req, res) => {
    try {
      const bookId = parseInt(req.params.id);
      const success = await storage.deleteBook(bookId);
      
      if (!success) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      res.json({ message: "Book deleted successfully" });
    } catch (error) {
      console.error("Error deleting book:", error);
      res.status(500).json({ message: "Failed to delete book" });
    }
  });
  
  app.delete("/api/admin/poems/:id", isAdmin, async (req, res) => {
    try {
      const poemId = parseInt(req.params.id);
      const success = await storage.deletePoem(poemId);
      
      if (!success) {
        return res.status(404).json({ message: "Poem not found" });
      }
      
      res.json({ message: "Poem deleted successfully" });
    } catch (error) {
      console.error("Error deleting poem:", error);
      res.status(500).json({ message: "Failed to delete poem" });
    }
  });

  return httpServer;
}
