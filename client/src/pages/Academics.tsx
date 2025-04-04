import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import AcademicResourceCard from "@/components/home/AcademicResourceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useState } from "react";
import type { AcademicResource } from "@shared/schema";

export default function Academics() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch academic resources
  const { data: resources, isLoading } = useQuery<AcademicResource[]>({
    queryKey: ['/api/academic-resources'],
  });

  // Filter resources based on search query and active tab
  const filteredResources = resources?.filter(resource => {
    // First apply search filter if there's a query
    const matchesSearch = searchQuery 
      ? resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    // Then apply category/type filter
    const matchesType = activeTab === "all" || resource.type.toLowerCase() === activeTab.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  // Get unique resource types
  const resourceTypes = [...new Set(resources?.map(r => r.type) || [])];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already applied through filteredResources
  };

  return (
    <div>
      {/* Hero section with dark background */}
      <div className="bg-neutral-charcoal text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl md:text-5xl mb-4">Academic Resources</h1>
            <div className="w-36 mx-auto mb-6 h-px" style={{ backgroundImage: "linear-gradient(90deg, transparent, #F7F3EB, transparent)" }}></div>
            <p className="text-white opacity-80 max-w-2xl mx-auto">
              Explore scholarly resources on cultural literature, poetry, and traditional storytelling
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative max-w-lg mx-auto">
            <Input
              type="text"
              placeholder="Search academic resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white bg-opacity-10 border-gray-700 text-white placeholder:text-gray-400 pr-10"
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full text-gray-400"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <Tabs 
          defaultValue="all" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mb-10"
        >
          <TabsList className="w-full flex flex-wrap justify-center">
            <TabsTrigger value="all">All Resources</TabsTrigger>
            {resourceTypes.map(type => (
              <TabsTrigger key={type} value={type.toLowerCase()}>
                {type}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Resource Highlight */}
        <Card className="mb-12 bg-secondary bg-opacity-10">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Featured Academic Resources</CardTitle>
            <CardDescription>
              Curated educational materials for understanding and appreciating cultural poetry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                // Loading state
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-[200px] bg-gray-100 animate-pulse rounded-lg"></div>
                ))
              ) : resources && resources.length > 0 ? (
                resources.slice(0, 3).map(resource => (
                  <div key={resource.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="text-accent-dark mb-3">
                      <i className={`${resource.icon} text-2xl`}></i>
                    </div>
                    <h3 className="font-display text-xl mb-2">{resource.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {resource.description}
                    </p>
                    <Link href={resource.link}>
                      <a className="text-primary text-sm font-medium inline-flex items-center">
                        Explore Resource <i className="fas fa-arrow-right ml-2"></i>
                      </a>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p>No featured resources available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Resources Grid */}
        <div className="mb-10">
          <h2 className="font-display text-2xl mb-6 text-center">All Academic Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading state
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-[200px] bg-gray-100 animate-pulse rounded-lg"></div>
              ))
            ) : filteredResources && filteredResources.length > 0 ? (
              // Display filtered resources
              filteredResources.map(resource => (
                <div key={resource.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-accent-dark mb-3">
                    <i className={`${resource.icon} text-2xl`}></i>
                  </div>
                  <h3 className="font-display text-xl mb-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {resource.description}
                  </p>
                  <Link href={resource.link}>
                    <a className="text-primary text-sm font-medium inline-flex items-center">
                      {resource.type === 'Research' && "Browse Collection "}
                      {resource.type === 'Video' && "View Lectures "}
                      {resource.type === 'Guide' && "Get Guides "}
                      {resource.type === 'Community' && "Join Groups "}
                      {resource.type === 'Resource' && "Explore Resources "}
                      {resource.type === 'Certificate' && "View Programs "}
                      <i className="fas fa-arrow-right ml-2"></i>
                    </a>
                  </Link>
                </div>
              ))
            ) : (
              // No results
              <div className="col-span-3 py-20 text-center">
                <h3 className="text-xl font-display mb-2">No resources found</h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? `No resources matching "${searchQuery}" in ${activeTab === "all" ? "any category" : activeTab}`
                    : `No resources available in ${activeTab === "all" ? "any category" : activeTab}`
                  }
                </p>
                {(searchQuery || activeTab !== "all") && (
                  <Button 
                    onClick={() => {
                      setSearchQuery("");
                      setActiveTab("all");
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
        </div>

        {/* CTA Section */}
        <div className="bg-primary bg-opacity-10 rounded-xl p-10 text-center">
          <h2 className="font-display text-2xl mb-3">Request Academic Resources</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Don't see what you're looking for? Request specific academic resources related to cultural poetry and literature.
          </p>
          <Button className="bg-primary hover:bg-primary-dark text-white">
            Submit a Request
          </Button>
        </div>
      </div>
    </div>
  );
}
