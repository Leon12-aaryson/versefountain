import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Heart, MessageSquare, ThumbsUp, ThumbsDown, Smile, Frown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import MainLayout from "@/components/shared/MainLayout";

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
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  // Fetch poem details
  const { data: poem, isLoading: isLoadingPoem } = useQuery({
    queryKey: ["/api/poems", poemId],
    queryFn: async () => {
      const response = await fetch(`/api/poems/${poemId}`);
      if (!response.ok) throw new Error("Failed to fetch poem");
      return response.json();
    },
    enabled: !isNaN(poemId),
  });

  // Fetch poem author
  const { data: author, isLoading: isLoadingAuthor } = useQuery({
    queryKey: ["/api/users", poem?.authorId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${poem?.authorId}`);
      if (!response.ok) throw new Error("Failed to fetch author information");
      return response.json();
    },
    enabled: !!poem?.authorId,
  });

  // Fetch poem comments
  const { data: comments = [], isLoading: isLoadingComments } = useQuery({
    queryKey: ["/api/poems/comments", poemId],
    queryFn: async () => {
      const response = await fetch(`/api/poems/${poemId}/comments`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      return response.json();
    },
    enabled: !isNaN(poemId),
  });

  // Fetch user status (liked)
  const { data: userStatus } = useQuery({
    queryKey: ["/api/poems/status", poemId],
    queryFn: async () => {
      const response = await fetch(`/api/poems/${poemId}/status`);
      if (!response.ok) throw new Error("Failed to fetch user status");
      return response.json();
    },
    enabled: !isNaN(poemId) && !!user,
  });

  // Fetch like count
  const { data: likeCount } = useQuery({
    queryKey: ["/api/poems/likes", poemId],
    queryFn: async () => {
      const response = await fetch(`/api/poems/${poemId}/likes`);
      if (!response.ok) throw new Error("Failed to fetch like count");
      return response.json();
    },
    enabled: !isNaN(poemId),
  });

  // Like/unlike mutations
  const likeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/poems/${poemId}/like`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/poems/status", poemId] });
      queryClient.invalidateQueries({ queryKey: ["/api/poems/likes", poemId] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/poems/${poemId}/unlike`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/poems/status", poemId] });
      queryClient.invalidateQueries({ queryKey: ["/api/poems/likes", poemId] });
    },
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", `/api/poems/${poemId}/comments`, { content });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/poems/comments", poemId] });
      setCommentText("");
      toast({ title: "Comment added", description: "Your comment has been added successfully." });
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const res = await apiRequest("DELETE", `/api/poems/comments/${commentId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/poems/comments", poemId] });
      toast({ title: "Comment deleted", description: "Your comment has been deleted successfully." });
    },
  });

  // Comment reaction handlers
  const addReactionMutation = useMutation({
    mutationFn: async ({ commentId, reaction }: { commentId: number; reaction: string }) => {
      const res = await apiRequest("POST", `/api/comments/${commentId}/reactions`, { reaction });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/poems/comments", poemId] });
    },
  });

  const removeReactionMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const res = await apiRequest("DELETE", `/api/comments/${commentId}/reactions`);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/poems/comments", poemId] });
    },
  });

  const handleReaction = (commentId: number, reaction: string, currentReaction?: string) => {
    if (currentReaction === reaction) {
      removeReactionMutation.mutate(commentId);
    } else {
      addReactionMutation.mutate({ commentId, reaction });
    }
  };

  // Combine comments with their reaction data (if present)
  const commentsWithReactions = comments.map((comment: PoemComment) => ({
    ...comment,
    reactionCounts: comment.reactionCounts || {},
    userReaction: comment.userReaction || null,
  }));

  const toggleLike = () => {
    if (userStatus?.liked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim()) {
      toast({ title: "Empty comment", description: "Please enter some text for your comment." });
      return;
    }
    addCommentMutation.mutate(commentText);
  };

  const handleDeleteComment = (commentId: number) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

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
                  disabled={!user || likeMutation.isPending || unlikeMutation.isPending}
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
                    disabled={addCommentMutation.isPending || !commentText.trim()}
                  >
                    {addCommentMutation.isPending ? (
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
                          disabled={deleteCommentMutation.isPending}
                        >
                          {deleteCommentMutation.isPending ? (
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
                        disabled={!user || addReactionMutation.isPending}
                      >
                        <ThumbsUp className={`h-4 w-4 mr-1 ${comment.userReaction === "like" ? "text-primary" : ""}`} />
                        <span>{comment.reactionCounts?.like || 0}</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className={comment.userReaction === "dislike" ? "bg-primary/10" : ""}
                        onClick={() => handleReaction(comment.id, "dislike", comment.userReaction ?? undefined)}
                        disabled={!user || addReactionMutation.isPending}
                      >
                        <ThumbsDown className={`h-4 w-4 mr-1 ${comment.userReaction === "dislike" ? "text-primary" : ""}`} />
                        <span>{comment.reactionCounts?.dislike || 0}</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className={comment.userReaction === "smile" ? "bg-primary/10" : ""}
                        onClick={() => handleReaction(comment.id, "smile", comment.userReaction ?? undefined)}
                        disabled={!user || addReactionMutation.isPending}
                      >
                        <Smile className={`h-4 w-4 mr-1 ${comment.userReaction === "smile" ? "text-primary" : ""}`} />
                        <span>{comment.reactionCounts?.smile || 0}</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className={comment.userReaction === "frown" ? "bg-primary/10" : ""}
                        onClick={() => handleReaction(comment.id, "frown", comment.userReaction ?? undefined)}
                        disabled={!user || addReactionMutation.isPending}
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