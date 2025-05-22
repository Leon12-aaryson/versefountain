<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PoemController extends Controller
{
    public function index(Request $request)
    {
        // List poems (with filters)
    }

    public function show($id)
    {
        // Show poem details
    }

    public function store(Request $request)
    {
        // Create a new poem
    }

    public function update(Request $request, $id)
    {
        // Update a poem
    }

    public function destroy($id)
    {
        // Delete a poem
    }

    public function like(Request $request, $id)
    {
        // Like a poem
    }

    public function unlike(Request $request, $id)
    {
        // Unlike a poem
    }

    public function likes($id)
    {
        // List users who liked the poem
    }
}
