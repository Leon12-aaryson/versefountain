import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

interface ChatMessage {
  type: string;
  roomId: number;
  userId: number;
  username: string;
  message: string;
  timestamp: string;
}

interface ChatRoom {
  id: number;
  name: string;
  description: string;
  isPrivate: boolean | null;
  createdById: number | null;
}

interface ChatContextType {
  connected: boolean;
  activeRoom: number | null;
  rooms: ChatRoom[];
  messages: ChatMessage[];
  joinRoom: (roomId: number) => void;
  sendMessage: (message: string) => void;
  leaveRoom: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [activeRoom, setActiveRoom] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;
  
  // Query for chat rooms
  const { data: rooms = [] } = useQuery<ChatRoom[]>({
    queryKey: ['/api/chat/rooms'],
    queryFn: async () => {
      const response = await fetch('/api/chat/rooms');
      if (!response.ok) {
        throw new Error('Failed to fetch chat rooms');
      }
      return response.json();
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });

  // Simplified WebSocket connection approach to fix recurring connection issues
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout>;
    let isUnmounting = false; // Flag to prevent reconnecting during unmount
    let pingInterval: ReturnType<typeof setInterval>;
    
    const connectWebSocket = () => {
      // Don't attempt to reconnect if we're unmounting or already reached max attempts
      if (isUnmounting) return;
      
      if (reconnectAttempts >= maxReconnectAttempts) {
        console.log("Max reconnect attempts reached. Please reload the page.");
        toast({
          title: "Connection Failed",
          description: "Unable to connect to chat server. Please reload the page.",
          variant: "destructive",
        });
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
        // Use direct path instead of calculating one
        const url = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${url}//${window.location.host}/ws`;
        
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
                userId: user.id,
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
                toast({
                  title: "Chat Error",
                  description: data.message,
                  variant: "destructive",
                });
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
          
          // Show toast after initial attempts (but not too frequently)
          if (reconnectAttempts > 2 && reconnectAttempts % 3 === 0) {
            toast({
              title: "Chat Connection Issue",
              description: "Connection to chat server lost. Reconnecting...",
              variant: "destructive",
            });
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
        toast({
          title: "Connection Error",
          description: "Failed to join chat room. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [socket, user, activeRoom, toast]);
  
  // Join a chat room
  const joinRoom = (roomId: number) => {
    if (!user) {
      toast({
        title: "Cannot Join Room",
        description: "You must be logged in to join a chat room",
        variant: "destructive",
      });
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
      toast({
        title: "Connection Error",
        description: "Failed to join chat room. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Send a message to the active room
  const sendMessage = (message: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !user || !activeRoom) {
      toast({
        title: "Cannot Send Message",
        description: "You must be logged in and in a chat room",
        variant: "destructive",
      });
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
      toast({
        title: "Message Failed",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Leave the active room
  const leaveRoom = () => {
    setActiveRoom(null);
    setMessages([]);
  };
  
  return (
    <ChatContext.Provider value={{
      connected,
      activeRoom,
      rooms,
      messages,
      joinRoom,
      sendMessage,
      leaveRoom
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
