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
  const [isSocketAuthed, setIsSocketAuthed] = useState(false);
  const [roomReady, setRoomReady] = useState(false);
  const maxReconnectAttempts = 5;

  const { data: rooms = [] } = useQuery<ChatRoom[]>({
    queryKey: ['/api/chat/rooms'],
    queryFn: async () => {
      const res = await fetch('/api/chat/rooms');
      if (!res.ok) throw new Error('Failed to fetch chat rooms');
      return res.json();
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout>;
    let pingInterval: ReturnType<typeof setInterval>;
    let isUnmounting = false;

    const connect = () => {
      if (isUnmounting || reconnectAttempts >= maxReconnectAttempts) {
        toast({
          title: "WebSocket Failed",
          description: "Please reload the page.",
          variant: "destructive",
        });
        return;
      }

      const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const wsUrl = `${proto}://${window.location.host}/ws`;

      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setSocket(ws);
        setConnected(true);
        setReconnectAttempts(0);

        if (user) {
          ws.send(JSON.stringify({
            type: 'authenticate',
            userId: user.id,
            username: user.username
          }));
        }

        pingInterval = setInterval(() => {
          ws?.send(JSON.stringify({ type: 'ping' }));
        }, 30000);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'auth_success':
            setIsSocketAuthed(true);
            break;
          case 'room_history':
            if (data.roomId === activeRoom) {
              setMessages(Array.isArray(data.messages) ? data.messages : []);
              setRoomReady(true);
            }
            break;
          case 'chat_message':
            if (data.roomId === activeRoom) {
              setMessages(prev => [...prev, data]);
            }
            break;
          case 'error':
            toast({ title: "Chat Error", description: data.message, variant: "destructive" });
            break;
        }
      };

      ws.onclose = () => {
        setConnected(false);
        setSocket(null);
        setIsSocketAuthed(false);
        setRoomReady(false);
        clearInterval(pingInterval);
        if (!isUnmounting) {
          reconnectTimeout = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, 1000 * Math.min(5, reconnectAttempts + 1));
        }
      };

      ws.onerror = () => {
        console.error("WebSocket error");
      };
    };

    if (user) connect();

    return () => {
      isUnmounting = true;
      ws?.close();
      clearTimeout(reconnectTimeout);
      clearInterval(pingInterval);
    };
  }, [user, reconnectAttempts]);

  useEffect(() => {
    if (socket?.readyState === WebSocket.OPEN && activeRoom && user) {
      socket.send(JSON.stringify({ type: 'join_room', roomId: activeRoom }));
    }
  }, [socket, user, activeRoom]);

  const joinRoom = (roomId: number) => {
    if (!user) {
      toast({
        title: "Join Failed",
        description: "You must be logged in to join a chat room",
        variant: "destructive",
      });
      return;
    }

    setActiveRoom(roomId);
    setMessages([]);
    setRoomReady(false);

    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'join_room', roomId }));
    }
  };

  const sendMessage = (message: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !user || !activeRoom || !isSocketAuthed || !roomReady) {
      toast({
        title: "Cannot Send Message",
        description: "You must be logged in and in a ready chat room",
        variant: "destructive",
      });
      return;
    }

    socket.send(JSON.stringify({
      type: 'chat_message',
      roomId: activeRoom,
      message
    }));
  };

  const leaveRoom = () => {
    setActiveRoom(null);
    setMessages([]);
    setRoomReady(false);
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
