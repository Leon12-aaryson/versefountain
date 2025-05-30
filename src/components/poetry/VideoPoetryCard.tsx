import { useState } from 'react';
import { Heart, MessageSquare, Star, Play } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/constants';

interface Author {
  id: number;
  username: string;
}

interface VideoPoetryCardProps {
  id: number;
  title: string;
  content: string;
  videoUrl?: string;
  thumbnailUrl: string;
  author: Author;
  createdAt: string;
  rating?: number;
  likes?: number;
  comments?: number;
}

const VideoPoetryCard = ({ 
  id, 
  title, 
  content, 
  videoUrl,
  thumbnailUrl, 
  author, 
  createdAt, 
  rating = 5, 
  likes = 0, 
  comments = 0 
}: VideoPoetryCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [currentRating, setCurrentRating] = useState(rating);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  const handleVideoPlay = () => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    } else {
      toast({
        title: "Video Unavailable",
        description: "This video is currently unavailable",
        variant: "destructive"
      });
    }
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
        await axios.post(`${API_BASE_URL}/poems/${id}/unlike`);
        setCurrentLikes(prev => prev - 1);
        setIsLiked(false);
      } else {
        await axios.post(`${API_BASE_URL}/poems/${id}/like`);
        setCurrentLikes(prev => prev + 1);
        setIsLiked(true);
      }
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
      await axios.post(`${API_BASE_URL}/poems/${id}/rate`, { rating });
      setCurrentRating(rating);

      toast({
        title: "Rating Submitted",
        description: `You rated this poem ${rating} stars`
      });
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
        
        {/* Video Element */}
        <div className="relative aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-center justify-center">
            <button 
              onClick={handleVideoPlay}
              className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
            >
              <Play className="h-8 w-8 text-white" />
            </button>
          </div>
          <img 
            src={thumbnailUrl || "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"} 
            alt={`Video thumbnail for ${title}`} 
            className="rounded-lg w-full h-full object-cover" 
          />
        </div>
        
        <p className="text-gray-600 text-sm">{content}</p>
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

export default VideoPoetryCard;
