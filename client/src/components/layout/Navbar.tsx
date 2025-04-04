import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, User } from "lucide-react";

const navLinks = [
  { name: "Poetry", path: "/poetry" },
  { name: "Books", path: "/books" },
  { name: "Discussions", path: "/discussions" },
  { name: "Events", path: "/events" },
  { name: "Academics", path: "/academics" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="relative">
      {/* Hero Background with Cultural Pattern Overlay */}
      <div
        className="relative h-[500px] md:h-[600px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1550399105-c4db5fb85c18?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-neutral-charcoal bg-opacity-60"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1614850523060-8da1d56ae167?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')", backgroundRepeat: "repeat-space" }}></div>

        {/* Navigation */}
        <nav className="relative z-10 flex justify-between items-center px-4 md:px-12 py-6">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-neutral-cream font-display text-2xl md:text-3xl tracking-wider">
                Kultiva
              </a>
            </Link>
            <div className="hidden md:block ml-2 text-accent-light text-sm italic">
              Poetry & Cultural Library
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-neutral-cream font-sans">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <a className={`navbar-item hover:text-accent transition-colors ${location === link.path ? 'text-accent' : ''}`}>
                  {link.name}
                </a>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-1 px-3 pr-8 rounded-full bg-white bg-opacity-20 text-neutral-cream placeholder:text-neutral-cream placeholder:opacity-70 border border-neutral-cream border-opacity-30 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-sm w-36 md:w-48"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-cream opacity-70 h-4 w-4" />
            </div>
            
            <Link href="/profile">
              <a className="text-neutral-cream hover:text-accent transition-colors">
                <User className="h-5 w-5" />
              </a>
            </Link>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-neutral-cream hover:text-accent">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link key={link.path} href={link.path}>
                      <a className={`text-lg font-medium ${location === link.path ? 'text-primary' : 'text-gray-700'}`}>
                        {link.name}
                      </a>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 h-[400px] md:h-[500px] px-6 md:px-16 flex flex-col justify-center">
          <h1 className="font-display text-4xl md:text-6xl text-neutral-cream mb-4 leading-tight">
            Preserving Culture<br />Through <span className="text-accent">Poetry</span>
          </h1>
          <div className="w-16 h-1 bg-primary mb-6"></div>
          <p className="font-body text-lg md:text-xl text-neutral-cream max-w-lg opacity-90 mb-8">
            Discover traditional and local cultural expressions from across the world through poetry, literature and community.
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Link href="/poetry">
              <a className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded transition-colors font-sans font-medium text-sm md:text-base inline-flex items-center justify-center sm:justify-start">
                <i className="fas fa-book-open mr-2"></i> Explore Featured Poetry
              </a>
            </Link>
            <Link href="/events">
              <a className="bg-transparent border border-neutral-cream text-neutral-cream hover:bg-white hover:bg-opacity-10 py-3 px-6 rounded transition-colors font-sans font-medium text-sm md:text-base inline-flex items-center justify-center sm:justify-start">
                <i className="fas fa-calendar-alt mr-2"></i> Upcoming Events
              </a>
            </Link>
          </div>
        </div>

        {/* Cultural Border Design */}
        <div className="absolute bottom-0 left-0 right-0 cultural-border"></div>
      </div>
    </header>
  );
}
