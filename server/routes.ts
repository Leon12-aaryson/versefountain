import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { setupWebSocketServer } from "./socketService";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { 
  insertPoemSchema, 
  insertBookSchema, 
  insertEventSchema,
  insertChatRoomSchema,
  insertChatMessageSchema,
  insertAcademicResourceSchema,
  insertPaymentSchema,
  insertTicketSchema
} from "@shared/schema";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  const httpServer = createServer(app);
  
  // Setup upload directory for file uploads
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  // Configure multer for file uploads
  const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Determine destination folder based on file type
      let destFolder = 'bookcovers';
      const dest = path.join(uploadDir, destFolder);
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      cb(null, dest);
    },
    filename: function (req, file, cb) {
      // Generate a unique filename with original extension
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    }
  });
  
  const upload = multer({ 
    storage: multerStorage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
    fileFilter: function(req, file, cb) {
      // Accept only image files
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        console.error('Only image files are allowed!');
        return cb(null, false);
      }
      cb(null, true);
    }
  });
  
  // Serve static files from the public directory
  app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));
  
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
      console.error("Error fetching poems:", error);
      res.status(500).json({ message: "Error fetching poems" });
    }
  });
  
  app.get("/api/poems/user", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
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
      console.error("Error fetching user poems:", error);
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
      console.error("Error fetching poem:", error);
      res.status(500).json({ message: "Error fetching poem" });
    }
  });
  
  app.post("/api/poems", isAuthenticated, async (req, res) => {
    try {
      const poemData = insertPoemSchema.parse(req.body);
      console.log("Creating poem with data:", poemData);
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
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
      console.error("Error approving poem:", error);
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
      
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      await storage.ratePoem(id, req.user.id, rating);
      res.sendStatus(200);
    } catch (error) {
      console.error("Error rating poem:", error);
      res.status(500).json({ message: "Error rating poem" });
    }
  });
  
  app.post("/api/poems/:id/like", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      await storage.likePoem(id, req.user.id);
      
      // Get updated like count
      const likeCount = await storage.getPoemLikeCount(id);
      
      res.status(200).json({ 
        message: "Poem liked successfully",
        likeCount
      });
    } catch (error) {
      console.error("Error liking poem:", error);
      res.status(500).json({ message: "Error liking poem" });
    }
  });
  
  app.post("/api/poems/:id/unlike", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      await storage.unlikePoem(id, req.user.id);
      
      // Get updated like count
      const likeCount = await storage.getPoemLikeCount(id);
      
      res.status(200).json({ 
        message: "Poem unliked successfully",
        likeCount
      });
    } catch (error) {
      console.error("Error unliking poem:", error);
      res.status(500).json({ message: "Error unliking poem" });
    }
  });
  
  // Get like count for a poem
  app.get("/api/poems/:id/like-count", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const likeCount = await storage.getPoemLikeCount(id);
      res.status(200).json({ likeCount });
    } catch (error) {
      console.error("Error getting like count:", error);
      res.status(500).json({ message: "Error getting like count" });
    }
  });
  
  // Get user status for a poem (like status and rating)
  app.get("/api/poems/:id/user-status", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const status = await storage.getUserPoemStatus(id, req.user.id);
      res.json(status);
    } catch (error) {
      console.error("Error getting user poem status:", error);
      res.status(500).json({ message: "Error getting user poem status" });
    }
  });
  
  // Poem comments routes
  app.get("/api/poems/:id/comments", async (req, res) => {
    try {
      const poemId = parseInt(req.params.id, 10);
      const comments = await storage.getPoemComments(poemId);
      
      // Get user details for each comment
      const commentsWithUsers = await Promise.all(comments.map(async (comment) => {
        const user = await storage.getUser(comment.userId);
        return {
          ...comment,
          user: user ? { 
            id: user.id, 
            username: user.username 
          } : null
        };
      }));
      
      res.json(commentsWithUsers);
    } catch (error) {
      console.error("Error fetching poem comments:", error);
      res.status(500).json({ message: "Error fetching poem comments" });
    }
  });
  
  app.post("/api/poems/:id/comments", isAuthenticated, async (req, res) => {
    try {
      const poemId = parseInt(req.params.id, 10);
      const userId = req.user!.id;
      
      // Check if the poem exists
      const poem = await storage.getPoemById(poemId);
      if (!poem) {
        return res.status(404).json({ message: "Poem not found" });
      }
      
      const comment = {
        poemId,
        content: req.body.content
      };
      
      const newComment = await storage.createPoemComment(comment, userId);
      
      // Get commenter details
      const user = await storage.getUser(userId);
      const commentWithUser = {
        ...newComment,
        user: { 
          id: user!.id, 
          username: user!.username 
        }
      };
      
      res.status(201).json(commentWithUser);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Error creating comment" });
    }
  });
  
  app.delete("/api/poems/comments/:id", isAuthenticated, async (req, res) => {
    try {
      const commentId = parseInt(req.params.id, 10);
      
      // Here we would ideally check if the user is either the comment creator or an admin
      // but for simplicity in this implementation we'll allow any authenticated user to delete comments
      
      const success = await storage.deletePoemComment(commentId);
      
      if (success) {
        res.status(200).json({ message: "Comment deleted successfully" });
      } else {
        res.status(404).json({ message: "Comment not found" });
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Error deleting comment" });
    }
  });
  
  // Comment reactions routes
  // Get reactions for a comment
  app.get("/api/comments/:id/reactions", async (req, res) => {
    try {
      const commentId = parseInt(req.params.id, 10);
      const reactions = await storage.getCommentReactions(commentId);
      
      res.json(reactions);
    } catch (error) {
      console.error("Error getting comment reactions:", error);
      res.status(500).json({ message: "Error getting comment reactions" });
    }
  });
  
  // Get reaction counts for a comment
  app.get("/api/comments/:id/reaction-counts", async (req, res) => {
    try {
      const commentId = parseInt(req.params.id, 10);
      const counts = await storage.getCommentReactionCounts(commentId);
      
      res.json(counts);
    } catch (error) {
      console.error("Error getting comment reaction counts:", error);
      res.status(500).json({ message: "Error getting comment reaction counts" });
    }
  });
  
  // Get all reaction data for multiple comments at once
  app.get("/api/comments/reactions", async (req, res) => {
    try {
      const commentIdsStr = req.query.commentIds as string;
      if (!commentIdsStr) {
        return res.status(400).json({ message: "Comment IDs are required" });
      }
      
      const commentIds = commentIdsStr.split(',').map(id => parseInt(id));
      const userId = req.isAuthenticated() ? req.user!.id : null;
      
      const result: Record<number, { counts: Record<string, number>, userReaction: string | null }> = {};
      
      // Gather data for each comment
      for (const commentId of commentIds) {
        const counts = await storage.getCommentReactionCounts(commentId);
        let userReaction = null;
        
        if (userId) {
          try {
            const reaction = await storage.getUserCommentReaction(commentId, userId);
            userReaction = reaction ? reaction.reaction : null;
          } catch (err) {
            // Ignore errors fetching user reaction
            console.log(`No reaction found for comment ${commentId}, user ${userId}`);
          }
        }
        
        result[commentId] = {
          counts,
          userReaction
        };
      }
      
      return res.json(result);
    } catch (error) {
      console.error("Error fetching reactions data:", error);
      return res.status(500).json({ message: "Failed to fetch reactions data" });
    }
  });
  
  // Get user's reaction to a comment
  app.get("/api/comments/:id/user-reaction", isAuthenticated, async (req, res) => {
    try {
      const commentId = parseInt(req.params.id, 10);
      const userId = req.user!.id;
      
      const reaction = await storage.getUserCommentReaction(commentId, userId);
      
      if (reaction) {
        res.json(reaction);
      } else {
        res.status(404).json({ message: "No reaction found" });
      }
    } catch (error) {
      console.error("Error getting user comment reaction:", error);
      res.status(500).json({ message: "Error getting user comment reaction" });
    }
  });
  
  // Add/update a reaction to a comment
  app.post("/api/comments/:id/reactions", isAuthenticated, async (req, res) => {
    try {
      const commentId = parseInt(req.params.id, 10);
      const userId = req.user!.id;
      const { reaction } = req.body;
      
      if (!reaction || typeof reaction !== 'string') {
        return res.status(400).json({ message: "Valid reaction type is required" });
      }
      
      // Check if the comment exists
      const commentExists = (await storage.getPoemComments(0)).some(c => c.id === commentId);
      if (!commentExists) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      const newReaction = await storage.addCommentReaction(commentId, userId, reaction);
      
      // Get updated counts
      const counts = await storage.getCommentReactionCounts(commentId);
      
      res.status(201).json({
        reaction: newReaction,
        counts
      });
    } catch (error) {
      console.error("Error adding comment reaction:", error);
      res.status(500).json({ message: "Error adding comment reaction" });
    }
  });
  
  // Remove a reaction from a comment
  app.delete("/api/comments/:id/reactions", isAuthenticated, async (req, res) => {
    try {
      const commentId = parseInt(req.params.id, 10);
      const userId = req.user!.id;
      
      const success = await storage.removeCommentReaction(commentId, userId);
      
      if (success) {
        // Get updated counts
        const counts = await storage.getCommentReactionCounts(commentId);
        
        res.json({
          message: "Reaction removed successfully",
          counts
        });
      } else {
        res.status(404).json({ message: "No reaction found" });
      }
    } catch (error) {
      console.error("Error removing comment reaction:", error);
      res.status(500).json({ message: "Error removing comment reaction" });
    }
  });
  
  // Update poem (for editing by creator)
  app.patch("/api/poems/:id", isAuthenticated, async (req, res) => {
    try {
      const poemId = parseInt(req.params.id);
      
      // Get the poem first to check ownership
      const poem = await storage.getPoemById(poemId);
      
      if (!poem) {
        return res.status(404).json({ message: "Poem not found" });
      }
      
      // Check if user owns the poem or is an admin
      if (poem.authorId !== req.user?.id && !req.user?.isAdmin) {
        return res.status(403).json({ message: "You don't have permission to edit this poem" });
      }
      
      // Validate input data (only allow title and content to be updated)
      const { title, content, isVideo, videoUrl } = req.body;
      
      if (!title && !content && isVideo === undefined && !videoUrl) {
        return res.status(400).json({ message: "No valid fields to update" });
      }
      
      // Create update object with only provided fields
      const updateData: any = {};
      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (isVideo !== undefined) updateData.isVideo = isVideo;
      if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
      
      // Add update poem functionality to storage.ts
      const updatedPoem = await storage.updatePoem(poemId, updateData);
      
      res.json(updatedPoem);
    } catch (error) {
      console.error("Error updating poem:", error);
      res.status(500).json({ message: "Error updating poem" });
    }
  });
  
  // Delete poem (for creator)
  app.delete("/api/poems/:id", isAuthenticated, async (req, res) => {
    try {
      const poemId = parseInt(req.params.id);
      
      // Get the poem first to check ownership
      const poem = await storage.getPoemById(poemId);
      
      if (!poem) {
        return res.status(404).json({ message: "Poem not found" });
      }
      
      // Check if user owns the poem or is an admin
      if (poem.authorId !== req.user?.id && !req.user?.isAdmin) {
        return res.status(403).json({ message: "You don't have permission to delete this poem" });
      }
      
      // Delete the poem
      const success = await storage.deletePoem(poemId);
      
      if (success) {
        res.status(200).json({ message: "Poem deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete poem" });
      }
    } catch (error) {
      console.error("Error deleting poem:", error);
      res.status(500).json({ message: "Error deleting poem" });
    }
  });
  
  // Book routes
  app.get("/api/books", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const books = await storage.getBooks(limit);
      res.json(books);
    } catch (error) {
      console.error("Error fetching books:", error);
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
      console.error("Error fetching book:", error);
      res.status(500).json({ message: "Error fetching book" });
    }
  });
  
  // Add file upload route for book covers
  app.post("/api/upload/bookcover", isAuthenticated, upload.single('coverImage'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // Return the file path to be used in the book creation
      const filePath = `/uploads/bookcovers/${req.file.filename}`;
      res.status(200).json({ 
        success: true, 
        filePath: filePath,
        message: "File uploaded successfully" 
      });
    } catch (error) {
      console.error("Error uploading book cover:", error);
      res.status(500).json({ message: "Error uploading file" });
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
      console.error("Error creating book:", error);
      res.status(500).json({ message: "Error creating book" });
    }
  });
  
  // Event routes
  
  app.get("/api/events", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const category = req.query.category as string | undefined;
      const events = await storage.getEvents(limit, category);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Error fetching events" });
    }
  });
  
  // Dedicated endpoint for upcoming poetry events - IMPORTANT: This route must be defined BEFORE the /api/events/:id route
  app.get("/api/events/poetry", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      // Case insensitive for flexibility
      const poetryEvents = await storage.getEvents(limit, "poetry");
      
      // Filter for upcoming events only (events happening today or in the future)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcomingPoetryEvents = poetryEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today;
      });
      
      // Sort by date (nearest first)
      upcomingPoetryEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      res.json(upcomingPoetryEvents);
    } catch (error) {
      console.error("Error getting poetry events:", error);
      res.status(500).json({ message: "Error fetching poetry events" });
    }
  });
  
  // Featured poets endpoint
  app.get("/api/poets/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const featuredPoets = await storage.getFeaturedPoets(limit);
      res.json(featuredPoets);
    } catch (error) {
      console.error("Error fetching featured poets:", error);
      res.status(500).json({ message: "Error fetching featured poets" });
    }
  });
  
  // Individual event endpoint - IMPORTANT: This route must be defined AFTER any specific /api/events/... routes
  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEventById(id);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Error fetching event" });
    }
  });
  
  app.post("/api/events", isAuthenticated, async (req, res) => {
    try {
      // Convert the string date to a Date object before validation
      const requestData = { ...req.body };
      if (requestData.date && typeof requestData.date === 'string') {
        requestData.date = new Date(requestData.date);
      }
      
      const eventData = insertEventSchema.parse(requestData);
      
      // Make sure createdById is set to the authenticated user's ID
      eventData.createdById = req.user.id;
      
      const event = await storage.createEvent(eventData);
      
      res.status(201).json(event);
    } catch (error) {
      console.error("Event creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating event" });
    }
  });
  
  // Add route for updating events
  app.put("/api/events/:id", isAuthenticated, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      // Get the existing event
      const existingEvent = await storage.getEventById(eventId);
      
      if (!existingEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Check if the user is the creator of the event or an admin
      if (existingEvent.createdById !== req.user?.id && !req.user?.isAdmin) {
        return res.status(403).json({ message: "You don't have permission to edit this event" });
      }
      
      // Convert date if needed
      const requestData = { ...req.body };
      if (requestData.date && typeof requestData.date === 'string') {
        requestData.date = new Date(requestData.date);
      }
      
      const eventData = insertEventSchema.parse(requestData);
      
      // Preserve the original creator ID
      eventData.createdById = existingEvent.createdById;
      
      // Update the event
      const updatedEvent = await storage.updateEvent(eventId, eventData);
      
      res.json(updatedEvent);
    } catch (error) {
      console.error("Event update error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating event" });
    }
  });
  
  // Chat room routes
  app.get("/api/chat/rooms", async (req, res) => {
    try {
      const rooms = await storage.getChatRooms();
      res.json(rooms);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
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
      console.error("Error fetching chat room:", error);
      res.status(500).json({ message: "Error fetching chat room" });
    }
  });
  
  app.post("/api/chat/rooms", isAuthenticated, async (req, res) => {
    try {
      const roomData = insertChatRoomSchema.parse(req.body);
      console.log("Creating chat room with data:", roomData);
      console.log("User ID:", req.user.id);
      
      const room = await storage.createChatRoom(roomData, req.user.id);
      console.log("Chat room created successfully:", room);
      
      res.status(201).json(room);
    } catch (error) {
      console.error("Error creating chat room:", error);
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
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Error fetching chat messages" });
    }
  });
  
  app.post("/api/chat/rooms/:id/messages", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const roomId = parseInt(req.params.id);
      const message = req.body;
      
      // Check if user is in the room before allowing them to post
      const isMember = await storage.isUserInChatRoom(req.user.id, roomId);
      if (!isMember) {
        return res.status(403).json({ message: "You must join this chat room to send messages" });
      }
      
      const chatMessage = await storage.createChatMessage({
        ...message,
        roomId
      }, req.user.id);
      
      res.status(201).json(chatMessage);
    } catch (error) {
      console.error('Error creating chat message:', error);
      res.status(500).json({ message: "Error creating chat message" });
    }
  });
  
  // User-specific chat room routes
  app.get("/api/user/chat/rooms", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const userRooms = await storage.getUserChatRooms(req.user.id);
      res.json(userRooms);
    } catch (error) {
      console.error('Error fetching user chat rooms:', error);
      res.status(500).json({ message: "Error fetching user chat rooms" });
    }
  });
  
  app.post("/api/chat/rooms/:id/join", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const roomId = parseInt(req.params.id);
      const success = await storage.joinChatRoom(req.user.id, roomId);
      
      if (success) {
        // Get the updated room info
        const room = await storage.getChatRoomById(roomId);
        res.json({ success: true, message: "Joined chat room successfully", room });
      } else {
        res.status(400).json({ success: false, message: "Failed to join chat room" });
      }
    } catch (error) {
      console.error('Error joining chat room:', error);
      res.status(500).json({ message: "Error joining chat room" });
    }
  });
  
  app.post("/api/chat/rooms/:id/leave", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const roomId = parseInt(req.params.id);
      const success = await storage.leaveChatRoom(req.user.id, roomId);
      
      if (success) {
        res.json({ success: true, message: "Left chat room successfully" });
      } else {
        res.status(400).json({ success: false, message: "Failed to leave chat room" });
      }
    } catch (error) {
      console.error('Error leaving chat room:', error);
      res.status(500).json({ message: "Error leaving chat room" });
    }
  });
  
  app.get("/api/chat/rooms/:id/membership", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const roomId = parseInt(req.params.id);
      const isMember = await storage.isUserInChatRoom(req.user.id, roomId);
      
      res.json({ isMember });
    } catch (error) {
      console.error('Error checking chat room membership:', error);
      res.status(500).json({ message: "Error checking chat room membership" });
    }
  });
  
  // Academic resources routes
  app.get("/api/academic-resources", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const resources = await storage.getAcademicResources(limit);
      res.json(resources);
    } catch (error) {
      console.error("Error fetching academic resources:", error);
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
  
  // Featured poets endpoint
  app.get("/api/poets/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const featuredPoets = await storage.getFeaturedPoets(limit);
      res.json(featuredPoets);
    } catch (error) {
      console.error("Error fetching featured poets:", error);
      res.status(500).json({ message: "Error fetching featured poets" });
    }
  });
  
  // Poet following endpoints
  app.post("/api/poets/:id/follow", isAuthenticated, async (req, res) => {
    try {
      const poetId = parseInt(req.params.id);
      const followerId = req.user.id;
      
      // Don't allow users to follow themselves
      if (poetId === followerId) {
        return res.status(400).json({ message: "You cannot follow yourself" });
      }
      
      // Check if the poet exists
      const poet = await storage.getUser(poetId);
      if (!poet) {
        return res.status(404).json({ message: "Poet not found" });
      }
      
      const follow = await storage.followPoet(followerId, poetId);
      res.status(201).json({ 
        message: "Successfully followed poet",
        followData: follow
      });
    } catch (error) {
      console.error("Error following poet:", error);
      res.status(500).json({ message: "Error following poet" });
    }
  });
  
  app.post("/api/poets/:id/unfollow", isAuthenticated, async (req, res) => {
    try {
      const poetId = parseInt(req.params.id);
      const followerId = req.user.id;
      
      // Check if the poet exists
      const poet = await storage.getUser(poetId);
      if (!poet) {
        return res.status(404).json({ message: "Poet not found" });
      }
      
      const success = await storage.unfollowPoet(followerId, poetId);
      
      if (success) {
        res.json({ message: "Successfully unfollowed poet" });
      } else {
        res.status(400).json({ message: "You are not following this poet" });
      }
    } catch (error) {
      console.error("Error unfollowing poet:", error);
      res.status(500).json({ message: "Error unfollowing poet" });
    }
  });
  
  app.get("/api/poets/:id/followers", async (req, res) => {
    try {
      const poetId = parseInt(req.params.id);
      
      // Check if the poet exists
      const poet = await storage.getUser(poetId);
      if (!poet) {
        return res.status(404).json({ message: "Poet not found" });
      }
      
      const followers = await storage.getPoetFollowers(poetId);
      const followerCount = await storage.getFollowerCount(poetId);
      
      res.json({ 
        followers,
        count: followerCount 
      });
    } catch (error) {
      console.error("Error getting poet followers:", error);
      res.status(500).json({ message: "Error getting poet followers" });
    }
  });
  
  app.get("/api/user/followed-poets", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const followedPoets = await storage.getFollowedPoets(userId);
      
      res.json(followedPoets);
    } catch (error) {
      console.error("Error getting followed poets:", error);
      res.status(500).json({ message: "Error getting followed poets" });
    }
  });
  
  app.get("/api/poets/:id/following-status", isAuthenticated, async (req, res) => {
    try {
      const poetId = parseInt(req.params.id);
      const userId = req.user.id;
      
      const isFollowing = await storage.isFollowingPoet(userId, poetId);
      
      res.json({ isFollowing });
    } catch (error) {
      console.error("Error checking following status:", error);
      res.status(500).json({ message: "Error checking following status" });
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
      const ticket = await storage.createTicket(parseInt(eventId), req.user?.id);
      
      res.status(201).json(ticket);
    } catch (error) {
      console.error("Error purchasing ticket:", error);
      res.status(500).json({ message: "Error purchasing ticket" });
    }
  });
  
  // Add route for free event registration
  app.post("/api/tickets", isAuthenticated, async (req, res) => {
    try {
      const { eventId, userId } = req.body;
      
      if (!eventId) {
        return res.status(400).json({ message: "Event ID is required" });
      }
      
      // Validate that the event exists and is free
      const event = await storage.getEventById(parseInt(eventId));
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // For security, always use the authenticated user's ID
      const ticket = await storage.createTicket(parseInt(eventId), req.user?.id);
      
      res.status(201).json(ticket);
    } catch (error) {
      console.error("Error creating ticket for free event:", error);
      res.status(500).json({ message: "Error registering for event" });
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
      console.error("Error fetching tickets:", error);
      res.status(500).json({ message: "Error fetching tickets" });
    }
  });
  
  app.get("/api/tickets/user", isAuthenticated, async (req, res) => {
    try {
      const tickets = await storage.getTicketsByUserId(req.user.id);
      
      // Always return an array (empty if no tickets)
      if (!tickets || tickets.length === 0) {
        return res.json([]);
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
      console.error("Error fetching user tickets:", error);
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
      if (ticket.userId !== req.user?.id && !req.user?.isAdmin) {
        return res.status(403).json({ message: "You don't have permission to view this ticket" });
      }
      
      const event = await storage.getEventById(ticket.eventId);
      
      res.json({
        ...ticket,
        event
      });
    } catch (error) {
      console.error("Error fetching ticket:", error);
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
  
  app.delete("/api/poems/:id", isAuthenticated, async (req, res) => {
    try {
      const poemId = parseInt(req.params.id);
      
      // Get the poem first to check ownership
      const poem = await storage.getPoemById(poemId);
      
      if (!poem) {
        return res.status(404).json({ message: "Poem not found" });
      }
      
      // Check if user owns the poem or is an admin
      if (poem.authorId !== req.user?.id && !req.user?.isAdmin) {
        return res.status(403).json({ message: "You don't have permission to delete this poem" });
      }
      
      const success = await storage.deletePoem(poemId);
      
      if (!success) {
        return res.status(500).json({ message: "Failed to delete poem" });
      }
      
      res.json({ message: "Poem deleted successfully" });
    } catch (error) {
      console.error("Error deleting poem:", error);
      res.status(500).json({ message: "Error deleting poem" });
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

  // Payment and ticket routes
  app.post("/api/payments", isAuthenticated, async (req, res) => {
    try {
      const paymentData = insertPaymentSchema.parse(req.body);
      
      // Verify the event exists and its price matches
      const event = await storage.getEventById(paymentData.eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Ensure user is authorized
      if (paymentData.userId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      // Create the payment entry
      const payment = await storage.createPayment({
        ...paymentData,
        status: 'pending'
      });
      
      res.status(201).json(payment);
    } catch (error) {
      console.error("Error creating payment:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid payment data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating payment" });
    }
  });
  
  app.patch("/api/payments/:id/status", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !['pending', 'completed', 'refunded', 'failed'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      // Get the payment to check owner
      const payment = await storage.getPaymentById(id);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      
      // Only admin or payment owner can update status
      if (payment.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const updatedPayment = await storage.updatePaymentStatus(id, status);
      
      // If payment is completed, create a ticket
      if (status === 'completed' && updatedPayment) {
        const ticket = await storage.createTicket(
          updatedPayment.eventId,
          updatedPayment.userId,
          updatedPayment.id
        );
        
        return res.json({ 
          payment: updatedPayment,
          ticket: ticket 
        });
      }
      
      res.json(updatedPayment);
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ message: "Error updating payment status" });
    }
  });
  
  app.patch("/api/payments/:id/refund", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { reason } = req.body;
      
      if (!reason) {
        return res.status(400).json({ message: "Refund reason is required" });
      }
      
      // Get the payment to check owner
      const payment = await storage.getPaymentById(id);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      
      // Only admin or payment owner can request refund
      if (payment.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      // Update payment with refund reason
      const updatedPayment = await storage.updatePaymentRefundReason(id, reason);
      
      // Mark associated tickets as refunded
      const tickets = await storage.getTicketsByUserId(payment.userId);
      const ticketForEvent = tickets.find(ticket => 
        ticket.eventId === payment.eventId && ticket.paymentId === payment.id
      );
      
      if (ticketForEvent) {
        await storage.markTicketRefunded(ticketForEvent.id);
      }
      
      res.json({
        message: "Refund processed successfully",
        payment: updatedPayment
      });
    } catch (error) {
      console.error("Error processing refund:", error);
      res.status(500).json({ message: "Error processing refund" });
    }
  });
  
  // Remove duplicate endpoint to ensure consistent behavior
  
  app.get("/api/tickets/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ticket = await storage.getTicketById(id);
      
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      // Only owner or admin can view ticket details
      if (ticket.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      // Get event details
      const event = await storage.getEventById(ticket.eventId);
      
      res.json({
        ...ticket,
        event: event || null
      });
    } catch (error) {
      console.error("Error fetching ticket:", error);
      res.status(500).json({ message: "Error fetching ticket" });
    }
  });
  
  app.patch("/api/tickets/:id/status", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !['active', 'cancelled', 'used'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      // Get the ticket to check owner
      const ticket = await storage.getTicketById(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      // Only owner or admin can update ticket status
      if (ticket.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      // For paid tickets, don't allow status change if already refunded
      if (ticket.paymentId && ticket.isRefunded && status !== 'refunded') {
        return res.status(400).json({ 
          message: "Cannot change status of a refunded ticket" 
        });
      }
      
      const updatedTicket = await storage.updateTicketStatus(id, status);
      res.json(updatedTicket);
    } catch (error) {
      console.error("Error updating ticket status:", error);
      res.status(500).json({ message: "Error updating ticket status" });
    }
  });

  // Endpoint for canceling tickets and processing refunds
  app.post("/api/tickets/:id/cancel", isAuthenticated, async (req, res) => {
    try {
      console.log(`Processing ticket cancellation request for ID: ${req.params.id}`);
      const ticketId = parseInt(req.params.id);
      const ticket = await storage.getTicketById(ticketId);
      
      if (!ticket) {
        console.log(`Ticket not found with ID: ${ticketId}`);
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      console.log(`Found ticket: ${JSON.stringify(ticket)}`);
      
      // Check if the user owns the ticket or is an admin
      if (ticket.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "You don't have permission to cancel this ticket" });
      }
      
      // Get event details to check if it's a paid event
      const event = await storage.getEventById(ticket.eventId);
      
      if (!event) {
        console.log(`Event not found for ticket ID: ${ticketId}, event ID: ${ticket.eventId}`);
        return res.status(404).json({ message: "Event not found" });
      }
      
      console.log(`Event details: ${JSON.stringify(event)}`);

      // For free events, simply mark ticket as cancelled
      if (event.isFree) {
        const updatedTicket = await storage.updateTicketStatus(ticketId, "cancelled");
        return res.json({
          ticket: updatedTicket,
          message: "Ticket cancelled successfully"
        });
      } else {
        // For paid events, process refund if there's an associated payment
        if (!ticket.paymentId) {
          console.log(`No payment ID associated with ticket ID: ${ticketId}`);
          
          // For backwards compatibility - if no payment ID but event is paid,
          // still allow cancellation without refund
          const updatedTicket = await storage.updateTicketStatus(ticketId, "cancelled");
          return res.json({
            ticket: updatedTicket,
            message: "Ticket cancelled successfully (no payment to refund)"
          });
        }
        
        console.log(`Attempting to find payment ID: ${ticket.paymentId}`);
        const payment = await storage.getPaymentById(ticket.paymentId);
        
        if (!payment) {
          console.log(`Payment record not found for ID: ${ticket.paymentId}`);
          // Still allow cancellation if payment record is missing
          const updatedTicket = await storage.updateTicketStatus(ticketId, "cancelled");
          return res.json({
            ticket: updatedTicket,
            message: "Ticket cancelled successfully (payment record not found)"
          });
        }
        
        console.log(`Payment details: ${JSON.stringify(payment)}`);
        
        // Only process refund if payment was completed
        if (payment.status !== 'completed') {
          console.log(`Payment status is not 'completed', current status: ${payment.status}`);
          // Still allow cancellation if payment is not in completed state
          const updatedTicket = await storage.updateTicketStatus(ticketId, "cancelled");
          return res.json({
            ticket: updatedTicket,
            payment: payment,
            message: "Ticket cancelled successfully (payment was not in completed state)"
          });
        }
        
        // Update payment status to refunded
        const refundReason = req.body.reason || "User requested refund";
        console.log(`Processing refund with reason: ${refundReason}`);
        const updatedPayment = await storage.updatePaymentStatus(payment.id, "refunded");
        await storage.updatePaymentRefundReason(payment.id, refundReason);
        
        // Mark ticket as refunded
        const updatedTicket = await storage.markTicketRefunded(ticketId);
        
        console.log(`Refund processed successfully for ticket ID: ${ticketId}`);
        
        res.json({
          ticket: updatedTicket,
          payment: updatedPayment,
          message: "Ticket cancelled and payment refunded successfully"
        });
      }
    } catch (error) {
      console.error("Error cancelling ticket:", error);
      res.status(500).json({ message: "Error cancelling ticket" });
    }
  });
  
  // Admin endpoints for tickets and payments
  app.get("/api/admin/tickets/event/:eventId", isAdmin, async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const tickets = await storage.getTicketsByEventId(eventId);
      
      // Enrich tickets with user info
      const enrichedTickets = await Promise.all(tickets.map(async (ticket) => {
        const user = await storage.getUser(ticket.userId);
        return {
          ...ticket,
          user: user ? {
            id: user.id,
            username: user.username,
            email: user.email
          } : null
        };
      }));
      
      res.json(enrichedTickets);
    } catch (error) {
      console.error("Error fetching event tickets:", error);
      res.status(500).json({ message: "Error fetching tickets" });
    }
  });

  // Configure Paddle checkout system integration
  app.post("/api/paddle/webhook", async (req, res) => {
    try {
      // Process Paddle webhook events
      const { event_type, data } = req.body;
      
      // Handle payment completion
      if (event_type === 'payment.completed') {
        const paymentId = data.custom_data?.payment_id;
        if (paymentId) {
          const payment = await storage.getPaymentById(parseInt(paymentId));
          if (payment) {
            // Update payment with Paddle info
            await storage.updatePaymentStatus(payment.id, 'completed');
            
            // Create ticket for successful payment
            await storage.createTicket(payment.eventId, payment.userId, payment.id);
          }
        }
      }
      
      // Return success to Paddle
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error processing Paddle webhook:", error);
      res.status(500).json({ success: false, message: "Error processing webhook" });
    }
  });

  // Endpoint to get featured poets (users who have published poems)
  app.get("/api/poets/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const featuredPoets = await storage.getFeaturedPoets(limit);
      res.json(featuredPoets);
    } catch (error) {
      console.error("Error fetching featured poets:", error);
      res.status(500).json({ message: "Error fetching featured poets" });
    }
  });

  return httpServer;
}
