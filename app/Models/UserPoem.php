<?php
// app/Models/UserPoem.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPoem extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'poem_id',
        'type', // 'like', 'rating'
        'rating', // 1-5 for rating type
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    /**
     * Get the user that owns the interaction.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the poem that owns the interaction.
     */
    public function poem()
    {
        return $this->belongsTo(Poem::class);
    }
}
