# VerseFountain

VerseFountain is a comprehensive digital library platform that empowers poets, readers, and literature enthusiasts to discover, share, and engage with creative content through advanced technological integrations and user-centric design.

## Features

- **Poetry Repository**: Browse, create, and interact with poetry content including text and video poems
- **eBooks Library**: Access and upload digital books with categorization
- **Academic Resources**: Find scholarly articles and educational materials
- **Events Management**: Discover, register for, and manage virtual and physical events
- **Real-time Chat**: Engage with the community through topic-based chat rooms
- **User Authentication**: Secure login and registration system
- **Admin Dashboard**: Comprehensive platform management for administrators
- **Payment Integration**: Process payments for paid events with Paddle
- **Ticket System**: Generate and manage event tickets with QR codes

## Tech Stack

- React with TypeScript for the frontend
- Express.js backend with Node.js
- PostgreSQL database with Drizzle ORM
- WebSocket for real-time chat functionality
- React Query for state management
- Shadcn UI components with Tailwind CSS
- Zod for schema validation
- Paddle for payment processing
- Session-based authentication

## Deployment Instructions

### Prerequisites

1. A Netlify account
2. A PostgreSQL database (Neon, Supabase, etc.)
3. API keys for services (Paddle, Firebase, etc.)

### Environment Variables

Before deploying, you need to set up the following environment variables:

1. Copy `.env.example` to `.env` and fill in the values
2. Add these variables to your Netlify site:
   - Database connection details (`DATABASE_URL`, `PGHOST`, etc.)
   - Session secret (`SESSION_SECRET`)
   - API keys for services (`STRIPE_SECRET_KEY`, `VITE_PADDLE_VENDOR_ID`, etc.)

### Deploy to Netlify

1. Push the code to a Git repository (GitHub, GitLab, Bitbucket)
2. Log in to your Netlify account
3. Click "New site from Git"
4. Select your repository and follow the setup wizard
5. In the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Deploy the site

### Post-Deployment

1. Set up environment variables in Netlify dashboard
2. Connect your custom domain (optional)
3. Initialize your database with Drizzle migrations

## Local Development

1. Clone the repository
2. Create a `.env` file based on `.env.example`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. Open `http://localhost:5000` in your browser

## Note on WebSocket Functionality

When deployed to Netlify, the WebSocket functionality will fallback to HTTP-based communication as Netlify Functions don't support native WebSockets. 

For production deployments that require real-time functionality, consider integrating with:
- Firebase Realtime Database
- Pusher
- Ably
- WebSocket API on AWS