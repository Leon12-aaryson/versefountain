<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ChatRoom;
use App\Events\UserJoinedChatRoom;
use App\Events\UserLeftChatRoom;
use Illuminate\Support\Facades\Auth;

class ChatRoomController extends Controller
{
    public function index(Request $request)
    {
        $query = ChatRoom::query()->withCount('members');

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
            // Use whereIn with subquery for better performance than whereHas
            $query->whereIn('chat_rooms.id', function ($subquery) use ($user) {
                $subquery->select('room_id')
                         ->from('user_chat_rooms')
                         ->where('user_id', $user->id);
            });
        }

        $chatRooms = $query->get();

        return response()->json($chatRooms);
    }

    public function show(ChatRoom $chatroom)
    {
        // Load relationships
        $chatroom->load('members', 'messages.user');
        
        if ($chatroom->isPrivate) {
            $user = Auth::user();
            // Use eager loaded relationship instead of separate query
            if (!$user || !$chatroom->members->contains('id', $user->id)) {
                abort(403, 'Forbidden. You are not a member of this private chat room.');
            }
        }
        
        return view('chatroom', ['chatroom' => $chatroom]);
    }

    public function apiShow(ChatRoom $room)
    {
        // Load relationships for API response
        $room->load('members');
        
        if ($room->isPrivate) {
            $user = Auth::user();
            // Use eager loaded relationship instead of separate query
            if (!$user || !$room->members->contains('id', $user->id)) {
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

        $chatRoom = ChatRoom::create([
            ...$validatedData,
            'created_by_id' => $user->id
        ]);

        $chatRoom->members()->attach($user->id, ['joinedAt' => now()]);

        return response()->json($chatRoom, 201);
    }

    public function userChatRooms(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $chatRooms = $user->chatRooms()->withCount('members')->get();

        return response()->json($chatRooms);
    }

    public function joinRoom(ChatRoom $room)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if ($room->isPrivate) {
            if ($room->created_by_id !== $user->id && $user->role !== 'admin') {
                return response()->json(['message' => 'Forbidden. You cannot join this private chat room without an invitation or admin privileges.'], 403);
            }
        }

        // Load members once to check membership
        $room->load('members');
        if ($room->members->contains('id', $user->id)) {
            return response()->json(['message' => 'Already a member of this chat room.'], 200);
        }

        $room->members()->attach($user->id, ['joinedAt' => now()]);

        // Broadcast the join event via WebSockets
        event(new UserJoinedChatRoom($user, $room));

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
            // Broadcast the leave event via WebSockets
            event(new UserLeftChatRoom($user, $room));
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

        // Load members once and check in memory
        $room->load('members');
        $isMember = $room->members->contains('id', $user->id);
        return response()->json(['isMember' => $isMember]);
    }
}
