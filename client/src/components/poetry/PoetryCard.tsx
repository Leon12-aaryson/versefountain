import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Poem } from "@shared/schema";

interface PoetryCardProps {
  poem: Poem;
}

export default function PoetryCard({ poem }: PoetryCardProps) {
  const { toast } = useToast();
  const [likes, setLikes] = useState(poem.likes);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    try {
      if (liked) {
        setLikes(likes - 1);
        setLiked(false);
      } else {
        setLikes(likes + 1);
        setLiked(true);
        
        // In a real app, we would call an API to update the likes
        // await apiRequest('POST', `/api/poems/${poem.id}/like`, {});
        
        toast({
          title: "Poem liked",
          description: `You liked "${poem.title}"`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like poem",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="poetry-card rounded-lg overflow-hidden shadow-md bg-white">
      <div className="h-48 overflow-hidden relative">
        <img
          src={poem.coverImage}
          alt={poem.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-accent text-white text-xs py-1 px-2 rounded-full">
          {poem.culturalOrigin}
        </div>
      </div>
      <CardContent className="p-6">
        <Link href={`/poetry/${poem.id}`}>
          <a className="hover:underline">
            <h3 className="font-display text-xl mb-2">{poem.title}</h3>
          </a>
        </Link>
        <p className="text-sm text-gray-500 mb-4">
          By {poem.authorName} • {poem.readTime} min read
        </p>
        <p className="line-clamp-3 mb-4 whitespace-pre-line">{poem.content}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`text-gray-400 hover:text-red-500 transition-colors ${liked ? 'text-red-500' : ''}`}
            >
              <Heart className="h-4 w-4 mr-1" fill={liked ? "currentColor" : "none"} />
              <span className="text-xs">{likes}</span>
            </Button>
            <Link href={`/poetry/${poem.id}#comments`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                <span className="text-xs">{poem.comments}</span>
              </Button>
            </Link>
          </div>
          <Rating value={poem.rating} count={poem.ratingCount} size="sm" />
        </div>
      </CardContent>
    </Card>
  );
}
