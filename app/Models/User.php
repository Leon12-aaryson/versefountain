<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Using Laravel Sanctum for API authentication

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'password', // This will be hashed automatically by the 'hashed' cast
        'isAdmin',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed', // Laravel automatically hashes passwords when set this way
        'isAdmin' => 'boolean',
    ];

    // Relationships

    /**
     * Get the poems authored by the user.
     */
    public function poems()
    {
        return $this->hasMany(Poem::class, 'author_id'); // Updated to snake_case
    }

    /**
     * Get the books uploaded by the user.
     */
    public function uploadedBooks()
    {
        return $this->hasMany(Book::class, 'uploaded_by_id'); // Updated to snake_case
    }

    /**
     * Get the events created by the user.
     */
    public function createdEvents()
    {
        return $this->hasMany(Event::class, 'created_by_id'); // Updated to snake_case
    }

    /**
     * Get the chat rooms created by the user.
     */
    public function createdChatRooms()
    {
        return $this->hasMany(ChatRoom::class, 'created_by_id'); // Updated to snake_case
    }

    /**
     * Get the chat messages sent by the user.
     */
    public function chatMessages()
    {
        return $this->hasMany(ChatMessage::class, 'user_id'); // Updated to snake_case
    }

    /**
     * Get the payments made by the user.
     */
    public function payments()
    {
        return $this->hasMany(Payment::class, 'user_id'); // Updated to snake_case
    }

    /**
     * Get the tickets purchased by the user.
     */
    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'user_id'); // Updated to snake_case
    }

    /**
     * Get the user's interactions (likes/ratings) with poems.
     */
    public function userPoems()
    {
        return $this->hasMany(UserPoem::class, 'user_id'); // Updated to snake_case
    }

    /**
     * Get the chat rooms the user has joined.
     */
    public function userChatRooms()
    {
        return $this->hasMany(UserChatRoom::class, 'user_id'); // Updated to snake_case
    }

    /**
     * Get the comments made by the user on poems.
     */
    public function poemComments()
    {
        return $this->hasMany(PoemComment::class, 'user_id'); // Updated to snake_case
    }

    /**
     * Get the reactions made by the user on comments.
     */
    public function commentReactions()
    {
        return $this->hasMany(CommentReaction::class, 'user_id'); // Updated to snake_case
    }

    /**
     * Get the poets (users) that this user is following.
     */
    public function following()
    {
        return $this->belongsToMany(User::class, 'poet_followers', 'follower_id', 'poet_id'); // Updated to snake_case
    }

    /**
     * Get the users who are following this user (poet).
     */
    public function followers()
    {
        return $this->belongsToMany(User::class, 'poet_followers', 'poet_id', 'follower_id'); // Updated to snake_case
    }
}
