<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Chat room presence channels
Broadcast::channel('chat.room.{roomId}', function ($user, $roomId) {
    // Debug logging
    Log::info('Broadcasting auth attempt', [
        'user' => $user ? $user->id : 'null',
        'roomId' => $roomId,
        'authenticated' => Auth::check()
    ]);
    
    // Check if user is authenticated
    if (!$user) {
        return false;
    }
    
    // Check if user is a member of the chat room
    return $user->chatRooms()->where('chat_room_id', $roomId)->exists();
});
