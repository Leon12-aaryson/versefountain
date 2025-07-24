<?php

namespace App\Http\Controllers;

use App\Models\Poem;
use App\Models\User;
use App\Models\UserPoem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class PoemController extends Controller
{
    /**
     * Display a listing of poems (Blade view)
     */
    public function index()
    {
        $poems = Poem::with(['author', 'comments', 'userInteractions'])
            ->where('approved', true)
            ->latest()
            ->paginate(12);

        return view('poetry.index', compact('poems'));
    }

    /**
     * Show the form for creating a new poem (Blade view)
     */
    public function create()
    {
        return view('poetry.create');
    }

    /**
     * Store a newly created poem
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:10000',
            'is_video' => 'boolean',
            'video_url' => 'nullable|url|required_if:is_video,1',
        ]);

        $poem = Poem::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'author_id' => Auth::id(),
            'is_video' => $validated['is_video'] ?? false,
            'video_url' => $validated['video_url'] ?? null,
            'approved' => true, // Auto-approve for now
        ]);

        return redirect()->route('poetry.show', $poem)
            ->with('success', 'Poem created successfully!');
    }

    /**
     * Display the specified poem (Blade view)
     */
    public function show(Poem $poem)
    {
        $poem->load(['author', 'comments.user', 'userInteractions']);
        
        // Check if current user has liked this poem
        $isLiked = false;
        if (Auth::check()) {
            $isLiked = $poem->userInteractions()
                ->where('user_id', Auth::id())
                ->where('type', 'like')
                ->exists();
        }

        return view('poetry.show', compact('poem', 'isLiked'));
    }

    /**
     * Show the form for editing the specified poem (Blade view)
     */
    public function edit(Poem $poem)
    {
        // Check if user can edit this poem
        if (Auth::id() !== $poem->author_id) {
            abort(403, 'Unauthorized action.');
        }

        return view('poetry.edit', compact('poem'));
    }

    /**
     * Update the specified poem
     */
    public function update(Request $request, Poem $poem)
    {
        // Check if user can edit this poem
        if (Auth::id() !== $poem->author_id) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:10000',
            'is_video' => 'boolean',
            'video_url' => 'nullable|url|required_if:is_video,1',
        ]);

        $poem->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'is_video' => $validated['is_video'] ?? false,
            'video_url' => $validated['video_url'] ?? null,
        ]);

        return redirect()->route('poetry.show', $poem)
            ->with('success', 'Poem updated successfully!');
    }

    /**
     * Remove the specified poem
     */
    public function destroy(Poem $poem)
    {
        // Check if user can delete this poem
        if (Auth::id() !== $poem->author_id) {
            abort(403, 'Unauthorized action.');
        }

        $poem->delete();

        return redirect()->route('poetry.index')
            ->with('success', 'Poem deleted successfully!');
    }

    // API Methods (for Alpine.js interactions)

    /**
     * Like or unlike a poem (API)
     */
    public function like(Poem $poem)
    {
        $user = Auth::user();
        $existingLike = UserPoem::where('user_id', $user->id)
            ->where('poem_id', $poem->id)
            ->where('type', 'like')
            ->first();

        if ($existingLike) {
            $existingLike->delete();
            $liked = false;
        } else {
            UserPoem::create([
                'user_id' => $user->id,
                'poem_id' => $poem->id,
                'type' => 'like',
            ]);
            $liked = true;
        }

        $likesCount = UserPoem::where('poem_id', $poem->id)
            ->where('type', 'like')
            ->count();

        return response()->json([
            'liked' => $liked,
            'likes_count' => $likesCount,
        ]);
    }

    /**
     * Rate a poem (API)
     */
    public function rate(Request $request, Poem $poem)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|between:1,5',
        ]);

        $user = Auth::user();
        
        // Update or create rating
        UserPoem::updateOrCreate(
            [
                'user_id' => $user->id,
                'poem_id' => $poem->id,
                'type' => 'rating',
            ],
            [
                'rating' => $validated['rating'],
            ]
        );

        $avgRating = UserPoem::where('poem_id', $poem->id)
            ->where('type', 'rating')
            ->avg('rating');

        return response()->json([
            'rating' => $validated['rating'],
            'average_rating' => round($avgRating, 1),
        ]);
    }

    /**
     * Approve a poem (Admin only)
     */
    public function approve(Poem $poem)
    {
        $poem->update(['approved' => true]);

        return response()->json(['message' => 'Poem approved successfully']);
    }

    /**
     * Get user's poems (API)
     */
    public function userPoems()
    {
        $poems = Poem::where('author_id', Auth::id())
            ->with(['comments', 'userInteractions'])
            ->latest()
            ->get();

        return response()->json($poems);
    }

    /**
     * Get user status for a poem (API)
     */
    public function getUserStatus(Poem $poem)
    {
        $user = Auth::user();
        $userInteraction = UserPoem::where('user_id', $user->id)
            ->where('poem_id', $poem->id)
            ->first();

        return response()->json([
            'liked' => $userInteraction && $userInteraction->type === 'like',
            'rating' => $userInteraction && $userInteraction->type === 'rating' ? $userInteraction->rating : null,
        ]);
    }
}
