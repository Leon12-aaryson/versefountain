<?php
// app/Models/ChatMessage.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id',    // Updated to snake_case
        'user_id',    // Updated to snake_case
        'message',
        'created_at', // Laravel's default
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * Get the chat room the message belongs to.
     */
    public function room()
    {
        return $this->belongsTo(ChatRoom::class, 'room_id'); // Updated to snake_case
    }

    /**
     * Get the user who sent the message.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id'); // Updated to snake_case
    }
}
