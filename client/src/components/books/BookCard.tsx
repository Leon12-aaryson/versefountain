import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface BookCardProps {
  id: number;
  title: string;
  author: string;
  coverImage?: string;
  onRead?: () => void;
}

const BookCard = ({ id, title, author, coverImage, onRead }: BookCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleReadClick = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to read books",
        variant: "destructive"
      });
      return;
    }
    
    if (onRead) {
      onRead();
    } else {
      // Default behavior if no onRead handler is provided
      toast({
        title: "Book Opened",
        description: `Now reading: ${title}`,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
      <img 
        src={coverImage || `https://source.unsplash.com/featured/?book,${encodeURIComponent(title)}`} 
        alt={`${title} cover`} 
        className="w-full h-40 object-cover" 
      />
      <div className="p-3 flex-grow">
        <h3 className="font-medium text-sm text-gray-800 line-clamp-2">{title}</h3>
        <p className="text-xs text-gray-600 mt-1">{author}</p>
      </div>
      <div className="px-3 pb-3">
        <Button 
          variant="secondary"
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium py-1.5"
          onClick={handleReadClick}
        >
          Read Now
        </Button>
      </div>
    </div>
  );
};

export default BookCard;
