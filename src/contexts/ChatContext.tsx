import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/constants';

interface ChatMessage {
  type: string;
  roomId: number;
  user_id: number;
  username: string;
  message: string;
  timestamp: string;
}

interface ChatRoom {
  id: number;
  name: string;
  description: string;
  isPrivate: boolean | null;
  created_by_id: number | null;
}

interface ChatContextType {
  connected: boolean;
  activeRoom: number | null;
  rooms: ChatRoom[];
  userRooms: ChatRoom[];
  messages: ChatMessage[];
  joinRoom: (roomId: number) => void;
  joinChatRoom: (roomId: number) => Promise<void>;
  leaveChatRoom: (roomId: number) => Promise<void>;
  sendMessage: (message: string) => void;
  leaveRoom: () => void;
  isMemberOf: (roomId: number) => boolean;
  loadingMembership: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [activeRoom, setActiveRoom] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [userRooms, setUserRooms] = useState<ChatRoom[]>([]);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [membershipCache, setMembershipCache] = useState<Record<number, boolean>>({});
  const [loadingMembership, setLoadingMembership] = useState(false);
  const maxReconnectAttempts = 5;

  // Fetch all chat rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/chat/rooms`, { withCredentials: true });
        setRooms(res.data);
      } catch (err) {
        setRooms([]);
      }
    };
    fetchRooms();
  }, []);

  // Fetch user's joined chat rooms
  useEffect(() => {
    if (!user) {
      setUserRooms([]);
      return;
    }
    const fetchUserRooms = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/user/chat/rooms`, { withCredentials: true });
        setUserRooms(res.data);
      } catch (err) {
        setUserRooms([]);
      }
    };
    fetchUserRooms();
  }, [user, loadingMembership]);

  // Simplified WebSocket connection approach to fix recurring connection issues
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout>;
    let isUnmounting = false; // Flag to prevent reconnecting during unmount
    let pingInterval: ReturnType<typeof setInterval>;
    
    // Helper function to determine the WebSocket URL
    const getWebSocketUrl = (): string | null => {
      if (typeof window === 'undefined') return null;

      // Always fallback: convert http(s) to ws(s) using API_BASE_URL
      try {
        const apiUrl = API_BASE_URL;
        if (apiUrl.startsWith('http://')) {
          return apiUrl.replace('http://', 'ws://') + '/ws/chat';
        }
        if (apiUrl.startsWith('https://')) {
          return apiUrl.replace('https://', 'wss://') + '/ws/chat';
        }
      } catch {
        return null;
      }
      return null;
    };

    const connectWebSocket = () => {
      // Don't attempt to reconnect if we're unmounting or already reached max attempts
      if (isUnmounting) return;
      
      if (reconnectAttempts >= maxReconnectAttempts) {
        console.error("Max reconnect attempts reached. Please reload the page.");
        return;
      }
      
      // Close existing connection if any
      if (ws) {
        try {
          console.log("Closing WebSocket connection");
          ws.close();
        } catch (err) {
          console.error("Error closing existing WebSocket:", err);
        }
        ws = null;
      }
      
      try {
        // Get WebSocket URL from the Netlify configuration
        const wsUrl = getWebSocketUrl();
        
        // If wsUrl is null, it means we're in production on Netlify without WebSocket support
        if (wsUrl === null) {
          console.log('WebSocket not available in this environment. Using polling fallback.');
          setConnected(false);
          return;
        }
        
        console.log(`Connecting to WebSocket at: ${wsUrl} (Attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`);
        
        ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log("WebSocket connection established");
          setSocket(ws);
          setConnected(true);
          setReconnectAttempts(0);
          
          // Setup ping interval to keep connection alive
          clearInterval(pingInterval);
          pingInterval = setInterval(() => {
            if (ws && ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'ping' }));
            }
          }, 30000); // ping every 30 seconds
          
          // Authenticate user immediately after connection
          if (user && ws && ws.readyState === WebSocket.OPEN) {
            console.log("Sending authentication message");
            try {
              ws.send(JSON.stringify({
                type: 'authenticate',
                user_id: user.user_id,
                username: user.username
              }));
            } catch (err) {
              console.error("Error sending authentication message:", err);
            }
          }
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
              case 'connection_established':
                console.log('WebSocket connection established - server confirmed');
                break;
                
              case 'pong':
                // Silently handle pong responses
                break;
                
              case 'auth_success':
                console.log('Authentication successful');
                break;
                
              case 'room_history':
                if (data.roomId === activeRoom) {
                  console.log(`Received room history with ${data.messages?.length || 0} messages`);
                  if (Array.isArray(data.messages)) {
                    setMessages(data.messages);
                  } else {
                    console.error("Received invalid room history format:", data);
                    setMessages([]);
                  }
                }
                break;
                
              case 'chat_message':
                if (data.roomId === activeRoom) {
                  setMessages(prev => [...prev, data]);
                }
                break;
                
              case 'error':
                console.error("Chat Error:", data.message);
                break;
            }
          } catch (err) {
            console.error("Error processing message:", err);
          }
        };
        
        ws.onclose = (event) => {
          console.log(`WebSocket connection closed`);
          setConnected(false);
          setSocket(null);
          clearInterval(pingInterval);
          
          if (isUnmounting) return;
          
          // Log reconnection attempts (but not too frequently)
          if (reconnectAttempts > 2 && reconnectAttempts % 3 === 0) {
            console.error("Chat Connection Issue: Connection to chat server lost. Reconnecting...");
          }
          
          // Exponential backoff with a maximum delay
          const delay = Math.min(1000 * Math.pow(1.5, reconnectAttempts), 10000);
          
          reconnectTimeout = setTimeout(() => {
            if (!isUnmounting) {
              setReconnectAttempts(prev => prev + 1);
              connectWebSocket();
            }
          }, delay);
        };
        
        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          // The onclose handler will be called automatically after an error
        };
      } catch (error) {
        console.error("Error creating WebSocket:", error);
        
        // Trigger reconnect
        const delay = 3000;
        reconnectTimeout = setTimeout(() => {
          if (!isUnmounting) {
            setReconnectAttempts(prev => prev + 1);
            connectWebSocket();
          }
        }, delay);
      }
    };
    
    // Only establish connection when we have a logged-in user
    if (user) {
      connectWebSocket();
    }
    
    // Clean up function
    return () => {
      isUnmounting = true;
      clearTimeout(reconnectTimeout);
      clearInterval(pingInterval);
      
      if (ws) {
        try {
          ws.close();
        } catch (err) {
          console.error("Error closing WebSocket during cleanup:", err);
        }
      }
    };
  }, [user, reconnectAttempts, activeRoom, toast]);
  
  // Send join room message when socket becomes ready and we have an active room
  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN && user && activeRoom) {
      console.log(`Auto-joining room ${activeRoom} after connection established`);
      try {
        socket.send(JSON.stringify({
          type: 'join_room',
          roomId: activeRoom
        }));
      } catch (err) {
        console.error(`Error auto-joining room ${activeRoom}:`, err);
      }
    }
  }, [socket, user, activeRoom, toast]);
  
  // Join a chat room
  const joinRoom = (roomId: number) => {
    if (!user) {
      console.error("Cannot Join Room: You must be logged in to join a chat room");
      return;
    }
    
    // First set the active room state
    setActiveRoom(roomId);
    setMessages([]); // Clear messages until we receive history
    
    // Ensure we have an active connection before sending join message
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.log("No active WebSocket connection, reconnecting...");
      // We'll rely on the useEffect to reconnect and join the room once connected
      return;
    }
    
    // Send the join room message to the server
    console.log(`Joining room: ${roomId}`);
    try {
      socket.send(JSON.stringify({
        type: 'join_room',
        roomId: roomId
      }));
    } catch (err) {
      console.error("Error sending join message:", err);
    }
  };
  
  // Send a message to the active room
  const sendMessage = (message: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !user || !activeRoom) {
      console.error("Cannot Send Message: You must be logged in and in a chat room");
      return;
    }
    
    try {
      socket.send(JSON.stringify({
        type: 'chat_message',
        roomId: activeRoom,
        message
      }));
    } catch (err) {
      console.error("Error sending chat message:", err);
    }
  };
  
  // Leave the active viewing room (doesn't remove user from room membership)
  const leaveRoom = () => {
    setActiveRoom(null);
    setMessages([]);
  };
  
  // Check if user is a member of a specific chat room
  const isMemberOf = (roomId: number): boolean => {
    // First check the cache
    if (membershipCache[roomId] !== undefined) {
      return membershipCache[roomId];
    }
    
    // Otherwise check if the room is in userRooms
    return userRooms.some(room => room.id === roomId);
  };
  
  // Join a chat room (persistent membership)
  const joinChatRoom = async (roomId: number): Promise<void> => {
    if (!user) {
      toast({ title: "Authentication Required", description: "You must be logged in to join chat rooms" });
      return;
    }
    setLoadingMembership(true);
    try {
      await axios.post(`${API_BASE_URL}/api/chat/rooms/${roomId}/join`, {}, { withCredentials: true });
      setMembershipCache(prev => ({ ...prev, [roomId]: true }));
      toast({ title: "Joined Chat Room", description: "You are now a member of this chat room" });
      // Refetch userRooms
      const res = await axios.get(`${API_BASE_URL}/api/user/chat/rooms`, { withCredentials: true });
      setUserRooms(res.data);
    } catch (err) {
      toast({ title: "Failed to join room", description: "Could not join the chat room" });
    } finally {
      setLoadingMembership(false);
    }
  };
  
  // Leave a chat room (remove membership)
  const leaveChatRoom = async (roomId: number): Promise<void> => {
    if (!user) return;
    setLoadingMembership(true);
    try {
      await axios.post(`${API_BASE_URL}/api/chat/rooms/${roomId}/leave`, {}, { withCredentials: true });
      setMembershipCache(prev => ({ ...prev, [roomId]: false }));
      if (activeRoom === roomId) leaveRoom();
      toast({ title: "Left Chat Room", description: "You have left this chat room" });
      // Refetch userRooms
      const res = await axios.get(`${API_BASE_URL}/api/user/chat/rooms`, { withCredentials: true });
      setUserRooms(res.data);
    } catch (err) {
      toast({ title: "Failed to leave room", description: "Could not leave the chat room" });
    } finally {
      setLoadingMembership(false);
    }
  };
  
  return (
    <ChatContext.Provider value={{
      connected,
      activeRoom,
      rooms,
      userRooms,
      messages,
      joinRoom,
      joinChatRoom,
      leaveChatRoom,
      sendMessage,
      leaveRoom,
      isMemberOf,
      loadingMembership
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
