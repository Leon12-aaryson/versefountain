import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventBadge } from '@/components/ui/event-badge';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

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
  
  const handleRegister = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to register for events",
        variant: "destructive"
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
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
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
          variant="link" 
          className="text-primary p-0 h-6 mt-2"
          onClick={handleRegister}
        >
          Register Now
        </Button>
      </div>
    </div>
  );
};

export default EventCard;
