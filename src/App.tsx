import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import PoetryPage from "@/pages/poetry-page";
import PoemDetailPage from "@/pages/poem-detail-page";
import BooksPage from "@/pages/books-page";
import AcademicsPage from "@/pages/academics-page";
import ChatPage from "@/pages/chat-page";
import EventsPage from "@/pages/events-page";
import EventDetailPage from "@/pages/event-detail-page";
import TicketsPage from "@/pages/tickets-page";
import ProfilePage from "@/pages/profile-page";
import AdminDashboard from "@/pages/admin-dashboard";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { ChatProvider } from "@/contexts/ChatContext";
import { PaymentProvider } from "@/contexts/PaymentContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/poetry" component={PoetryPage} />
      <Route path="/poems/:id" component={PoemDetailPage} />
      <Route path="/books" component={BooksPage} />
      <Route path="/academics" component={AcademicsPage} />
      <ProtectedRoute path="/chat" component={ChatPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/events/:id" component={EventDetailPage} />
      <ProtectedRoute path="/tickets" component={TicketsPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/admin-dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <AuthProvider>
          <ChatProvider>
            <PaymentProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </PaymentProvider>
          </ChatProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
