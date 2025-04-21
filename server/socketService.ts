import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { storage } from "./storage";
import { parse as parseUrl } from "url";

// Extend WebSocket type to include our custom properties
interface ExtendedWebSocket extends WebSocket {
  isAlive: boolean;
  connectionId?: number;
}

interface ChatMessage {
  type: string;
  roomId: number;
  userId: number;
  username: string;
  message: string;
  timestamp: string;
}

// Map to track which clients belong to which rooms
const roomClients = new Map<number, Set<ExtendedWebSocket>>();

// Map to track user data
const clientData = new Map<ExtendedWebSocket, { userId: number; username: string }>();

// Connection counter for debugging
let connectionCounter = 0;
const activeConnections = new Set<ExtendedWebSocket>();

export function setupWebSocketServer(server: Server) {
  console.log("Setting up WebSocket server on /ws path");
  
  // Create WebSocket server with proper options
  const wss = new WebSocketServer({ 
    server, 
    path: '/ws',
    // Increase timeouts for better reliability
    clientTracking: true,
    perMessageDeflate: {
      zlibDeflateOptions: {
        // Higher memory usage but faster
        chunkSize: 1024,
        memLevel: 7,
        level: 3
      },
      zlibInflateOptions: {
        chunkSize: 10 * 1024
      },
      // Don't compress small payloads
      threshold: 1024
    }
  });
  
  // Handle connections
  wss.on('connection', (wsBasic, req) => {
    // Cast to our extended type
    const ws = wsBasic as ExtendedWebSocket;
    
    const id = ++connectionCounter;
    ws.connectionId = id;
    
    const ip = req.socket.remoteAddress;
    const params = parseUrl(req.url || '', true).query;
    
    console.log(`WebSocket #${id} connection established from ${ip}`);
    
    // Track this connection
    activeConnections.add(ws);
    
    // Heartbeat setup - helps detect disconnections faster
    ws.isAlive = true;
    
    ws.on('pong', () => {
      ws.isAlive = true;
    });
    
    // Handle messages
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log(`WS #${id}: Received ${message.type} message`);
        
        switch (message.type) {
          case 'auth':
          case 'authenticate':
            await handleAuthentication(ws, message);
            break;
            
          case 'join_room':
            await handleJoinRoom(ws, message);
            break;
            
          case 'chat_message':
            await handleChatMessage(wss, ws, message);
            break;
            
          case 'ping':
            // Respond with a pong to keep connection alive
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: 'pong'
              }));
            }
            break;
            
          default:
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Unknown message type'
            }));
        }
      } catch (error) {
        console.error(`WS #${id}: Error processing message:`, error);
        // Only send if connection is still open
        if (ws.readyState === WebSocket.OPEN) {
          try {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Error processing your message'
            }));
          } catch (err) {
            console.error(`WS #${id}: Error sending error message:`, err);
          }
        }
      }
    });
    
    // Handle close
    ws.on('close', (code, reason) => {
      console.log(`WS #${id}: Client disconnected (${code}): ${reason || 'No reason provided'}`);
      
      // Clean up resources
      activeConnections.delete(ws);
      
      // Remove client from all rooms
      if (clientData.has(ws)) {
        roomClients.forEach((clients, roomId) => {
          if (clients.has(ws)) {
            clients.delete(ws);
            console.log(`WS #${id}: Client removed from room ${roomId}`);
          }
        });
        
        // Clear client data
        clientData.delete(ws);
      }
    });
    
    // Handle errors
    ws.on('error', (error) => {
      console.error(`WS #${id}: WebSocket error:`, error);
      // Close the connection to clean up resources
      try {
        ws.terminate();
      } catch (e) {
        console.error(`WS #${id}: Error during termination:`, e);
      }
    });
    
    // Immediately send connection acknowledgement
    try {
      ws.send(JSON.stringify({
        type: 'connection_established',
        message: 'Connected to VerseFountain chat server',
        connectionId: id
      }));
    } catch (error) {
      console.error(`WS #${id}: Error sending initial message:`, error);
    }
  });
  
  // Set up a more robust heartbeat
  const pingInterval = setInterval(() => {
    console.log(`Active WS connections: ${activeConnections.size}`);
    
    wss.clients.forEach((wsBasic) => {
      const ws = wsBasic as ExtendedWebSocket;
      
      if (!ws.isAlive) {
        console.log(`Terminating inactive connection #${ws.connectionId || 'unknown'}`);
        return ws.terminate();
      }
      
      ws.isAlive = false;
      try {
        ws.ping();
      } catch (err) {
        console.error(`Error sending ping to connection #${ws.connectionId || 'unknown'}:`, err);
        ws.terminate();
      }
    });
  }, 30000); // 30 seconds
  
  // Clean up on server close
  wss.on('close', () => {
    clearInterval(pingInterval);
  });
  
  return wss;
}

