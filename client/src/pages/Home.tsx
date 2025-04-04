import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import PoetryCard from "@/components/poetry/PoetryCard";
import BookCard from "@/components/books/BookCard";
import DiscussionCard from "@/components/discussions/DiscussionCard";
import EventCard from "@/components/events/EventCard";
import CulturalCategoryComponent from "@/components/home/CulturalCategory";
import AcademicResourceCard from "@/components/home/AcademicResourceCard";
import Newsletter from "@/components/home/Newsletter";
import ChatMessageComponent from "@/components/discussions/ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useState, useRef, useEffect } from "react";
import type { Poem, Book, Discussion, Event, CulturalCategory, AcademicResource, ChatMessage } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const [chatMessage, setChatMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // WebSocket connection for chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { sendMessage, isConnected } = useWebSocket({
    chat: (data) => {
      setMessages((prev) => [...prev, data.message]);
    },
  });

  // Fetch poetry
  const { data: poems } = useQuery<Poem[]>({
    queryKey: ['/api/poems?limit=3'],
  });

  // Fetch cultural categories
  const { data: categories } = useQuery<CulturalCategory[]>({
    queryKey: ['/api/cultural-categories'],
  });

  // Fetch books
  const { data: books } = useQuery<Book[]>({
    queryKey: ['/api/books?limit=5'],
  });

  // Fetch discussions
  const { data: discussions } = useQuery<Discussion[]>({
    queryKey: ['/api/discussions?limit=3'],
  });

  // Fetch chat messages
  const { data: chatMessages } = useQuery<ChatMessage[]>({
    queryKey: ['/api/chat-messages?limit=10'],
    onSuccess: (data) => {
      setMessages(data);
    },
  });

  // Fetch events
  const { data: events } = useQuery<Event[]>({
    queryKey: ['/api/events?limit=3'],
  });

  // Fetch academic resources
  const { data: academicResources } = useQuery<AcademicResource[]>({
    queryKey: ['/api/academic-resources'],
  });

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
    <main className="container mx-auto px-4 md:px-6 pb-16">
      {/* QuickNav - Mobile only */}
      <div className="sticky top-0 z-20 bg-neutral-cream border-b border-gray-200 py-3 px-4 mb-10 overflow-x-auto whitespace-nowrap md:hidden">
        <div className="flex space-x-6">
          <Link href="/poetry" className="text-neutral-charcoal font-medium hover:text-primary transition-colors">Poetry</Link>
          <Link href="/books" className="text-neutral-charcoal font-medium hover:text-primary transition-colors">Books</Link>
          <Link href="/discussions" className="text-neutral-charcoal font-medium hover:text-primary transition-colors">Discussions</Link>
          <Link href="/events" className="text-neutral-charcoal font-medium hover:text-primary transition-colors">Events</Link>
          <Link href="/academics" className="text-neutral-charcoal font-medium hover:text-primary transition-colors">Academics</Link>
        </div>
      </div>

      {/* Featured Poetry */}
      <section id="featured" className="mb-20">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-3">Featured Poetry</h2>
          <div className="section-divider w-24 mx-auto mb-4"></div>
          <p className="text-neutral-charcoal opacity-75 max-w-2xl mx-auto">
            Explore our curated collection of poetry celebrating traditions and cultural identity from around the world.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {poems?.map((poem) => (
            <PoetryCard key={poem.id} poem={poem} />
          ))}
          
          {!poems && (
            <div className="col-span-3 text-center py-10">
              <div className="mb-4">Loading featured poetry...</div>
            </div>
          )}
          
          {poems?.length === 0 && (
            <div className="col-span-3 text-center py-10">
              <div className="mb-4">No poetry available yet. Check back soon!</div>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/poetry" className="inline-flex items-center font-sans text-primary hover:text-primary-dark transition-colors">
            Explore all poetry <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
      </section>

      {/* Cultural Categories */}
      <section className="mb-20 py-12 px-6 bg-secondary bg-opacity-10 rounded-xl">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl mb-3">Cultural Categories</h2>
          <div className="section-divider w-24 mx-auto mb-4"></div>
          <p className="text-neutral-charcoal opacity-75 max-w-2xl mx-auto">
            Explore poetry and literature from different cultural traditions around the world.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories?.map((category) => (
            <CulturalCategoryComponent key={category.id} category={category} />
          ))}
          
          {!categories && (
            <div className="col-span-6 text-center py-10">
              <div className="mb-4">Loading cultural categories...</div>
            </div>
          )}
        </div>
      </section>

      {/* Books Section */}
      <section id="books" className="mb-20">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-3">Explore Books</h2>
          <div className="section-divider w-24 mx-auto mb-4"></div>
          <p className="text-neutral-charcoal opacity-75 max-w-2xl mx-auto">
            Discover our collection of books celebrating traditional cultures and local heritage.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center mb-8 space-x-2">
          <Link href="/books" className="bg-primary text-white px-4 py-2 rounded-full text-sm mb-2">
            All Categories
          </Link>
          <Link href="/books?category=Cultural Studies" className="bg-white hover:bg-gray-100 text-neutral-charcoal px-4 py-2 rounded-full text-sm mb-2">
            Cultural Studies
          </Link>
          <Link href="/books?category=Traditional Tales" className="bg-white hover:bg-gray-100 text-neutral-charcoal px-4 py-2 rounded-full text-sm mb-2">
            Traditional Tales
          </Link>
          <Link href="/books?category=Poetry Collections" className="bg-white hover:bg-gray-100 text-neutral-charcoal px-4 py-2 rounded-full text-sm mb-2">
            Poetry Collections
          </Link>
          <Link href="/books?category=Historical" className="bg-white hover:bg-gray-100 text-neutral-charcoal px-4 py-2 rounded-full text-sm mb-2">
            Historical
          </Link>
          <Link href="/books?category=Modern Interpretations" className="bg-white hover:bg-gray-100 text-neutral-charcoal px-4 py-2 rounded-full text-sm mb-2">
            Modern Interpretations
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          {books?.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
          
          {!books && (
            <div className="col-span-5 text-center py-10">
              <div className="mb-4">Loading books...</div>
            </div>
          )}
        </div>
        
        <div className="mt-10 text-center">
          <Link href="/books" className="inline-flex items-center font-sans text-primary hover:text-primary-dark transition-colors">
            Browse all books <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
      </section>

      {/* Discussion Section */}
      <section id="discussions" className="mb-20">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-3">Join the Conversation</h2>
          <div className="section-divider w-24 mx-auto mb-4"></div>
          <p className="text-neutral-charcoal opacity-75 max-w-2xl mx-auto">
            Connect with fellow poetry and literature enthusiasts in our discussion forums.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-display text-xl mb-1">Popular Discussions</h3>
                <p className="text-sm text-gray-500">Join ongoing conversations about poetry and cultural literature</p>
              </div>
              
              <div className="divide-y divide-gray-100">
                {discussions?.map((discussion) => (
                  <DiscussionCard key={discussion.id} discussion={discussion} />
                ))}
                
                {!discussions && (
                  <div className="text-center py-10">
                    <div className="mb-4">Loading discussions...</div>
                  </div>
                )}
                
                {discussions?.length === 0 && (
                  <div className="text-center py-10">
                    <div className="mb-4">No discussions yet. Start one!</div>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
                <Link href="/discussions" className="text-primary hover:text-primary-dark text-sm font-medium">
                  View all discussions
                </Link>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-display text-xl mb-1">Live Poetry Chat</h3>
                <p className="text-sm text-gray-500">Join real-time discussions about cultural poetry</p>
              </div>
              
              <div className="h-64 overflow-y-auto p-4 space-y-3" ref={chatContainerRef}>
                {messages?.map((message, index) => (
                  <ChatMessageComponent key={message.id || index} message={message} />
                ))}
                
                {!messages && (
                  <div className="text-center py-6">
                    <div>Loading messages...</div>
                  </div>
                )}
                
                {messages?.length === 0 && (
                  <div className="text-center py-6">
                    <div>No messages yet. Start the conversation!</div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendChatMessage} className="flex">
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1 rounded-l-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                  />
                  <Button 
                    type="submit"
                    className="bg-primary text-white rounded-r-lg px-4 py-2 hover:bg-primary-dark transition-colors"
                    disabled={!isConnected}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="mb-20">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-3">Upcoming Events</h2>
          <div className="section-divider w-24 mx-auto mb-4"></div>
          <p className="text-neutral-charcoal opacity-75 max-w-2xl mx-auto">
            Join poetry readings, book launches, and cultural celebrations both online and in-person.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          
          {!events && (
            <div className="col-span-3 text-center py-10">
              <div className="mb-4">Loading upcoming events...</div>
            </div>
          )}
          
          {events?.length === 0 && (
            <div className="col-span-3 text-center py-10">
              <div className="mb-4">No upcoming events at this time. Check back soon!</div>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/events" className="inline-flex items-center font-sans text-primary hover:text-primary-dark transition-colors">
            See all upcoming events <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
      </section>

      {/* Academics Section */}
      <section id="academics" className="mb-20 py-12 px-6 bg-neutral-charcoal text-white rounded-xl">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-3">Academic Resources</h2>
          <div className="w-24 mx-auto mb-4 h-px" style={{ backgroundImage: "linear-gradient(90deg, transparent, #F7F3EB, transparent)" }}></div>
          <p className="text-white opacity-75 max-w-2xl mx-auto">
            Explore scholarly resources on cultural literature, poetry, and traditional storytelling.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {academicResources?.map((resource) => (
            <AcademicResourceCard key={resource.id} resource={resource} />
          ))}
          
          {!academicResources && (
            <div className="col-span-3 text-center py-10 text-white">
              <div className="mb-4">Loading academic resources...</div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />
    </main>
  );
}
