import { Link } from 'wouter';
import { 
  Home, 
  BookOpen, 
  BookText, 
  GraduationCap, 
  MessageSquare, 
  Calendar, 
  Ticket 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeSection: string;
  user: any;
}

const Sidebar = ({ activeSection, user }: SidebarProps) => {
  return (
    <aside className="hidden md:block w-64 border-r border-gray-200 bg-white pt-6">
      <nav className="px-4 space-y-1">
        <Link href="/">
          <span className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
            activeSection === 'home' 
              ? 'bg-primary text-white' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}>
            <Home className={`h-5 w-5 mr-3 ${activeSection === 'home' ? 'text-white' : 'text-gray-500'}`} />
            Home
          </span>
        </Link>
        
        <Link href="/poetry">
          <span className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
            activeSection === 'poetry' 
              ? 'bg-primary text-white' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}>
            <BookText className={`h-5 w-5 mr-3 ${activeSection === 'poetry' ? 'text-white' : 'text-gray-500'}`} />
            Poetry
          </span>
        </Link>
        
        <Link href="/books">
          <span className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
            activeSection === 'books' 
              ? 'bg-primary text-white' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}>
            <BookOpen className={`h-5 w-5 mr-3 ${activeSection === 'books' ? 'text-white' : 'text-gray-500'}`} />
            Books
          </span>
        </Link>
        
        <Link href="/academics">
          <span className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
            activeSection === 'academics' 
              ? 'bg-primary text-white' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}>
            <GraduationCap className={`h-5 w-5 mr-3 ${activeSection === 'academics' ? 'text-white' : 'text-gray-500'}`} />
            Academics
          </span>
        </Link>
        
        <Link href="/chat">
          <span className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
            activeSection === 'chat' 
              ? 'bg-primary text-white' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}>
            <MessageSquare className={`h-5 w-5 mr-3 ${activeSection === 'chat' ? 'text-white' : 'text-gray-500'}`} />
            Chat Rooms
          </span>
        </Link>
        
        <Link href="/events">
          <span className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
            activeSection === 'events' 
              ? 'bg-primary text-white' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}>
            <Calendar className={`h-5 w-5 mr-3 ${activeSection === 'events' ? 'text-white' : 'text-gray-500'}`} />
            Events
          </span>
        </Link>
        
        <Link href="/tickets">
          <span className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
            activeSection === 'tickets' 
              ? 'bg-primary text-white' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}>
            <Ticket className={`h-5 w-5 mr-3 ${activeSection === 'tickets' ? 'text-white' : 'text-gray-500'}`} />
            Tickets
          </span>
        </Link>
      </nav>

      <div className="px-4 mt-8">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscriptions</h2>
        <div className="mt-3 rounded-lg bg-blue-50 p-4">
          <h3 className="text-sm font-medium text-blue-800">Upgrade to Premium</h3>
          <p className="mt-1 text-xs text-blue-700">Get unlimited access to all books and premium features.</p>
          <Button 
            className="mt-3 w-full bg-primary text-white text-xs font-medium py-2 rounded-md hover:bg-blue-700 transition"
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
