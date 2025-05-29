import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import {
  Search,
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
  Settings,
  LogOut
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  user: any;
  toggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

const Header = ({ user, toggleMobileMenu, isMobileMenuOpen }: HeaderProps) => {
  const [, navigate] = useLocation();
  const { logoutMutation } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality would go here
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/">
            <span className="text-primary text-2xl font-bold cursor-pointer">eLibrary</span>
          </Link>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search books, poetry, events..."
                className="w-full pl-10 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Search className="h-5 w-5" />
              </div>
            </div>
          </form>
        </div>

        {/* Nav Actions */}
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Button
                variant="ghost"
                className="hidden md:block"
                onClick={() => navigate('/auth')}
              >
                Log In
              </Button>
              <Button
                className="hidden md:block"
                onClick={() => navigate('/auth')}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center focus:outline-none">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-white">
                      {user?.username ? user.username.charAt(0).toUpperCase() : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile?tab=settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/admin-dashboard')}>
                      <Settings className="mr-2 h-4 w-4 text-purple-500" />
                      <span className="text-purple-600 font-medium">Admin Dashboard</span>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center text-gray-700"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search (shown when menu is open) */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 py-3 bg-white border-t border-gray-200">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search books, poetry, events..."
                className="w-full pl-10 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Search className="h-5 w-5" />
              </div>
            </div>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
