import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Heart, MessageSquare, ThumbsUp, ThumbsDown, Smile, Frown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { formatDistanceToNow } from "date-fns";
import MainLayout from "@/components/shared/MainLayout";
import axios from "axios";
import { API_BASE_URL } from "@/constants/constants";

interface PoemComment {
  id: number;
  userId: number;
  poemId: number;
  content: string;
  createdAt: string;
  user?: {
    username: string;
  };
  reactionCounts?: Record<string, number>;
  userReaction?: string | null;
}

const PoemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const poemId = parseInt(id);
  const { user } = useAuth();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState("");
  const [poem, setPoem] = useState<any>(null);
  const [author, setAuthor] = useState<any>(null);
  const [comments, setComments] = useState<PoemComment[]>([]);
  const [userStatus, setUserStatus] = useState<any>(null);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [isLoadingPoem, setIsLoadingPoem] = useState(true);
  const [isLoadingAuthor, setIsLoadingAuthor] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [isUnliking, setIsUnliking] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const [isReacting, setIsReacting] = useState(false);

  // Fetch poem details
  useEffect(() => {
    setIsLoadingPoem(true);
    axios.get(`${API_BASE_URL}/api/poems/${poemId}`)
      .then(res => setPoem(res.data))
      .catch(() => setPoem(null))
      .finally(() => setIsLoadingPoem(false));
  }, [poemId]);

  // Fetch poem author
  useEffect(() => {
    if (!poem?.authorId) return;
    setIsLoadingAuthor(true);
    axios.get(`${API_BASE_URL}/api/users/${poem.authorId}`)
      .then(res => setAuthor(res.data))
      .catch(() => setAuthor(null))
      .finally(() => setIsLoadingAuthor(false));
  }, [poem?.authorId]);

  // Fetch poem comments
  const fetchComments = () => {
    setIsLoadingComments(true);
    axios.get(`${API_BASE_URL}/api/poems/${poemId}/comments`)
      .then(res => setComments(res.data))
      .catch(() => setComments([]))
      .finally(() => setIsLoadingComments(false));
  };
  useEffect(() => {
    fetchComments();
  }, [poemId]);

  // Fetch user status (liked)
  const fetchUserStatus = () => {
    if (!user) return setUserStatus(null);
    axios.get(`${API_BASE_URL}/api/poems/${poemId}/status`, { withCredentials: true })
      .then(res => setUserStatus(res.data))
      .catch(() => setUserStatus(null));
  };
  useEffect(() => {
    fetchUserStatus();
  }, [poemId, user]);

  // Fetch like count
  const fetchLikeCount = () => {
    axios.get(`${API_BASE_URL}/api/poems/${poemId}/likes`)
      .then(res => setLikeCount(res.data))
      .catch(() => setLikeCount(0));
  };
  useEffect(() => {
    fetchLikeCount();
  }, [poemId]);

  // Like/unlike handlers
  const toggleLike = async () => {
    if (!user) return;
    if (userStatus?.liked) {
      setIsUnliking(true);
      try {
        await axios.post(`${API_BASE_URL}/api/poems/${poemId}/unlike`, {}, { withCredentials: true });
        fetchUserStatus();
        fetchLikeCount();
      } catch {
        toast({ title: "Error", description: "Failed to unlike poem" });
      } finally {
        setIsUnliking(false);
      }
    } else {
      setIsLiking(true);
      try {
        await axios.post(`${API_BASE_URL}/api/poems/${poemId}/like`, {}, { withCredentials: true });
        fetchUserStatus();
        fetchLikeCount();
      } catch {
        toast({ title: "Error", description: "Failed to like poem" });
      } finally {
        setIsLiking(false);
      }
    }
  };

  // Add comment handler
  const handleAddComment = async () => {
    if (!commentText.trim()) {
      toast({ title: "Empty comment", description: "Please enter some text for your comment." });
      return;
    }
    setIsAddingComment(true);
    try {
      await axios.post(`${API_BASE_URL}/api/poems/${poemId}/comments`, { content: commentText }, { withCredentials: true });
      setCommentText("");
      fetchComments();
      toast({ title: "Comment added", description: "Your comment has been added successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to add comment" });
    } finally {
      setIsAddingComment(false);
    }
  };

  // Delete comment handler
  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    setIsDeletingComment(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/poems/comments/${commentId}`, { withCredentials: true });
      fetchComments();
      toast({ title: "Comment deleted", description: "Your comment has been deleted successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to delete comment" });
    } finally {
      setIsDeletingComment(false);
    }
  };

  // Reaction handlers
  const handleReaction = async (commentId: number, reaction: string, currentReaction?: string) => {
    if (!user) return;
    setIsReacting(true);
    try {
      if (currentReaction === reaction) {
        await axios.delete(`${API_BASE_URL}/api/comments/${commentId}/reactions`, { withCredentials: true });
      } else {
        await axios.post(`${API_BASE_URL}/api/comments/${commentId}/reactions`, { reaction }, { withCredentials: true });
      }
      fetchComments();
    } catch {
      toast({ title: "Error", description: "Failed to react to comment" });
    } finally {
      setIsReacting(false);
    }
  };

  // Combine comments with their reaction data (if present)
  const commentsWithReactions = comments.map((comment: PoemComment) => ({
    ...comment,
    reactionCounts: comment.reactionCounts || {},
    userReaction: comment.userReaction || null,
  }));

  if (isLoadingPoem || isLoadingAuthor) {
    return (
      <MainLayout activeSection="poetry">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </MainLayout>
    );
  }

  if (!poem) {
    return (
      <MainLayout activeSection="poetry">
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <h1 className="text-2xl font-bold">Poem not found</h1>
          <p>The poem you're looking for doesn't exist or has been removed.</p>
          <Link href="/poetry">
            <Button>Back to Poetry</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout activeSection="poetry">
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <div className="mb-4">
          <Link href="/poetry">
            <Button variant="ghost" size="sm">
              ← Back to Poetry
            </Button>
          </Link>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">{poem.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLike}
                  disabled={!user || isLiking || isUnliking}
                  className={userStatus?.liked ? "text-red-500" : ""}
                >
                  <Heart className={`h-5 w-5 mr-1 ${userStatus?.liked ? "fill-red-500" : ""}`} />
                  <span>{likeCount || 0}</span>
                </Button>
              </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>By {author?.username || "Unknown"}</span>
              <span className="mx-2">•</span>
              <span>{new Date(poem.createdAt).toLocaleDateString()}</span>
            </div>
          </CardHeader>
          <CardContent>
            {poem.isVideo ? (
              <div className="aspect-video w-full mb-4">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={poem.videoUrl} 
                  title={poem.title}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="rounded-md"
                ></iframe>
              </div>
            ) : (
              <div className="whitespace-pre-wrap">{poem.content}</div>
            )}
          </CardContent>
        </Card>

        <div className="mb-6" id="comments">
          <h2 className="text-xl font-semibold mb-4">Comments ({comments.length})</h2>
          
          {user ? (
            <div className="mb-6">
              <div className="flex flex-col space-y-2">
                <Textarea
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full"
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleAddComment} 
                    disabled={isAddingComment || !commentText.trim()}
                  >
                    {isAddingComment ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Posting...
                      </>
                    ) : (
                      "Post Comment"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-muted p-4 rounded-md mb-6">
              <p>Please <Link href="/auth"><span className="text-primary font-medium">sign in</span></Link> to leave a comment.</p>
            </div>
          )}

          {isLoadingComments ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-border" />
            </div>
          ) : commentsWithReactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="rounded-md p-4">
              <div className="space-y-4">
                {commentsWithReactions.map((comment: PoemComment) => (
                  <div key={comment.id} className="rounded-lg border p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-white">
                            {comment.user?.username?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{comment.user?.username || "User"}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      {user && (user.user_id === comment.userId || user.role === "admin") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={isDeletingComment}
                        >
                          {isDeletingComment ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Delete"
                          )}
                        </Button>
                      )}
                    </div>
                    <p className="mt-2 mb-3">{comment.content}</p>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={comment.userReaction === "like" ? "bg-primary/10" : ""}
                        onClick={() => handleReaction(comment.id, "like", comment.userReaction ?? undefined)}
                        disabled={!user || isReacting}
                      >
                        <ThumbsUp className={`h-4 w-4 mr-1 ${comment.userReaction === "like" ? "text-primary" : ""}`} />
                        <span>{comment.reactionCounts?.like || 0}</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className={comment.userReaction === "dislike" ? "bg-primary/10" : ""}
                        onClick={() => handleReaction(comment.id, "dislike", comment.userReaction ?? undefined)}
                        disabled={!user || isReacting}
                      >
                        <ThumbsDown className={`h-4 w-4 mr-1 ${comment.userReaction === "dislike" ? "text-primary" : ""}`} />
                        <span>{comment.reactionCounts?.dislike || 0}</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className={comment.userReaction === "smile" ? "bg-primary/10" : ""}
                        onClick={() => handleReaction(comment.id, "smile", comment.userReaction ?? undefined)}
                        disabled={!user || isReacting}
                      >
                        <Smile className={`h-4 w-4 mr-1 ${comment.userReaction === "smile" ? "text-primary" : ""}`} />
                        <span>{comment.reactionCounts?.smile || 0}</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className={comment.userReaction === "frown" ? "bg-primary/10" : ""}
                        onClick={() => handleReaction(comment.id, "frown", comment.userReaction ?? undefined)}
                        disabled={!user || isReacting}
                      >
                        <Frown className={`h-4 w-4 mr-1 ${comment.userReaction === "frown" ? "text-primary" : ""}`} />
                        <span>{comment.reactionCounts?.frown || 0}</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default PoemDetailPage;