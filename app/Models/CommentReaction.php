<?php
// app/Models/CommentReaction.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommentReaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'comment_id', // Updated to snake_case
        'user_id',    // Updated to snake_case
        'reaction',
        'created_at', // Laravel's default
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * Get the comment this reaction belongs to.
     */
    public function comment()
    {
        return $this->belongsTo(PoemComment::class, 'comment_id'); // Updated to snake_case
    }

    /**
     * Get the user who made this reaction.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id'); // Updated to snake_case
    }
}
