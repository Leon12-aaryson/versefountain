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
        'gradeLevel',
        'language',
        'resourceUrl',
    ];
}
