import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { API_BASE_URL } from "@/constants/constants";

// Define missing types
export type Payment = {
  id: number;
  user_id: number;
  eventId: number;
  amount: number;
  currency: string;
  status: string;
  paddlePaymentId?: string;
  paddleTransactionId?: string;
};

export type Ticket = {
  id: number;
  eventId: number;
  user_id: number;
  paymentId: number;
  status: string;
};

declare global {
  interface Window {
    Paddle: any;
  }
}

export type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  isFree: boolean;
  ticketPrice?: number;
  isVirtual?: boolean;
  streamUrl?: string;
  location?: string;
  category?: string;
  organizer?: string;
};

type PaymentContextType = {
  isLoading: boolean;
  createPayment: (eventId: number, amount: number) => Promise<Payment>;
  requestRefund: (paymentId: number, reason: string) => Promise<void>;
  updateTicketStatus: (ticketId: number, status: string) => Promise<Ticket>;
  userTickets?: Ticket[];
  isTicketsLoading: boolean;
  initializePaddle: () => void;
  startCheckout: (event: Event) => Promise<void>;
};

export const PaymentContext = React.createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [paddleInitialized, setPaddleInitialized] = useState(false);
  const [userTickets, setUserTickets] = useState<Ticket[] | undefined>(undefined);
  const [isTicketsLoading, setIsTicketsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user tickets
  const fetchUserTickets = async () => {
    if (!user) {
      setUserTickets(undefined);
      return;
    }
    setIsTicketsLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/tickets/user`, { withCredentials: true });
      setUserTickets(res.data);
    } catch {
      setUserTickets(undefined);
    } finally {
      setIsTicketsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Initialize Paddle
  const initializePaddle = () => {
    if (window.Paddle || !import.meta.env.VITE_PADDLE_VENDOR_ID) {
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/paddle.js";
    script.async = true;
    script.onload = () => {
      window.Paddle.Setup({
        vendor: parseInt(import.meta.env.VITE_PADDLE_VENDOR_ID, 10),
      });
      setPaddleInitialized(true);
    };
    document.body.appendChild(script);
  };

  // Create payment
  const createPayment = async (eventId: number, amount: number): Promise<Payment> => {
    if (!user) throw new Error("You must be logged in to make a payment.");
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/payments`, {
        user_id: user.user_id,
        eventId,
        amount,
        currency: "USD",
        status: "pending",
      }, { withCredentials: true });
      if (res.status < 200 || res.status >= 300) {
        throw new Error(res.data?.message || "Failed to create payment");
      }
      return res.data;
    } finally {
      setIsLoading(false);
    }
  };

  // Request refund
  const requestRefund = async (paymentId: number, reason: string): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await axios.patch(`${API_BASE_URL}/api/payments/${paymentId}/refund`, { reason }, { withCredentials: true });
      if (res.status < 200 || res.status >= 300) {
        throw new Error(res.data?.message || "Failed to request refund");
      }
      toast({
        title: "Refund Requested",
        description: "Your refund request has been submitted.",
        variant: "default",
      });
      fetchUserTickets();
    } catch (error: any) {
      toast({
        title: "Refund Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update ticket status
  const updateTicketStatus = async (ticketId: number, status: string): Promise<Ticket> => {
    setIsLoading(true);
    try {
      const res = await axios.patch(`${API_BASE_URL}/api/tickets/${ticketId}/status`, { status }, { withCredentials: true });
      if (res.status < 200 || res.status >= 300) {
        throw new Error(res.data?.message || "Failed to update ticket status");
      }
      toast({
        title: "Ticket Updated",
        description: "Your ticket status has been updated.",
        variant: "default",
      });
      fetchUserTickets();
      return res.data;
    } catch (error: any) {
      toast({
        title: "Update Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Start checkout
  const startCheckout = async (event: Event): Promise<void> => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You must be logged in to purchase tickets.",
        variant: "destructive",
      });
      return;
    }
    if (!paddleInitialized) {
      toast({
        title: "Payment System Error",
        description: "Payment system not initialized. Please try again.",
        variant: "destructive",
      });
      return;
    }
    try {
      const payment = await createPayment(event.id, event.ticketPrice || 0);
      window.Paddle.Checkout.open({
        product: parseInt(import.meta.env.VITE_PADDLE_PRODUCT_ID, 10),
        title: `Ticket for ${event.title}`,
        message: event.description || "Purchase a ticket for this event",
        closeCallback: () => {
          console.log("Checkout closed");
        },
        successCallback: async (data: any) => {
          try {
            await axios.patch(`${API_BASE_URL}/api/payments/${payment.id}/status`, {
              status: "completed",
              paddlePaymentId: data.checkout.id,
              paddleTransactionId: data.checkout.order_id,
            }, { withCredentials: true });
            await axios.post(`${API_BASE_URL}/api/tickets`, {
              eventId: event.id,
              user_id: user.user_id,
              paymentId: payment.id
            }, { withCredentials: true });
            fetchUserTickets();
          } catch (err) {
            console.error("Error processing payment completion:", err);
          }
        },
        passthrough: JSON.stringify({
          payment_id: payment.id,
          user_id: user.user_id,
          event_id: event.id,
        }),
      });
    } catch (error) {
      console.error("Error starting checkout:", error);
      toast({
        title: "Checkout Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      initializePaddle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <PaymentContext.Provider
      value={{
        isLoading,
        createPayment,
        requestRefund,
        updateTicketStatus,
        userTickets,
        isTicketsLoading,
        initializePaddle,
        startCheckout,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};
