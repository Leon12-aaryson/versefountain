import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { insertBookSchema, insertPoemSchema, insertDiscussionSchema, insertEventSchema } from "@shared/schema";

// Create simplified schemas for forms without author data (will be added from auth)
const createBookSchema = insertBookSchema.omit({ authorId: true, authorName: true, rating: true, ratingCount: true });
const createPoemSchema = insertPoemSchema.omit({ authorId: true, authorName: true, likes: true, comments: true, rating: true, ratingCount: true });
const createDiscussionSchema = insertDiscussionSchema.omit({ authorId: true, authorName: true, authorAvatar: true, replies: true, views: true });
const createEventSchema = insertEventSchema.omit({ organizerId: true, organizerName: true, attendees: true }).extend({
  monthDay: z.string().min(1, "Please enter a date in format MM-DD (e.g., 06-15)"),
});

type ContentType = "book" | "poem" | "discussion" | "event";

export default function CreateContentPage() {
  const [contentType, setContentType] = useState<ContentType>("poem");
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  return (
    <div className="container py-10">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create New Content</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Share your cultural knowledge by creating a new poem, book, discussion, or event for the VerseFountain community.
        </p>
      </div>

      <Tabs 
        defaultValue="poem" 
        onValueChange={(value) => setContentType(value as ContentType)}
        className="w-full max-w-3xl mx-auto"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="poem">Poem</TabsTrigger>
          <TabsTrigger value="book">Book</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
          <TabsTrigger value="event">Event</TabsTrigger>
        </TabsList>

        <Card className="mt-6 border-t-0 rounded-t-none">
          <CardHeader>
            <CardTitle>
              {contentType === "poem" && "Create a New Poem"}
              {contentType === "book" && "Add a New Book"}
              {contentType === "discussion" && "Start a New Discussion"}
              {contentType === "event" && "Create a New Event"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TabsContent value="poem" className="mt-0">
              <CreatePoemForm />
            </TabsContent>
            
            <TabsContent value="book" className="mt-0">
              <CreateBookForm />
            </TabsContent>
            
            <TabsContent value="discussion" className="mt-0">
              <CreateDiscussionForm />
            </TabsContent>
            
            <TabsContent value="event" className="mt-0">
              <CreateEventForm />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}

function CreatePoemForm() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const form = useForm<z.infer<typeof createPoemSchema>>({
    resolver: zodResolver(createPoemSchema),
    defaultValues: {
      title: "",
      content: "",
      culturalOrigin: "",
      coverImage: "",
      readTime: 5,
    },
  });

  const createPoemMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createPoemSchema>) => {
      const res = await apiRequest("POST", "/api/create/poem", data);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Failed to create poem" }));
        throw new Error(errorData.message || "Failed to create poem");
      }
      return await res.json();
    },
    onSuccess: (poem) => {
      queryClient.invalidateQueries({ queryKey: ["/api/poems"] });
      toast({
        title: "Poem created!",
        description: "Your poem has been successfully published.",
      });
      navigate(`/poems/${poem.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create poem",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: z.infer<typeof createPoemSchema>) {
    createPoemMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter the title of your poem" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write your poem here..." 
                  className="min-h-[200px]" 
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
            name="culturalOrigin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cultural Origin</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., African, Asian, European..." {...field} />
                </FormControl>
                <FormDescription>
                  The cultural tradition that inspired this poem
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="readTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Read Time (minutes)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1}
                    placeholder="Estimated reading time" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input placeholder="URL to an image representing your poem" {...field} />
              </FormControl>
              <FormDescription>
                Provide a URL to an image that represents your poem's theme
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={createPoemMutation.isPending}
        >
          {createPoemMutation.isPending ? (
            <>
              <span className="mr-2">Publishing Poem</span>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            </>
          ) : (
            "Publish Poem"
          )}
        </Button>
      </form>
    </Form>
  );
}

function CreateBookForm() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const form = useForm<z.infer<typeof createBookSchema>>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      category: "",
      culturalOrigin: "",
      coverImage: "",
    },
  });

  const createBookMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createBookSchema>) => {
      const res = await apiRequest("POST", "/api/create/book", data);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Failed to create book" }));
        throw new Error(errorData.message || "Failed to create book");
      }
      return await res.json();
    },
    onSuccess: (book) => {
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      toast({
        title: "Book added!",
        description: "Your book has been successfully added to the library.",
      });
      navigate(`/books/${book.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add book",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: z.infer<typeof createBookSchema>) {
    createBookMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter the title of the book" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Original Author</FormLabel>
              <FormControl>
                <Input placeholder="The original author of this book" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write a description of the book..." 
                  className="min-h-[120px]" 
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Poetry, Fiction, Historical..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="culturalOrigin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cultural Origin</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., African, Asian, European..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input placeholder="URL to the book's cover image" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={createBookMutation.isPending}
        >
          {createBookMutation.isPending ? (
            <>
              <span className="mr-2">Adding Book</span>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            </>
          ) : (
            "Add Book"
          )}
        </Button>
      </form>
    </Form>
  );
}

function CreateDiscussionForm() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const form = useForm<z.infer<typeof createDiscussionSchema>>({
    resolver: zodResolver(createDiscussionSchema),
    defaultValues: {
      title: "",
      content: "",
      status: "New",
    },
  });

  const createDiscussionMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createDiscussionSchema>) => {
      const res = await apiRequest("POST", "/api/create/discussion", data);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Failed to create discussion" }));
        throw new Error(errorData.message || "Failed to create discussion");
      }
      return await res.json();
    },
    onSuccess: (discussion) => {
      queryClient.invalidateQueries({ queryKey: ["/api/discussions"] });
      toast({
        title: "Discussion created!",
        description: "Your discussion topic has been successfully posted.",
      });
      navigate(`/discussions/${discussion.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create discussion",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: z.infer<typeof createDiscussionSchema>) {
    createDiscussionMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a title for your discussion topic" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your discussion topic in detail..." 
                  className="min-h-[200px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                >
                  <option value="New">New</option>
                  <option value="Active">Active</option>
                  <option value="Hot">Hot</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={createDiscussionMutation.isPending}
        >
          {createDiscussionMutation.isPending ? (
            <>
              <span className="mr-2">Posting Discussion</span>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            </>
          ) : (
            "Post Discussion"
          )}
        </Button>
      </form>
    </Form>
  );
}

function CreateEventForm() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const form = useForm<z.infer<typeof createEventSchema> & { monthDay: string }>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      isVirtual: false,
      startTime: "",
      endTime: "",
      coverImage: "",
      monthDay: "",
      month: "",
      day: "",
    },
  });

  // Update month and day based on the MM-DD input
  const watchMonthDay = form.watch("monthDay");
  if (watchMonthDay && watchMonthDay.includes("-")) {
    const [month, day] = watchMonthDay.split("-");
    const monthMap: Record<string, string> = {
      "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun",
      "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
    };
    
    if (monthMap[month] && form.getValues("month") !== monthMap[month]) {
      form.setValue("month", monthMap[month]);
    }
    
    if (day && form.getValues("day") !== day) {
      // Remove leading zero if exists
      form.setValue("day", day.replace(/^0+/, ""));
    }
  }

  const createEventMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createEventSchema> & { monthDay: string }) => {
      // Remove the monthDay field before sending to API
      const { monthDay, ...eventData } = data;
      // Set the date field
      const today = new Date();
      const [month, day] = monthDay.split("-");
      const eventDate = new Date(today.getFullYear(), parseInt(month) - 1, parseInt(day));
      
      const res = await apiRequest("POST", "/api/create/event", {
        ...eventData,
        date: eventDate.toISOString()
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Failed to create event" }));
        throw new Error(errorData.message || "Failed to create event");
      }
      return await res.json();
    },
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Event created!",
        description: "Your event has been successfully posted.",
      });
      navigate(`/events/${event.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create event",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: z.infer<typeof createEventSchema> & { monthDay: string }) {
    createEventMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a title for your event" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your event in detail..." 
                  className="min-h-[120px]" 
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
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="Event location or 'Virtual'" {...field} />
                    <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="monthDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date (MM-DD)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="e.g., 06-15 for June 15" {...field} />
                    <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormDescription>Format: MM-DD (month-day)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="e.g., 7:00 PM" {...field} />
                    <Clock className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="e.g., 9:00 PM" {...field} />
                    <Clock className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="isVirtual"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <input
                  type="checkbox"
                  className="h-4 w-4 mt-1"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Virtual Event</FormLabel>
                <FormDescription>
                  Check this if your event will be held online rather than at a physical location
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input placeholder="URL to an image representing your event" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={createEventMutation.isPending}
        >
          {createEventMutation.isPending ? (
            <>
              <span className="mr-2">Creating Event</span>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            </>
          ) : (
            "Create Event"
          )}
        </Button>
      </form>
    </Form>
  );
}