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

        return view('poetry', compact('poems'));
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
    public function show($identifier)
    {
        // Try to find by ID first
        $poem = null;
        
        if (is_numeric($identifier)) {
            $poem = Poem::find($identifier);
        }
        
        // Hardcoded poems data (matching poetry.blade.php)
        $hardcodedPoems = [
            'road-not-taken' => [
                'title' => 'The Road Not Taken',
                'author' => 'Robert Frost',
                'year' => '1916',
                'excerpt' => 'Two roads diverged in a yellow wood, And sorry I could not travel both And be one traveler, long I stood And looked down one as far as I could...',
                'content' => "Two roads diverged in a yellow wood,\nAnd sorry I could not travel both\nAnd be one traveler, long I stood\nAnd looked down one as far as I could\nTo where it bent in the undergrowth;\n\nThen took the other, as just as fair,\nAnd having perhaps the better claim,\nBecause it was grassy and wanted wear;\nThough as for that the passing there\nHad worn them really about the same,\n\nAnd both that morning equally lay\nIn leaves no step had trodden black.\nOh, I kept the first for another day!\nYet knowing how way leads on to way,\nI doubted if I should ever come back.\n\nI shall be telling this with a sigh\nSomewhere ages and ages hence:\nTwo roads diverged in a wood, and I—\nI took the one less traveled by,\nAnd that has made all the difference.",
            ],
            'sonnet-18' => [
                'title' => 'Sonnet 18',
                'author' => 'William Shakespeare',
                'year' => '1609',
                'excerpt' => 'Shall I compare thee to a summer\'s day? Thou art more lovely and more temperate: Rough winds do shake the darling buds of May...',
                'content' => "Shall I compare thee to a summer's day?\nThou art more lovely and more temperate:\nRough winds do shake the darling buds of May,\nAnd summer's lease hath all too short a date;\nSometime too hot the eye of heaven shines,\nAnd often is his gold complexion dimm'd;\nAnd every fair from fair sometime declines,\nBy chance or nature's changing course untrimm'd;\nBut thy eternal summer shall not fade\nNor lose possession of that fair thou owest;\nNor shall Death brag thou wander'st in his shade,\nWhen in eternal lines to time thou growest:\nSo long as men can breathe or eyes can see,\nSo long lives this, and this gives life to thee.",
            ],
            'still-i-rise' => [
                'title' => 'Still I Rise',
                'author' => 'Maya Angelou',
                'year' => '1978',
                'excerpt' => 'You may write me down in history With your bitter, twisted lies, You may trod me in the very dirt But still, like dust, I\'ll rise...',
                'content' => "You may write me down in history\nWith your bitter, twisted lies,\nYou may trod me in the very dirt\nBut still, like dust, I'll rise.\n\nDoes my sassiness upset you?\nWhy are you beset with gloom?\n'Cause I walk like I've got oil wells\nPumping in my living room.\n\nJust like moons and like suns,\nWith the certainty of tides,\nJust like hopes springing high,\nStill I'll rise.",
            ],
            'do-not-go-gentle' => [
                'title' => 'Do Not Go Gentle',
                'author' => 'Dylan Thomas',
                'year' => '1951',
                'excerpt' => 'Do not go gentle into that good night, Old age should burn and rave at close of day; Rage, rage against the dying of the light...',
                'content' => "Do not go gentle into that good night,\nOld age should burn and rave at close of day;\nRage, rage against the dying of the light.\n\nThough wise men at their end know dark is right,\nBecause their words had forked no lightning they\nDo not go gentle into that good night.\n\nGood men, the last wave by, crying how bright\nTheir frail deeds might have danced in a green bay,\nRage, rage against the dying of the light.",
            ],
            'waste-land' => [
                'title' => 'The Waste Land',
                'author' => 'T.S. Eliot',
                'year' => '1922',
                'excerpt' => 'April is the cruellest month, breeding Lilacs out of the dead land, mixing Memory and desire, stirring Dull roots with spring rain...',
                'content' => "April is the cruellest month, breeding\nLilacs out of the dead land, mixing\nMemory and desire, stirring\nDull roots with spring rain.\n\nWinter kept us warm, covering\nEarth in forgetful snow, feeding\nA little life with dried tubers.\n\nSummer surprised us, coming over the Starnbergersee\nWith a shower of rain; we stopped in the colonnade,\nAnd went on in sunlight, into the Hofgarten,\nAnd drank coffee, and talked for an hour.",
            ],
            'howl' => [
                'title' => 'Howl',
                'author' => 'Allen Ginsberg',
                'year' => '1956',
                'excerpt' => 'I saw the best minds of my generation destroyed by madness, starving hysterical naked, dragging themselves through the negro streets...',
                'content' => "I saw the best minds of my generation destroyed by madness,\nstarving hysterical naked,\ndragging themselves through the negro streets at dawn\nlooking for an angry fix,\nangelheaded hipsters burning for the ancient heavenly\nconnection to the starry dynamo in the machinery of night,\nwho poverty and tatters and hollow-eyed and high sat up\nsmoking in the supernatural darkness of cold-water flats\nfloating across the tops of cities contemplating jazz...",
            ],
        ];
        
        // If not found by ID, check hardcoded poems
        if (!$poem && isset($hardcodedPoems[$identifier])) {
            $poemData = $hardcodedPoems[$identifier];
            $poem = (object) [
                'id' => 0,
                'title' => $poemData['title'],
                'content' => $poemData['content'],
                'author_id' => null,
                'is_video' => false,
                'video_url' => null,
                'created_at' => \Carbon\Carbon::createFromDate($poemData['year'], 1, 1),
                'author' => (object) ['first_name' => $poemData['author']],
                'comments' => collect([]),
                'userInteractions' => collect([]),
            ];
        } else if (!$poem) {
            // Try to find by title in database
            $title = str_replace('-', ' ', $identifier);
            $title = ucwords($title);
            $poem = Poem::where('title', 'like', '%' . $title . '%')->first();
        }
        
        // If still not found, create a basic mock
        if (!$poem) {
            $poem = (object) [
                'id' => 0,
                'title' => ucwords(str_replace('-', ' ', $identifier)),
                'content' => 'This poem is not yet available in our database.',
                'author_id' => null,
                'is_video' => false,
                'video_url' => null,
                'created_at' => now(),
                'author' => (object) ['first_name' => 'Unknown'],
                'comments' => collect([]),
                'userInteractions' => collect([]),
            ];
        } else {
            // Load relationships for real poems
            if ($poem->id > 0) {
                $userId = Auth::id();
                // Eager load user interactions and check like status in single query
                $poem->load(['author', 'comments.user', 'userInteractions' => function ($query) use ($userId) {
                    if ($userId) {
                        $query->where('user_id', $userId);
                    }
                }]);
            }
        }
        
        // Check if current user has liked this poem using eager loaded relationship
        $isLiked = false;
        if (Auth::check() && isset($poem->id) && $poem->id > 0 && $poem->userInteractions) {
            $isLiked = $poem->userInteractions->contains(function ($interaction) {
                return $interaction->type === 'like';
            });
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

    // API Methods (for JavaScript interactions)

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

        // Get likes count using withCount would be better, but since we just modified, refresh count
        $likesCount = UserPoem::where('poem_id', $poem->id)
            ->where('type', 'like')
            ->count();

        return response()->json([
            'liked' => $liked,
            'likes_count' => $likesCount,
        ]);
    }

    /**
     * Unlike a poem (API)
     */
    public function unlike(Poem $poem)
    {
        $user = Auth::user();
        $existingLike = UserPoem::where('user_id', $user->id)
            ->where('poem_id', $poem->id)
            ->where('type', 'like')
            ->first();

        if ($existingLike) {
            $existingLike->delete();
        }

        $likesCount = UserPoem::where('poem_id', $poem->id)
            ->where('type', 'like')
            ->count();

        return response()->json([
            'liked' => false,
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

        // Get rating stats in a single query using aggregation
        $ratingStats = UserPoem::where('poem_id', $poem->id)
            ->where('type', 'rating')
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as rating_count')
            ->first();

        return response()->json([
            'rating' => $validated['rating'],
            'average_rating' => round($ratingStats->avg_rating ?? 0, 1),
            'rating_count' => $ratingStats->rating_count ?? 0,
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
            ->select('id', 'title', 'content', 'author_id', 'is_video', 'video_url', 'approved', 'created_at')
            ->with(['comments:id,poem_id,user_id,content,created_at', 'userInteractions'])
            ->latest()
            ->get();

        return response()->json($poems);
    }

    /**
     * Get like count for a poem (API)
     */
    public function getLikeCount(Poem $poem)
    {
        $likesCount = UserPoem::where('poem_id', $poem->id)
            ->where('type', 'like')
            ->count();

        return response()->json([
            'likes_count' => $likesCount,
        ]);
    }

    /**
     * Get user status for a poem (API)
     */
    public function getUserStatus(Poem $poem)
    {
        $user = Auth::user();
        
        // Get all user interactions for this poem in a single query
        $userInteractions = UserPoem::where('user_id', $user->id)
            ->where('poem_id', $poem->id)
            ->get()
            ->keyBy('type');
        
        // Get rating stats in a single query
        $ratingStats = UserPoem::where('poem_id', $poem->id)
            ->where('type', 'rating')
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as rating_count')
            ->first();

        $userRating = $userInteractions->get('rating');
        
        return response()->json([
            'liked' => $userInteractions->has('like'),
            'rating' => $userRating ? $userRating->rating : 0,
            'average_rating' => round($ratingStats->avg_rating ?? 0, 1),
            'rating_count' => $ratingStats->rating_count ?? 0,
        ]);
    }
}
