import express, { Request, Response } from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import session from 'express-session';
import { setupAuth } from '../../server/auth';
import { storage } from '../../server/storage';
import { registerRoutes } from '../../server/routes';

// Initialize express app for serverless function
const app = express();

// Setup middleware
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

// Session setup
const sessionSettings = {
  secret: process.env.SESSION_SECRET || 'versefountain-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  },
  store: storage.sessionStore
};

app.use(session(sessionSettings));

// Setup authentication
setupAuth(app);

// Register all API routes
registerRoutes(app);

// Error handling middleware
app.use((err: any, _req: Request, res: Response) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Export the serverless handler
export const handler = serverless(app);