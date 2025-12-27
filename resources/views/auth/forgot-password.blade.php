@extends('layouts.auth')

@section('title', 'Forgot Password - VerseFountain')

@section('auth-content')
    <div class="bg-white rounded-md shadow-sm">
        <div class="p-6">
            <div class="mb-6">
                <h3 class="text-xl font-semibold text-gray-900">Forgot Password</h3>
                <p class="text-gray-600 mt-1">Enter your email address and we'll send you a link to reset your password.</p>
            </div>

            <!-- Session Status -->
            @if (session('status'))
                <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <p class="text-sm text-blue-800">{{ session('status') }}</p>
                </div>
            @endif

            <form method="POST" action="{{ route('password.email') }}" class="space-y-4">
                @csrf

                <!-- Email Address -->
                <div class="space-y-2">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input id="email" type="email" name="email" value="{{ old('email') }}" required autofocus 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none placeholder-gray-400"
                           placeholder="Enter your email">
                    @error('email')
                        <p class="text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Submit Button -->
                <button type="submit" 
                        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors focus:outline-none">
                    Send Password Reset Link
                </button>

                <!-- Back to Login -->
                <div class="text-center">
                    <a href="{{ route('login') }}" 
                       class="text-sm text-blue-600 hover:text-blue-700 underline">
                        Back to login
                    </a>
                </div>
            </form>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <p class="text-center text-xs text-gray-600">
                Remember your password? <a href="{{ route('login') }}" class="text-blue-600 hover:text-blue-700">Sign in here</a>
            </p>
        </div>
    </div>
@endsection
