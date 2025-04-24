# VerseFountain: Digital Literary Platform

VerseFountain is a comprehensive digital library platform that empowers poets, readers, and literature enthusiasts to discover, share, and engage with creative content through advanced technological integrations and user-centric design.

## Features

- **Digital Library**: Extensive collection of books, poetry, and academic resources
- **Poetry Community**: Share, rate, and comment on poetry content
- **Event Management**: Create, browse, and register for literary events
- **Real-time Chat**: Join thematic chat rooms to discuss literary topics
- **Ticketing System**: Generate event tickets with QR codes
- **Payment Processing**: Handle paid event registrations
- **User Management**: Authentication and personalized profiles

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL (Neon)
- **State Management**: TanStack Query
- **Real-time Communication**: WebSockets
- **Authentication**: Session-based auth with Passport.js
- **Payment Processing**: Paddle
- **Deployment**: Netlify

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required values

4. Start the development server:
   ```bash
   npm run dev
   ```

## Database Migration

When making schema changes, use the following steps:

1. Update the schema in `shared/schema.ts`
2. Generate migration files:
   ```bash
   npx drizzle-kit generate
   ```
3. Apply migrations:
   ```bash
   npx drizzle-kit push
   ```
   
**Note:** If you encounter issues with interactive prompts during `drizzle-kit push`, you can manually apply the SQL from the generated migration files to your database.

## Deployment on Netlify

### Prerequisites

1. A [Netlify account](https://app.netlify.com/signup)
2. PostgreSQL database (e.g., [Neon](https://neon.tech))
3. Properly configured environment variables

### Deployment Steps

1. **Prepare for deployment**:
   ```bash
   npm run build
   ```

2. **Deploy through Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy
   ```

3. **Or deploy through Netlify UI**:
   - Sign in to Netlify
   - Go to "Sites" and click "Add new site" > "Import an existing project"
   - Connect to your Git provider and select the repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

4. **Set up environment variables in Netlify**:
   - In your site dashboard, go to "Site settings" > "Environment variables"
   - Add all required environment variables from your `.env` file
   - Make sure to include `DATABASE_URL` and all other database credentials

5. **Configure serverless functions**:
   - Netlify automatically detects functions in the `netlify/functions` directory
   - No additional configuration is required

### WebSocket Limitations on Netlify

Netlify Functions don't natively support WebSockets, so we have two options:

1. **Use the REST API fallback** (implemented in the code)
   - The application automatically detects when running on Netlify and uses AJAX polling instead

2. **Use a third-party WebSocket service** (for production):
   - Consider services like Pusher, Firebase, or Ably
   - Update the client code to use the chosen service

## User Authentication

Sample users are created during the initial database seeding:

- **Regular User**:
  - Username: `user`
  - Password: `password`

- **Admin User**:
  - Username: `admin`
  - Password: `password`

## License

[MIT License](LICENSE)