import { useState } from 'react';
import { Heart, MessageSquare, Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface Author {
  id: number;
  username: string;
}

interface PoetryCardProps {
  id: number;
  title: string;
  content: string;
  author: Author;
  createdAt: string;
  rating?: number;
  likes?: number;
  comments?: number;
}

const PoetryCard = ({ 
  id, 
  title, 
  content, 
  author, 
  createdAt, 
  rating = 4, 
  likes = 0, 
  comments = 0 
}: PoetryCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);
  const [currentRating, setCurrentRating] = useState(rating);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like poems",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (isLiked) {
        await apiRequest("POST", `/api/poems/${id}/unlike`);
        setCurrentLikes(prev => prev - 1);
        setIsLiked(false);
      } else {
        await apiRequest("POST", `/api/poems/${id}/like`);
        setCurrentLikes(prev => prev + 1);
        setIsLiked(true);
      }
      
      // Invalidate poems cache
      queryClient.invalidateQueries({ queryKey: ["/api/poems"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
    }
  };
  
  const handleRate = async (rating: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to rate poems",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await apiRequest("POST", `/api/poems/${id}/rate`, { rating });
      setCurrentRating(rating);
      
      toast({
        title: "Rating Submitted",
        description: `You rated this poem ${rating} stars`
      });
      
      // Invalidate poems cache
      queryClient.invalidateQueries({ queryKey: ["/api/poems"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <Avatar className="w-10 h-10 mr-3">
            <AvatarFallback className="bg-primary text-white">
              {author.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-gray-800">{author.username}</h3>
            <p className="text-xs text-gray-500">
              {formatDate(createdAt)}
            </p>
          </div>
        </div>
        
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
        
        <div className="prose prose-sm text-gray-600">
          {expanded ? (
            <p className="whitespace-pre-line">{content}</p>
          ) : (
            <p className="whitespace-pre-line">
              {content.length > 200 ? `${content.substring(0, 200)}...` : content}
            </p>
          )}
        </div>
        
        {content.length > 200 && (
          <Button
            variant="link"
            className="text-primary text-sm font-medium mt-2 p-0 h-auto"
            onClick={toggleExpand}
          >
            {expanded ? "Read less" : "Read more"}
          </Button>
        )}
      </div>
      
      <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            className={`flex items-center text-gray-500 hover:text-red-500 ${isLiked ? 'text-red-500' : ''}`}
            onClick={handleLike}
          >
            <Heart className="h-5 w-5 mr-1" fill={isLiked ? 'currentColor' : 'none'} />
            <span>{currentLikes}</span>
          </button>
          
          <button className="flex items-center text-gray-500 hover:text-primary">
            <MessageSquare className="h-5 w-5 mr-1" />
            <span>{comments}</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => handleRate(star)}>
              <Star 
                className={`h-5 w-5 ${
                  star <= currentRating ? 'text-yellow-500' : 'text-gray-300'
                }`} 
                fill={star <= currentRating ? 'currentColor' : 'none'}
              />
            </button>
          ))}
          <span className="text-sm text-gray-600 ml-1">{currentRating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default PoetryCard;
