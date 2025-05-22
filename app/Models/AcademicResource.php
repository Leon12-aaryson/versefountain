<?php
// app/Models/AcademicResource.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicResource extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'type',
        'subject',
        'grade_level', // Updated to snake_case
        'language',
        'resource_url', // Updated to snake_case
    ];
}
