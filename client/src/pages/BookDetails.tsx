import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Share2, 
  BookmarkPlus, 
  ArrowLeft, 
  User, 
  CalendarDays,
  Clock,
  Globe
} from "lucide-react";
import type { Book, Comment } from "@shared/schema";

export default function BookDetails() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  
  // Fetch book details
  const { data: book, isLoading: isLoadingBook } = useQuery<Book>({
    queryKey: [`/api/books/${id}`],
  });
  
  // Fetch book comments
  const { data: comments, isLoading: isLoadingComments } = useQuery<Comment[]>({
    queryKey: [`/api/comments/book/${id}`],
  });
  
  const handleBack = () => {
    navigate("/books");
  };

  if (isLoadingBook) {
    return (
      <div className="container mx-auto px-4 py-10 min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-4xl animate-pulse">
          <div className="h-8 w-1/3 bg-gray-200 rounded mb-6"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 h-[400px] bg-gray-200 rounded"></div>
            <div className="md:w-2/3 space-y-4">
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-display mb-4">Book Not Found</h2>
        <p className="mb-8">The book you're looking for doesn't exist or has been removed.</p>
        <Button onClick={handleBack}>Back to Books</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Button
        variant="ghost"
        className="mb-6 group"
        onClick={handleBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Books
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Book Cover */}
        <div className="md:col-span-1">
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
            <img
              src={book.coverImage || '/placeholder-book.jpg'}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <Button variant="outline" className="flex-1">
              <BookmarkPlus className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
        
        {/* Book Details */}
        <div className="md:col-span-2">
          <h1 className="font-display text-3xl md:text-4xl mb-2">{book.title}</h1>
          
          <div className="mb-3 text-gray-700">by <span className="font-medium">{book.author}</span></div>
          
          <div className="flex items-center mb-6">
            <Rating value={book.rating} count={book.ratingCount} />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <Globe className="mr-2 h-4 w-4 text-primary" />
              Origin: {book.culturalOrigin || 'Not specified'}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CalendarDays className="mr-2 h-4 w-4 text-primary" />
              Published: {new Date(book.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm text-gray-600 col-span-2">
              <BookOpen className="mr-2 h-4 w-4 text-primary" />
              Category: {book.category}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="font-display text-xl mb-3">Description</h3>
            <p className="text-gray-800 leading-relaxed">
              {book.description || 'No description available for this book.'}
            </p>
          </div>
          
          <Button size="lg" className="mb-6 w-full md:w-auto">
            <BookOpen className="mr-2 h-5 w-5" />
            Start Reading
          </Button>
        </div>
      </div>
      
      {/* Tabs Section */}
      <Card className="mb-12">
        <Tabs defaultValue="about">
          <TabsList className="border-b w-full rounded-none justify-start">
            <TabsTrigger value="about">About the Book</TabsTrigger>
            <TabsTrigger value="discussions">
              Discussions {comments?.length ? `(${comments.length})` : ''}
            </TabsTrigger>
          </TabsList>
          
          <CardContent className="pt-6">
            <TabsContent value="about">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-display text-xl mb-4">Cultural Context</h3>
                  <p className="text-gray-800 leading-relaxed mb-4">
                    This book represents traditions and cultural elements from {book.culturalOrigin || 'various cultures'}. 
                    It provides insights into local customs, beliefs, and heritage that have been passed down through generations.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-display text-xl mb-4">Reading Experience</h3>
                  <p className="text-gray-800 leading-relaxed">
                    Track your reading progress, save favorite quotes, and engage with a community 
                    of readers passionate about cultural literature.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="discussions">
              {isLoadingComments ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="mb-4 animate-pulse">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      <div>
                        <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="ml-12">
                      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))
              ) : comments && comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id} className="mb-6 last:mb-0">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                          {comment.userAvatar ? (
                            <img 
                              src={comment.userAvatar} 
                              alt={comment.username} 
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-6 w-6" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h4 className="font-medium">{comment.username}</h4>
                          <span className="text-xs text-gray-500 ml-2">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-800">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-xl font-display mb-2">No discussions yet</h3>
                  <p className="text-gray-500 mb-4">Be the first to start a discussion about this book!</p>
                  <Button>Start Discussion</Button>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}