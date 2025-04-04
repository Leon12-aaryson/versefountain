import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowLeft, 
  Share2, 
  Video,
  Ticket,
  CalendarCheck 
} from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@shared/schema";

export default function EventDetails() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Fetch event details
  const { data: event, isLoading } = useQuery<Event>({
    queryKey: [`/api/events/${id}`],
  });
  
  // Register or get tickets mutation
  const attendMutation = useMutation({
    mutationFn: async () => {
      await apiRequest(`/api/events/${id}/attend`, {
        method: "POST"
      });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: event?.isVirtual 
          ? "You have successfully registered for this event." 
          : "You will be redirected to the tickets page.",
        variant: "default",
      });
      
      // Invalidate event query to refresh attendee count
      queryClient.invalidateQueries({ queryKey: [`/api/events/${id}`] });
      
      // If not virtual, navigate to tickets page
      if (!event?.isVirtual) {
        navigate(`/events/${id}/tickets`);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was a problem processing your request. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleBack = () => {
    navigate("/events");
  };
  
  const handleAttend = () => {
    attendMutation.mutate();
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-4xl animate-pulse">
          <div className="h-8 w-1/3 bg-gray-200 rounded mb-6"></div>
          <div className="h-[350px] bg-gray-200 rounded-lg mb-8"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-display mb-4">Event Not Found</h2>
        <p className="mb-8">The event you're looking for doesn't exist or has been removed.</p>
        <Button onClick={handleBack}>Back to Events</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Button
        variant="ghost"
        className="mb-6 group"
        onClick={handleBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Events
      </Button>
      
      {/* Event Banner */}
      <div className="rounded-xl overflow-hidden h-64 md:h-80 lg:h-96 mb-8 relative">
        <img
          src={event.coverImage || '/placeholder-event.jpg'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent py-10 px-6">
          <Badge 
            className={`mb-3 ${event.isVirtual ? 'bg-secondary' : 'bg-primary'}`}
          >
            {event.isVirtual ? 'Virtual Event' : 'In-Person Event'}
          </Badge>
          <h1 className="text-white text-3xl md:text-4xl font-display">{event.title}</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Event Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <h2 className="font-display text-2xl mb-4">About this event</h2>
              
              <p className="text-gray-800 leading-relaxed mb-6">
                {event.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start">
                  <Calendar className="mr-3 h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Date and Time</h4>
                    <p className="text-gray-600 text-sm">{formatDate(event.date)}</p>
                    <p className="text-gray-600 text-sm">{event.startTime} - {event.endTime}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  {event.isVirtual ? (
                    <Video className="mr-3 h-5 w-5 text-primary mt-0.5" />
                  ) : (
                    <MapPin className="mr-3 h-5 w-5 text-primary mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-medium mb-1">Location</h4>
                    <p className="text-gray-600 text-sm">{event.location}</p>
                    {!event.isVirtual && (
                      <Button variant="link" className="text-primary p-0 h-auto text-sm">
                        View Map
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mb-6">
                <Button variant="outline" className="flex-1 md:flex-none">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" className="flex-1 md:flex-none">
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  Add to Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Registration/Tickets Card */}
        <div>
          <Card className="sticky top-6">
            <CardContent className="pt-6">
              <div className={`flex items-center justify-center w-14 h-14 rounded mb-4 ${event.isVirtual ? 'bg-secondary' : 'bg-primary'} text-white`}>
                {event.isVirtual ? (
                  <Video className="h-6 w-6" />
                ) : (
                  <Ticket className="h-6 w-6" />
                )}
              </div>
              
              <h3 className="font-display text-xl mb-1">
                {event.isVirtual ? 'Registration' : 'Tickets'}
              </h3>
              
              <div className="flex items-center text-gray-600 mb-4">
                <Users className="mr-2 h-4 w-4" />
                <span>{event.attendees} people attending</span>
              </div>
              
              <div className="border-t border-b py-4 my-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Price</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Availability</span>
                  <span className="font-medium">Open</span>
                </div>
              </div>
              
              <Button 
                className="w-full text-lg py-6" 
                onClick={handleAttend}
                disabled={attendMutation.isPending}
              >
                {event.isVirtual ? 'Register Now' : 'Get Tickets'}
                {attendMutation.isPending && (
                  <div className="ml-2 w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                )}
              </Button>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                {event.isVirtual 
                  ? 'You will receive a confirmation email with the link to join.'
                  : 'Secure your spot at this cultural event today.'
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}