<?php
// app/Http/Controllers/CommentReactionController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PoemComment;
use App\Models\CommentReaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class CommentReactionController extends Controller
{
    /**
     * Retrieve all reactions for a specific comment.
     */
    public function index(PoemComment $comment)
    {
        $reactions = $comment->reactions()->with('user:id,username')->get();
        return response()->json($reactions);
    }

    /**
     * Get a summary of reaction counts for a specific comment.
     */
    public function getReactionCounts(PoemComment $comment)
    {
        $reactionCounts = $comment->reactions()
                                  ->selectRaw('reaction, count(*) as count')
                                  ->groupBy('reaction')
                                  ->pluck('count', 'reaction'); // Transforms to associative array
        return response()->json($reactionCounts);
    }

    /**
     * Retrieve all reactions made by the currently authenticated user.
     */
    public function userReactions(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $reactions = $user->commentReactions()->with('comment')->get();
        return response()->json($reactions);
    }

    /**
     * Get the authenticated user's specific reaction to a comment.
     */
    public function getUserReaction(PoemComment $comment)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $reaction = CommentReaction::where('comment_id', $comment->id)
                                   ->where('user_id', $user->id)
                                   ->first();

        return response()->json(['reaction' => $reaction ? $reaction->reaction : null]);
    }

    /**
     * Add or update a reaction to a comment.
     */
    public function storeOrUpdate(Request $request, PoemComment $comment)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $request->validate([
            'reaction' => ['required', 'string', Rule::in(['like', 'dislike', 'smile', 'frown'])],
        ]);

        $reaction = CommentReaction::updateOrCreate(
            ['comment_id' => $comment->id, 'user_id' => $user->id],
            ['reaction' => $request->reaction]
        );

        return response()->json($reaction, $reaction->wasRecentlyCreated ? 201 : 200);
    }

    /**
     * Remove a user's reaction from a comment.
     */
    public function destroy(PoemComment $comment)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $deleted = CommentReaction::where('comment_id', $comment->id)
                                  ->where('user_id', $user->id)
                                  ->delete();

        if ($deleted) {
            return response()->json(null, 204);
        }

        return response()->json(['message' => 'No reaction found from this user on this comment.'], 404);
    }
}
