<?php
// app/Models/Poem.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Poem extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'author_id', // Updated to snake_case
        'is_video',  // Updated to snake_case
        'video_url', // Updated to snake_case
        'approved',
    ];

    protected $casts = [
        'is_video' => 'boolean',  // Updated to snake_case
        'approved' => 'boolean',
        'created_at' => 'datetime', // Laravel's default
    ];

    /**
     * Get the author of the poem.
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id'); // Updated to snake_case
    }

    /**
     * Get the user interactions (likes and ratings) for the poem.
     */
    public function userInteractions()
    {
        return $this->hasMany(UserPoem::class, 'poem_id'); // Updated to snake_case
    }

    /**
     * Get the comments for the poem.
     */
    public function comments()
    {
        return $this->hasMany(PoemComment::class, 'poem_id'); // Updated to snake_case
    }
}
