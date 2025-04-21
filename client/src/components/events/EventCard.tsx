import { format } from 'date-fns';
import { Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventBadge } from '@/components/ui/event-badge';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';

interface EventCardProps {
  id: number;
  title: string;
  date: string | Date;
  location: string;
  isFree: boolean;
  isVirtual: boolean;
  price?: number;
  onRegister?: () => void;
}

const EventCard = ({ 
  id, 
  title, 
  date, 
  location, 
  isFree, 
  isVirtual,
  price = 0,
  onRegister 
}: EventCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const eventDate = new Date(date);
  
  // Get the user's tickets to check if they're registered
  const { data: userTickets } = useQuery({
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
  const isRegistered = userTickets?.some((ticket: {eventId: number}) => ticket.eventId === id);
  
  const handleRegister = async () => {
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
        description: `You are already registered for ${title}`,
      });
      return;
    }
    
    if (onRegister) {
      onRegister();
      return;
    }
    
    try {
      const response = await apiRequest("POST", "/api/tickets/purchase", { eventId: id });
      const ticket = await response.json();
      
      toast({
        title: "Registration Successful",
        description: `You have successfully registered for ${title}`,
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
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price / 100);
  };

  return (
    <div className="flex border-b border-gray-100 pb-4">
      <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 bg-primary bg-opacity-10 rounded-lg mr-4">
        <span className="text-primary font-bold text-lg">
          {format(eventDate, 'd')}
        </span>
        <span className="text-primary text-xs uppercase">
          {format(eventDate, 'MMM')}
        </span>
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">
          {isVirtual ? 'Virtual Event' : location} • {format(eventDate, 'h:mm a')}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {isFree ? (
            <EventBadge variant="success">Free Entry</EventBadge>
          ) : (
            <EventBadge variant="info">
              {formatPrice(price)}
            </EventBadge>
          )}
          
          {isVirtual && (
            <EventBadge variant="secondary">Virtual</EventBadge>
          )}
        </div>
        
        <Button 
          variant={isRegistered ? "outline" : "link"}
          className={`p-0 h-6 mt-2 ${isRegistered ? 'text-green-600 cursor-default' : 'text-primary'}`}
          onClick={handleRegister}
          disabled={isRegistered}
        >
          {isRegistered ? (
            <span className="flex items-center">
              <Check className="h-4 w-4 mr-1" />
              Registered
            </span>
          ) : (
            'Register Now'
          )}
        </Button>
      </div>
    </div>
  );
};

export default EventCard;
