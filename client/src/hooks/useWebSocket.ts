import { useState, useEffect, useCallback, useRef } from "react";

type MessageHandler = (message: any) => void;
type WebSocketStatus = "connecting" | "open" | "closing" | "closed" | "error";

export function useWebSocket(handlers: Record<string, MessageHandler> = {}) {
  const [status, setStatus] = useState<WebSocketStatus>("connecting");
  const socketRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef(handlers);
  
  // Update handlers ref if they change
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  // Connect to WebSocket
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      setStatus("open");
      console.log("WebSocket connection established");
    };

    socket.onclose = () => {
      setStatus("closed");
      console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
      setStatus("error");
      console.error("WebSocket error:", error);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const messageType = data.type;
        
        if (messageType && handlersRef.current[messageType]) {
          handlersRef.current[messageType](data);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  // Send message function
  const sendMessage = useCallback((type: string, data: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type, ...data }));
      return true;
    }
    return false;
  }, []);

  return {
    status,
    sendMessage,
    isConnected: status === "open",
  };
}
