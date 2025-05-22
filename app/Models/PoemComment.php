<?php
// app/Models/PoemComment.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PoemComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'poem_id',    // Updated to snake_case
        'user_id',    // Updated to snake_case
        'content',
        'created_at', // Laravel's default
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * Get the poem this comment belongs to.
     */
    public function poem()
    {
        return $this->belongsTo(Poem::class, 'poem_id'); // Updated to snake_case
    }

    /**
     * Get the user who made this comment.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id'); // Updated to snake_case
    }

    /**
     * Get the reactions to this comment.
     */
    public function reactions()
    {
        return $this->hasMany(CommentReaction::class, 'comment_id'); // Updated to snake_case
    }
}
