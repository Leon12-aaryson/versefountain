<?php
// app/Http/Controllers/BookController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Book;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class BookController extends Controller
{
    /**
     * Retrieve a list of all approved books.
     * Returns JSON for API requests, Blade view for web requests.
     */
    public function index(Request $request)
    {
        $query = Book::where('approved', true);

        // Apply filters
        if ($request->has('genre') && $request->genre) {
            $request->validate(['genre' => 'string|max:255']);
            $query->where('genre', $request->genre);
        }
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                  ->orWhere('author', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%')
                  ->orWhere('genre', 'like', '%' . $search . '%');
            });
        }

        // If API request (wants JSON), return JSON
        if ($request->wantsJson() || $request->expectsJson()) {
            // Cache books for 5 minutes to improve performance
            $cacheKey = 'books.all';
            if ($request->has('genre')) {
                $cacheKey .= '.genre.' . $request->genre;
            }
            if ($request->has('limit')) {
                $cacheKey .= '.limit.' . $request->limit;
            }
            if ($request->has('offset')) {
                $cacheKey .= '.offset.' . $request->offset;
            }

            $books = Cache::remember($cacheKey, 300, function () use ($query, $request) {
                $limit = $request->input('limit', 10);
                $offset = $request->input('offset', 0);

                return $query->select('id', 'title', 'author', 'description', 'coverImage', 'genre', 'approved', 'uploadedById', 'created_at')
                             ->with('uploadedBy:id,username')
                             ->offset($offset)
                             ->limit($limit)
                             ->get();
            });

            return response()->json($books);
        }

        // Otherwise, return Blade view for web requests
        // Get featured books (4 most recent) - reuse base query with eager loading
        $featuredBooks = (clone $query)->with('uploadedBy')
            ->latest()
            ->take(4)
            ->get();

        // Get recent books (paginated) with eager loading
        $recentBooks = $query->with('uploadedBy')
            ->latest()
            ->paginate(12);

        // Get unique genres for category counts - optimize with pluck directly
        $genres = Book::where('approved', true)
            ->whereNotNull('genre')
            ->distinct()
            ->pluck('genre');

        return view('books', compact('featuredBooks', 'recentBooks', 'genres'));
    }

    /**
     * Retrieve a single book by its ID (API).
     */
    public function show(Book $book)
    {
        // Eager load relationships
        $book->load('uploadedBy');
        return response()->json($book);
    }

    /**
     * Display the specified book (Blade view).
     */
    public function showWeb($identifier)
    {
        // Hardcoded books data (matching books.blade.php)
        $hardcodedBooks = [
            'great-gatsby' => [
                'title' => 'The Great Gatsby',
                'author' => 'F. Scott Fitzgerald',
                'genre' => 'Fiction',
                'description' => 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream through the eyes of Nick Carraway and his mysterious neighbor Jay Gatsby.',
            ],
            'midnight-library' => [
                'title' => 'The Midnight Library',
                'author' => 'Matt Haig',
                'genre' => 'Fiction',
                'description' => 'A thought-provoking novel about a library between life and death where every book represents a different life you could have lived.',
            ],
        ];

        // Try to find by ID first
        $book = null;
        if (is_numeric($identifier)) {
            $book = Book::find($identifier);
        }

        // If not found by ID, check hardcoded books
        if (!$book && isset($hardcodedBooks[$identifier])) {
            $bookData = $hardcodedBooks[$identifier];
            $book = (object) [
                'id' => 0,
                'title' => $bookData['title'],
                'author' => $bookData['author'],
                'genre' => $bookData['genre'],
                'description' => $bookData['description'],
                'created_at' => now(),
            ];
        } else if (!$book) {
            // Try to find by title in database
            $title = str_replace('-', ' ', $identifier);
            $title = ucwords($title);
            $book = Book::where('title', 'like', '%' . $title . '%')->first();
        }

        // If still not found, create a basic mock
        if (!$book) {
            $book = (object) [
                'id' => 0,
                'title' => ucwords(str_replace('-', ' ', $identifier)),
                'author' => 'Unknown',
                'genre' => 'General',
                'description' => 'This book is not yet available in our database.',
                'created_at' => now(),
            ];
        }

        return view('books.show', compact('book'));
    }

    /**
     * Upload a book cover image.
     */
    public function uploadCover(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $request->validate([
            'cover_image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('public/book_covers');
            // Return the URL relative to your public storage
            return response()->json(['coverImage' => Storage::url($path)]);
        }

        return response()->json(['message' => 'No image uploaded.'], 400);
    }

    /**
     * Add a new book.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'description' => 'nullable|string',
            'coverImage' => 'nullable|url', // Expecting a URL from uploadCover endpoint
            'genre' => 'nullable|string|max:255',
        ]);

        $book = Book::create($validatedData + ['uploadedById' => $user->id, 'approved' => false]); // Default to false for admin approval

        // Clear cache to ensure fresh data
        Cache::flush(); // Clear all book caches

        return response()->json($book, 201);
    }
}
