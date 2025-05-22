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
        $comments = $poem->comments()->with('user:id,username')->orderBy('createdAt', 'asc')->get();
        return response()->json($comments);
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
