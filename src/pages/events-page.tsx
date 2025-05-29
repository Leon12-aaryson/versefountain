import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import MainLayout from '@/components/shared/MainLayout';
import EventCard from '@/components/events/EventCard';
import EventCreationForm from '@/components/events/EventCreationForm';
import EventEditForm from '@/components/events/EventEditForm';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, MapPin, Users, CalendarDays, Check, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { usePayment } from '@/contexts/PaymentContext';
import { apiRequest, queryClient } from '@/lib/queryClient';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/constants';

interface Event {
  id: number;
  title: string;
  date: string;
  location?: string;
  isFree?: boolean | null;
  isVirtual?: boolean | null;
  ticketPrice?: number | null;
  organizer?: string;
  createdById?: number | null;
  description?: string;
  streamUrl?: string;
}

export default function EventsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { startCheckout, userTickets: paymentTickets, initializePaddle } = usePayment();
  
  // Update the events query
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ['/api/events'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/api/events`); // Added /api prefix
      return response.data;
    }
  });
  
  // Get the user's tickets to check registration status
  const { data: userTickets } = useQuery({
    queryKey: ['/api/tickets/user'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tickets/user`); // Added /api prefix
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!user, // Only run query if user is logged in
  });
  
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  
  useEffect(() => {
    document.title = 'VerseFountain - Events';
    // Initialize Paddle when user is logged in
    if (user) {
      initializePaddle();
    }
  }, [user, initializePaddle]);
  
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
  
  const featuredEvents = upcomingEvents?.filter(event => (event.ticketPrice || 0) > 0).slice(0, 3);

  return (
    <MainLayout activeSection="events">
      <div className="py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Events</h1>
          <p className="text-sm sm:text-base text-gray-600">Discover and join poetry readings, book launches, and literary meetups</p>
        </div>
        
        {/* Featured Events Banner */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Featured Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-6 sm:py-10 text-sm sm:text-base">Loading featured events...</div>
            ) : featuredEvents && featuredEvents.length > 0 ? (
              featuredEvents.map(event => (
                <Card key={event.id} className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-2 py-0.5 sm:px-3 sm:py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-bl-lg">
                    FEATURED
                  </div>
                  <CardHeader className="p-3 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">{event.title}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {event.description?.substring(0, 80)}{event.description && event.description.length > 80 ? '...' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                    <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {format(new Date(event.date), window.innerWidth < 640 ? 'MMM d, yyyy' : 'EEEE, MMMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                      <span className="truncate">{event.isVirtual ? 'Virtual Event' : event.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {event.isFree ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">Free Entry</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                          ${((event.ticketPrice || 0) / 100).toFixed(2)}
                        </Badge>
                      )}
                      
                      {event.isVirtual && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">Virtual</Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-3 pt-0 sm:p-6 sm:pt-0">
                    {(() => {
                      // Check if the user is already registered for this event
                      const isRegistered = userTickets?.some((ticket: {eventId: number}) => ticket.eventId === event.id);
                      
                      // Show edit button and registration button
                      return (
                        <div className="flex flex-col w-full space-y-2">
                          {/* Registration button */}
                          {isRegistered ? (
                            <Button 
                              className="w-full h-8 sm:h-10 text-xs sm:text-sm" 
                              variant="outline" 
                              disabled 
                            >
                              <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              Registered
                            </Button>
                          ) : (
                            <Button 
                              className="w-full h-8 sm:h-10 text-xs sm:text-sm" 
                              onClick={async () => {
                                if (!user) {
                                  toast({
                                    title: "Authentication Required",
                                    description: "Please log in to register for events",
                                    variant: "destructive"
                                  });
                                  return;
                                }
                                
                                // For paid events, use the payment system
                                if (!event.isFree && (event.ticketPrice || 0) > 0) {
                                  try {
                                    // Start the Paddle checkout flow
                                    await startCheckout({ ...event, description: event.description || "" });
                                  } catch (error) {
                                    toast({
                                      title: "Payment Error",
                                      description: error instanceof Error ? error.message : "Failed to process payment",
                                      variant: "destructive"
                                    });
                                  }
                                  return;
                                }
                                
                                // For free events, create a ticket directly
                                try {
                                  // Free event registration
                                  const response = await axios.post(`${API_BASE_URL}/api/tickets`, { // Added /api prefix
                                    eventId: event.id,
                                    user_id: user.user_id
                                  });
                                  
                                  toast({
                                    title: "Registration Successful",
                                    description: `You have successfully registered for ${event.title}`,
                                  });
                                  
                                  // Invalidate tickets cache
                                  queryClient.invalidateQueries({ queryKey: ['/api/tickets/user'] });
                                } catch (error) {
                                  toast({
                                    title: "Registration Failed",
                                    description: axios.isAxiosError(error) 
                                      ? error.response?.data?.message || error.message 
                                      : "Failed to register for event",
                                    variant: "destructive"
                                  });
                                }
                              }}
                            >
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              Register Now
                            </Button>
                          )}

                          {/* Edit button if user created this event */}
                          {user && user.user_id && event.createdById && user.user_id === event.createdById && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  className="w-full h-8 sm:h-10 text-xs sm:text-sm"
                                >
                                  <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                  Edit Event
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Event</DialogTitle>
                                  <DialogDescription>
                                    Make changes to your event details
                                  </DialogDescription>
                                </DialogHeader>
                                <EventEditForm event={event} />
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      );
                    })()}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-6 sm:py-10">
                <p className="text-sm sm:text-base text-gray-500">No featured events currently scheduled.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Event Calendar Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Upcoming Events</h2>
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mr-1 sm:mr-2" />
              <select
                className="bg-white border border-gray-300 text-gray-700 text-xs sm:text-sm py-1 px-2 sm:px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
          
          <div className="overflow-x-auto -mx-2 px-2 mb-4 sm:mb-6">
            <Tabs defaultValue="all" className="w-max min-w-full">
              <TabsList className="h-8 sm:h-10 text-xs sm:text-sm">
                <TabsTrigger value="all" className="h-7 sm:h-9 px-2 sm:px-4">All Events</TabsTrigger>
                <TabsTrigger value="poetry" className="h-7 sm:h-9 px-2 sm:px-4">Poetry</TabsTrigger>
                <TabsTrigger value="book" className="h-7 sm:h-9 px-2 sm:px-4">Book Launches</TabsTrigger>
                <TabsTrigger value="workshop" className="h-7 sm:h-9 px-2 sm:px-4">Workshops</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <Card>
            <CardContent className="p-3 sm:p-6">
              {isLoading ? (
                <div className="text-center py-6 sm:py-10 text-sm sm:text-base">Loading events...</div>
              ) : upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="py-3 sm:py-4 first:pt-0 last:pb-0">
                      <EventCard
                        id={event.id}
                        title={event.title}
                        date={event.date}
                        location={event.location || ""}
                        isFree={event.isFree === null || event.isFree === undefined ? true : event.isFree}
                        isVirtual={event.isVirtual === null || event.isVirtual === undefined ? false : event.isVirtual}
                        price={event.ticketPrice || 0}
                        organizer={event.organizer || ""}
                        createdById={event.createdById || undefined}
                        description={event.description || ""}
                        streamUrl={event.streamUrl || ""}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 flex flex-col items-center">
                  <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-800">No events found</h3>
                  <p className="text-sm sm:text-base text-gray-500 mt-1">Check back later for upcoming events</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Community Events Section */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-4 sm:p-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:w-2/3">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">Host Your Own Literary Event</h2>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Are you organizing a poetry reading, book club meeting, or author workshop? Partner with us to list your event and sell tickets through our platform.</p>
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="default" size="sm" className="h-8 sm:h-10 text-xs sm:text-sm">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Become an Organizer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create New Event</DialogTitle>
                        <DialogDescription>
                          Fill out the form below to create a new literary event.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <EventCreationForm />
                      
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" className="h-8 sm:h-10 text-xs sm:text-sm">Learn More</Button>
                </div>
              </div>
              <div className="w-full md:w-1/3 flex justify-center mt-2 md:mt-0">
                <img 
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
                  alt="Literary event" 
                  className="rounded-lg max-w-[180px] sm:max-w-[200px]" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
