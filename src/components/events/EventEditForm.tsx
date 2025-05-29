import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { DialogClose } from "@/components/ui/dialog";

type EventFormData = {
  title: string;
  description: string;
  date: Date | string;
  location: string;
  organizer: string;
  isVirtual: boolean;
  isFree: boolean;
  ticketPrice?: number;
  streamUrl?: string;
};

interface EventEditFormProps {
  event: any;
  onSuccess?: () => void;
}

export default function EventEditForm({ event, onSuccess }: EventEditFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const form = useForm<EventFormData>({
    defaultValues: {
      title: event.title || "",
      description: event.description || "",
      date: event.date ? new Date(event.date) : "",
      location: event.location || "",
      isVirtual: event.isVirtual || false,
      isFree: event.isFree || false,
      ticketPrice: event.ticketPrice ? event.ticketPrice / 100 : 0,
      organizer: event.organizer || user?.username || "",
      streamUrl: event.streamUrl || "",
    },
  });

  const isVirtual = form.watch("isVirtual");
  const isFree = form.watch("isFree");

  async function onSubmit(data: EventFormData) {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to edit an event",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert price from dollars to cents for storage
      const eventData = {
        ...data,
        ticketPrice: isFree ? 0 : (data.ticketPrice || 0) * 100,
        streamUrl: isVirtual ? data.streamUrl || "" : null,
      };

      const response = await apiRequest("PUT", `/api/events/${event.id}`, eventData);

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to update event");
      }

      // Optionally await response.json() if you need the updated event
      toast({
        title: "Event Updated",
        description: "Your event has been successfully updated",
      });

      queryClient.invalidateQueries({ queryKey: ['/api/events'] });

      setFormSubmitted(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Failed to Update Event",
        description: error?.message || "An error occurred while updating the event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (formSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="mb-4 text-green-500">
          <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium">Event Updated Successfully!</h3>
        <p className="text-gray-500 mt-2 mb-6">Your event has been updated in our calendar.</p>
        <DialogClose asChild>
          <Button>Close</Button>
        </DialogClose>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          rules={{ required: "Title is required", minLength: { value: 2, message: "Title must be at least 2 characters." } }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Poetry Reading Night" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          rules={{ required: "Description is required", minLength: { value: 10, message: "Description must be at least 10 characters." } }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Provide details about your event..." 
                  className="resize-none h-20" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            rules={{ required: "Please select a date for the event" }}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Event Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : "Select date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? (typeof field.value === "string" ? new Date(field.value) : field.value) : undefined}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="organizer"
            rules={{ required: "Organizer is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organizer</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="isVirtual"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Virtual Event</FormLabel>
                  <FormDescription>
                    Will this be a virtual event?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFree"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Free Event</FormLabel>
                  <FormDescription>
                    Is this a free event?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {isVirtual ? (
          <FormField
            control={form.control}
            name="streamUrl"
            rules={{ required: "Stream URL is required for virtual events" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stream URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>
                  Provide a link to where the event will be streamed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="location"
            rules={{ required: "Location is required for physical events", minLength: { value: 2, message: "Location must be at least 2 characters." } }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="City Library, 123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {!isFree && (
          <FormField
            control={form.control}
            name="ticketPrice"
            rules={{ min: { value: 0, message: "Ticket price must be a positive number." } }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticket Price ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0"
                    step="0.01"
                    placeholder="10.00" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Enter the price in dollars (e.g., 10.00)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end space-x-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Event
          </Button>
        </div>
      </form>
    </Form>
  );
}