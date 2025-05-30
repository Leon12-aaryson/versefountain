<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ChatRoom;
use Illuminate\Support\Facades\Auth;

class ChatRoomController extends Controller
{
    public function index(Request $request)
    {
        $query = ChatRoom::query();

        if ($request->has('isPrivate')) {
            $request->validate(['isPrivate' => 'boolean']);
            $query->where('isPrivate', $request->boolean('isPrivate'));
        } else {
            if (!Auth::check()) {
                $query->where('isPrivate', false);
            }
        }

        if ($request->boolean('joined') && Auth::check()) {
            $user = Auth::user();
            $query->whereHas('members', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        $chatRooms = $query->get();

        return response()->json($chatRooms);
    }

    public function show(ChatRoom $room)
    {
        if ($room->isPrivate) {
            $user = Auth::user();
            if (!$user || !$room->members()->where('user_id', $user->id)->exists()) {
                return response()->json(['message' => 'Forbidden. You are not a member of this private chat room.'], 403);
            }
        }
        return response()->json($room);
    }

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

        $chatRoom->members()->attach($user->id, ['joinedAt' => now()]);

        return response()->json($chatRoom, 201);
    }

    public function userChatRooms(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $chatRooms = $user->userChatRooms()->with('chatRoom')->get()->map(function ($userChatRoom) {
            return $userChatRoom->chatRoom;
        });

        return response()->json($chatRooms);
    }

    public function joinRoom(ChatRoom $room)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if ($room->isPrivate) {
            if ($room->created_by_id !== $user->id && !$user->isAdmin) {
                return response()->json(['message' => 'Forbidden. You cannot join this private chat room without an invitation or admin privileges.'], 403);
            }
        }

        if ($room->members()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'Already a member of this chat room.'], 200);
        }

        $room->members()->attach($user->id, ['joinedAt' => now()]);

        return response()->json(['message' => 'Successfully joined chat room.'], 200);
    }

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
