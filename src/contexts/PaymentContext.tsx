import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Initialize Paddle
declare global {
  interface Window {
    Paddle: any;
  }
}

type PaymentContextType = {
  isLoading: boolean;
  createPayment: (eventId: number, amount: number) => Promise<Payment>;
  requestRefund: (paymentId: number, reason: string) => Promise<void>;
  updateTicketStatus: (ticketId: number, status: string) => Promise<Ticket>;
  userTickets: Ticket[] | undefined;
  isTicketsLoading: boolean;
  initializePaddle: () => void;
  startCheckout: (event: Event) => Promise<void>;
};

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [paddleInitialized, setPaddleInitialized] = useState(false);

  // Fetch user tickets
  const { 
    data: userTickets, 
    isLoading: isTicketsLoading 
  } = useQuery({
    queryKey: ["/api/tickets/user"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/tickets/user");
      if (!res.ok) {
        throw new Error("Failed to fetch tickets");
      }
      return await res.json();
    },
    enabled: !!user, // Only fetch when user is authenticated
  });

  // Initialize Paddle
  const initializePaddle = () => {
    if (window.Paddle || !import.meta.env.VITE_PADDLE_VENDOR_ID) {
      return;
    }

    // Create script to load Paddle
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/paddle.js";
    script.async = true;
    script.onload = () => {
      window.Paddle.Setup({
        vendor: parseInt(import.meta.env.VITE_PADDLE_VENDOR_ID, 10),
        eventCallback: (data: any) => {
          console.log("Paddle event:", data);
          if (data.event === "Checkout.Complete") {
            toast({
              title: "Payment Successful",
              description: "Your payment was processed successfully.",
            });
            // Refresh user tickets
            queryClient.invalidateQueries({ queryKey: ["/api/tickets/user"] });
          }
        },
      });
      setPaddleInitialized(true);
    };

    document.body.appendChild(script);
  };

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: async ({ eventId, amount }: { eventId: number; amount: number }) => {
      if (!user) throw new Error("You must be logged in to make a payment.");

      const res = await apiRequest("POST", "/api/payments", {
        user_id: user.user_id,
        eventId,
        amount,
        currency: "USD",
        status: "pending",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create payment");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets/user"] });
    },
    onError: (error) => {
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Request refund mutation
  const requestRefundMutation = useMutation({
    mutationFn: async ({ paymentId, reason }: { paymentId: number; reason: string }) => {
      const res = await apiRequest(
        "PATCH", 
        `/api/payments/${paymentId}/refund`,
        { reason }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to request refund");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Refund Requested",
        description: "Your refund request has been processed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tickets/user"] });
    },
    onError: (error) => {
      toast({
        title: "Refund Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update ticket status mutation
  const updateTicketStatusMutation = useMutation({
    mutationFn: async ({ ticketId, status }: { ticketId: number; status: string }) => {
      const res = await apiRequest(
        "PATCH", 
        `/api/tickets/${ticketId}/status`,
        { status }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update ticket status");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Ticket Updated",
        description: "Your ticket status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tickets/user"] });
    },
    onError: (error) => {
      toast({
        title: "Update Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create payment function
  const createPayment = async (eventId: number, amount: number) => {
    return await createPaymentMutation.mutateAsync({ eventId, amount });
  };

  // Request refund function
  const requestRefund = async (paymentId: number, reason: string) => {
    await requestRefundMutation.mutateAsync({ paymentId, reason });
  };

  // Update ticket status function
  const updateTicketStatus = async (ticketId: number, status: string) => {
    return await updateTicketStatusMutation.mutateAsync({ ticketId, status });
  };

  // Start Paddle checkout
  const startCheckout = async (event: Event) => {
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
      // First create a pending payment in our system
      const payment = await createPayment(event.id, event.ticketPrice || 0);

      // Open Paddle checkout
      window.Paddle.Checkout.open({
        product: parseInt(import.meta.env.VITE_PADDLE_PRODUCT_ID, 10),
        title: `Ticket for ${event.title}`,
        message: event.description || "Purchase a ticket for this event",
        closeCallback: () => {
          console.log("Checkout closed");
        },
        successCallback: (data: any) => {
          console.log("Checkout success:", data);
          // Update payment status to completed
          apiRequest("PATCH", `/api/payments/${payment.id}/status`, {
            status: "completed",
            paddlePaymentId: data.checkout.id,
            paddleTransactionId: data.checkout.order_id,
          })
          .then(() => {
            // Create a ticket for the user
            return apiRequest("POST", "/api/tickets", {
              eventId: event.id,
              user_id: user?.id,
              paymentId: payment.id
            });
          })
          .then(() => {
            // Invalidate tickets cache to show the new ticket
            queryClient.invalidateQueries({ queryKey: ["/api/tickets/user"] });
          })
          .catch(err => {
            console.error("Error processing payment completion:", err);
          });
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

  // Effect to initialize Paddle
  useEffect(() => {
    if (user) {
      initializePaddle();
    }
  }, [user]);

  return (
    <PaymentContext.Provider
      value={{
        isLoading: createPaymentMutation.isPending,
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
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};