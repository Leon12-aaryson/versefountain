import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import MainLayout from '@/components/shared/MainLayout';
import { useAuth } from '@/hooks/use-auth';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Ticket, Download, QrCode } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface TicketWithEvent {
  id: number;
  eventId: number;
  userId: number;
  purchaseDate: string;
  ticketCode: string;
  event: {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    isVirtual: boolean;
    streamUrl: string | null;
    isFree: boolean;
    ticketPrice: number;
    organizer: string;
  };
}

export default function TicketsPage() {
  const { user } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<TicketWithEvent | null>(null);
  
  const { data: tickets, isLoading } = useQuery<TicketWithEvent[]>({
    queryKey: ['/api/tickets'],
    queryFn: async () => {
      const res = await fetch('/api/tickets');
      if (!res.ok) throw new Error('Failed to fetch tickets');
      return res.json();
    },
    enabled: !!user,
  });
  
  useEffect(() => {
    document.title = 'eLibrary - My Tickets';
  }, []);
  
  const upcomingTickets = tickets?.filter(ticket => new Date(ticket.event.date) > new Date())
    .sort((a, b) => new Date(a.event.date).getTime() - new Date(b.event.date).getTime());
  
  const pastTickets = tickets?.filter(ticket => new Date(ticket.event.date) <= new Date())
    .sort((a, b) => new Date(b.event.date).getTime() - new Date(a.event.date).getTime());
  
  const handleDownloadTicket = (ticket: TicketWithEvent) => {
    // In a real app, this would generate a PDF ticket
    alert(`Downloading ticket ${ticket.ticketCode} for ${ticket.event.title}`);
  };
  
  const viewTicketDetails = (ticket: TicketWithEvent) => {
    setSelectedTicket(ticket);
  };

  if (!user) {
    return (
      <MainLayout activeSection="tickets">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Ticket className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">My Tickets</h2>
            <p className="text-gray-600 max-w-md mb-6">
              You need to be logged in to view your tickets. Login or register to purchase tickets for events.
            </p>
            <Button href="/auth">
              Login or Register
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout activeSection="tickets">
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">My Tickets</h1>
          <p className="text-gray-600">Manage your tickets for upcoming and past events</p>
        </div>
        
        <Tabs defaultValue="upcoming" className="mb-6">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-6">
            {isLoading ? (
              <div className="text-center py-10">Loading your tickets...</div>
            ) : upcomingTickets && upcomingTickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingTickets.map(ticket => (
                  <Card key={ticket.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle>{ticket.event.title}</CardTitle>
                      <CardDescription>
                        {ticket.event.description?.substring(0, 100)}{ticket.event.description && ticket.event.description.length > 100 ? '...' : ''}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{format(new Date(ticket.event.date), 'EEEE, MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{format(new Date(ticket.event.date), 'h:mm a')}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{ticket.event.isVirtual ? 'Virtual Event' : ticket.event.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Ticket className="h-4 w-4 mr-2" />
                          <span>Ticket #{ticket.ticketCode}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        {ticket.event.isFree ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">Free Entry</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            ${(ticket.event.ticketPrice / 100).toFixed(2)}
                          </Badge>
                        )}
                        
                        {ticket.event.isVirtual && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">Virtual</Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        className="flex items-center"
                        onClick={() => viewTicketDetails(ticket)}
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        className="flex items-center"
                        onClick={() => handleDownloadTicket(ticket)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 flex flex-col items-center">
                <Ticket className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-800">No upcoming tickets</h3>
                <p className="text-gray-500 mt-1">You don't have any tickets for upcoming events</p>
                <Button className="mt-4" href="/events">
                  Browse Events
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="mt-6">
            {isLoading ? (
              <div className="text-center py-10">Loading your past tickets...</div>
            ) : pastTickets && pastTickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastTickets.map(ticket => (
                  <Card key={ticket.id} className="overflow-hidden opacity-80">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="transform rotate-45 bg-gray-200/50 text-gray-500 font-bold text-xl px-12 py-2">
                        PAST
                      </div>
                    </div>
                    <CardHeader className="pb-2 relative z-10">
                      <CardTitle>{ticket.event.title}</CardTitle>
                      <CardDescription>
                        {ticket.event.description?.substring(0, 100)}{ticket.event.description && ticket.event.description.length > 100 ? '...' : ''}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-sm space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{format(new Date(ticket.event.date), 'EEEE, MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{ticket.event.isVirtual ? 'Virtual Event' : ticket.event.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Ticket className="h-4 w-4 mr-2" />
                          <span>Ticket #{ticket.ticketCode}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="relative z-10">
                      <Button variant="outline" className="w-full" onClick={() => viewTicketDetails(ticket)}>
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">You don't have any tickets for past events.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Ticket Dialog */}
        {selectedTicket && (
          <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Ticket Details</DialogTitle>
                <DialogDescription>
                  Event ticket information and QR code
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg flex justify-center">
                  <div className="w-40 h-40 bg-white flex items-center justify-center border">
                    <QrCode className="h-32 w-32 text-gray-800" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">{selectedTicket.event.title}</h3>
                  <p className="text-sm text-gray-600">{selectedTicket.event.description}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Date:</div>
                  <div>{format(new Date(selectedTicket.event.date), 'EEEE, MMMM d, yyyy')}</div>
                  
                  <div className="font-medium">Time:</div>
                  <div>{format(new Date(selectedTicket.event.date), 'h:mm a')}</div>
                  
                  <div className="font-medium">Location:</div>
                  <div>{selectedTicket.event.isVirtual ? 'Virtual Event' : selectedTicket.event.location}</div>
                  
                  <div className="font-medium">Ticket ID:</div>
                  <div>{selectedTicket.ticketCode}</div>
                  
                  <div className="font-medium">Purchase Date:</div>
                  <div>{format(new Date(selectedTicket.purchaseDate), 'MMMM d, yyyy')}</div>
                </div>
                
                {selectedTicket.event.isVirtual && selectedTicket.event.streamUrl && (
                  <div className="mt-2">
                    <Button className="w-full" variant="outline">
                      Join Virtual Event
                    </Button>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Button onClick={() => handleDownloadTicket(selectedTicket)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Ticket
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  );
}
