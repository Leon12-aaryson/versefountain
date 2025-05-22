<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function storePoemComment(Request $request, $poem_id)
    {
        // Validate and store a comment for a poem
    }

    public function storeBookComment(Request $request, $book_id)
    {
        // Validate and store a comment for a book
    }

    public function poemComments($poem_id)
    {
        // Return all comments for a poem
    }

    public function bookComments($book_id)
    {
        // Return all comments for a book
    }

    public function update(Request $request, $id)
    {
        // Update a comment
    }

    public function destroy($id)
    {
        // Delete a comment
    }
}
