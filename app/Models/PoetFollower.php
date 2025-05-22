<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PoetFollower extends Model
{
    use HasFactory;

    protected $table = 'poet_followers'; // Explicitly define table name
    public $timestamps = false; // Disable Laravel's default created_at/updated_at for this table

    protected $fillable = [
        'follower_id', // Updated to snake_case
        'poet_id',     // Updated to snake_case
        'created_at',  // Laravel's default
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * Get the user who is following.
     */
    public function follower()
    {
        return $this->belongsTo(User::class, 'follower_id'); // Updated to snake_case
    }

    /**
     * Get the user (poet) being followed.
     */
    public function poet()
    {
        return $this->belongsTo(User::class, 'poet_id'); // Updated to snake_case
    }
}
