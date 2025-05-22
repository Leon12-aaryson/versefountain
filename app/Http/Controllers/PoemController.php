<?php
// app/Http/Controllers/PoemController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Poem;
use App\Models\UserPoem;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class PoemController extends Controller
{
    /**
     * Display a listing of approved poems.
     */
    public function index(Request $request)
    {
        $query = Poem::with('author')->where('approved', true);

        if ($request->has('author_id')) {
            $request->validate(['author_id' => 'integer|exists:users,id']);
            $query->where('author_id', $request->author_id);
        }

        $limit = $request->input('limit', 10);
        $offset = $request->input('offset', 0);

        $poems = $query->orderBy('created_at', 'desc')
                       ->offset($offset)
                       ->limit($limit)
                       ->get();

        return response()->json($poems);
    }

    /**
     * Display poems created by the authenticated user.
     */
    public function userPoems(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }
        $poems = $user->poems()->orderBy('created_at', 'desc')->get();
        return response()->json($poems);
    }

    /**
     * Display the specified poem.
     */
    public function show(Poem $poem)
    {
        return response()->json($poem->load('author'));
    }

    /**
     * Store a newly created poem in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $validatedData = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'isVideo' => ['boolean'],
            'videoUrl' => ['nullable', 'url', 'required_if:isVideo,true'],
        ]);

        // Default to false for admin approval if not explicitly set in request
        $poem = $user->poems()->create($validatedData + ['approved' => false]);

        return response()->json($poem, 201);
    }

    /**
     * Update the specified poem in storage.
     */
    public function update(Request $request, Poem $poem)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Authorization check
        if ($user->id !== $poem->author_id && !$user->isAdmin) {
            return response()->json(['message' => 'Forbidden. You do not own this poem or are not an administrator.'], 403);
        }

        $validatedData = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'content' => ['sometimes', 'string'],
            'isVideo' => ['sometimes', 'boolean'],
            'videoUrl' => ['nullable', 'url', 'required_if:isVideo,true'],
            'approved' => ['sometimes', 'boolean'], // Only for admin updates
        ]);

        $poem->update($validatedData);

        return response()->json($poem);
    }

    /**
     * Remove the specified poem from storage.
     */
    public function destroy(Poem $poem)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Authorization check
        if ($user->id !== $poem->author_id && !$user->isAdmin) {
            return response()->json(['message' => 'Forbidden. You do not own this poem or are not an administrator.'], 403);
        }

        $poem->delete();

        return response()->json(null, 204);
    }

    /**
     * Approve a poem (Admin only).
     */
    public function approve(Poem $poem)
    {
        $user = Auth::user();
        if (!$user || !$user->isAdmin) {
            return response()->json(['message' => 'Forbidden. Admin access required.'], 403);
        }

        $poem->approved = true;
        $poem->save();

        return response()->json($poem);
    }

    /**
     * Rate a poem.
     */
    public function rate(Request $request, Poem $poem)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
        ]);

        // Create or update the user's rating for this poem
        $userPoem = UserPoem::updateOrCreate(
            ['user_id' => $user->id, 'poem_id' => $poem->id],
            ['rating' => $request->rating]
        );

        return response()->json(['message' => 'Poem rated successfully', 'user_poem' => $userPoem]);
    }

    /**
     * Like a poem.
     */
    public function like(Poem $poem)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $userPoem = UserPoem::firstOrNew(
            ['user_id' => $user->id, 'poem_id' => $poem->id]
        );

        if ($userPoem->liked) {
            return response()->json(['message' => 'Poem already liked.'], 409);
        }

        $userPoem->liked = true;
        $userPoem->save();

        return response()->json(['message' => 'Poem liked successfully', 'user_poem' => $userPoem]);
    }

    /**
     * Unlike a poem.
     */
    public function unlike(Poem $poem)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $userPoem = UserPoem::where('user_id', $user->id)
                            ->where('poem_id', $poem->id)
                            ->first();

        if (!$userPoem || !$userPoem->liked) {
            return response()->json(['message' => 'Poem not liked yet.'], 409);
        }

        $userPoem->liked = false;
        $userPoem->save();

        return response()->json(['message' => 'Poem unliked successfully', 'user_poem' => $userPoem]);
    }

    /**
     * Get the total number of likes for a poem.
     */
    public function getLikeCount(Poem $poem)
    {
        $likeCount = UserPoem::where('poem_id', $poem->id)->where('liked', true)->count();
        return response()->json(['likeCount' => $likeCount]);
    }

    /**
     * Get the authenticated user's like/rating status for a specific poem.
     */
    public function getUserStatus(Poem $poem)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $userPoem = UserPoem::where('user_id', $user->id)
                            ->where('poem_id', $poem->id)
                            ->first();

        return response()->json([
            'liked' => (bool)($userPoem ? $userPoem->liked : false),
            'rating' => $userPoem ? $userPoem->rating : null,
        ]);
    }
}
