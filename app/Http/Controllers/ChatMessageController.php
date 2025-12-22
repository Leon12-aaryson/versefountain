<?php
// app/Http/Controllers/ChatMessageController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ChatRoom;
use App\Models\ChatMessage;
use App\Events\ChatMessageSent;
use Illuminate\Support\Facades\Auth;

class ChatMessageController extends Controller
{
    /**
     * Retrieve messages from a specific chat room.
     */
    public function index(Request $request, ChatRoom $chatroom)
    {
        // Check if user is authorized to view messages in this room (especially if private)
        if ($chatroom->isPrivate) {
            $user = Auth::user();
            // Load members once and check in memory
            $chatroom->load('members');
            if (!$user || !$chatroom->members->contains('id', $user->id)) {
                return response()->json(['message' => 'Forbidden. You are not a member of this private chat room.'], 403);
            }
        }

        $limit = $request->input('limit', 50); // Default to 50 messages
        $offset = $request->input('offset', 0);

        $messages = $chatroom->messages()
                         ->select('id', 'room_id', 'user_id', 'message', 'created_at')
                         ->with('user:id,username')
                         ->orderBy('created_at', 'asc')
                         ->offset($offset)
                         ->limit($limit)
                         ->get()
                         ->map(function ($message) {
                             return [
                                 'id' => $message->id,
                                 'room_id' => $message->room_id,
                                 'user_id' => $message->user_id,
                                 'username' => $message->user->username ?? 'Unknown User',
                                 'message' => $message->message,
                                 'timestamp' => $message->created_at,
                                 'createdAt' => $message->created_at,
                             ];
                         });

        return response()->json($messages);
    }

    /**
     * Send a new message to a chat room.
     */
    public function store(Request $request, ChatRoom $chatroom)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Ensure user is a member of the room before sending message
        // Load members once and check in memory
        $chatroom->load('members');
        if (!$chatroom->members->contains('id', $user->id)) {
            return response()->json(['message' => 'Forbidden. You are not a member of this chat room.'], 403);
        }

        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $message = $chatroom->messages()->create([
            'user_id' => $user->id,
            'message' => $request->message,
        ]);

        // Eager load user to return with the message
        $message->load('user:id,username');

        // Format message for frontend
        $formattedMessage = [
            'id' => $message->id,
            'room_id' => $message->room_id,
            'user_id' => $message->user_id,
            'username' => $message->user->username ?? 'Unknown User',
            'message' => $message->message,
            'timestamp' => $message->created_at,
            'createdAt' => $message->created_at,
        ];

        // Broadcast the message via WebSockets
        event(new ChatMessageSent($message));

        return response()->json($formattedMessage, 201);
    }
}
