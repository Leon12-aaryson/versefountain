<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'username',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function poems()
    {
        return $this->hasMany(Poem::class, 'author_id');
    }

    public function uploadedBooks()
    {
        return $this->hasMany(Book::class, 'uploadedById');
    }

    public function createdEvents()
    {
        return $this->hasMany(Event::class, 'created_by_id');
    }

    public function createdChatRooms()
    {
        return $this->hasMany(ChatRoom::class, 'created_by_id');
    }

    public function chatMessages()
    {
        return $this->hasMany(ChatMessage::class, 'user_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'user_id');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'user_id');
    }

    public function userPoems()
    {
        return $this->hasMany(UserPoem::class, 'user_id');
    }

    public function userChatRooms()
    {
        return $this->hasMany(UserChatRoom::class, 'user_id');
    }

    public function chatRooms()
    {
        return $this->belongsToMany(ChatRoom::class, 'user_chat_rooms', 'user_id', 'room_id');
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function activeSubscription()
    {
        return $this->hasOne(Subscription::class)->where('status', 'active');
    }

    public function poemComments()
    {
        return $this->hasMany(PoemComment::class, 'user_id');
    }

    public function commentReactions()
    {
        return $this->hasMany(CommentReaction::class, 'user_id');
    }

    public function following()
    {
        return $this->belongsToMany(User::class, 'poet_followers', 'follower_id', 'poet_id');
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'poet_followers', 'poet_id', 'follower_id');
    }
}
