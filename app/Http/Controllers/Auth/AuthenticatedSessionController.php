<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();
        // $request->session()->regenerate();

        $user = $request->user();
        
        // Create token(Sanctum)
        $token = $user->createToken('auth_token')->plainTextToken;

        // return response()->noContent();
        return response()->json([
            'token' => $token,
            'user_id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'role' => $user->role,
            'username' => $user->username,
        ], 201);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): JsonResponse
    {
        // For Sanctum: Revoke all tokens for the user
        if ($request->user()) {
            $request->user()->tokens()->delete();
        }

        return response()->json(null, 204);
    }
}
