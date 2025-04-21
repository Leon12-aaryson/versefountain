import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import MainLayout from '@/components/shared/MainLayout';
import EventCard from '@/components/events/EventCard';
import { Event } from '@shared/schema';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Users, CalendarDays } from 'lucide-react';

export default function EventsPage() {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ['/api/events'],
    queryFn: async () => {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('Failed to fetch events');
      return res.json();
    }
  });
  
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  
  useEffect(() => {
    document.title = 'Versefountain - Events';
  }, []);
  
  const getUniqueMonths = () => {
    if (!events) return [];
    
    const months = new Set();
    events.forEach(event => {
      const month = format(new Date(event.date), 'MMMM');
      months.add(month);
    });
    
    return Array.from(months) as string[];
  };
  
  const filteredEvents = events?.filter(event => {
    if (selectedMonth === 'all') return true;
    return format(new Date(event.date), 'MMMM') === selectedMonth;
  });
  
  const upcomingEvents = filteredEvents?.filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const featuredEvents = upcomingEvents?.filter(event => event.ticketPrice > 0).slice(0, 3);

  return (
    <MainLayout activeSection="events">
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Events</h1>
          <p className="text-gray-600">Discover and join poetry readings, book launches, and literary meetups</p>
        </div>
        
        {/* Featured Events Banner */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Featured Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-10">Loading featured events...</div>
            ) : featuredEvents && featuredEvents.length > 0 ? (
              featuredEvents.map(event => (
                <Card key={event.id} className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-bl-lg">
                    FEATURED
                  </div>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>
                      {event.description?.substring(0, 100)}{event.description && event.description.length > 100 ? '...' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.isVirtual ? 'Virtual Event' : event.location}</span>
                    </div>
                    <div className="flex space-x-2">
                      {event.isFree ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Free Entry</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          ${(event.ticketPrice / 100).toFixed(2)}
                        </Badge>
                      )}
                      
                      {event.isVirtual && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">Virtual</Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Register Now</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">No featured events currently scheduled.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Event Calendar Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
            <div className="flex items-center">
              <CalendarDays className="h-5 w-5 text-gray-500 mr-2" />
              <select
                className="bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="all">All Months</option>
                {getUniqueMonths().map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="poetry">Poetry</TabsTrigger>
              <TabsTrigger value="book">Book Launches</TabsTrigger>
              <TabsTrigger value="workshop">Workshops</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Card>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="text-center py-10">Loading events...</div>
              ) : upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="py-4 first:pt-0 last:pb-0">
                      <EventCard
                        id={event.id}
                        title={event.title}
                        date={event.date}
                        location={event.location}
                        isFree={event.isFree}
                        isVirtual={event.isVirtual}
                        price={event.ticketPrice}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 flex flex-col items-center">
                  <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-800">No events found</h3>
                  <p className="text-gray-500 mt-1">Check back later for upcoming events</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Community Events Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Host Your Own Literary Event</h2>
                <p className="text-gray-600 mb-4">Are you organizing a poetry reading, book club meeting, or author workshop? Partner with us to list your event and sell tickets through our platform.</p>
                <div className="flex space-x-4">
                  <Button variant="default">
                    <Users className="h-4 w-4 mr-2" />
                    Become an Organizer
                  </Button>
                  <Button variant="outline">Learn More</Button>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center mt-6 md:mt-0">
                <img 
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
                  alt="Literary event" 
                  className="rounded-lg max-w-full md:max-w-[200px]" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
