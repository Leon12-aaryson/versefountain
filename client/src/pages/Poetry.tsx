import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import PoetryCard from "@/components/poetry/PoetryCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import type { Poem, CulturalCategory } from "@shared/schema";

export default function Poetry() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Fetch all poems
  const { data: poems, isLoading: poemsLoading } = useQuery<Poem[]>({
    queryKey: ['/api/poems'],
  });

  // Fetch cultural categories
  const { data: categories, isLoading: categoriesLoading } = useQuery<CulturalCategory[]>({
    queryKey: ['/api/cultural-categories'],
  });

  // Filter poems based on search query and category
  const filteredPoems = poems?.filter(poem => {
    // First apply search filter if there's a query
    const matchesSearch = searchQuery 
      ? poem.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        poem.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poem.authorName.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    // Then apply category filter
    const matchesCategory = activeCategory === "all" || poem.culturalOrigin.toLowerCase() === activeCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already being applied through the filteredPoems
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl md:text-5xl mb-4">Cultural Poetry Collection</h1>
        <div className="section-divider w-36 mx-auto mb-6"></div>
        <p className="text-neutral-charcoal opacity-75 max-w-2xl mx-auto">
          Discover and explore poetry from diverse cultural traditions around the world
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <Input
              type="text"
              placeholder="Search poems, authors..."
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

          <Tabs 
            defaultValue="all" 
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full md:w-auto"
          >
            <TabsList className="overflow-x-auto flex w-full md:w-auto justify-start">
              <TabsTrigger value="all" className="min-w-max">All Poems</TabsTrigger>
              {!categoriesLoading && categories?.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.name.toLowerCase()} 
                  className="min-w-max"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Poetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {poemsLoading ? (
          // Loading state
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-lg"></div>
          ))
        ) : filteredPoems && filteredPoems.length > 0 ? (
          // Display filtered poems
          filteredPoems.map(poem => (
            <PoetryCard key={poem.id} poem={poem} />
          ))
        ) : (
          // No results or empty state
          <div className="col-span-3 py-20 text-center">
            <h3 className="text-xl font-display mb-2">No poems found</h3>
            <p className="text-gray-500">
              {searchQuery 
                ? `No poems matching "${searchQuery}" in ${activeCategory === "all" ? "any category" : activeCategory}`
                : `No poems available in ${activeCategory === "all" ? "any category" : activeCategory}`
              }
            </p>
            {searchQuery && (
              <Button 
                onClick={() => setSearchQuery("")} 
                variant="outline" 
                className="mt-4"
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Pagination if needed */}
      {filteredPoems && filteredPoems.length > 9 && (
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
