import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import EventCard from "@/components/events/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import type { Event } from "@shared/schema";

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showVirtualOnly, setShowVirtualOnly] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Fetch events
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  // Filter events based on search query, virtual filter, and date
  const filteredEvents = events?.filter(event => {
    // Search filter
    const matchesSearch = searchQuery 
      ? event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    // Virtual event filter
    const matchesVirtual = showVirtualOnly ? event.isVirtual : true;
    
    // Date filter
    const matchesDate = date
      ? format(new Date(event.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      : true;
    
    return matchesSearch && matchesVirtual && matchesDate;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already applied through the filteredEvents
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl md:text-5xl mb-4">Cultural Events</h1>
        <div className="section-divider w-36 mx-auto mb-6"></div>
        <p className="text-neutral-charcoal opacity-75 max-w-2xl mx-auto">
          Join poetry readings, book launches, and cultural celebrations both online and in-person
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-10">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <form onSubmit={handleSearch} className="relative">
                <Label htmlFor="search-events">Search Events</Label>
                <div className="flex mt-1">
                  <Input
                    id="search-events"
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                  <Button 
                    type="submit" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-7"
                  >
                    <Search className="h-5 w-5 text-gray-400" />
                  </Button>
                </div>
              </form>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-filter">Filter by Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                  {date && (
                    <div className="p-3 border-t border-gray-100 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setDate(undefined)}
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="virtual-filter">Event Type</Label>
              <div className="flex items-center justify-between space-x-2 p-4 border rounded-md">
                <Label htmlFor="virtual-filter" className="cursor-pointer">Show virtual events only</Label>
                <Switch 
                  id="virtual-filter"
                  checked={showVirtualOnly}
                  onCheckedChange={setShowVirtualOnly}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading state
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-xl"></div>
          ))
        ) : filteredEvents && filteredEvents.length > 0 ? (
          // Display filtered events
          filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          // No results
          <div className="col-span-3 py-20 text-center">
            <h3 className="text-xl font-display mb-2">No events found</h3>
            <p className="text-gray-500">
              {searchQuery || date || showVirtualOnly
                ? `No events match your current filters`
                : `No upcoming events scheduled at this time`
              }
            </p>
            {(searchQuery || date || showVirtualOnly) && (
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setDate(undefined);
                  setShowVirtualOnly(false);
                }} 
                variant="outline" 
                className="mt-4"
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Pagination if needed */}
      {filteredEvents && filteredEvents.length > 9 && (
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
