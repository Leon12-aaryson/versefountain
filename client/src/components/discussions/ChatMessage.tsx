import { ChatMessage } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface ChatMessageProps {
  message: ChatMessage;
}

export default function ChatMessageComponent({ message }: ChatMessageProps) {
  const formattedTime = formatDistanceToNow(new Date(message.createdAt), { addSuffix: true });
  
  return (
    <div className="chat-message p-3 rounded-lg">
      <div className="flex items-start">
        <img
          src={message.userAvatar || "https://via.placeholder.com/32"}
          alt={`${message.username} avatar`}
          className="w-8 h-8 rounded-full object-cover mr-3"
        />
        <div>
          <div className="flex items-center mb-1">
            <span className="font-medium text-sm">{message.username}</span>
            <span className="text-xs text-gray-500 ml-2">{formattedTime}</span>
          </div>
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
    </div>
  );
}
