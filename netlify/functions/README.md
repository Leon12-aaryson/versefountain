# Netlify Functions for VerseFountain

This directory contains serverless functions that handle the backend API and WebSocket functionality when the application is deployed on Netlify.

## API Function (`api.ts`)

This function serves as the main backend API for the VerseFountain application. It handles all HTTP requests to API endpoints including:

- User authentication
- Content management (books, poems, events, etc.)
- Data persistence
- Session management

### Implementation

The API function uses Express.js wrapped with serverless-http to provide a familiar development experience while being compatible with Netlify Functions. It shares the same code as the regular Express server but is adapted for the serverless environment.

### Environment Variables

The API function requires the following environment variables:

- `DATABASE_URL`: Connection string for the PostgreSQL database
- `SESSION_SECRET`: Secret for session encryption
- Various API keys for third-party services

## WebSocket Function (`websocket.ts`)

This function provides a fallback for the real-time chat functionality since Netlify Functions don't natively support WebSockets.

### Implementation

The WebSocket function works by:

1. Accepting HTTP requests that simulate WebSocket messages
2. Storing messages in the database
3. Using periodic polling to retrieve new messages

### Alternative Approaches

For production deployments requiring robust real-time functionality, consider these alternatives:

1. Use a real-time service like Firebase, Pusher, or Ably
2. Deploy the WebSocket server separately on a platform that supports persistent connections
3. Configure AWS API Gateway WebSockets with Lambda functions

## Deployment Notes

- These functions will be automatically deployed when you deploy to Netlify
- Function logs can be viewed in the Netlify dashboard
- The functions have a 10-second execution limit per request
- Maximum payload size is 6MB