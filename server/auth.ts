import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Express } from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { storage } from './storage';
import { z } from 'zod';

// User type aligned with schema
export interface DBUser {
  id: number;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date | null;
}

declare global {
  namespace Express {
    interface User extends Omit<DBUser, 'password'> {
      password?: string;
    }
  }
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  return bcrypt.compare(supplied, stored);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'versefountain-secret-key',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  };

  app.set('trust proxy', 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log(`Authentication attempt for username: ${username}`);
        
        // Get user from PostgreSQL
        const dbUser = await db
          .select()
          .from(users)
          .where(eq(users.username, username))
          .limit(1)
          .catch((err) => {
            console.error(`Error querying user ${username}:`, err);
            throw err;
          });

        if (dbUser[0]) {
          console.log(`DB User found: ${username}, checking password...`);
          const passwordMatch = await comparePasswords(password, dbUser[0].password);
          console.log(`Password match result: ${passwordMatch}`);
          
          if (passwordMatch) {
            const user = {
              id: dbUser[0].id,
              username: dbUser[0].username,
              email: dbUser[0].email,
              isAdmin: dbUser[0].isAdmin,
              createdAt: dbUser[0].createdAt?.toISOString() || undefined,
            };
            console.log(`Authentication successful for DB user: ${username}`);
            return done(null, user);
          }
        } else {
          console.log(`No DB user found for: ${username}, checking memory storage...`);
        }
        
        // Fall back to in-memory storage
        const memUser = await storage.getUserByUsername(username).catch((err) => {
          console.error(`Error querying memory storage for ${username}:`, err);
          throw err;
        });
        if (memUser) {
          console.log(`Memory user found: ${username}, checking password...`);
          const passwordMatch = await comparePasswords(password, memUser.password);
          console.log(`Memory password match result: ${passwordMatch}`);
          
          if (passwordMatch) {
            console.log(`Authentication successful for memory user: ${username}`);
            return done(null, memUser);
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
      // Get user from PostgreSQL
      const dbUser = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1)
        .catch((err) => {
          console.error(`Error querying user by ID ${id}:`, err);
          throw err;
        });
      
      if (dbUser[0]) {
        const user = {
          id: dbUser[0].id,
          username: dbUser[0].username,
          email: dbUser[0].email,
          isAdmin: dbUser[0].isAdmin,
          createdAt: dbUser[0].createdAt?.toISOString() || undefined,
        };
        done(null, user);
      } else {
        // Fall back to in-memory storage
        const user = await storage.getUser(id).catch((err) => {
          console.error(`Error querying memory storage by ID ${id}:`, err);
          throw err;
        });
        done(null, user);
      }
    } catch (error) {
      console.error('Deserialization error:', error);
      done(error);
    }
  });

  // Registration validation schema
  const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

  app.post('/api/register', async (req, res, next) => {
    try {
      console.log('Registration attempt:', req.body);
      // Validate input
      const validation = registerSchema.safeParse(req.body);
      if (!validation.success) {
        console.log('Validation failed:', validation.error.flatten().fieldErrors);
        return res.status(400).json({
          message: 'Validation failed',
          errors: validation.error.flatten().fieldErrors,
        });
      }

      const { username, email, password } = validation.data;

      // Check if username exists
      const existingDbUser = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1)
        .catch((err) => {
          console.error(`Error checking username ${username}:`, err);
          throw err;
        });
      if (existingDbUser[0]) {
        console.log(`Username ${username} already exists`);
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Check if email exists
      const existingEmailUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
        .catch((err) => {
          console.error(`Error checking email ${email}:`, err);
          throw err;
        });
      if (existingEmailUser[0]) {
        console.log(`Email ${email} already exists`);
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Check in-memory storage
      const existingMemUser = await storage.getUserByUsername(username).catch((err) => {
        console.error(`Error checking memory storage for ${username}:`, err);
        throw err;
      });
      if (existingMemUser) {
        console.log(`Username ${username} exists in memory storage`);
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user in PostgreSQL
      const [newUser] = await db
        .insert(users)
        .values({
          username,
          email,
          password: hashedPassword,
          isAdmin: false,
        })
        .returning()
        .catch((err) => {
          console.error(`Error inserting user ${username}:`, err);
          throw err;
        });

      const user = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        createdAt: newUser.createdAt?.toISOString() || undefined,
      };

      // Create user in memory storage
      await storage.createUser({
        username,
        email,
        password: hashedPassword,
        confirmPassword: '',
        isAdmin: false,
      }).catch((err) => {
        console.error(`Error creating user ${username} in memory storage:`, err);
        throw err;
      });

      // Log in the new user
      req.login(user, (err) => {
        if (err) {
          console.error('Login error after registration:', err);
          return next(err);
        }
        console.log(`Registration successful for ${username}`);
        res.status(201).json(user);
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Registration failed', error: error.message });
      next(error);
    }
  });

  app.post('/api/login', (req, res, next) => {
    console.log('Login attempt:', req.body);
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error('Authentication error:', err);
        return next(err);
      }
      if (!user) {
        console.log('Authentication failed: Invalid username or password');
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      
      req.login(user, (err) => {
        if (err) {
          console.error('Login error:', err);
          return next(err);
        }
        console.log(`Login successful for ${user.username}`);
        const { password, ...safeUser } = user;
        res.json(safeUser);
      });
    })(req, res, next);
  });

  app.post('/api/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        return next(err);
      }
      console.log('Logout successful');
      res.sendStatus(200);
    });
  });

  app.get('/api/user', (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('User not authenticated');
      return res.sendStatus(401);
    }
    const { password, ...safeUser } = req.user;
    res.json(safeUser);
  });
}