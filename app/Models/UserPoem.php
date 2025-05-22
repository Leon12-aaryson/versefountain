<?php
// app/Models/UserPoem.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPoem extends Model
{
    use HasFactory;

    protected $table = 'user_poems'; // Explicitly define table name

    protected $fillable = [
        'user_id', // Updated to snake_case
        'poem_id', // Updated to snake_case
        'rating',
        'liked',
    ];

    protected $casts = [
        'liked' => 'boolean',
        'rating' => 'integer',
    ];

    /**
     * Get the user associated with this interaction.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id'); // Updated to snake_case
    }

    /**
     * Get the poem associated with this interaction.
     */
    public function poem()
    {
        return $this->belongsTo(Poem::class, 'poem_id'); // Updated to snake_case
    }
}
