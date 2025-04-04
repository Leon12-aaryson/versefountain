import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import BookCard from "@/components/books/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Book } from "@shared/schema";

export default function Books() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  // Extract category from URL if present
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const categoryParam = urlParams.get('category');
  
  // Use category from URL if present, otherwise use state
  const effectiveCategory = categoryParam || activeCategory;

  // Fetch books potentially filtered by category
  const { data: books, isLoading } = useQuery<Book[]>({
    queryKey: ['/api/books', effectiveCategory ? `?category=${effectiveCategory}` : ''],
  });

  // Filter books by search query
  const filteredBooks = books?.filter(book => 
    searchQuery ? (
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.description && book.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : true
  );

  // Get unique categories from books
  const categories = [...new Set(books?.map(book => book.category) || [])];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already applied through filteredBooks
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl md:text-5xl mb-4">Explore Cultural Books</h1>
        <div className="section-divider w-36 mx-auto mb-6"></div>
        <p className="text-neutral-charcoal opacity-75 max-w-2xl mx-auto">
          Discover our collection of books celebrating traditional cultures and local heritage
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-10">
        <form onSubmit={handleSearch} className="relative w-full max-w-md mx-auto mb-8">
          <Input
            type="text"
            placeholder="Search books, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <Button 
            type="submit" 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 top-0 h-full"
          >
            <Search className="h-5 w-5 text-gray-400" />
          </Button>
        </form>

        <div className="flex flex-wrap justify-center mb-8 space-x-2">
          <Button
            variant={!effectiveCategory ? "default" : "outline"}
            onClick={() => handleCategoryChange("")}
            className="mb-2"
          >
            All Categories
          </Button>
          
          {categories.map(category => (
            <Button
              key={category}
              variant={effectiveCategory === category ? "default" : "outline"}
              onClick={() => handleCategoryChange(category)}
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
        {isLoading ? (
          // Loading state
          Array(10).fill(0).map((_, i) => (
            <div key={i} className="h-[300px] bg-gray-100 animate-pulse rounded-md"></div>
          ))
        ) : filteredBooks && filteredBooks.length > 0 ? (
          // Display filtered books
          filteredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))
        ) : (
          // No results
          <div className="col-span-5 py-20 text-center">
            <h3 className="text-xl font-display mb-2">No books found</h3>
            <p className="text-gray-500">
              {searchQuery 
                ? `No books matching "${searchQuery}" ${effectiveCategory ? `in ${effectiveCategory}` : ''}`
                : `No books available ${effectiveCategory ? `in ${effectiveCategory}` : ''}`
              }
            </p>
            {(searchQuery || effectiveCategory) && (
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("");
                }} 
                variant="outline" 
                className="mt-4"
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Pagination if needed */}
      {filteredBooks && filteredBooks.length > 15 && (
        <div className="mt-12 flex justify-center">
          <div className="join">
            <Button variant="outline" className="mr-1">« Previous</Button>
            <Button variant="outline" className="mr-1">1</Button>
            <Button variant="default" className="mr-1">2</Button>
            <Button variant="outline" className="mr-1">3</Button>
            <Button variant="outline">Next »</Button>
          </div>
        </div>
      )}
    </div>
  );
}
