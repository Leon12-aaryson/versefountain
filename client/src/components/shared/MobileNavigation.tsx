import { Link } from 'wouter';
import { 
  Home, 
  BookText, 
  BookOpen, 
  MessageSquare, 
  User 
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface MobileNavigationProps {
  activeSection: string;
}

const MobileNavigation = ({ activeSection }: MobileNavigationProps) => {
  const { user } = useAuth();
  
  return (
    <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-40">
      <div className="flex justify-around items-center h-16">
        <Link href="/">
          <span className={`flex flex-col items-center justify-center cursor-pointer ${
            activeSection === 'home' ? 'text-primary' : 'text-gray-500'
          }`}>
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </span>
        </Link>
        
        <Link href="/poetry">
          <span className={`flex flex-col items-center justify-center cursor-pointer ${
            activeSection === 'poetry' ? 'text-primary' : 'text-gray-500'
          }`}>
            <BookText className="h-6 w-6" />
            <span className="text-xs mt-1">Poetry</span>
          </span>
        </Link>
        
        <Link href="/books">
          <span className={`flex flex-col items-center justify-center cursor-pointer ${
            activeSection === 'books' ? 'text-primary' : 'text-gray-500'
          }`}>
            <BookOpen className="h-6 w-6" />
            <span className="text-xs mt-1">Books</span>
          </span>
        </Link>
        
        <Link href="/chat">
          <span className={`flex flex-col items-center justify-center cursor-pointer ${
            activeSection === 'chat' ? 'text-primary' : 'text-gray-500'
          }`}>
            <MessageSquare className="h-6 w-6" />
            <span className="text-xs mt-1">Chat</span>
          </span>
        </Link>
        
        <Link href={user ? "/profile" : "/auth"}>
          <span className={`flex flex-col items-center justify-center cursor-pointer ${
            activeSection === 'profile' ? 'text-primary' : 'text-gray-500'
          }`}>
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNavigation;
