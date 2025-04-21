import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import MainLayout from '@/components/shared/MainLayout';
import BookCard from '@/components/books/BookCard';
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
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Search, FileText, BookOpen, Library } from 'lucide-react';
import { Book, insertBookSchema } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BooksPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { data: books, isLoading } = useQuery<Book[]>({
    queryKey: ['/api/books'],
    queryFn: async () => {
      const res = await fetch('/api/books');
      if (!res.ok) throw new Error('Failed to fetch books');
      return res.json();
    }
  });
  
  const bookForm = useForm({
    resolver: zodResolver(insertBookSchema),
    defaultValues: {
      title: '',
      author: '',
      description: '',
      genre: '',
      coverImage: '',
    }
  });
  
  const createBookMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/books', data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Book Submitted',
        description: 'Your book has been submitted successfully and is pending approval.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
      bookForm.reset();
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'Failed to submit book',
        variant: 'destructive',
      });
    }
  });
  
  const onSubmit = (data: any) => {
    createBookMutation.mutate(data);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality would be implemented here
    toast({
      title: 'Search',
      description: `Searching for "${searchQuery}"`,
    });
  };
  
  const filteredBooks = books?.filter(book => {
    const matchesSearch = searchQuery === '' || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
    
    return matchesSearch && matchesGenre;
  });
  
  const getGenres = () => {
    if (!books) return [];
    const genres = new Set(books.map(book => book.genre).filter(Boolean));
    return Array.from(genres);
  };

  useEffect(() => {
    document.title = 'eLibrary - Books';
  }, []);

  return (
    <MainLayout activeSection="books">
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Books</h1>
            <p className="text-gray-600">Browse our collection of eBooks across various genres</p>
          </div>
          
          {user && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 md:mt-0">
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Upload Book
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Upload a Book</DialogTitle>
                  <DialogDescription>
                    Share your literature with the community. Your submission will be reviewed before publishing.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...bookForm}>
                  <form onSubmit={bookForm.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={bookForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter the book title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={bookForm.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter the author's name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={bookForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter a brief description of the book" 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={bookForm.control}
                      name="genre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Genre</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter the book genre" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={bookForm.control}
                      name="coverImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter URL to the book cover image" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit" disabled={createBookMutation.isPending}>
                        {createBookMutation.isPending ? 'Uploading...' : 'Upload Book'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        {/* Search and Filter Area */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search books by title or author..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <Search className="h-5 w-5" />
                  </div>
                </div>
              </form>
              
              <div className="w-full md:w-auto">
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Select Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {getGenres().map(genre => (
                      <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Book Categories */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Books</TabsTrigger>
            <TabsTrigger value="fiction">Fiction</TabsTrigger>
            <TabsTrigger value="nonfiction">Non-Fiction</TabsTrigger>
            <TabsTrigger value="poetry">Poetry Collections</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Books Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {isLoading ? (
            <div className="col-span-full text-center py-10">Loading books...</div>
          ) : filteredBooks && filteredBooks.length > 0 ? (
            filteredBooks.map(book => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                coverImage={book.coverImage || undefined}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 flex flex-col items-center">
              <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-800">No books found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
        
        {/* Featured Collections Section */}
        <div className="mt-12 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <CardContent className="pt-6">
                <FileText className="h-8 w-8 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Classics Library</h3>
                <p className="text-sm opacity-90 mb-4">Explore timeless literature from renowned authors throughout history</p>
                <Button variant="secondary" className="bg-white text-blue-700 hover:bg-gray-100">
                  Browse Classics
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <CardContent className="pt-6">
                <Library className="h-8 w-8 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Contemporary Fiction</h3>
                <p className="text-sm opacity-90 mb-4">Discover modern stories from today's most captivating storytellers</p>
                <Button variant="secondary" className="bg-white text-emerald-700 hover:bg-gray-100">
                  Browse Collection
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <CardContent className="pt-6">
                <BookOpen className="h-8 w-8 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Poetry Anthologies</h3>
                <p className="text-sm opacity-90 mb-4">Immerse yourself in collections of beautiful poetry from around the world</p>
                <Button variant="secondary" className="bg-white text-amber-700 hover:bg-gray-100">
                  Browse Poetry
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
