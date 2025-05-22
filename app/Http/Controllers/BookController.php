<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index(Request $request)
    {
        // List books
    }

    public function show($id)
    {
        // Show book details
    }

    public function store(Request $request)
    {
        // Create a new book
    }

    public function update(Request $request, $id)
    {
        // Update a book
    }

    public function destroy($id)
    {
        // Delete a book
    }

    public function like(Request $request, $id)
    {
        // Like a book
    }

    public function unlike(Request $request, $id)
    {
        // Unlike a book
    }

    public function likes($id)
    {
        // List users who liked the book
    }
}
