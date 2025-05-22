<?php
// app/Http/Controllers/ChatRoomController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ChatRoom;
use App\Models\UserChatRoom;
use Illuminate\Support\Facades\Auth;

class ChatRoomController extends Controller
{
    /**
     * Retrieve a list of all chat rooms.
     */
    public function index(Request $request)
    {
        $query = ChatRoom::query();

        // Filter by privacy status
        if ($request->has('isPrivate')) {
            $request->validate(['isPrivate' => 'boolean']);
            $query->where('isPrivate', $request->boolean('isPrivate'));
        } else {
            // By default, only show public rooms to unauthenticated users
            if (!Auth::check()) {
                $query->where('isPrivate', false);
            }
        }

        // Filter by joined status for authenticated users
        if ($request->boolean('joined') && Auth::check()) {
            $user = Auth::user();
            $query->whereHas('members', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        $chatRooms = $query->get();

        return response()->json($chatRooms);
    }

    /**
     * Retrieve a single chat room by its ID.
     */
    public function show(ChatRoom $room)
    {
        // If room is private, check membership
        if ($room->isPrivate) {
            $user = Auth::user();
            if (!$user || !$room->members()->where('user_id', $user->id)->exists()) {
                return response()->json(['message' => 'Forbidden. You are not a member of this private chat room.'], 403);
            }
        }
        return response()->json($room);
    }

    /**
     * Create a new chat room.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'isPrivate' => 'boolean',
        ]);

        $chatRoom = $user->createdChatRooms()->create($validatedData);

        // Automatically add the creator to the chat room members
        $chatRoom->members()->attach($user->id, ['joinedAt' => now()]);

        return response()->json($chatRoom, 201);
    }

    /**
     * Retrieve all chat rooms that the currently authenticated user has joined.
     */
    public function userChatRooms(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $chatRooms = $user->userChatRooms()->with('chatRoom')->get()->map(function ($userChatRoom) {
            return $userChatRoom->chatRoom; // Return the chat room object directly
        });

        return response()->json($chatRooms);
    }

    /**
     * Allow the authenticated user to join a specific chat room.
     */
    public function joinRoom(ChatRoom $room)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // If room is private, check if user is allowed to join (e.g., invited, or admin)
        // For simplicity, assuming private rooms can only be joined if creator allows, or if admin.
        // In a real app, you'd have an invitation system or admin override.
        if ($room->isPrivate) {
            // Example: Only creator can add members, or if user is admin
            if ($room->createdById !== $user->id && !$user->isAdmin) {
                return response()->json(['message' => 'Forbidden. You cannot join this private chat room without an invitation or admin privileges.'], 403);
            }
        }

        // Check if already a member
        if ($room->members()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'Already a member of this chat room.'], 200);
        }

        $room->members()->attach($user->id, ['joinedAt' => now()]);

        return response()->json(['message' => 'Successfully joined chat room.'], 200);
    }

    /**
     * Allow the authenticated user to leave a specific chat room.
     */
    public function leaveRoom(ChatRoom $room)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $detached = $room->members()->detach($user->id);

        if ($detached) {
            return response()->json(null, 204);
        }

        return response()->json(['message' => 'You are not a member of this chat room.'], 404);
    }

    /**
     * Check if the authenticated user is a member of a specific chat room.
     */
    public function getMembershipStatus(ChatRoom $room)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $isMember = $room->members()->where('user_id', $user->id)->exists();
        return response()->json(['isMember' => $isMember]);
    }
}
