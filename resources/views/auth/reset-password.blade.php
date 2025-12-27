@extends('layouts.auth')

@section('title', 'Reset Password - VerseFountain')

@section('auth-content')
    <div class="bg-white rounded-md shadow-sm">
        <div class="p-6">
            <div class="mb-6">
                <h3 class="text-xl font-semibold text-gray-900">Reset Password</h3>
                <p class="text-gray-600 mt-1">Enter your new password below.</p>
            </div>

            <form method="POST" action="{{ route('password.store') }}" class="space-y-4">
                @csrf

                <!-- Password Reset Token -->
                <input type="hidden" name="token" value="{{ $request->route('token') }}">

                <!-- Email Address -->
                <div class="space-y-2">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input id="email" type="email" name="email" value="{{ old('email', $request->email) }}" required autofocus 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none placeholder-gray-400"
                           placeholder="Enter your email">
                    @error('email')
                        <p class="text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Password -->
                <div class="space-y-2">
                    <label for="password" class="block text-sm font-medium text-gray-700">New Password</label>
                    <input id="password" type="password" name="password" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none placeholder-gray-400"
                           placeholder="Enter new password">
                    @error('password')
                        <p class="text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Confirm Password -->
                <div class="space-y-2">
                    <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input id="password_confirmation" type="password" name="password_confirmation" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none placeholder-gray-400"
                           placeholder="Confirm new password">
                    @error('password_confirmation')
                        <p class="text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Submit Button -->
                <button type="submit" 
                        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors focus:outline-none">
                    Reset Password
                </button>
            </form>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <p class="text-center text-xs text-gray-600">
                Remember your password? <a href="{{ route('login') }}" class="text-blue-600 hover:text-blue-700">Sign in here</a>
            </p>
        </div>
    </div>
@endsection
