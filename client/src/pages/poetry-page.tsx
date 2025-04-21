import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import MainLayout from '@/components/shared/MainLayout';
import PoetryCard from '@/components/poetry/PoetryCard';
import VideoPoetryCard from '@/components/poetry/VideoPoetryCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Poem, insertPoemSchema } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function PoetryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("trending");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isVideoPoetry, setIsVideoPoetry] = useState(false);

  const { data: poems, isLoading } = useQuery<Poem[]>({
    queryKey: ['/api/poems'],
    queryFn: async () => {
      const res = await fetch('/api/poems');
      if (!res.ok) throw new Error('Failed to fetch poems');
      return res.json();
    }
  });

  const poemForm = useForm({
    resolver: zodResolver(insertPoemSchema),
    defaultValues: {
      title: '',
      content: '',
      approved: true,
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
        description: 'Your poem has been created successfully',
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
    document.title = 'Versefountain - Poetry';
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

    return (
      <div className="space-y-6">
        {poems.map(poem => (
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

  return (
    <MainLayout activeSection="poetry">
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Poetry</h1>
          <p className="text-gray-600">Discover and share beautiful poetry from around the world</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Poetry Feed */}
          <div className="md:w-2/3 space-y-6">
            {/* Tabs for Poetry Types */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="border-b border-gray-200 w-full justify-start">
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                  <TabsTrigger value="text">Text Poetry</TabsTrigger>
                  <TabsTrigger value="video">Video Poetry</TabsTrigger>
                  {user && <TabsTrigger value="following">My Follows</TabsTrigger>}
                </TabsList>
              </Tabs>
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
                {/* Poet Item */}
                <div className="flex items-center">
                  <Avatar className="mr-3">
                    <AvatarFallback className="bg-primary text-white">RF</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">Robert Frost</h3>
                    <p className="text-xs text-gray-500">142 poems</p>
                  </div>
                  <Button variant="link" size="sm" className="text-primary hover:text-blue-700">Follow</Button>
                </div>
                
                <div className="flex items-center">
                  <Avatar className="mr-3">
                    <AvatarFallback className="bg-purple-500 text-white">ED</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">Emily Dickinson</h3>
                    <p className="text-xs text-gray-500">98 poems</p>
                  </div>
                  <Button variant="link" size="sm" className="text-primary hover:text-blue-700">Follow</Button>
                </div>
                
                <div className="flex items-center">
                  <Avatar className="mr-3">
                    <AvatarFallback className="bg-green-500 text-white">WW</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">Walt Whitman</h3>
                    <p className="text-xs text-gray-500">76 poems</p>
                  </div>
                  <Button variant="link" size="sm" className="text-primary hover:text-blue-700">Follow</Button>
                </div>
              </div>
              <Button variant="link" className="w-full text-primary text-sm font-medium mt-4">View All Poets</Button>
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

            {/* Upcoming Poetry Events */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Poetry Events</h2>
              <div className="space-y-4">
                {/* Event Item */}
                <div className="flex">
                  <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 bg-primary bg-opacity-10 rounded-lg mr-3">
                    <span className="text-primary font-bold text-lg">18</span>
                    <span className="text-primary text-xs uppercase">May</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Poetry Slam Night</h3>
                    <p className="text-xs text-gray-500">Virtual Event • 7:00 PM</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mr-3">
                    <span className="text-purple-600 font-bold text-lg">24</span>
                    <span className="text-purple-600 text-xs uppercase">May</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Romantic Poetry Reading</h3>
                    <p className="text-xs text-gray-500">Central Library • 5:30 PM</p>
                  </div>
                </div>
              </div>
              <Button variant="link" className="block w-full text-primary text-sm font-medium mt-4">View All Events</Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
