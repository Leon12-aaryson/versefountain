import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import MainLayout from '@/components/shared/MainLayout';
import PoetryCard from '@/components/poetry/PoetryCard';
import VideoPoetryCard from '@/components/poetry/VideoPoetryCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, ArrowLeft, Calendar, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Poem, insertPoemSchema, Event } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLocation } from 'wouter';

export default function PoetryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("trending");
  
  // Check for tab parameter in URL on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['trending', 'text', 'video', 'following'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('tab', activeTab);
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [activeTab]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isVideoPoetry, setIsVideoPoetry] = useState(false);
  const [location, navigate] = useLocation();
  const [editPoemDialogOpen, setEditPoemDialogOpen] = useState(false);
  const [editingPoem, setEditingPoem] = useState<{id: number; title: string; content: string; isVideo: boolean; videoUrl: string}>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  // Parse URL parameters to get poem ID if present
  const searchParams = new URLSearchParams(window.location.search);
  const poemId = searchParams.get('poemId');
  const [detailView, setDetailView] = useState(!!poemId);
  
  // Query for all poems
  const { data: poems, isLoading } = useQuery<Poem[]>({
    queryKey: ['/api/poems'],
    queryFn: async () => {
      const res = await fetch('/api/poems');
      if (!res.ok) throw new Error('Failed to fetch poems');
      return res.json();
    }
  });
  
  // Query for individual poem if in detail view
  const { data: selectedPoem, isLoading: isLoadingSelectedPoem } = useQuery<Poem>({
    queryKey: ['/api/poems', poemId],
    queryFn: async () => {
      if (!poemId) throw new Error('No poem ID provided');
      const res = await fetch(`/api/poems/${poemId}`);
      if (!res.ok) throw new Error('Failed to fetch poem');
      return res.json();
    },
    enabled: !!poemId // Only run this query if poemId exists
  });
  
  // Query for featured poets
  const { data: featuredPoets, isLoading: isLoadingFeaturedPoets } = useQuery<Array<{id: number; username: string; poemCount: number}>>({
    queryKey: ['/api/poets/featured'],
    queryFn: async () => {
      const res = await fetch('/api/poets/featured?limit=5');
      if (!res.ok) throw new Error('Failed to fetch featured poets');
      return res.json();
    }
  });
  
  // Poet following mutations
  const followPoetMutation = useMutation({
    mutationFn: async (poetId: number) => {
      const res = await apiRequest('POST', `/api/poets/${poetId}/follow`, {});
      return res.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: 'Success',
        description: 'You are now following this poet',
      });
      
      // Immediately update UI state
      setPoetFollowingStatus(prev => ({
        ...prev,
        [variables]: true // Use the poetId from variables
      }));
      
      // Add to followed poet IDs for filtering
      setFollowedPoetIds(prev => {
        if (!prev.includes(variables)) {
          return [...prev, variables];
        }
        return prev;
      });
      
      // Still invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/user/followed-poets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/poets/featured'] });
    },
    onError: (error) => {
      console.error('Error following poet:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to follow poet',
        variant: 'destructive',
      });
    }
  });
  
  const unfollowPoetMutation = useMutation({
    mutationFn: async (poetId: number) => {
      const res = await apiRequest('POST', `/api/poets/${poetId}/unfollow`, {});
      return res.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: 'Success',
        description: 'You have unfollowed this poet',
      });
      
      // Immediately update UI state
      setPoetFollowingStatus(prev => ({
        ...prev,
        [variables]: false // Use the poetId from variables
      }));
      
      // Remove from followed poet IDs for filtering
      setFollowedPoetIds(prev => prev.filter(id => id !== variables));
      
      // Still invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/user/followed-poets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/poets/featured'] });
    },
    onError: (error) => {
      console.error('Error unfollowing poet:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to unfollow poet',
        variant: 'destructive',
      });
    }
  });
  
  // Track following status for each featured poet
  const [poetFollowingStatus, setPoetFollowingStatus] = useState<Record<number, boolean>>({});
  const [followedPoetIds, setFollowedPoetIds] = useState<number[]>([]);
  
  // Check following status for poets if user is logged in
  useEffect(() => {
    if (user && featuredPoets) {
      featuredPoets.forEach(async (poet) => {
        try {
          const res = await fetch(`/api/poets/${poet.id}/following-status`);
          if (res.ok) {
            const data = await res.json();
            setPoetFollowingStatus(prev => ({
              ...prev,
              [poet.id]: data.isFollowing
            }));
            
            // If we're following this poet, add to followedPoetIds
            if (data.isFollowing) {
              setFollowedPoetIds(prev => {
                if (!prev.includes(poet.id)) {
                  return [...prev, poet.id];
                }
                return prev;
              });
            }
          }
        } catch (error) {
          console.error(`Error checking following status for poet ${poet.id}:`, error);
        }
      });
    }
  }, [user, featuredPoets]);
  
  // Get complete list of followed poets if user is authenticated
  useEffect(() => {
    if (user) {
      const fetchFollowedPoets = async () => {
        try {
          const res = await fetch('/api/user/followed-poets');
          if (res.ok) {
            const data = await res.json();
            const poetIds = data.map((poet: any) => poet.id);
            setFollowedPoetIds(poetIds);
          }
        } catch (error) {
          console.error('Error fetching followed poets:', error);
        }
      };
      
      fetchFollowedPoets();
    }
  }, [user]);
  
  // Query for upcoming poetry events
  const { data: poetryEvents, isLoading: isLoadingPoetryEvents } = useQuery<Event[]>({
    queryKey: ['/api/events/poetry'],
    queryFn: async () => {
      const res = await fetch('/api/events/poetry?limit=3');
      if (!res.ok) throw new Error('Failed to fetch poetry events');
      return res.json();
    }
  });

  const poemForm = useForm({
    resolver: zodResolver(insertPoemSchema),
    defaultValues: {
      title: '',
      content: '',
      isVideo: false,
      videoUrl: '',
    }
  });

  const createPoemMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/poems', data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Poetry Submitted',
        description: 'Your poetry has been submitted successfully and is pending approval.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/poems'] });
      poemForm.reset();
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'Failed to submit poetry',
        variant: 'destructive',
      });
    }
  });

  const onSubmit = (data: any) => {
    createPoemMutation.mutate({
      ...data,
      isVideo: isVideoPoetry,
    });
  };

  useEffect(() => {
    document.title = 'eLibrary - Poetry';
  }, []);

  const togglePoetryType = () => {
    setIsVideoPoetry(!isVideoPoetry);
  };

  const renderPoems = () => {
    if (isLoading) {
      return <div className="text-center py-10">Loading poems...</div>;
    }

    if (!poems || poems.length === 0) {
      return <div className="text-center py-10">No poems available.</div>;
    }
    
    // Filter poems based on the active tab
    const filteredPoems = poems.filter(poem => {
      if (activeTab === 'trending') {
        return true; // Show all poems in trending
      } else if (activeTab === 'text') {
        return !poem.isVideo; // Show only text poems
      } else if (activeTab === 'video') {
        return poem.isVideo; // Show only video poems
      } else if (activeTab === 'following' && user) {
        // Show only poems by authors the user follows
        if (poem.author && followedPoetIds.includes(poem.author.id)) {
          return true;
        }
        return false;
      }
      return true;
    });
    
    if (filteredPoems.length === 0) {
      if (activeTab === 'following') {
        return (
          <div className="text-center py-10">
            <div className="mb-2">No poems from poets you follow</div>
            {followedPoetIds.length === 0 && (
              <div className="text-sm text-muted-foreground">
                Start following poets from the featured poets section to see their work here
              </div>
            )}
          </div>
        );
      }
      
      return (
        <div className="text-center py-10">
          No {activeTab === 'video' ? 'video' : activeTab === 'text' ? 'text' : ''} poems available.
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {filteredPoems.map(poem => (
          poem.isVideo ? (
            <VideoPoetryCard
              key={poem.id}
              id={poem.id}
              title={poem.title}
              content={poem.content}
              videoUrl={poem.videoUrl || ''}
              thumbnailUrl={poem.videoUrl ? `https://source.unsplash.com/featured/?poetry,${encodeURIComponent(poem.title)}` : ''}
              author={poem.author || { id: 0, username: 'Anonymous' }}
              createdAt={poem.createdAt}
            />
          ) : (
            <PoetryCard
              key={poem.id}
              id={poem.id}
              title={poem.title}
              content={poem.content}
              author={poem.author || { id: 0, username: 'Anonymous' }}
              createdAt={poem.createdAt}
            />
          )
        ))}
      </div>
    );
  };

  // Function to render a single detailed poem view
  const renderDetailedPoem = () => {
    if (isLoadingSelectedPoem) {
      return <div className="text-center py-10">Loading poem...</div>;
    }

    if (!selectedPoem) {
      return <div className="text-center py-10">Poem not found.</div>;
    }

    return (
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            className="flex items-center text-muted-foreground hover:text-foreground"
            onClick={() => {
              // First clear the selected poem and detail view
              setDetailView(false);
              // Then navigate back to main poetry page without query params
              navigate('/poetry', { replace: true });
              // If coming from profile, go back to profile
              const referrer = document.referrer;
              if (referrer && referrer.includes('/profile')) {
                window.location.href = '/profile';
              }
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to all poems
          </Button>
          
          {user && selectedPoem.author && user.id === selectedPoem.author.id && (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={() => {
                  setEditPoemDialogOpen(true);
                  setEditingPoem({
                    id: selectedPoem.id,
                    title: selectedPoem.title,
                    content: selectedPoem.content,
                    isVideo: selectedPoem.isVideo || false,
                    videoUrl: selectedPoem.videoUrl || ''
                  });
                }}
              >
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setDeleteConfirmOpen(true)}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">{selectedPoem.title}</h1>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback className="text-xs bg-primary text-white">
                  {selectedPoem.author ? selectedPoem.author.username.charAt(0).toUpperCase() : 'A'}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">
                {selectedPoem.author ? selectedPoem.author.username : 'Anonymous'}
              </span>
            </div>
            <span className="mx-2">•</span>
            <span>{new Date(selectedPoem.createdAt).toLocaleDateString()}</span>
          </div>
          
          {selectedPoem.isVideo ? (
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-md overflow-hidden">
                <iframe 
                  src={selectedPoem.videoUrl} 
                  className="w-full h-full" 
                  allowFullScreen
                  title={selectedPoem.title}
                ></iframe>
              </div>
              <div className="whitespace-pre-line">{selectedPoem.content}</div>
            </div>
          ) : (
            <div className="whitespace-pre-line prose max-w-none">{selectedPoem.content}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <MainLayout activeSection="poetry">
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        {!detailView ? (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Poetry</h1>
              <p className="text-gray-600">Discover and share beautiful poetry from around the world</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Column - Poetry Feed */}
              <div className="md:w-2/3 space-y-6">
                {/* Tabs for Poetry Types */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="overflow-x-auto pb-1">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="border-b border-gray-200 w-full justify-start inline-flex min-w-full">
                        <TabsTrigger value="trending" className="flex items-center whitespace-nowrap text-xs md:text-sm">
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                            </svg>
                            All Poetry
                          </span>
                        </TabsTrigger>
                        <TabsTrigger value="text" className="flex items-center whitespace-nowrap text-xs md:text-sm">
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            Text Poetry
                          </span>
                        </TabsTrigger>
                        <TabsTrigger value="video" className="flex items-center whitespace-nowrap text-xs md:text-sm">
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                            Video Poetry
                          </span>
                        </TabsTrigger>
                        {user && (
                          <TabsTrigger value="following" className="flex items-center whitespace-nowrap text-xs md:text-sm">
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                              My Follows
                            </span>
                          </TabsTrigger>
                        )}
                      </TabsList>
                    </Tabs>
                  </div>
                </div>

                {/* New Poetry button (for logged in users) */}
                {user && (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center">
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Submit New Poetry
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>Submit New Poetry</DialogTitle>
                        <DialogDescription>
                          Share your creativity with the community. Your submission will be reviewed before publishing.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="flex items-center space-x-2 py-2">
                        <Switch id="poetry-type" checked={isVideoPoetry} onCheckedChange={togglePoetryType} />
                        <Label htmlFor="poetry-type">Video Poetry</Label>
                      </div>
                      
                      <Form {...poemForm}>
                        <form onSubmit={poemForm.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={poemForm.control}
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
                            control={poemForm.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder={isVideoPoetry ? "Enter a brief description or transcript" : "Enter your poem"} 
                                    className="min-h-[150px]" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {isVideoPoetry && (
                            <FormField
                              control={poemForm.control}
                              name="videoUrl"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Video URL</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter the URL to your poetry video" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Provide a link to your video on platforms like YouTube or Vimeo
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          <DialogFooter>
                            <Button type="submit" disabled={createPoemMutation.isPending}>
                              {createPoemMutation.isPending ? 'Submitting...' : 'Submit Poetry'}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                )}

                {/* Poetry Items */}
                {renderPoems()}
              </div>

              {/* Right Column - Sidebar */}
              <div className="md:w-1/3 space-y-6">
                {/* Featured Poets */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Featured Poets</h2>
                  <div className="space-y-4">
                    {isLoadingFeaturedPoets ? (
                      <div className="text-center py-2">Loading featured poets...</div>
                    ) : !featuredPoets || featuredPoets.length === 0 ? (
                      <div className="text-center py-2 text-sm text-gray-500">No featured poets available</div>
                    ) : (
                      featuredPoets.map((poet: {id: number; username: string; poemCount: number}) => (
                        <div key={poet.id} className="flex items-center">
                          <Avatar className="mr-3">
                            <AvatarFallback className="bg-primary text-white">
                              {poet.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800">{poet.username}</h3>
                            <p className="text-xs text-gray-500">
                              {poet.poemCount} {poet.poemCount === 1 ? 'poem' : 'poems'}
                            </p>
                          </div>
                          {!user ? (
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="text-primary hover:text-blue-700"
                              onClick={() => navigate("/auth")}
                            >
                              Follow
                            </Button>
                          ) : user.id === poet.id ? (
                            <Badge variant="outline" className="text-xs">You</Badge>
                          ) : poetFollowingStatus[poet.id] ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-muted-foreground hover:text-foreground border-gray-200 hover:border-gray-300"
                              onClick={() => unfollowPoetMutation.mutate(poet.id)}
                              disabled={unfollowPoetMutation.isPending}
                            >
                              Unfollow
                            </Button>
                          ) : (
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="text-primary hover:text-blue-700"
                              onClick={() => followPoetMutation.mutate(poet.id)}
                              disabled={followPoetMutation.isPending}
                            >
                              Follow
                            </Button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Upcoming Poetry Events */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Poetry Events</h2>
                  <div className="space-y-4">
                    {isLoadingPoetryEvents ? (
                      <div className="text-center py-2">Loading events...</div>
                    ) : !poetryEvents || poetryEvents.length === 0 ? (
                      <div className="text-center py-2 text-sm text-gray-500">No upcoming poetry events</div>
                    ) : (
                      poetryEvents.map((event: Event) => (
                        <Card key={event.id} className="border border-gray-200">
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-base">{event.title}</CardTitle>
                            <CardDescription className="text-xs flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(event.date).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="py-2 px-4">
                            <p className="text-sm line-clamp-2">{event.description}</p>
                          </CardContent>
                          <CardFooter className="py-2 px-4 border-t flex justify-between items-center">
                            <div className="text-xs text-gray-500">
                              {event.location}
                            </div>
                            <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => navigate(`/events/${event.id}`)}>
                              View
                            </Button>
                          </CardFooter>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Popular Tags */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Popular Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">#nature</Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">#love</Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">#haiku</Badge>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">#life</Badge>
                    <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200">#hope</Badge>
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">#inspiration</Badge>
                    <Badge variant="secondary" className="bg-pink-100 text-pink-800 hover:bg-pink-200">#spokenword</Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">#modernpoetry</Badge>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Detail view for single poem
          <div className="max-w-4xl mx-auto">
            {renderDetailedPoem()}
          </div>
        )}
      </div>

      {/* Edit Poem Dialog */}
      {editingPoem && (
        <Dialog open={editPoemDialogOpen} onOpenChange={setEditPoemDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Poetry</DialogTitle>
              <DialogDescription>
                Update your poetry content.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex items-center space-x-2 py-2">
              <Switch 
                id="edit-poetry-type" 
                checked={editingPoem.isVideo} 
                onCheckedChange={(checked) => setEditingPoem({...editingPoem, isVideo: checked})} 
              />
              <Label htmlFor="edit-poetry-type">Video Poetry</Label>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input 
                  id="edit-title" 
                  value={editingPoem.title} 
                  onChange={(e) => setEditingPoem({...editingPoem, title: e.target.value})}
                  placeholder="Enter the title of your poem" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea 
                  id="edit-content" 
                  value={editingPoem.content}
                  onChange={(e) => setEditingPoem({...editingPoem, content: e.target.value})}
                  placeholder={editingPoem.isVideo ? "Enter a brief description or transcript" : "Enter your poem"} 
                  className="min-h-[150px]" 
                />
              </div>
              
              {editingPoem.isVideo && (
                <div className="space-y-2">
                  <Label htmlFor="edit-video-url">Video URL</Label>
                  <Input 
                    id="edit-video-url" 
                    value={editingPoem.videoUrl} 
                    onChange={(e) => setEditingPoem({...editingPoem, videoUrl: e.target.value})}
                    placeholder="Enter the URL to your poetry video" 
                  />
                  <p className="text-sm text-muted-foreground">
                    Provide a link to your video on platforms like YouTube or Vimeo
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditPoemDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  // Implement the update functionality here
                  fetch(`/api/poems/${editingPoem.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      title: editingPoem.title,
                      content: editingPoem.content,
                      isVideo: editingPoem.isVideo,
                      videoUrl: editingPoem.videoUrl,
                    }),
                  })
                    .then(res => {
                      if (!res.ok) throw new Error('Failed to update poem');
                      return res.json();
                    })
                    .then(() => {
                      queryClient.invalidateQueries({ queryKey: ['/api/poems'] });
                      queryClient.invalidateQueries({ queryKey: ['/api/poems', poemId] });
                      toast({
                        title: 'Poem Updated',
                        description: 'Your poem has been updated successfully',
                      });
                      setEditPoemDialogOpen(false);
                    })
                    .catch(error => {
                      toast({
                        title: 'Update Failed',
                        description: error.message,
                        variant: 'destructive',
                      });
                    });
                }}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {selectedPoem && (
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedPoem.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter className="flex space-x-2 pt-4">
              <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  fetch(`/api/poems/${selectedPoem.id}`, {
                    method: 'DELETE',
                  })
                    .then(res => {
                      if (!res.ok) throw new Error('Failed to delete poem');
                      return res.json();
                    })
                    .then(() => {
                      // Redirect back to poetry list after deletion
                      navigate('/poetry', { replace: true });
                      setDetailView(false);
                      queryClient.invalidateQueries({ queryKey: ['/api/poems'] });
                      toast({
                        title: 'Poem Deleted',
                        description: 'Your poem has been deleted successfully',
                      });
                    })
                    .catch(error => {
                      toast({
                        title: 'Deletion Failed',
                        description: error.message,
                        variant: 'destructive',
                      });
                    });
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
}
