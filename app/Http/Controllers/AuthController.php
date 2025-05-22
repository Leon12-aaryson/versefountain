<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Register a new user
    }

    public function login(Request $request)
    {
        // Authenticate user and return token
    }

    public function logout(Request $request)
    {
        // Logout user (invalidate token)
    }

    public function user(Request $request)
    {
        // Return authenticated user's profile
    }
}
