import { useState, useEffect } from 'react';
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
import { useForm } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/constants';

// Define the Book type
interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  genre?: string;
  coverImage?: string;
}

export default function BooksPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;

  // State for books
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch books on mount
  useEffect(() => {
    setIsLoading(true);
    axios.get(`${API_BASE_URL}/api/books`)
      .then(res => setBooks(res.data))
      .catch(() => setBooks([]))
      .finally(() => setIsLoading(false));
  }, []);

  // Remove zodResolver and schema, use react-hook-form rules instead
  const bookForm = useForm({
    defaultValues: {
      title: '',
      author: '',
      description: '',
      genre: '',
      coverImage: '',
    }
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedCoverPath, setUploadedCoverPath] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // File upload handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);

      const formData = new FormData();
      formData.append('coverImage', file);

      setIsUploading(true);
      try {
        const res = await axios.post(`${API_BASE_URL}/api/upload/bookcover`, formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setUploadedCoverPath(res.data.filePath);
        toast({
          title: 'File Uploaded',
          description: 'Cover image uploaded successfully',
        });
      } catch (error: any) {
        toast({
          title: 'Upload Failed',
          description: error?.message || 'Failed to upload cover image',
          variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Book creation handler
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const bookData = {
        ...data,
        coverImage: uploadedCoverPath || data.coverImage,
      };
      await axios.post(`${API_BASE_URL}/api/books`, bookData, { withCredentials: true });
      toast({
        title: 'Book Submitted',
        description: 'Your book has been submitted successfully and is pending approval.',
      });
      // Refetch books
      const res = await axios.get(`${API_BASE_URL}/api/books`);
      setBooks(res.data);
      bookForm.reset();
      setUploadedFile(null);
      setUploadedCoverPath(null);
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Submission Failed',
        description: error?.message || 'Failed to submit book',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
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

  // Pagination
  const totalBooks = filteredBooks?.length || 0;
  const totalPages = Math.ceil(totalBooks / booksPerPage);
  const currentBooks = filteredBooks?.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const getGenres = () => {
    if (!books) return [];
    // Filter out undefined/null and ensure all genres are strings
    const genres = new Set(
      books
        .map(book => book.genre)
        .filter((genre): genre is string => typeof genre === 'string' && genre.length > 0)
    );
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
                      rules={{ required: "Title is required", minLength: { value: 2, message: "Title must be at least 2 characters." } }}
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
                      rules={{ required: "Author is required", minLength: { value: 2, message: "Author must be at least 2 characters." } }}
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
                      rules={{ required: "Description is required", minLength: { value: 10, message: "Description must be at least 10 characters." } }}
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
                      rules={{ required: "Genre is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Genre</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a genre" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fiction">Fiction</SelectItem>
                              <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                              <SelectItem value="mystery">Mystery</SelectItem>
                              <SelectItem value="science-fiction">Science Fiction</SelectItem>
                              <SelectItem value="fantasy">Fantasy</SelectItem>
                              <SelectItem value="romance">Romance</SelectItem>
                              <SelectItem value="thriller">Thriller</SelectItem>
                              <SelectItem value="horror">Horror</SelectItem>
                              <SelectItem value="biography">Biography</SelectItem>
                              <SelectItem value="history">History</SelectItem>
                              <SelectItem value="poetry">Poetry</SelectItem>
                              <SelectItem value="self-help">Self-Help</SelectItem>
                              <SelectItem value="children">Children's</SelectItem>
                              <SelectItem value="young-adult">Young Adult</SelectItem>
                              <SelectItem value="academic">Academic</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <div>
                        <FormLabel>Cover Image</FormLabel>
                        <div className="mt-2">
                          <div className="flex items-center gap-4">
                            <Input
                              type="file"
                              id="cover-upload"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="max-w-sm"
                            />
                            {isUploading &&
                              <div className="text-sm text-gray-500">
                                Uploading...
                              </div>
                            }
                          </div>
                          {uploadedCoverPath && (
                            <div className="mt-2">
                              <div className="text-sm text-green-600 mb-2 flex items-center gap-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Cover image uploaded successfully
                              </div>
                              <div className="border rounded-md p-2 max-w-xs">
                                <img
                                  src={uploadedCoverPath}
                                  alt="Uploaded Cover"
                                  className="max-h-40 object-contain mx-auto"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Or provide a URL to an existing image:
                        </div>
                      </div>

                      <FormField
                        control={bookForm.control}
                        name="coverImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Cover Image URL</FormLabel>
                            <FormControl>
                              <Input placeholder="Alternative: enter URL to the book cover image" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <DialogFooter>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Uploading...' : 'Upload Book'}
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
        <div className="overflow-x-auto pb-2 mb-4">
          <Tabs defaultValue="all" className="mb-2">
            <TabsList className="inline-flex h-9 min-w-full w-auto">
              <TabsTrigger value="all" className="whitespace-nowrap text-xs md:text-sm">All Books</TabsTrigger>
              <TabsTrigger value="fiction" className="whitespace-nowrap text-xs md:text-sm">Fiction</TabsTrigger>
              <TabsTrigger value="nonfiction" className="whitespace-nowrap text-xs md:text-sm">Non-Fiction</TabsTrigger>
              <TabsTrigger value="poetry" className="whitespace-nowrap text-xs md:text-sm">Poetry Collections</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {isLoading ? (
            <div className="col-span-full text-center py-10">Loading books...</div>
          ) : currentBooks && currentBooks.length > 0 ? (
            currentBooks.map(book => (
              <BookCard
                key={book.id}
                id={Number(book.id)}
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

        {/* Pagination Controls */}
        {filteredBooks && filteredBooks.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 mb-4 sm:mb-0">
              Showing {Math.min(totalBooks, 1 + (currentPage - 1) * booksPerPage)}-{Math.min(currentPage * booksPerPage, totalBooks)} of {totalBooks} books
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="h-8 w-8 p-0"
              >
                &lt;
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageToShow;
                if (totalPages <= 5) {
                  pageToShow = i + 1;
                } else if (currentPage <= 3) {
                  pageToShow = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageToShow = totalPages - 4 + i;
                } else {
                  pageToShow = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageToShow}
                    variant={currentPage === pageToShow ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageToShow)}
                    className="h-8 w-8 p-0"
                  >
                    {pageToShow}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="h-8 w-8 p-0"
              >
                &gt;
              </Button>
            </div>
          </div>
        )}

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
