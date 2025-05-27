/**
 * Netlify configuration for API and WebSocket endpoints
 * 
 * This file provides configuration for connecting to backend services
 * when the application is deployed on Netlify
 */

// API base URL - use Netlify functions in production, local dev server in development
export const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    return '/.netlify/functions/api';
  }
  return '/api';
};

// WebSocket URL - use Netlify functions or external service in production
export const getWebSocketUrl = () => {
  if (import.meta.env.PROD) {
    // For real-time functionality, you would typically use a service like
    // Pusher, Firebase, or Ably instead of a direct WebSocket connection
    // when deploying on Netlify, as Netlify Functions don't support native WebSockets.
    
    // Example fallback to REST API in production:
    return null; // Indicates WebSocket is not available, use polling instead
  }
  
  // Local development WebSocket
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/ws`;
};