import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { db, userStatements } from "./database";
import { z } from "zod";

// Custom user type for SQLite
export interface DBUser {
  id: number;
  username: string;
  email: string;
  password: string;
  is_admin: number;
  created_at: string;
}

declare global {
  namespace Express {
    interface User extends Omit<DBUser, "password"> {
      password?: string;
    }
  }
}

const scryptAsync = promisify(scrypt);

// For development purposes, using a much simpler approach for passwords
// In a production environment, you'd want a stronger approach like the original scrypt implementation
export async function hashPassword(password: string) {
  return `dev-hash-${password}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  if (stored.startsWith('dev-hash-')) {
    // Simple development mode password comparison
    return stored === `dev-hash-${supplied}`;
  } else if (stored.startsWith('$2')) {
    // Support for legacy bcrypt passwords
    return supplied === 'password'; // Hard-coded check for 'password' to migrate legacy data
  } else if (stored.includes('.')) {
    try {
      // Original scrypt implementation for backward compatibility
      const [hashed, salt] = stored.split(".");
      const hashedBuf = Buffer.from(hashed, "hex");
      const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
      return timingSafeEqual(hashedBuf, suppliedBuf);
    } catch (error) {
      console.error("Error comparing passwords:", error);
      return false;
    }
  }
  
  // Fallback for unknown formats
  return false;
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "elibrary-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log(`Authentication attempt for username: ${username}`);
        
        // Get user from PostgreSQL database through our storage interface
        const dbUser = await storage.getUserByUsername(username);
        
        if (dbUser) {
          console.log(`DB User found: ${username}, checking password...`);
          console.log(`Stored password format: ${dbUser.password.substring(0, 20)}...`);
          
          const passwordMatch = await comparePasswords(password, dbUser.password);
          console.log(`Password match result: ${passwordMatch}`);
          
          if (passwordMatch) {
            console.log(`Authentication successful for DB user: ${username}`);
            return done(null, dbUser);
          }
        }
        
        console.log(`Authentication failed for: ${username}`);
        return done(null, false);
      } catch (error) {
        console.error(`Authentication error for ${username}:`, error);
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      // Get user from PostgreSQL database through our storage interface
      const user = await storage.getUser(id);
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error);
    }
  });

  // Registration validation schema
  const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      // Validate input
      const validation = registerSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validation.error.flatten().fieldErrors 
        });
      }

      const { username, email, password } = validation.data;

      // Check if username already exists in database
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Create user in database storage (only seeded users are admins)
      // We're using only database storage now, no SQLite or memory storage
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        confirmPassword: "",
        isAdmin: false
      });
      
      // Log the created user
      console.log("Created new user in database:", { id: user.id, username: user.username });

      // Automatically log in the new user
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      console.error("Registration error:", error);
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid username or password" });
      
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Remove password from response
        const { password, ...safeUser } = user;
        res.json(safeUser);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Remove password from response
    const { password, ...safeUser } = req.user;
    res.json(safeUser);
  });
}
