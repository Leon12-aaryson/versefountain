import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, User, Plus, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const { user, logoutMutation } = useAuth();

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
        {/* Enhanced overlay for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1614850523060-8da1d56ae167?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')", backgroundRepeat: "repeat-space" }}></div>

        {/* Navigation with enhanced styling */}
        <nav className="relative z-10 flex justify-between items-center px-4 md:px-12 py-6 border-b border-white/10 backdrop-blur-sm bg-black/20">
          <div className="flex items-center">
            <Link href="/">
              <div className="group">
                <span className="text-white font-display text-2xl md:text-3xl tracking-wider bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent drop-shadow-sm">
                  VerseFountain
                </span>
                <div className="hidden md:block text-white text-sm font-medium mt-1">
                  Poetry & Cultural Library
                </div>
                <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-amber-200 to-amber-400 transition-all duration-300 mt-1"></div>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-white font-sans">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <div className="group relative">
                  <span className={`navbar-item transition-colors ${location === link.path ? 'text-amber-300 font-medium' : 'text-white hover:text-amber-200'}`}>
                    {link.name}
                  </span>
                  <div className={`h-0.5 ${location === link.path ? 'w-full bg-amber-300' : 'w-0 group-hover:w-full bg-amber-200'} transition-all duration-300 absolute bottom-0 left-0`}></div>
                </div>
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
                className="py-1 px-3 pr-8 rounded-full bg-white/15 text-white placeholder:text-white/70 border border-white/30 focus:outline-none focus:ring-1 focus:ring-amber-300 focus:border-amber-300 text-sm w-36 md:w-48 backdrop-blur-sm"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4" />
            </div>
            
            {user ? (
              <>
                <Link href="/create">
                  <Button variant="ghost" size="sm" className="text-white bg-amber-600/80 hover:bg-amber-700 hover:text-white hidden md:flex">
                    <Plus className="mr-1 h-4 w-4" /> Create
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:text-amber-300 hover:bg-white/10 rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      <div className="font-medium">
                        {user.username}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Member
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/profile">
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                    <Link href="/create">
                      <DropdownMenuItem>Create Content</DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => logoutMutation.mutate()}
                      disabled={logoutMutation.isPending}
                      className="text-red-500 focus:text-red-500"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" size="sm" className="text-white hover:text-amber-300 hover:bg-white/10">
                  Login / Register
                </Button>
              </Link>
            )}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-amber-300 hover:bg-white/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link key={link.path} href={link.path}>
                      <div className={`text-lg font-medium ${location === link.path ? 'text-amber-600' : 'text-gray-700 hover:text-amber-600'} transition-colors`}>
                        {link.name}
                      </div>
                    </Link>
                  ))}
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    {user ? (
                      <>
                        <Link href="/create">
                          <div className="text-lg font-medium text-amber-600 hover:text-amber-700 transition-colors">
                            Create Content
                          </div>
                        </Link>
                        <div 
                          className="text-lg font-medium text-red-500 hover:text-red-600 transition-colors mt-4 cursor-pointer"
                          onClick={() => logoutMutation.mutate()}
                        >
                          Logout
                        </div>
                      </>
                    ) : (
                      <Link href="/auth">
                        <div className="text-lg font-medium text-amber-600 hover:text-amber-700 transition-colors">
                          Login / Register
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>

        {/* Hero Content with enhanced visibility */}
        <div className="relative z-10 h-[400px] md:h-[500px] px-6 md:px-16 flex flex-col justify-center">
          <h1 className="font-display text-4xl md:text-6xl text-white mb-4 leading-tight drop-shadow-lg">
            Preserving Culture<br />Through <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">Poetry</span>
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-200 mb-6"></div>
          <p className="font-body text-lg md:text-xl text-white max-w-lg mb-8 drop-shadow">
            Discover traditional and local cultural expressions from across the world through poetry, literature and community.
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Link href="/poetry">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 px-6 rounded-md transition-all duration-300 font-sans font-medium text-sm md:text-base inline-flex items-center justify-center sm:justify-start shadow-lg shadow-amber-700/20">
                <i className="fas fa-book-open mr-2"></i> Explore Featured Poetry
              </div>
            </Link>
            <Link href="/events">
              <div className="bg-transparent border border-white text-white hover:bg-white/10 py-3 px-6 rounded-md transition-all duration-300 font-sans font-medium text-sm md:text-base inline-flex items-center justify-center sm:justify-start backdrop-blur-sm">
                <i className="fas fa-calendar-alt mr-2"></i> Upcoming Events
              </div>
            </Link>
          </div>
        </div>

        {/* Enhanced Cultural Border Design */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-amber-800/30 via-amber-600/40 to-amber-800/30 backdrop-blur-sm"></div>
      </div>
    </header>
  );
}
