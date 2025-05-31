import { useState, useEffect } from 'react';
import { Heart, MessageSquare, Star, Pencil, Trash, MoreVertical, Send, X, ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/constants';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface Author {
  id: number;
  username: string;
}

interface Comment {
  id: number;
  content: string;
  poemId: number;
  user_id: number;
  createdAt: string | Date;
  user?: {
    id: number;
    username: string;
  };
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentsDialogOpen, setCommentsDialogOpen] = useState(false);
  const [currentCommentCount, setCurrentCommentCount] = useState(comments);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch the user's like status for this poem
  useEffect(() => {
    if (!user) return;
    axios.get(`${API_BASE_URL}/api/poems/${id}/user-status`)
      .then(res => {
        setIsLiked(res.data.liked ?? false);
        if (res.data.rating !== undefined && res.data.rating !== null) {
          setCurrentRating(res.data.rating);
        }
      })
      .catch(() => {});
  }, [user, id]);

  // Fetch the like count for this poem
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/poems/${id}/likes`)
      .then(res => setCurrentLikes(res.data.likeCount ?? 0))
      .catch(() => {});
  }, [id]);

  // Fetch comments count
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/poems/${id}/comments`)
      .then(res => setCurrentCommentCount(res.data.length ?? 0))
      .catch(() => {});
  }, [id]);

  // Define validation schema for the edit form
  const formSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters" }),
    content: z.string().min(10, { message: "Content must be at least 10 characters" })
  });

  // Initialize form with existing poem data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title,
      content
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
      let response;
      if (isLiked) {
        response = await axios.post(`${API_BASE_URL}/api/poems/${id}/unlike`);
        setIsLiked(false);
      } else {
        response = await axios.post(`${API_BASE_URL}/api/poems/${id}/like`);
        setIsLiked(true);
      }
      setCurrentLikes(response.data.likeCount ?? currentLikes);
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
      await axios.post(`${API_BASE_URL}/api/poems/${id}/rate`, { rating });
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

  // Handle poem edit submission
  const onEditSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to edit poems",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.patch(`${API_BASE_URL}/api/poems/${id}`, data);

      if (response.status >= 200 && response.status < 300) {
        setEditDialogOpen(false);
        toast({
          title: "Poem Updated",
          description: "Your poem has been updated successfully"
        });
      } else {
        throw new Error(response.data?.message || "Failed to update poem");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update poem",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle poem deletion
  const handleDeletePoem = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to delete poems",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.delete(`${API_BASE_URL}/api/poems/${id}`);

      if (response.status >= 200 && response.status < 300) {
        setDeleteDialogOpen(false);
        toast({
          title: "Poem Deleted",
          description: "Your poem has been deleted successfully"
        });
      } else {
        throw new Error(response.data?.message || "Failed to delete poem");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete poem",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
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

          {/* Show edit/delete options if the user is the author or an admin */}
          {user && (user.user_id === author.id || user.role === "admin") && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-red-500 focus:text-red-500"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <Link href={`/poems/${id}`}>
          <h2 className="text-lg font-semibold text-gray-800 mb-2 hover:text-primary cursor-pointer">{title}</h2>
        </Link>

        <div className="prose prose-sm text-gray-600">
          <div className="rounded-md p-1 -m-1">
            {expanded ? (
              <p className="whitespace-pre-line">{content}</p>
            ) : (
              <p className="whitespace-pre-line">
                {content.length > 200 ? `${content.substring(0, 200)}...` : content}
              </p>
            )}
          </div>
        </div>

        {content.length > 200 && (
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="link"
              className="text-primary text-sm font-medium p-0 h-auto"
              onClick={toggleExpand}
            >
              {expanded ? "Read less" : "Read more"}
            </Button>

            <Link href={`/poems/${id}`}>
              <Button
                variant="link"
                className="text-primary text-sm font-medium p-0 h-auto flex items-center"
              >
                <span>View full poem</span>
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
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

          <Button
            variant="ghost"
            className="flex items-center text-gray-500 hover:text-primary"
            onClick={() => setCommentsDialogOpen(true)}
          >
            <MessageSquare className="h-5 w-5 mr-1" />
            <span>{currentCommentCount}</span>
          </Button>
        </div>

        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => handleRate(star)}>
              <Star
                className={`h-5 w-5 ${star <= currentRating ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                fill={star <= currentRating ? 'currentColor' : 'none'}
              />
            </button>
          ))}
          <span className="text-sm text-gray-600 ml-1">{currentRating ? currentRating.toFixed(1) : '0.0'}</span>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Poem</DialogTitle>
            <DialogDescription>
              Make changes to your poem. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={10}
                        placeholder="Write your poem here..."
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              poem and remove all of its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePoem}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Comments Dialog */}
      <Dialog open={commentsDialogOpen} onOpenChange={setCommentsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comments on "{title}"</DialogTitle>
            <DialogDescription>
              Join the conversation about this poem.
            </DialogDescription>
          </DialogHeader>

          <CommentsSection
            poemId={id}
            onCommentAdded={() => setCurrentCommentCount(prev => prev + 1)}
          />

        </DialogContent>
      </Dialog>
    </div>
  );
};

// Comment Section Component with Form
interface CommentsSectionProps {
  poemId: number;
  onCommentAdded: () => void;
}

const CommentsSection = ({ poemId, onCommentAdded }: CommentsSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Comment form schema
  const commentSchema = z.object({
    content: z.string().min(1, "Comment cannot be empty").max(500, "Comment is too long")
  });

  // Comment form
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: ""
    }
  });

  // Fetch comments for this poem
  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/poems/${poemId}/comments`);
      setComments(res.data);
    } catch {
      setError("Failed to load comments. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poemId]);

  // Submit new comment
  const onSubmit = async (data: z.infer<typeof commentSchema>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to comment",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/poems/${poemId}/comments`, { content: data.content });

      if (response.status >= 200 && response.status < 300) {
        form.reset();
        fetchComments();
        onCommentAdded();

        toast({
          title: "Comment Added",
          description: "Your comment has been posted successfully"
        });
      } else {
        throw new Error(response.data?.message || "Failed to post comment");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to post comment",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to delete comments",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/api/poems/comments/${commentId}`);

      if (response.status >= 200 && response.status < 300) {
        fetchComments();
        toast({
          title: "Comment Deleted",
          description: "Your comment has been deleted successfully"
        });
      } else {
        throw new Error(response.data?.message || "Failed to delete comment");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete comment",
        variant: "destructive"
      });
    }
  };

  // Format date for display
  const formatCommentDate = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      {/* Comments List */}
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
        {isLoading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}

        {error && (
          <div className="py-4 text-center text-red-500">
            {error}
          </div>
        )}

        {!isLoading && comments.length === 0 && (
          <div className="py-4 text-center text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        )}

        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback className="bg-primary text-white text-xs">
                    {comment.user?.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{comment.user?.username}</p>
                  <p className="text-xs text-gray-500">{formatCommentDate(comment.createdAt)}</p>
                </div>
              </div>

              {user && (user.user_id === comment.user_id || user.role === "admin") && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </Button>
              )}
            </div>

            <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{comment.content}</p>
          </div>
        ))}
      </div>

      {/* Comment Form */}
      {user ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-end gap-2">
                      <Textarea
                        {...field}
                        placeholder="Write a comment..."
                        className="resize-none"
                        disabled={isSubmitting}
                        rows={3}
                      />
                      <Button
                        type="submit"
                        size="sm"
                        disabled={isSubmitting}
                        className="mb-1"
                      >
                        {isSubmitting ? (
                          <div className="animate-spin w-4 h-4 border border-white border-t-transparent rounded-full" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      ) : (
        <div className="text-center py-2 text-sm text-gray-500">
          Please log in to comment on this poem.
        </div>
      )}
    </div>
  );
};

export default PoetryCard;
