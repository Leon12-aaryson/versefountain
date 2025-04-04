import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  Download, 
  Mail, 
  Ticket,
  QrCode
} from "lucide-react";
import type { Event } from "@shared/schema";

export default function EventTickets() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  
  // Fetch event details
  const { data: event, isLoading } = useQuery<Event>({
    queryKey: [`/api/events/${id}`],
  });
  
  const handleBack = () => {
    navigate(`/events/${id}`);
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
        <div className="w-full max-w-md animate-pulse">
          <div className="h-8 w-1/3 bg-gray-200 rounded mb-6"></div>
          <div className="h-[500px] bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-display mb-4">Event Not Found</h2>
        <p className="mb-8">The event you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/events")}>Back to Events</Button>
      </div>
    );
  }

  // If this is a virtual event, redirect to event page (no tickets needed)
  if (event.isVirtual) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-display mb-4">Virtual Event</h2>
        <p className="mb-8">This is a virtual event that doesn't require tickets. Check your email for participation details.</p>
        <Button onClick={handleBack}>Back to Event</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Button
        variant="ghost"
        className="mb-6 group"
        onClick={handleBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Event
      </Button>
      
      <h1 className="font-display text-3xl mb-6 text-center">Your Tickets</h1>
      
      <Card className="mb-10 overflow-hidden">
        {/* Ticket Header */}
        <div className="bg-primary p-4 text-white">
          <h3 className="font-display text-lg text-center">VerseFountain Cultural Event</h3>
        </div>
        
        {/* Ticket Content */}
        <CardContent className="pt-6">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <QrCode className="h-32 w-32 text-primary" />
            </div>
          </div>
          
          <h2 className="font-display text-2xl mb-4 text-center">{event.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start">
              <Calendar className="mr-3 h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Date</h4>
                <p className="text-gray-600">{formatDate(event.date)}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="mr-3 h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Time</h4>
                <p className="text-gray-600">{event.startTime} - {event.endTime}</p>
              </div>
            </div>
            
            <div className="flex items-start md:col-span-2">
              <MapPin className="mr-3 h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Location</h4>
                <p className="text-gray-600">{event.location}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-dashed my-6 pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Ticket Type</span>
              <span className="font-medium">General Admission</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Quantity</span>
              <span className="font-medium">1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Ticket ID</span>
              <span className="font-medium text-sm font-mono">VF{event.id}-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 -mx-6 px-6 py-4 font-medium text-center">
            <div className="flex items-center justify-center">
              <Ticket className="mr-2 h-5 w-5 text-primary" />
              Show this ticket at the entrance
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="justify-between border-t px-6 py-4">
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </CardFooter>
      </Card>
      
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-display text-xl mb-4">Important Information</h3>
        <ul className="space-y-2 text-gray-700">
          <li>Please arrive 15 minutes before the event starts.</li>
          <li>Your ticket will be scanned at the entrance.</li>
          <li>This ticket is non-transferable and non-refundable.</li>
          <li>For any questions, please contact us at support@versefountain.com</li>
        </ul>
      </div>
    </div>
  );
}