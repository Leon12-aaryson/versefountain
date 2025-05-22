<?php
// app/Http/Controllers/UserController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\PoetFollower;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Retrieve a list of "featured" poets.
     * (Logic for "featured" can be customized, e.g., most followers, active users)
     */
    public function featuredPoets()
    {
        // Example: Get users with at least one poem, ordered by number of followers
        $featuredPoets = User::has('poems')
            ->withCount('followers')
            ->orderByDesc('followers_count')
            ->limit(10) // Example limit
            ->get(['id', 'username', 'email']); // Select only necessary fields

        return response()->json($featuredPoets);
    }

    /**
     * Allow the authenticated user to follow another user (poet).
     */
    public function followPoet(User $user)
    {
        $follower = Auth::user();
        if (!$follower) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if ($follower->id === $user->id) {
            return response()->json(['message' => 'You cannot follow yourself.'], 400);
        }

        // Check if already following
        if ($follower->following()->where('poet_id', $user->id)->exists()) {
            return response()->json(['message' => 'Already following this poet.'], 409);
        }

        $follower->following()->attach($user->id);

        return response()->json(['message' => 'Successfully followed poet.'], 200);
    }

    /**
     * Allow the authenticated user to unfollow another user (poet).
     */
    public function unfollowPoet(User $user)
    {
        $follower = Auth::user();
        if (!$follower) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Check if actually following
        if (!$follower->following()->where('poet_id', $user->id)->exists()) {
            return response()->json(['message' => 'Not following this poet.'], 409);
        }

        $follower->following()->detach($user->id);

        return response()->json(['message' => 'Successfully unfollowed poet.'], 200);
    }

    /**
     * Retrieve a list of users who are following a specific poet.
     */
    public function getFollowers(User $user)
    {
        $followers = $user->followers()->get(['id', 'username', 'email']);
        return response()->json($followers);
    }

    /**
     * Retrieve a list of poets that the currently authenticated user is following.
     */
    public function followedPoets(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }
        $followedPoets = $user->following()->get(['id', 'username', 'email']);
        return response()->json($followedPoets);
    }

    /**
     * Check if the authenticated user is following a specific poet.
     */
    public function getFollowingStatus(User $user)
    {
        $currentUser = Auth::user();
        if (!$currentUser) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $isFollowing = $currentUser->following()->where('poet_id', $user->id)->exists();
        return response()->json(['isFollowing' => $isFollowing]);
    }
}
