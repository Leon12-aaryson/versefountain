<?php
// app/Http/Controllers/PoemCommentController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Poem;
use App\Models\PoemComment;
use App\Models\CommentReaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PoemCommentController extends Controller
{
    /**
     * Retrieve all comments for a specific poem.
     */
    public function index(Poem $poem)
    {
        $user = Auth::user();
        $comments = $poem->comments()
            ->select('id', 'poem_id', 'user_id', 'content', 'created_at')
            ->with('user:id,username')
            ->orderBy('created_at', 'asc')
            ->get();
        
        // Get all comment IDs
        $commentIds = $comments->pluck('id');
        
        // Get all reaction counts in a single query grouped by comment_id and reaction
        $reactionCounts = CommentReaction::whereIn('comment_id', $commentIds)
            ->select('comment_id', 'reaction', DB::raw('count(*) as count'))
            ->groupBy('comment_id', 'reaction')
            ->get()
            ->groupBy('comment_id')
            ->map(function ($reactions) {
                return $reactions->pluck('count', 'reaction')->toArray();
            });
        
        // Get all user reactions in a single query if user is authenticated
        $userReactions = [];
        if ($user && $commentIds->isNotEmpty()) {
            $userReactions = CommentReaction::whereIn('comment_id', $commentIds)
                ->where('user_id', $user->getKey())
                ->pluck('reaction', 'comment_id')
                ->toArray();
        }
        
        // Map comments with pre-loaded reaction data
        $commentsWithReactions = $comments->map(function ($comment) use ($reactionCounts, $userReactions) {
            return [
                'id' => $comment->id,
                'userId' => $comment->user_id,
                'poemId' => $comment->poem_id,
                'content' => $comment->content,
                'createdAt' => $comment->created_at,
                'user' => $comment->user ? [
                    'username' => $comment->user->username
                ] : null,
                'reactionCounts' => $reactionCounts->get($comment->id, []),
                'userReaction' => $userReactions[$comment->id] ?? null,
            ];
        });
        
        return response()->json($commentsWithReactions);
    }

    /**
     * Add a new comment to a poem.
     */
    public function store(Request $request, Poem $poem)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment = $poem->comments()->create([
            'user_id' => Auth::id(),
            'content' => $request->input('content'),
        ]);

        // Eager load user to return with the comment
        $comment->load('user:id,username');

        return response()->json($comment, 201);
    }

    /**
     * Delete a specific comment.
     */
    public function destroy(PoemComment $comment)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Authorization check
        if ($user->getKey() !== $comment->user_id && !$user->isAdmin) {
            return response()->json(['message' => 'Forbidden. You do not own this comment or are not an administrator.'], 403);
        }

        $comment->delete();
        return response()->json(null, 204);
    }
}