async function handleAuthentication(ws: WebSocket, message: any) {
  const extWs = ws as ExtendedWebSocket;
  const userId = message.userId;
  if (!userId) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Invalid user ID'
    }));
    return;
  }
  
  try {
    const user = await storage.getUser(userId);
    if (!user) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'User not found'
      }));
      return;
    }
    
    // Store user data with the connection
    clientData.set(extWs, { userId, username: user.username });
    
    console.log(`User authenticated: ${user.username} (${userId})`);
    
    // Send confirmation of successful authentication
    ws.send(JSON.stringify({
      type: 'auth_success',
      userId,
      username: user.username
    }));
  } catch (error) {
    console.error('Authentication error:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Authentication failed'
    }));
  }
}

async function handleJoinRoom(ws: WebSocket, message: any) {
  const extWs = ws as ExtendedWebSocket;
  const userData = clientData.get(extWs);
  if (!userData) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Authentication required'
    }));
    return;
  }
  
  const roomId = message.roomId;
  try {
    const room = await storage.getChatRoomById(roomId);
    
    if (!room) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Chat room not found'
      }));
      return;
    }
    
    // Add client to room
    if (!roomClients.has(roomId)) {
      roomClients.set(roomId, new Set());
    }
    roomClients.get(roomId)?.add(extWs);
    
    console.log(`User ${userData.username} joined room: ${room.name} (${roomId})`);
    
    // Load existing messages
    const messages = await storage.getChatMessagesByRoomId(roomId);
    console.log(`Fetched ${messages.length} messages for room ${roomId}`);
    
    const formattedMessages = await Promise.all(messages.map(async (msg) => {
      const user = await storage.getUser(msg.userId);
      return {
        type: 'chat_message',
        roomId: msg.roomId,
        userId: msg.userId,
        username: user ? user.username : 'Unknown User',
        message: msg.message,
        timestamp: msg.createdAt ? msg.createdAt.toISOString() : new Date().toISOString(),
      };
    }));
    
    console.log(`Sending ${formattedMessages.length} formatted messages to client`);
    
    try {
      ws.send(JSON.stringify({
        type: 'room_history',
        roomId,
        messages: formattedMessages
      }));
    } catch (err) {
      console.error(`Error sending room history to client:`, err);
    }
    
    // Notify other clients in the room
    broadcastToRoom(roomId, {
      type: 'user_joined',
      roomId,
      userId: userData.userId,
      username: userData.username,
      timestamp: new Date().toISOString(),
      message: `${userData.username} joined the room`
    }, extWs); // Exclude this client
    
  } catch (error) {
    console.error('Join room error:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Failed to join room'
    }));
  }
}

async function handleChatMessage(wss: WebSocketServer, ws: WebSocket, message: any) {
  const extWs = ws as ExtendedWebSocket;
  const userData = clientData.get(extWs);
  if (!userData) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Authentication required'
    }));
    return;
  }
  
  const roomId = message.roomId;
  try {
    // Check if room exists
    const room = await storage.getChatRoomById(roomId);
    if (!room) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Chat room not found'
      }));
      return;
    }
    
    // Check if message is empty
    const messageText = message.message.trim();
    if (!messageText) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Message cannot be empty'
      }));
      return;
    }
    
    const chatMessage = {
      roomId,
      userId: userData.userId,
      message: messageText,
    };
    
    // Store the message in the database
    await storage.createChatMessage(chatMessage, userData.userId);
    
    const timestamp = new Date().toISOString();
    
    // Create the formatted message
    const formattedMessage = {
      type: 'chat_message',
      roomId,
      userId: userData.userId,
      username: userData.username,
      message: messageText,
      timestamp,
    };
    
    // Send back to sender first with a delivered confirmation
    ws.send(JSON.stringify({
      ...formattedMessage,
      delivered: true
    }));
    
    // Broadcast to all other clients in the room
    broadcastToRoom(roomId, formattedMessage, extWs);
    
    console.log(`Message from ${userData.username} in room ${roomId}: ${messageText.substring(0, 30)}${messageText.length > 30 ? '...' : ''}`);
  } catch (error) {
    console.error('Message handling error:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Failed to send message'
    }));
  }
}

// Broadcast to all clients in a specific room
function broadcastToRoom(roomId: number, message: ChatMessage, exclude?: ExtendedWebSocket) {
  const clients = roomClients.get(roomId);
  if (!clients) return;
  
  clients.forEach(client => {
    if (client !== exclude && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Broadcast to all connected clients
function broadcastMessage(wss: WebSocketServer, message: ChatMessage) {
  wss.clients.forEach((client) => {
    const extClient = client as ExtendedWebSocket;
    if (extClient.readyState === WebSocket.OPEN) {
      extClient.send(JSON.stringify(message));
    }
  });
}
