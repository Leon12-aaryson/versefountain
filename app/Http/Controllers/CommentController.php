<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function storePoemComment(Request $request, $poemId)
    {
        // Validate and store a comment for a poem
    }

    public function storeBookComment(Request $request, $bookId)
    {
        // Validate and store a comment for a book
    }

    public function poemComments($poemId)
    {
        // Return all comments for a poem
    }

    public function bookComments($bookId)
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
