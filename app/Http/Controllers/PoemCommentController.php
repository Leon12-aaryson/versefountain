<?php
// app/Http/Controllers/PoemCommentController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Poem;
use App\Models\PoemComment;
use Illuminate\Support\Facades\Auth;

class PoemCommentController extends Controller
{
    /**
     * Retrieve all comments for a specific poem.
     */
    public function index(Poem $poem)
    {
        $user = Auth::user();
        $comments = $poem->comments()->with('user')->orderBy('created_at', 'asc')->get();
        
        // Add reaction data to each comment
        $commentsWithReactions = $comments->map(function ($comment) use ($user) {
            // Get reaction counts
            $reactionCounts = $comment->reactions()
                ->selectRaw('reaction, count(*) as count')
                ->groupBy('reaction')
                ->pluck('count', 'reaction')
                ->toArray();
            
            // Get user's reaction if authenticated
            $userReaction = null;
            if ($user) {
                $userReaction = $comment->reactions()
                    ->where('user_id', $user->id)
                    ->value('reaction');
            }
            
            return [
                'id' => $comment->id,
                'userId' => $comment->user_id,
                'poemId' => $comment->poem_id,
                'content' => $comment->content,
                'createdAt' => $comment->created_at,
                'user' => $comment->user ? [
                    'username' => $comment->user->username
                ] : null,
                'reactionCounts' => $reactionCounts,
                'userReaction' => $userReaction,
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
            'user_id' => $user->id,
            'content' => $request->content,
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
        if ($user->id !== $comment->user_id && !$user->isAdmin) {
            return response()->json(['message' => 'Forbidden. You do not own this comment or are not an administrator.'], 403);
        }

        $comment->delete();
        return response()->json(null, 204);
    }
}
