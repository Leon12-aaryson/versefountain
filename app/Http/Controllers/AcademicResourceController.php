<?php
// app/Http/Controllers/AcademicResourceController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AcademicResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AcademicResourceController extends Controller
{
    /**
     * Retrieve a list of all academic resources.
     * Returns JSON for API requests, Blade view for web requests.
     */
    public function index(Request $request)
    {
        $query = AcademicResource::query();

        // Apply filters
        if ($request->has('type') && $request->type) {
            $request->validate(['type' => 'string']);
            $query->where('type', $request->type);
        }
        if ($request->has('subject') && $request->subject) {
            $request->validate(['subject' => 'string']);
            $query->where('subject', $request->subject);
        }
        if ($request->has('gradeLevel') && $request->gradeLevel) {
            $request->validate(['gradeLevel' => 'string']);
            $query->where('gradeLevel', $request->gradeLevel);
        }
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%')
                  ->orWhere('subject', 'like', '%' . $search . '%');
            });
        }

        // If API request (wants JSON), return JSON
        if ($request->wantsJson() || $request->expectsJson()) {
            $limit = $request->input('limit', 10);
            $offset = $request->input('offset', 0);

            $resources = $query->select('id', 'title', 'description', 'type', 'subject', 'gradeLevel', 'language', 'resourceUrl', 'created_at')
                               ->offset($offset)
                               ->limit($limit)
                               ->get();

            return response()->json($resources);
        }

        // Otherwise, return Blade view for web requests
        // Get featured resources (most recent, limit 3) - reuse base query
        $featuredResources = (clone $query)->latest()
            ->take(3)
            ->get();

        // Get recent papers (paginated)
        $recentPapers = $query->latest()
            ->paginate(12);

        // Get unique subjects for category counts - cache this as it's expensive
        $subjects = AcademicResource::select('subject')
            ->whereNotNull('subject')
            ->distinct()
            ->pluck('subject');

        return view('academics', compact('featuredResources', 'recentPapers', 'subjects'));
    }

    /**
     * Retrieve a single academic resource by its ID or identifier.
     * Returns JSON for API requests, Blade view for web requests.
     */
    public function show(Request $request, $identifier)
    {
        // Handle route model binding (when AcademicResource instance is passed)
        if ($identifier instanceof AcademicResource) {
            $resource = $identifier;
        } else {
            // Optimize: Try to find by ID or title in a single query
            $resource = null;
            if (is_numeric($identifier)) {
                $resource = AcademicResource::find($identifier);
            }
            
            // If not found by ID, try to find by title/slug
            if (!$resource) {
                $title = str_replace('-', ' ', $identifier);
                $title = ucwords($title);
                $resource = AcademicResource::where('title', 'like', '%' . $title . '%')->first();
            }

            // If still not found, return 404
            if (!$resource) {
                if ($request->wantsJson() || $request->expectsJson()) {
                    return response()->json(['message' => 'Resource not found'], 404);
                }
                abort(404, 'Resource not found');
            }
        }

        // If API request (wants JSON), return JSON
        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($resource);
        }

        // Otherwise, return Blade view for web requests
        return view('academics.show', compact('resource'));
    }

    /**
     * Download the academic resource file.
     */
    public function download($identifier)
    {
        // Optimize: Try to find by ID or title in a single query
        $resource = null;
        if (is_numeric($identifier)) {
            $resource = AcademicResource::find($identifier);
        }

        // If not found by ID, try to find by title/slug
        if (!$resource) {
            $title = str_replace('-', ' ', $identifier);
            $title = ucwords($title);
            $resource = AcademicResource::where('title', 'like', '%' . $title . '%')->first();
        }

        if (!$resource) {
            abort(404, 'Resource not found');
        }

        // If resource has a file URL, redirect to it or serve the file
        if ($resource->resourceUrl) {
            // Check if it's a full URL (external) or a local file path
            if (filter_var($resource->resourceUrl, FILTER_VALIDATE_URL)) {
                // External URL - redirect to it
                return redirect($resource->resourceUrl);
            } else {
                // Local file path - check if file exists and serve it
                $filePath = storage_path('app/public/' . ltrim($resource->resourceUrl, '/'));
                if (file_exists($filePath)) {
                    return response()->download($filePath);
                }
                
                // Try public storage path
                $publicPath = public_path('storage/' . ltrim($resource->resourceUrl, '/'));
                if (file_exists($publicPath)) {
                    return response()->download($publicPath);
                }
            }
        }

        // If no file exists, generate a downloadable text/PDF file from description
        $filename = str_replace(' ', '_', $resource->title) . '.pdf';
        
        // Create content from resource data
        $content = "Title: " . $resource->title . "\n\n";
        $content .= "Subject: " . ($resource->subject ?? 'General') . "\n";
        $content .= "Type: " . ucfirst(str_replace('_', ' ', $resource->type ?? 'Document')) . "\n";
        $content .= "Language: " . ($resource->language ?? 'English') . "\n\n";
        $content .= "---\n\n";
        $content .= ($resource->description ?? 'No content available.');

        // Return as downloadable file
        return response($content)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
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

    /**
     * Upload a file for an academic resource.
     */
    public function uploadFile(Request $request, AcademicResource $academicResource)
    {
        $user = Auth::user();
        if (!$user || !$user->isAdmin) {
            return response()->json(['message' => 'Forbidden. Admin access required.'], 403);
        }

        $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx,txt,rtf|max:10240', // Max 10MB
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('academic_resources', $filename, 'public');
            
            // Update the resource with the file URL
            $academicResource->update([
                'resourceUrl' => Storage::url($path)
            ]);

            return response()->json([
                'message' => 'File uploaded successfully',
                'file_url' => Storage::url($path),
                'resource' => $academicResource->fresh()
            ]);
        }

        return response()->json(['message' => 'No file uploaded.'], 400);
    }
}
