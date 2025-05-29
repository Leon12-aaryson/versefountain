import { Switch, Route, useLocation } from "wouter";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ChatProvider } from "@/contexts/ChatContext";
import { PaymentProvider } from "@/contexts/PaymentContext";
import ProtectedRoute from "./lib/protected-route";

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
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/poetry" component={PoetryPage} />
      <Route path="/poems/:id" component={PoemDetailPage} />
      <Route path="/books" component={BooksPage} />
      <Route path="/academics" component={AcademicsPage} />
      <Route path="/chat">
        <ProtectedRoute>
          <ChatPage />
        </ProtectedRoute>
      </Route>
      <Route path="/events" component={EventsPage} />
      <Route path="/events/:id" component={EventDetailPage} />
      <Route path="/tickets">
        <ProtectedRoute>
          <TicketsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      </Route>
      <Route path="/admin-dashboard">
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [, navigate] = useLocation();

  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        <ChatProvider>
          <PaymentProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </PaymentProvider>
        </ChatProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
