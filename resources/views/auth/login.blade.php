@extends('layouts.auth')

@section('title', 'Login - VerseFountain')

@section('auth-content')
    <x-auth-card title="Welcome to VerseFountain" description="Sign in to your account to continue" activeTab="login">
        <!-- Session Status -->
        @if (session('status'))
            <div class="mb-4 p-4 bg-gray-50 border border-gray-200">
                <p class="text-sm text-gray-700 font-light">{{ session('status') }}</p>
            </div>
        @endif

        <form method="POST" action="{{ route('login') }}" class="space-y-5">
            @csrf

            <!-- Email Address -->
            <div class="space-y-2">
                <label for="email" class="block text-xs font-normal text-gray-600 uppercase tracking-wide">Email</label>
                <input id="email" type="email" name="email" value="{{ old('email') }}" required autofocus autocomplete="username" 
                       class="w-full px-3 py-2 border-2 border-gray-300 focus:border-blue-600 bg-white focus:outline-none placeholder-gray-400 text-sm rounded-md transition-colors"
                       placeholder="Enter your email">
                @error('email')
                    <p class="text-sm text-gray-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Password -->
            <div class="space-y-2">
                <label for="password" class="block text-xs font-normal text-gray-600 uppercase tracking-wide">Password</label>
                <input id="password" type="password" name="password" required autocomplete="current-password"
                       class="w-full px-3 py-2 border-2 border-gray-300 focus:border-blue-600 bg-white focus:outline-none placeholder-gray-400 text-sm rounded-md transition-colors"
                       placeholder="Enter your password">
                @error('password')
                    <p class="text-sm text-gray-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Remember Me -->
            <div class="flex items-center">
                <input id="remember_me" type="checkbox" name="remember" 
                       class="h-4 w-4 text-gray-800 focus:ring-gray-500 border-gray-300">
                <label for="remember_me" class="ml-2 block text-sm text-gray-600 font-light">
                    Remember me
                </label>
            </div>

            <!-- Submit Button -->
            <button type="submit" 
                    class="w-full bg-blue-600 text-white py-2.5 px-4 font-normal hover:bg-blue-700 transition-colors text-sm rounded-md">
                Sign In
            </button>

            <!-- Forgot Password -->
            @if (Route::has('password.request'))
                <div class="text-center">
                    <a href="{{ route('password.request') }}" 
                       class="text-sm text-gray-600 hover:text-gray-900 font-light">
                        Forgot your password?
                    </a>
                </div>
            @endif
        </form>
    </x-auth-card>
@endsection
