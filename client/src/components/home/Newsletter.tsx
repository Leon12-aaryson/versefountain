import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real app, we would call an API to subscribe the user
      // await apiRequest('POST', '/api/newsletter/subscribe', { email });
      
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
      
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mb-20 py-16 px-6 bg-primary bg-opacity-10 rounded-xl text-center">
      <div className="max-w-xl mx-auto">
        <h2 className="font-display text-3xl mb-3">Stay Connected</h2>
        <p className="text-neutral-charcoal opacity-75 mb-6">
          Subscribe to our newsletter for updates on new poetry, book releases, and upcoming cultural events.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-0">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 py-3 px-4 rounded-l-lg sm:rounded-r-none border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg sm:rounded-l-none font-medium transition-colors"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
        <p className="text-xs text-neutral-charcoal opacity-60 mt-3">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
