<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function show($id)
    {
        // Show user profile
    }

    public function update(Request $request, $id)
    {
        // Update user profile
    }

    public function follow(Request $request, $id)
    {
        // Follow a user
    }

    public function unfollow(Request $request, $id)
    {
        // Unfollow a user
    }

    public function poems($id)
    {
        // List poems by user
    }

    public function followers($id)
    {
        // List followers of user
    }

    public function following($id)
    {
        // List users this user is following
    }
}
