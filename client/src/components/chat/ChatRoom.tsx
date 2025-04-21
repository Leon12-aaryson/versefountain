import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useChat } from '@/contexts/ChatContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

interface ChatRoomProps {
  roomId: number;
  roomName: string;
  onBack: () => void;
}

const ChatRoom = ({ roomId, roomName, onBack }: ChatRoomProps) => {
  const { user } = useAuth();
  const { messages, sendMessage, joinRoom } = useChat();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // The room is already joined in the parent component (ChatPage)
  // We don't need to call joinRoom here again, as it would create an infinite update loop
  // useEffect(() => {
  //   joinRoom(roomId);
  // }, [roomId]);
  
  // This component assumes roomId is already joined
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() === '') return;
    
    sendMessage(messageText);
    setMessageText('');
  };
  
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, 'h:mm a');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white p-4 border-b border-gray-200 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold">{roomName}</h2>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            No messages yet. Be the first to say hello!
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.userId === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex ${msg.userId === user?.id ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className={msg.userId === user?.id ? 'bg-primary' : 'bg-secondary'}>
                    {msg.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`max-w-xs mx-2 ${msg.userId === user?.id ? 'bg-primary text-white' : 'bg-white'} rounded-lg p-3 shadow-sm`}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`text-xs font-medium ${msg.userId === user?.id ? 'text-primary-foreground' : 'text-gray-700'}`}>
                      {msg.username}
                    </span>
                    <span className={`text-xs ${msg.userId === user?.id ? 'text-primary-foreground/70' : 'text-gray-500'} ml-2`}>
                      {formatMessageTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className={msg.userId === user?.id ? 'text-primary-foreground' : 'text-gray-800'}>
                    {msg.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="bg-white p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={!messageText.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;
