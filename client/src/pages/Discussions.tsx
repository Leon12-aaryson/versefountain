import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import DiscussionCard from "@/components/discussions/DiscussionCard";
import ChatMessageComponent from "@/components/discussions/ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";
import type { Discussion, ChatMessage } from "@shared/schema";

export default function Discussions() {
  const { toast } = useToast();
  const [chatMessage, setChatMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("discussions");
  
  // WebSocket connection for chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { sendMessage, isConnected } = useWebSocket({
    chat: (data) => {
      setMessages((prev) => [...prev, data.message]);
    },
  });

  // Fetch discussions
  const { data: discussions, isLoading: discussionsLoading } = useQuery<Discussion[]>({
    queryKey: ['/api/discussions'],
  });

  // Fetch chat messages for the Live Chat tab
  const { data: chatMessages, isLoading: chatMessagesLoading } = useQuery<ChatMessage[]>({
    queryKey: ['/api/chat-messages'],
    onSuccess: (data) => {
      setMessages(data);
    },
  });

  // Auto scroll to bottom of chat when messages change
  useEffect(() => {
    if (activeTab === "live-chat" && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    if (isConnected) {
      sendMessage('chat', {
        content: chatMessage,
        userId: 1, // In a real app, this would come from auth
        username: "Guest User",
        userAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
      });
      setChatMessage("");
    } else {
      toast({
        title: "Connection issue",
        description: "Unable to send message. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl md:text-5xl mb-4">Literary Discussions</h1>
        <div className="section-divider w-36 mx-auto mb-6"></div>
        <p className="text-neutral-charcoal opacity-75 max-w-2xl mx-auto">
          Connect with fellow poetry and literature enthusiasts in our discussion forums and live chat
        </p>
      </div>

      <Tabs 
        defaultValue="discussions" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="discussions">Forum Discussions</TabsTrigger>
            <TabsTrigger value="live-chat">Live Poetry Chat</TabsTrigger>
          </TabsList>
          
          <Link href="/discussions/new">
            <Button className="bg-primary hover:bg-primary-dark text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> New Discussion
            </Button>
          </Link>
        </div>

        <TabsContent value="discussions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Literary Discussions</CardTitle>
              <CardDescription>Join ongoing conversations about poetry and cultural literature</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-gray-100">
                {discussionsLoading ? (
                  // Loading state
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="py-6 px-3">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse mr-4"></div>
                        <div className="flex-1">
                          <div className="h-6 bg-gray-200 animate-pulse mb-2 w-3/4"></div>
                          <div className="h-4 bg-gray-200 animate-pulse mb-3 w-1/2"></div>
                          <div className="h-16 bg-gray-200 animate-pulse mb-3"></div>
                          <div className="h-4 bg-gray-200 animate-pulse w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : discussions && discussions.length > 0 ? (
                  discussions.map((discussion) => (
                    <DiscussionCard key={discussion.id} discussion={discussion} />
                  ))
                ) : (
                  <div className="text-center py-10">
                    <h3 className="text-xl font-display mb-2">No discussions yet</h3>
                    <p className="text-gray-500 mb-6">Be the first to start a discussion about cultural poetry and literature</p>
                    <Link href="/discussions/new">
                      <Button className="bg-primary hover:bg-primary-dark text-white">
                        Start a Discussion
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="live-chat">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Live Poetry Chat</CardTitle>
              <CardDescription>Join real-time discussions about cultural poetry</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <div 
                className="flex-grow overflow-y-auto p-4 space-y-3 mb-4 border border-gray-200 rounded-md"
                ref={chatContainerRef}
              >
                {chatMessagesLoading ? (
                  <div className="text-center py-10">
                    <div className="mb-4">Loading chat messages...</div>
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((message, index) => (
                    <ChatMessageComponent key={message.id || index} message={message} />
                  ))
                ) : (
                  <div className="text-center py-10">
                    <div className="mb-4">No messages yet. Start the conversation!</div>
                  </div>
                )}
              </div>
              
              <form onSubmit={handleSendChatMessage} className="flex mt-auto">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
                <Button 
                  type="submit"
                  className="bg-primary text-white rounded-r-lg px-4 hover:bg-primary-dark transition-colors"
                  disabled={!isConnected}
                >
                  <i className="fas fa-paper-plane"></i>
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
