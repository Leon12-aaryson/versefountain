import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Poetry from "@/pages/Poetry";
import Books from "@/pages/Books";
import BookDetails from "@/pages/BookDetails";
import Discussions from "@/pages/Discussions";
import Events from "@/pages/Events";
import EventDetails from "@/pages/EventDetails";
import EventTickets from "@/pages/EventTickets";
import Academics from "@/pages/Academics";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/poetry" component={Poetry} />
      <Route path="/books" component={Books} />
      <Route path="/books/:id" component={BookDetails} />
      <Route path="/discussions" component={Discussions} />
      <Route path="/events" component={Events} />
      <Route path="/events/:id" component={EventDetails} />
      <Route path="/events/:id/tickets" component={EventTickets} />
      <Route path="/academics" component={Academics} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col font-body bg-neutral-cream text-neutral-charcoal">
        <Navbar />
        <div className="flex-grow">
          <Router />
        </div>
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
