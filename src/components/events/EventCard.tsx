import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { Calendar, Check, Edit, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventBadge } from '@/components/ui/event-badge';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { usePayment } from '@/contexts/PaymentContext';
import axios from "axios";
import { API_BASE_URL } from "@/constants/constants";
import { queryClient } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EventEditForm from './EventEditForm';


interface EventCardProps {
  id: number;
  title: string;
  date: string | Date;
  location: string;
  isFree: boolean;
  isVirtual: boolean;
  price?: number;
  organizer?: string;
  createdById?: number;
  description?: string;
  streamUrl?: string;
  onRegister?: () => void;
  fullEvent?: Event; // For the edit form
}

// First, define an interface for the ticket type
interface Ticket {
  eventId: number;
  // Add other ticket properties if needed
}

const EventCard = ({ 
  id, 
  title, 
  date, 
  location, 
  isFree, 
  isVirtual,
  price = 0,
  organizer,
  createdById,
  description,
  streamUrl,
  onRegister,
  fullEvent
}: EventCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { startCheckout, userTickets: paymentTickets, initializePaddle } = usePayment();
  const eventDate = new Date(date);
  const [_, navigate] = useLocation();
  
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
  const isRegistered = Array.isArray(userTickets) 
    ? userTickets.some((ticket: Ticket) => ticket.eventId === id)
    : false;
  
  // Initialize Paddle on component mount
  useEffect(() => {
    if (user && !isFree && price > 0) {
      initializePaddle();
    }
  }, [user, isFree, price, initializePaddle]);

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
    
    // For paid events, use the payment system
    if (!isFree && price > 0) {
      try {
        // Create an event object that matches what startCheckout expects
        const event = {
          id,
          title,
          date: typeof date === 'string' ? date : eventDate.toISOString(),
          location: location || '',
          isFree: isFree as boolean | null,
          isVirtual: isVirtual as boolean | null,
          description: description || "",
          ticketPrice: price,
          organizer: organizer || null,
          streamUrl: streamUrl || null,
          createdById: createdById || null,
          // category property removed as it does not exist on Event
        };
        
        // Start the Paddle checkout flow
        await startCheckout(event);
        return;
      } catch (error) {
        toast({
          title: "Payment Error",
          description: error instanceof Error ? error.message : "Failed to process payment",
          variant: "destructive"
        });
        return;
      }
    }
    
    // For free events, create a ticket directly
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/tickets`,
        { 
          eventId: id,
          user_id: user.user_id 
        }
      );
      
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to register for event");
      }
      
      const ticket = response.data;
      
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
    <div className="flex flex-col sm:flex-row border-b border-gray-100 pb-4 gap-3 sm:gap-4">
      {/* Date box - slightly smaller on mobile */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-primary bg-opacity-10 rounded-lg">
        <span className="text-primary font-bold text-base sm:text-lg">
          {format(eventDate, 'd')}
        </span>
        <span className="text-primary text-xs uppercase">
          {format(eventDate, 'MMM')}
        </span>
      </div>
      
      <div className="flex-1">
        {/* Event title - easier to read on mobile */}
        <h3 
          className="font-medium text-gray-800 hover:text-primary hover:underline cursor-pointer text-sm sm:text-base"
          onClick={() => navigate(`/events/${id}`)}
        >
          {title}
        </h3>
        
        {/* Event details - smaller on mobile */}
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {isVirtual ? 'Virtual Event' : location} • {format(eventDate, 'h:mm a')}
        </p>
        
        {/* Event badges */}
        <div className="mt-2 flex flex-wrap gap-1 sm:gap-2">
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
        
        {/* Action buttons - mobile-friendly layout */}
        <div className="flex flex-wrap gap-3 mt-3">
          {/* Register button */}
          <Button 
            variant={isRegistered ? "outline" : "default"}
            size="sm"
            className={`${isRegistered ? 'text-green-600 border-green-200 bg-green-50' : 'text-white'} 
                        text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3`}
            onClick={handleRegister}
            disabled={isRegistered}
          >
            {isRegistered ? (
              <span className="flex items-center">
                <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Registered
              </span>
            ) : (
              <span className="flex items-center">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Register Now
              </span>
            )}
          </Button>
          
          {/* Event details button */}
          <Button
            variant="outline"
            size="sm"
            className="h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3 text-primary"
            onClick={() => navigate(`/events/${id}`)}
          >
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            View Details
          </Button>
          
          {/* Edit button for event creators */}
          {user && createdById && user.user_id === createdById && fullEvent && (
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Event</DialogTitle>
                  <DialogDescription>
                    Make changes to your event details
                  </DialogDescription>
                </DialogHeader>
                <EventEditForm event={fullEvent} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
