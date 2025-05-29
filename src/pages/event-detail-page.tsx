import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import MainLayout from '@/components/shared/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, Video, Link as LinkIcon, Globe, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { usePayment } from '@/contexts/PaymentContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

export default function EventDetailPage() {
  const { id } = useParams();
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { startCheckout, initializePaddle } = usePayment();

  // Query to get event details
  const { data: event, isLoading, isError } = useQuery<Event>({
    queryKey: ['/api/events', id],
    queryFn: async () => {
      const res = await fetch(`/api/events/${id}`);
      if (!res.ok) throw new Error('Failed to fetch event details');
      return res.json();
    },
    enabled: !!id
  });

  // Query to check if user has a ticket for this event
  const { data: userTickets, isLoading: isLoadingTickets } = useQuery({
    queryKey: ['/api/tickets/user'],
    queryFn: async () => {
      const res = await fetch('/api/tickets/user');
      if (res.status === 404) return []; // No tickets found
      if (!res.ok) throw new Error('Failed to fetch tickets');
      return res.json();
    },
    enabled: !!user, // Only run query if user is logged in
  });

  // Check if user is already registered for this event
  const isRegistered = userTickets?.some((ticket: {eventId: number}) => 
    ticket.eventId === Number(id)
  );

  // Initialize Paddle for payment processing
  useEffect(() => {
    if (user && event && !event.isFree && event.ticketPrice && event.ticketPrice > 0) {
      initializePaddle();
    }
  }, [user, event, initializePaddle]);

  // Handle event registration
  const handleRegister = async () => {
    if (!event) return;
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to register for events",
        variant: "destructive"
      });
      return;
    }

    if (isRegistered) {
      toast({
        title: "Already Registered",
        description: `You are already registered for ${event.title}`,
      });
      return;
    }

    // For paid events, use the payment system
    if (!event.isFree && event.ticketPrice && event.ticketPrice > 0) {
      try {
        await startCheckout(event);
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
      const response = await apiRequest("POST", "/api/tickets", { 
        eventId: event.id,
        user_id: user.user_id 
      });
      
      if (!response.ok) {
        throw new Error("Failed to register for event");
      }
      
      toast({
        title: "Registration Successful",
        description: `You have successfully registered for ${event.title}`,
      });
      
      // Invalidate tickets cache
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tickets/user'] });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to register for event",
        variant: "destructive"
      });
    }
  };

  // Helper function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price / 100);
  };

  // Display loading state
  if (isLoading) {
    return (
      <MainLayout activeSection="events">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center text-muted-foreground hover:text-foreground"
              onClick={() => navigate('/events')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to events
            </Button>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-40 bg-slate-200 rounded"></div>
              <div className="h-10 bg-slate-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Display error state
  if (isError || !event) {
    return (
      <MainLayout activeSection="events">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center text-muted-foreground hover:text-foreground"
              onClick={() => navigate('/events')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to events
            </Button>
          </div>
          <div className="max-w-3xl mx-auto text-center py-12">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Event Not Found</h1>
            <p className="text-gray-600">The event you're looking for doesn't exist or has been removed.</p>
            <Button 
              variant="default" 
              className="mt-6"
              onClick={() => navigate('/events')}
            >
              View All Events
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Parse event date
  const eventDate = new Date(event.date);

  return (
    <MainLayout activeSection="events">
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/events')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to events
          </Button>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">{event.title}</CardTitle>
                  <CardDescription className="flex items-center mt-2">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {format(eventDate, 'EEEE, MMMM d, yyyy • h:mm a')}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end">
                  <Badge className={`${event.isFree ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} mb-2`}>
                    {event.isFree ? 'Free Entry' : formatPrice(event.ticketPrice || 0)}
                  </Badge>
                  {event.isVirtual && (
                    <Badge variant="outline" className="border-purple-200 text-purple-800">
                      <Video className="h-3 w-3 mr-1" />
                      Virtual Event
                    </Badge>
                  )}
                  {event.category && (
                    <Badge variant="outline" className="border-gray-200 text-gray-700 mt-2">
                      {event.category}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pb-6 pt-2">
              <div className="space-y-6">
                {/* Location */}
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Location</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {event.isVirtual ? 'Virtual Event' : event.location}
                    </p>
                    {event.isVirtual && event.streamUrl && (
                      <div className="mt-2">
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          <LinkIcon className="h-3 w-3 mr-1" />
                          <span>Stream Link</span>
                        </div>
                        <a 
                          href={event.streamUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 text-sm text-blue-600 hover:underline flex items-center"
                        >
                          <Globe className="h-3 w-3 mr-1" />
                          {event.streamUrl.length > 40 ? `${event.streamUrl.slice(0, 40)}...` : event.streamUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">About this event</h3>
                  <div className="text-sm text-gray-600 whitespace-pre-line">
                    {event.description}
                  </div>
                </div>
                
                {/* Organizer */}
                {event.organizer && (
                  <div className="flex items-start">
                    <User className="h-5 w-5 mr-3 text-gray-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Organizer</h3>
                      <p className="mt-1 text-sm text-gray-600">{event.organizer}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="border-t bg-gray-50 px-6 py-4">
              <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="text-sm text-gray-600 text-center sm:text-left">
                  {isRegistered 
                    ? 'You are registered for this event' 
                    : 'Register now to reserve your spot'}
                </div>
                <Button 
                  variant={isRegistered ? "outline" : "default"}
                  className={`${isRegistered ? 'text-green-600 border-green-200' : ''} w-full sm:w-auto`}
                  onClick={handleRegister}
                  disabled={isRegistered || isLoadingTickets}
                >
                  {isRegistered 
                    ? 'Already Registered' 
                    : event.isFree 
                      ? 'Register for Free' 
                      : `Register (${formatPrice(event.ticketPrice || 0)})`}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}