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
     */
    public function index(Request $request)
    {
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

        $books = Cache::remember($cacheKey, 300, function () use ($request) {
            $query = Book::where('approved', true);

            if ($request->has('genre')) {
                $request->validate(['genre' => 'string|max:255']);
                $query->where('genre', $request->genre);
            }

            $limit = $request->input('limit', 10);
            $offset = $request->input('offset', 0);

            return $query->offset($offset)
                         ->limit($limit)
                         ->get();
        });

        return response()->json($books);
    }

    /**
     * Retrieve a single book by its ID.
     */
    public function show(Book $book)
    {
        return response()->json($book);
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

        $book = Book::create($validatedData + ['uploaded_by_id' => $user->id, 'approved' => false]); // Default to false for admin approval

        // Clear cache to ensure fresh data
        Cache::flush(); // Clear all book caches

        return response()->json($book, 201);
    }
}
