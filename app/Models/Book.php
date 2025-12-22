<?php
// app/Models/Book.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'description',
        'coverImage',
        'uploadedById',
        'genre',
        'approved',
    ];

    protected $casts = [
        'approved' => 'boolean',
    ];

    /**
     * Get the user who uploaded the book.
     */
    public function uploadedBy()
    {
        return $this->belongsTo(User::class, 'uploadedById');
    }
}
