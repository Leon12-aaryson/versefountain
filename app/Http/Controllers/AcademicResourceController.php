<?php
// app/Http/Controllers/AcademicResourceController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AcademicResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class AcademicResourceController extends Controller
{
    /**
     * Retrieve a list of all academic resources.
     */
    public function index(Request $request)
    {
        $query = AcademicResource::query();

        if ($request->has('type')) {
            $request->validate(['type' => 'string']);
            $query->where('type', $request->type);
        }
        if ($request->has('subject')) {
            $request->validate(['subject' => 'string']);
            $query->where('subject', $request->subject);
        }
        if ($request->has('gradeLevel')) {
            $request->validate(['gradeLevel' => 'string']);
            $query->where('gradeLevel', $request->gradeLevel);
        }

        $limit = $request->input('limit', 10);
        $offset = $request->input('offset', 0);

        $resources = $query->offset($offset)
                           ->limit($limit)
                           ->get();

        return response()->json($resources);
    }

    /**
     * Retrieve a single academic resource by its ID.
     */
    public function show(AcademicResource $academicResource)
    {
        return response()->json($academicResource);
    }

    /**
     * Add a new academic resource.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user || !$user->isAdmin) { // Only admins can add academic resources
            return response()->json(['message' => 'Forbidden. Admin access required.'], 403);
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => ['required', 'string', Rule::in(['study_guide', 'video', 'career_guide', 'other'])], // Example types
            'subject' => 'nullable|string|max:255',
            'gradeLevel' => 'nullable|string|max:255',
            'language' => 'nullable|string|max:255',
            'resourceUrl' => 'nullable|url',
        ]);

        $resource = AcademicResource::create($validatedData);

        return response()->json($resource, 201);
    }
}
