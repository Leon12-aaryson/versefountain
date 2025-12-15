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
     * Retrieve a single academic resource by its ID (API).
     */
    public function show(AcademicResource $academicResource)
    {
        return response()->json($academicResource);
    }

    /**
     * Display the specified academic resource (Blade view).
     */
    public function showWeb($identifier)
    {
        // Hardcoded academic resources data (matching academics.blade.php)
        $hardcodedResources = [
            'modern-poetry-analysis' => [
                'title' => 'Modern Poetry Analysis',
                'author' => 'Dr. Sarah Johnson',
                'subject' => 'Literature',
                'type' => 'Research Paper',
                'pages' => '15',
                'content' => 'This comprehensive research paper explores the evolution of modern poetry, analyzing contemporary trends and techniques used by leading poets of the 21st century. The study examines how digital media has influenced poetic expression and the ways in which modern poets break traditional boundaries.',
            ],
            'shakespeare-influence' => [
                'title' => 'Shakespeare\'s Influence',
                'author' => 'Prof. Michael Chen',
                'subject' => 'Literature',
                'type' => 'Essay',
                'pages' => '8',
                'content' => 'An in-depth analysis of William Shakespeare\'s enduring influence on contemporary literature, theater, and language. This essay explores how Shakespeare\'s works continue to shape modern storytelling and dramatic techniques.',
            ],
            'creative-writing-guide' => [
                'title' => 'Creative Writing Guide',
                'author' => 'Dr. Emily Rodriguez',
                'subject' => 'Literature',
                'type' => 'Study Guide',
                'pages' => '25',
                'content' => 'A comprehensive guide to creative writing techniques, covering everything from character development to narrative structure. This study guide provides practical exercises and examples to help aspiring writers hone their craft.',
            ],
            'evolution-poetry-digital' => [
                'title' => 'The Evolution of Poetry in Digital Age',
                'author' => 'Dr. Lisa Thompson',
                'subject' => 'Literature',
                'type' => 'Research Paper',
                'pages' => '12',
                'content' => 'This research paper examines how poetry has adapted to the digital age, exploring new forms of expression through social media, digital platforms, and interactive media.',
            ],
            'comparative-analysis-poets' => [
                'title' => 'Comparative Analysis of Modern Poets',
                'author' => 'Prof. David Wilson',
                'subject' => 'Literature',
                'type' => 'Research Paper',
                'pages' => '18',
                'content' => 'A detailed comparative study of contemporary poets, analyzing their unique styles, themes, and contributions to modern literature.',
            ],
            'social-media-literature' => [
                'title' => 'The Impact of Social Media on Literature',
                'author' => 'Dr. Maria Garcia',
                'subject' => 'Literature',
                'type' => 'Research Paper',
                'pages' => '22',
                'content' => 'An exploration of how social media platforms have transformed the way literature is created, shared, and consumed in the modern era.',
            ],
        ];

        // Try to find by ID first
        $resource = null;
        if (is_numeric($identifier)) {
            $resource = AcademicResource::find($identifier);
        }

        // If not found by ID, check hardcoded resources
        if (!$resource && isset($hardcodedResources[$identifier])) {
            $resourceData = $hardcodedResources[$identifier];
            $resource = (object) [
                'id' => 0,
                'title' => $resourceData['title'],
                'description' => $resourceData['content'],
                'author' => $resourceData['author'],
                'subject' => $resourceData['subject'],
                'type' => $resourceData['type'],
                'pages' => $resourceData['pages'],
                'created_at' => now(),
            ];
        } else if (!$resource) {
            // Try to find by title in database
            $title = str_replace('-', ' ', $identifier);
            $title = ucwords($title);
            $resource = AcademicResource::where('title', 'like', '%' . $title . '%')->first();
        }

        // If still not found, create a basic mock
        if (!$resource) {
            $resource = (object) [
                'id' => 0,
                'title' => ucwords(str_replace('-', ' ', $identifier)),
                'description' => 'This resource is not yet available in our database.',
                'author' => 'Unknown',
                'subject' => 'General',
                'type' => 'Document',
                'pages' => '0',
                'created_at' => now(),
            ];
        }

        return view('academics.show', compact('resource'));
    }

    /**
     * Download the academic resource as PDF.
     */
    public function download($identifier)
    {
        // Hardcoded academic resources data (matching academics.blade.php)
        $hardcodedResources = [
            'modern-poetry-analysis' => [
                'title' => 'Modern Poetry Analysis',
                'author' => 'Dr. Sarah Johnson',
                'subject' => 'Literature',
                'type' => 'Research Paper',
                'pages' => '15',
                'content' => 'This comprehensive research paper explores the evolution of modern poetry, analyzing contemporary trends and techniques used by leading poets of the 21st century. The study examines how digital media has influenced poetic expression and the ways in which modern poets break traditional boundaries.',
            ],
            'shakespeare-influence' => [
                'title' => 'Shakespeare\'s Influence',
                'author' => 'Prof. Michael Chen',
                'subject' => 'Literature',
                'type' => 'Essay',
                'pages' => '8',
                'content' => 'An in-depth analysis of William Shakespeare\'s enduring influence on contemporary literature, theater, and language. This essay explores how Shakespeare\'s works continue to shape modern storytelling and dramatic techniques.',
            ],
            'creative-writing-guide' => [
                'title' => 'Creative Writing Guide',
                'author' => 'Dr. Emily Rodriguez',
                'subject' => 'Literature',
                'type' => 'Study Guide',
                'pages' => '25',
                'content' => 'A comprehensive guide to creative writing techniques, covering everything from character development to narrative structure. This study guide provides practical exercises and examples to help aspiring writers hone their craft.',
            ],
            'evolution-poetry-digital' => [
                'title' => 'The Evolution of Poetry in Digital Age',
                'author' => 'Dr. Lisa Thompson',
                'subject' => 'Literature',
                'type' => 'Research Paper',
                'pages' => '12',
                'content' => 'This research paper examines how poetry has adapted to the digital age, exploring new forms of expression through social media, digital platforms, and interactive media.',
            ],
            'comparative-analysis-poets' => [
                'title' => 'Comparative Analysis of Modern Poets',
                'author' => 'Prof. David Wilson',
                'subject' => 'Literature',
                'type' => 'Research Paper',
                'pages' => '18',
                'content' => 'A detailed comparative study of contemporary poets, analyzing their unique styles, themes, and contributions to modern literature.',
            ],
            'social-media-literature' => [
                'title' => 'The Impact of Social Media on Literature',
                'author' => 'Dr. Maria Garcia',
                'subject' => 'Literature',
                'type' => 'Research Paper',
                'pages' => '22',
                'content' => 'An exploration of how social media platforms have transformed the way literature is created, shared, and consumed in the modern era.',
            ],
        ];

        // Try to find resource
        $resource = null;
        if (is_numeric($identifier)) {
            $resource = AcademicResource::find($identifier);
        }

        // If not found by ID, check hardcoded resources
        if (!$resource && isset($hardcodedResources[$identifier])) {
            $resourceData = $hardcodedResources[$identifier];
            $resource = (object) [
                'id' => 0,
                'title' => $resourceData['title'],
                'description' => $resourceData['content'],
                'author' => $resourceData['author'],
                'subject' => $resourceData['subject'],
                'type' => $resourceData['type'],
                'pages' => $resourceData['pages'],
            ];
        } else if (!$resource) {
            // Try to find by title in database
            $title = str_replace('-', ' ', $identifier);
            $title = ucwords($title);
            $resource = AcademicResource::where('title', 'like', '%' . $title . '%')->first();
        }

        if (!$resource) {
            abort(404, 'Resource not found');
        }

        // Generate PDF content (simple text-based PDF)
        $filename = str_replace(' ', '_', $resource->title) . '.pdf';
        
        // Create a simple text file that can be downloaded
        // In a real application, you would use a PDF library like DomPDF or TCPDF
        $content = "Title: " . $resource->title . "\n\n";
        $content .= "Author: " . ($resource->author ?? 'Unknown') . "\n";
        $content .= "Subject: " . ($resource->subject ?? 'General') . "\n";
        $content .= "Type: " . ($resource->type ?? 'Document') . "\n";
        $content .= "Pages: " . ($resource->pages ?? '0') . "\n\n";
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
}
