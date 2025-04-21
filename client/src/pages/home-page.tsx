import { useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/shared/MainLayout';
import BookCard from '@/components/books/BookCard';
import EventCard from '@/components/events/EventCard';
import ResourceCard from '@/components/academics/ResourceCard';
import PoetryCard from '@/components/poetry/PoetryCard';
import { Button } from '@/components/ui/button';
import { Book, Poem, Event, AcademicResource } from '@shared/schema';

export default function HomePage() {
  // Fetch featured poems
  const { data: poems } = useQuery<Poem[]>({
    queryKey: ['/api/poems'],
    queryFn: async () => {
      const res = await fetch('/api/poems?limit=2');
      if (!res.ok) throw new Error('Failed to fetch poems');
      return res.json();
    }
  });

  // Fetch popular books
  const { data: books } = useQuery<Book[]>({
    queryKey: ['/api/books'],
    queryFn: async () => {
      const res = await fetch('/api/books?limit=5');
      if (!res.ok) throw new Error('Failed to fetch books');
      return res.json();
    }
  });

  // Fetch upcoming events
  const { data: events } = useQuery<Event[]>({
    queryKey: ['/api/events'],
    queryFn: async () => {
      const res = await fetch('/api/events?limit=2');
      if (!res.ok) throw new Error('Failed to fetch events');
      return res.json();
    }
  });

  // Fetch academic resources
  const { data: resources } = useQuery<AcademicResource[]>({
    queryKey: ['/api/academic-resources'],
    queryFn: async () => {
      const res = await fetch('/api/academic-resources?limit=3');
      if (!res.ok) throw new Error('Failed to fetch academic resources');
      return res.json();
    }
  });

  useEffect(() => {
    document.title = 'Versefountain - Home';
  }, []);

  return (
    <MainLayout activeSection="home">
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
              alt="Library books on shelves" 
              className="w-full h-48 md:h-64 lg:h-96 object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-end p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">Welcome to Versefountain</h1>
              <p className="text-sm md:text-base text-gray-200 max-w-lg">Discover a world of poetry, books, and academic resources. Connect with a community of readers and writers.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/poetry">
                  <Button className="bg-primary hover:bg-blue-700 text-white">
                    Explore Poetry
                  </Button>
                </Link>
                <Link href="/books">
                  <Button variant="secondary" className="bg-white hover:bg-gray-100 text-gray-800">
                    Browse Books
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Featured Poetry */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Featured Poetry</h2>
              <Link href="/poetry">
                <span className="text-primary text-sm font-medium cursor-pointer">View All</span>
              </Link>
            </div>
            <div className="space-y-4">
              {poems && poems.length > 0 ? (
                poems.map((poem) => (
                  <div key={poem.id} className="border-b border-gray-100 pb-4">
                    <p className="text-gray-700 italic mb-2">{poem.content.length > 100 ? `${poem.content.substring(0, 100)}...` : poem.content}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-2">
                          {poem.author?.username.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{poem.author?.username || 'Anonymous'}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-4">No featured poetry available</div>
              )}
            </div>
          </div>
          
          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
              <Link href="/events">
                <span className="text-primary text-sm font-medium cursor-pointer">View All</span>
              </Link>
            </div>
            <div className="space-y-4">
              {events && events.length > 0 ? (
                events.map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    date={event.date}
                    location={event.location}
                    isFree={event.isFree}
                    isVirtual={event.isVirtual}
                    price={event.ticketPrice}
                  />
                ))
              ) : (
                <div className="text-gray-500 text-center py-4">No upcoming events</div>
              )}
            </div>
          </div>
        </div>

        {/* Books Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Popular Books</h2>
            <Link href="/books">
              <span className="text-primary text-sm font-medium cursor-pointer">Browse Library</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {books && books.length > 0 ? (
              books.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  coverImage={book.coverImage}
                />
              ))
            ) : (
              <div className="text-gray-500 col-span-full text-center py-8">No books available</div>
            )}
          </div>
        </div>

        {/* Academic Resources */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Academic Resources</h2>
            <Link href="/academics">
              <span className="text-primary text-sm font-medium cursor-pointer">View All</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {resources && resources.length > 0 ? (
              resources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  id={resource.id}
                  title={resource.title}
                  description={resource.description || ''}
                  type={resource.type}
                />
              ))
            ) : (
              <div className="text-gray-500 col-span-full text-center py-8">No academic resources available</div>
            )}
          </div>
        </div>

        {/* Community Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Join Our Community</h2>
          </div>
          <p className="text-gray-600 mb-4">Connect with fellow readers, writers, and poetry enthusiasts in our vibrant community.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-800 mb-1">Chat Rooms</h3>
              <p className="text-sm text-gray-600 mb-3">Join real-time discussions about books and poetry</p>
              <Link href="/chat">
                <span className="text-primary text-sm font-medium mt-auto cursor-pointer">Explore Chat Rooms</span>
              </Link>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-800 mb-1">Share Your Poetry</h3>
              <p className="text-sm text-gray-600 mb-3">Submit your own poetry and get feedback from the community</p>
              <Link href="/poetry">
                <span className="text-primary text-sm font-medium mt-auto cursor-pointer">Submit Poetry</span>
              </Link>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-800 mb-1">Attend Events</h3>
              <p className="text-sm text-gray-600 mb-3">Join poetry readings, book launches, and author meetups</p>
              <Link href="/events">
                <span className="text-primary text-sm font-medium mt-auto cursor-pointer">View Events</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white mb-2">Upgrade Your Experience</h2>
            <p className="text-blue-100">Get unlimited access to all premium features with a subscription plan</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Free Plan */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-2">Free</h3>
              <p className="text-white/80 text-sm mb-4">Basic access for casual readers</p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start text-sm text-white/90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-300 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Read public poetry and books</span>
                </li>
                <li className="flex items-start text-sm text-white/90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-300 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Browse event listings</span>
                </li>
                <li className="flex items-start text-sm text-white/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/30 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>No interaction features</span>
                </li>
              </ul>
              <Button className="w-full bg-white/20 hover:bg-white/30 text-white">
                Current Plan
              </Button>
            </div>
            
            {/* Standard Plan */}
            <div className="bg-white rounded-lg p-5 transform scale-105 shadow-lg relative">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Standard</h3>
              <p className="text-gray-600 text-sm mb-1">Full access for dedicated readers</p>
              <div className="text-xl font-bold text-gray-800 mb-4">$4.99<span className="text-sm font-normal text-gray-600">/month</span></div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start text-sm text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Full library access</span>
                </li>
                <li className="flex items-start text-sm text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Participate in chat rooms</span>
                </li>
                <li className="flex items-start text-sm text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Submit your own poetry</span>
                </li>
              </ul>
              <Button className="w-full bg-primary hover:bg-blue-700 text-white">
                Subscribe Now
              </Button>
            </div>
            
            {/* Premium Plan */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-2">Premium</h3>
              <p className="text-white/80 text-sm mb-1">Ultimate experience for enthusiasts</p>
              <div className="text-xl font-bold text-white mb-4">$9.99<span className="text-sm font-normal text-white/70">/month</span></div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start text-sm text-white/90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-300 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Everything in Standard</span>
                </li>
                <li className="flex items-start text-sm text-white/90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-300 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Create private chat rooms</span>
                </li>
                <li className="flex items-start text-sm text-white/90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-300 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Event ticket discounts</span>
                </li>
              </ul>
              <Button variant="secondary" className="w-full bg-white hover:bg-white/90 text-blue-600">
                Upgrade
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
