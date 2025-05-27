import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import MainLayout from '@/components/shared/MainLayout';
import { queryClient } from '@/lib/queryClient';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
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
  DialogTitle
} from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Ticket, Download, QrCode, ArrowLeft, User, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface TicketWithEvent {
  id: number;
  eventId: number;
  userId: number;
  purchaseDate: string;
  ticketCode: string;
  status: string;
  paymentId?: number;
  isRefunded?: boolean;
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
  const { toast } = useToast();
  const [selectedTicket, setSelectedTicket] = useState<TicketWithEvent | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [location, navigate] = useLocation();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  
  // Parse URL parameters to get ticket ID if present
  const searchParams = new URLSearchParams(window.location.search);
  const ticketId = searchParams.get('ticketId');
  const [detailView, setDetailView] = useState(!!ticketId);
  
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
    document.title = 'VerseFountain - My Tickets';
    
    // If a ticket ID is provided in the URL, find and select that ticket
    if (ticketId && tickets) {
      const ticket = tickets.find(t => t.id === parseInt(ticketId));
      if (ticket) {
        setSelectedTicket(ticket);
        setDetailView(true);
      } else {
        toast({
          title: "Ticket Not Found",
          description: "The requested ticket could not be found.",
          variant: "destructive",
        });
        // Remove the query parameter
        navigate('/tickets', { replace: true });
      }
    }
  }, [ticketId, tickets, toast, navigate]);
  
  // Generate QR code when a ticket is selected
  useEffect(() => {
    if (selectedTicket) {
      generateQRCode(selectedTicket);
    } else {
      setQrCodeDataUrl(null);
    }
  }, [selectedTicket]);
  
  // Function to generate QR code with detailed ticket information
  const generateQRCode = async (ticket: TicketWithEvent) => {
    try {
      // Create a detailed JSON object with all ticket and event information
      const ticketData = {
        ticketId: ticket.id,
        ticketCode: ticket.ticketCode,
        eventId: ticket.eventId,
        eventTitle: ticket.event.title,
        eventDate: ticket.event.date,
        eventLocation: ticket.event.location,
        eventVirtual: ticket.event.isVirtual,
        price: ticket.event.isFree ? 'FREE' : `$${(ticket.event.ticketPrice / 100).toFixed(2)}`,
        userId: ticket.userId,
        purchaseDate: ticket.purchaseDate,
        validationHash: `${ticket.id}-${ticket.userId}-${ticket.ticketCode}`, // Simple validation hash
        timestamp: new Date().toISOString(),
        attendee: user?.username
      };
      
      // Convert the ticket data to a JSON string
      const qrCodeContent = JSON.stringify(ticketData);
      
      // Generate QR code as data URL
      const dataUrl = await QRCode.toDataURL(qrCodeContent, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 200,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      setQrCodeDataUrl(null);
    }
  };
  
  const upcomingTickets = tickets?.filter(ticket => new Date(ticket.event.date) > new Date())
    .sort((a, b) => new Date(a.event.date).getTime() - new Date(b.event.date).getTime());
  
  const pastTickets = tickets?.filter(ticket => new Date(ticket.event.date) <= new Date())
    .sort((a, b) => new Date(b.event.date).getTime() - new Date(a.event.date).getTime());
  
  const handleDownloadTicket = async (ticket: TicketWithEvent) => {
    try {
      // Generate QR code for the ticket - using same data format as in the preview
      const ticketData = {
        ticketId: ticket.id,
        ticketCode: ticket.ticketCode,
        eventId: ticket.eventId,
        eventTitle: ticket.event.title,
        eventDate: ticket.event.date,
        eventLocation: ticket.event.location,
        eventVirtual: ticket.event.isVirtual,
        price: ticket.event.isFree ? 'FREE' : `$${(ticket.event.ticketPrice / 100).toFixed(2)}`,
        userId: ticket.userId,
        purchaseDate: ticket.purchaseDate,
        validationHash: `${ticket.id}-${ticket.userId}-${ticket.ticketCode}`, // Simple validation hash
        timestamp: new Date().toISOString(),
        attendee: user?.username
      };
      
      // Convert the ticket data to a JSON string
      const qrCodeContent = JSON.stringify(ticketData);
      
      // Generate QR code as data URL using same options as in preview
      const qrCodeDataUrl = await QRCode.toDataURL(qrCodeContent, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 200,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5'
      });
      
      // Set background color - light blue-gray like in the UI
      doc.setFillColor(245, 245, 250);
      doc.rect(0, 0, 148, 210, 'F');
      
      // Add VerseFountain header/branding
      doc.setFontSize(14);
      doc.setTextColor(60, 80, 200);
      doc.setFont('helvetica', 'bold');
      doc.text('VerseFountain', 74, 10, { align: 'center' });
      
      // Add title (event name)
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 80);
      
      // Center title text
      const titleText = ticket.event.title;
      const titleWidth = doc.getTextWidth(titleText);
      const centerX = (148 - titleWidth) / 2;
      doc.text(titleText, centerX, 24);
      
      // Add event description if available
      if (ticket.event.description) {
        doc.setFontSize(9);
        doc.setTextColor(90, 90, 100);
        doc.setFont('helvetica', 'normal');
        // Limit description to 100 chars with ellipsis like in the UI
        const description = ticket.event.description.length > 100 
          ? ticket.event.description.substring(0, 100) + '...' 
          : ticket.event.description;
        doc.text(description, 74, 32, { 
          align: 'center',
          maxWidth: 120 
        });
      }
      
      // Draw ticket box with light blue background
      doc.setFillColor(240, 242, 250);
      doc.setDrawColor(220, 225, 240);
      doc.setLineWidth(0.5);
      doc.roundedRect(14, 40, 120, 120, 3, 3, 'FD');

      // Add QR code section with white background
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(54, 47, 40, 40, 2, 2, 'F');
      doc.addImage(qrCodeDataUrl, 'PNG', 54, 47, 40, 40);
      
      // Add QR code instructions (matches the UI)
      doc.setFontSize(7.5);
      doc.setTextColor(100, 100, 120);
      doc.text('This QR code contains complete ticket and event information', 74, 93, { align: 'center' });
      doc.text('Present at the venue for entry verification', 74, 98, { align: 'center' });
      
      // Add separator line
      doc.setDrawColor(220, 225, 240);
      doc.setLineWidth(0.5);
      doc.line(24, 105, 124, 105);
      
      // Add ticket details in same format as UI
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 90);
      
      // Create a two-column layout for ticket details
      // Left column labels
      doc.setFont('helvetica', 'bold');
      doc.text('Date:', 24, 115);
      doc.text('Time:', 24, 122);
      doc.text('Location:', 24, 129);
      doc.text('Ticket ID:', 24, 136);
      doc.text('Purchase Date:', 24, 143);
      doc.text('Price:', 24, 150);
      
      // Right column values - normal font
      doc.setFont('helvetica', 'normal');
      const formattedEventDate = format(new Date(ticket.event.date), 'EEEE, MMMM d, yyyy');
      const formattedEventTime = format(new Date(ticket.event.date), 'h:mm a');
      const formattedLocation = ticket.event.isVirtual ? 'Virtual Event' : ticket.event.location;
      const formattedPurchaseDate = format(new Date(ticket.purchaseDate), 'MMMM d, yyyy');
      const formattedPrice = ticket.event.isFree ? 'Free Entry' : `$${(ticket.event.ticketPrice / 100).toFixed(2)}`;
      
      doc.text(formattedEventDate, 74, 115);
      doc.text(formattedEventTime, 74, 122);
      doc.text(formattedLocation, 74, 129);
      doc.text(ticket.ticketCode, 74, 136);
      doc.text(formattedPurchaseDate, 74, 143);
      doc.text(formattedPrice, 74, 150);
      
      // Add additional details if available (matches UI)
      let currentY = 150;
      
      if (ticket.event.organizer) {
        currentY += 7;
        doc.setFont('helvetica', 'bold');
        doc.text('Organizer:', 24, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(ticket.event.organizer, 74, currentY);
      }
      
      // Add attendee name
      currentY += 7;
      doc.setFont('helvetica', 'bold');
      doc.text('Attendee:', 24, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(user?.username || 'Guest', 74, currentY);
      
      // Add validation hash for security
      currentY += 7;
      doc.setFont('helvetica', 'bold');
      doc.text('Validation:', 24, currentY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 140);
      const validationHash = `${ticket.id}-${ticket.userId}-${ticket.ticketCode}`;
      doc.text(validationHash.substring(0, 24) + '...', 74, currentY);
      
      // Add footer
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 120);
      doc.text('This ticket is valid for one-time entry to the above event.', 74, 175, { align: 'center' });
      doc.text('Ticket generated by VerseFountain on ' + new Date().toLocaleString(), 74, 180, { align: 'center' });
      
      // Generate the PDF
      doc.save(`VerseFountain-Ticket-${ticket.ticketCode}.pdf`);
      
      toast({
        title: "Ticket Downloaded",
        description: `Your ticket for ${ticket.event.title} has been downloaded with embedded QR code.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your ticket. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const viewTicketDetails = (ticket: TicketWithEvent) => {
    setSelectedTicket(ticket);
    setDetailView(true);
    // Update URL with ticket ID for direct linking
    navigate(`/tickets?ticketId=${ticket.id}`, { replace: true });
  };
  
  // Function to cancel a ticket
  const cancelTicket = async () => {
    if (!selectedTicket) return;
    
    setIsCancelling(true);
    try {
      // Always send the reason for both free and paid tickets
      const payload = {
        reason: cancelReason || 'User requested cancellation'
      };
      
      console.log(`Cancelling ticket ${selectedTicket.id} for event ${selectedTicket.eventId}`);
      
      const response = await fetch(`/api/tickets/${selectedTicket.id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel ticket');
      }
      
      const data = await response.json();
      
      // Close the dialog
      setShowCancelDialog(false);
      setCancelReason('');
      
      // Show success message
      toast({
        title: selectedTicket.event.isFree ? "Ticket Cancelled" : "Ticket Refunded",
        description: data.message,
        variant: "default",
      });
      
      // Refresh tickets data
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
      
      // Go back to ticket list
      setDetailView(false);
      setSelectedTicket(null);
      navigate('/tickets', { replace: true });
    } catch (error) {
      console.error('Error cancelling ticket:', error);
      toast({
        title: "Cancellation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
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
            <Button onClick={() => window.location.href = "/auth"}>
              Login or Register
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Function to render a single detailed ticket view
  const renderDetailedTicket = () => {
    if (!selectedTicket) {
      return <div className="text-center py-10">Ticket not found.</div>;
    }

    // Only show cancel option for active tickets and upcoming events
    const isUpcomingEvent = new Date(selectedTicket.event.date) > new Date();
    const canCancel = isUpcomingEvent && (selectedTicket.status === 'active' || !selectedTicket.status);
    const showCancelButton = canCancel && !selectedTicket.isRefunded;

    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <Button 
            variant="ghost" 
            className="flex items-center text-muted-foreground hover:text-foreground justify-start sm:justify-center p-0 sm:p-2 h-auto sm:h-10"
            onClick={() => {
              // First clear the selected ticket and detail view
              setSelectedTicket(null);
              setDetailView(false);
              // Then navigate back to main tickets page without query params
              navigate('/tickets', { replace: true });
              // If coming from profile, go back to profile
              const referrer = document.referrer;
              if (referrer && referrer.includes('/profile')) {
                window.location.href = '/profile';
              }
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm sm:text-base">Back to all tickets</span>
          </Button>
          
          <div className="flex space-x-2 mt-2 sm:mt-0">
            {showCancelButton && (
              <Button 
                variant="outline" 
                className="flex items-center text-red-600 border-red-200 hover:bg-red-50 text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
                onClick={() => setShowCancelDialog(true)}
              >
                Cancel Ticket
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="flex items-center text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
              onClick={() => handleDownloadTicket(selectedTicket)}
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          <div className="md:w-1/3">
            <div className="bg-gray-100 p-3 sm:p-4 rounded-lg flex flex-col items-center justify-center">
              <div className="w-full aspect-square bg-white flex items-center justify-center border mb-2 max-w-[160px] sm:max-w-[200px]" ref={qrCodeRef}>
                {qrCodeDataUrl ? (
                  <img src={qrCodeDataUrl} alt="Ticket QR Code" className="w-full h-full object-contain" />
                ) : (
                  <QrCode className="h-24 w-24 sm:h-32 sm:w-32 text-gray-800 animate-pulse" />
                )}
              </div>
              <div className="text-center text-xs text-gray-600">
                <p>This QR code contains complete ticket and event information</p>
                <p>Present at the venue for entry verification</p>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3 space-y-3 sm:space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold line-clamp-1">{selectedTicket.event.title}</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1 line-clamp-3">{selectedTicket.event.description}</p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Date</div>
                  <div className="truncate">
                    <span className="block sm:hidden">
                      {format(new Date(selectedTicket.event.date), 'EEE, MMM d, yyyy')}
                    </span>
                    <span className="hidden sm:block">
                      {format(new Date(selectedTicket.event.date), 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Time</div>
                  <div>{format(new Date(selectedTicket.event.date), 'h:mm a')}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Location</div>
                  <div className="truncate">{selectedTicket.event.isVirtual ? 'Virtual Event' : selectedTicket.event.location}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Ticket className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Ticket ID</div>
                  <div className="truncate">{selectedTicket.ticketCode}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-gray-500 mt-0.5 flex-shrink-0">$</div>
                <div>
                  <div className="font-medium">Price</div>
                  <div>
                    {selectedTicket.event.isFree 
                      ? 'Free Entry' 
                      : `$${(selectedTicket.event.ticketPrice / 100).toFixed(2)}`
                    }
                  </div>
                </div>
              </div>
              
              {selectedTicket.event.organizer && (
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Organizer</div>
                    <div className="truncate">{selectedTicket.event.organizer}</div>
                  </div>
                </div>
              )}
            </div>
            
            {selectedTicket.event.isVirtual && selectedTicket.event.streamUrl && (
              <div className="mt-3 sm:mt-4">
                <Button 
                  className="w-full flex items-center justify-center h-9 sm:h-10 text-sm"
                  onClick={() => window.open(selectedTicket.event.streamUrl!, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Join Virtual Event
                </Button>
              </div>
            )}
            
            <div className="text-xs text-gray-500 pt-3 sm:pt-4">
              <p>
                Purchased on:
                <span className="inline-block sm:hidden"> {format(new Date(selectedTicket.purchaseDate), 'MMM d, yyyy')}</span>
                <span className="hidden sm:inline-block"> {format(new Date(selectedTicket.purchaseDate), 'MMMM d, yyyy')}</span>
              </p>
              <p>Attendee: {user?.username}</p>
              <p className="truncate" title={`${selectedTicket.id}-${selectedTicket.userId}-${selectedTicket.ticketCode}`}>
                Validation: {`${selectedTicket.id}-${selectedTicket.userId}-${selectedTicket.ticketCode}`.substring(0, 16)}...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout activeSection="tickets">
      {/* Cancel Ticket Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedTicket?.event.isFree 
                ? "Cancel Ticket" 
                : "Request Refund"
              }
            </DialogTitle>
            <DialogDescription>
              {selectedTicket?.event.isFree 
                ? "Are you sure you want to cancel your ticket? This action cannot be undone."
                : "Please provide a reason for your refund request. All refund requests are subject to review."
              }
            </DialogDescription>
          </DialogHeader>
          
          {!selectedTicket?.event.isFree && (
            <div className="py-4">
              <Textarea
                placeholder="Reason for refund request..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="h-24"
                disabled={isCancelling}
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowCancelDialog(false);
                setCancelReason("");
              }}
              disabled={isCancelling}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={cancelTicket}
              disabled={isCancelling}
            >
              {isCancelling 
                ? "Processing..." 
                : selectedTicket?.event.isFree 
                  ? "Confirm Cancellation" 
                  : "Request Refund"
              }
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        {detailView && selectedTicket ? (
          renderDetailedTicket()
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">My Tickets</h1>
              <p className="text-gray-600">Manage your tickets for upcoming and past events</p>
            </div>
            
            <Tabs defaultValue="upcoming" className="mb-6">
              <TabsList className="w-full grid grid-cols-2 sm:w-auto sm:inline-flex">
                <TabsTrigger value="upcoming" className="whitespace-nowrap text-xs sm:text-sm">Upcoming Events</TabsTrigger>
                <TabsTrigger value="past" className="whitespace-nowrap text-xs sm:text-sm">Past Events</TabsTrigger>
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
                              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">
                                <span className="sm:hidden">{format(new Date(ticket.event.date), 'MM/dd/yyyy')}</span>
                                <span className="hidden sm:inline">{format(new Date(ticket.event.date), 'EEEE, MMMM d, yyyy')}</span>
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span>{format(new Date(ticket.event.date), 'h:mm a')}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{ticket.event.isVirtual ? 'Virtual Event' : ticket.event.location}</span>
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
                        <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
                          <Button 
                            variant="outline" 
                            className="flex items-center justify-center w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
                            onClick={() => viewTicketDetails(ticket)}
                          >
                            <QrCode className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="whitespace-nowrap">View Ticket</span>
                          </Button>
                          <Button 
                            className="flex items-center justify-center w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
                            onClick={() => handleDownloadTicket(ticket)}
                          >
                            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="whitespace-nowrap">Download</span>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 flex flex-col items-center px-4">
                    <Ticket className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800">No upcoming tickets</h3>
                    <p className="text-gray-500 mt-1 mb-4">You don't have any tickets for upcoming events</p>
                    <Button className="mt-2 w-full sm:w-auto" onClick={() => window.location.href = "/events"}>
                      <Calendar className="h-4 w-4 mr-2" />
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
                              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">
                                <span className="sm:hidden">{format(new Date(ticket.event.date), 'MM/dd/yyyy')}</span>
                                <span className="hidden sm:inline">{format(new Date(ticket.event.date), 'EEEE, MMMM d, yyyy')}</span>
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{ticket.event.isVirtual ? 'Virtual Event' : ticket.event.location}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Ticket className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">Ticket #{ticket.ticketCode.substring(0, 10)}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="relative z-10 flex gap-2">
                          <Button variant="outline" className="w-full flex items-center justify-center" onClick={() => viewTicketDetails(ticket)}>
                            <QrCode className="h-4 w-4 mr-2" />
                            <span className="whitespace-nowrap">View Details</span>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 flex flex-col items-center px-4">
                    <Clock className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800">No past event tickets</h3>
                    <p className="text-gray-500 mt-1">You haven't attended any events yet</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            {/* Ticket Dialog */}
            {selectedTicket && (
              <Dialog open={!!selectedTicket && !detailView} onOpenChange={(open) => !open && setSelectedTicket(null)}>
                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">Ticket Details</DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                      Event ticket information and QR code
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-3 sm:p-4 rounded-lg flex flex-col items-center justify-center">
                      <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white flex items-center justify-center border mb-2" ref={qrCodeRef}>
                        {qrCodeDataUrl ? (
                          <img src={qrCodeDataUrl} alt="Ticket QR Code" className="h-28 w-28 sm:h-36 sm:w-36 object-contain" />
                        ) : (
                          <QrCode className="h-24 w-24 sm:h-32 sm:w-32 text-gray-800 animate-pulse" />
                        )}
                      </div>
                      <div className="text-center text-xs text-gray-600">
                        <p>This QR code contains complete ticket and event information</p>
                        <p>Present at the venue for entry verification</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1 sm:space-y-2">
                      <h3 className="font-bold text-base sm:text-lg">{selectedTicket.event.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-3">
                        {selectedTicket.event.description}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 sm:gap-2 text-xs sm:text-sm">
                      <div className="font-medium">Date:</div>
                      <div className="truncate">
                        {/* Responsive date format - short on mobile, full on desktop */}
                        <span className="block sm:hidden">
                          {format(new Date(selectedTicket.event.date), 'MMM d, yyyy')}
                        </span>
                        <span className="hidden sm:block">
                          {format(new Date(selectedTicket.event.date), 'EEEE, MMMM d, yyyy')}
                        </span>
                      </div>
                      
                      <div className="font-medium">Time:</div>
                      <div>{format(new Date(selectedTicket.event.date), 'h:mm a')}</div>
                      
                      <div className="font-medium">Location:</div>
                      <div className="truncate">
                        {selectedTicket.event.isVirtual ? 'Virtual Event' : selectedTicket.event.location}
                      </div>
                      
                      <div className="font-medium">Ticket ID:</div>
                      <div className="truncate">{selectedTicket.ticketCode}</div>
                      
                      <div className="font-medium">Purchase Date:</div>
                      <div className="truncate">
                        <span className="block sm:hidden">
                          {format(new Date(selectedTicket.purchaseDate), 'MMM d, yyyy')}
                        </span>
                        <span className="hidden sm:block">
                          {format(new Date(selectedTicket.purchaseDate), 'MMMM d, yyyy')}
                        </span>
                      </div>
                      
                      <div className="font-medium">Price:</div>
                      <div>
                        {selectedTicket.event.isFree 
                          ? 'Free Entry' 
                          : `$${(selectedTicket.event.ticketPrice / 100).toFixed(2)}`
                        }
                      </div>
                      
                      {selectedTicket.event.organizer && (
                        <>
                          <div className="font-medium">Organizer:</div>
                          <div className="truncate">{selectedTicket.event.organizer}</div>
                        </>
                      )}
                      
                      <div className="font-medium">Attendee:</div>
                      <div className="truncate">{user?.username}</div>
                      
                      <div className="font-medium">Validation:</div>
                      <div className="text-xs text-gray-500 truncate" title={`${selectedTicket.id}-${selectedTicket.userId}-${selectedTicket.ticketCode}`}>
                        {`${selectedTicket.id}-${selectedTicket.userId}-${selectedTicket.ticketCode}`.substring(0, 16)}...
                      </div>
                    </div>
                    
                    {selectedTicket.event.isVirtual && selectedTicket.event.streamUrl && (
                      <div className="mt-2">
                        <Button 
                          className="w-full flex items-center justify-center"
                          onClick={() => window.open(selectedTicket.event.streamUrl!, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Join Virtual Event
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex justify-center sm:justify-end">
                      <Button 
                        className="w-full sm:w-auto" 
                        onClick={() => handleDownloadTicket(selectedTicket)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Ticket
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}