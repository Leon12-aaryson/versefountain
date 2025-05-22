<?php
// app/Models/UserChatRoom.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserChatRoom extends Model
{
    use HasFactory;

    protected $table = 'user_chat_rooms'; // Explicitly define table name
    public $timestamps = false; // Disable Laravel's default created_at/updated_at for this table

    protected $fillable = [
        'user_id',   // Updated to snake_case
        'room_id',   // Updated to snake_case
        'joined_at', // Updated to snake_case
    ];

    protected $casts = [
        'joined_at' => 'datetime', // Updated to snake_case
    ];

    /**
     * Get the user associated with this chat room membership.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id'); // Updated to snake_case
    }

    /**
     * Get the chat room associated with this membership.
     */
    public function chatRoom()
    {
        return $this->belongsTo(ChatRoom::class, 'room_id'); // Updated to snake_case
    }
}
