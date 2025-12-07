@extends('layouts.auth')

@section('title', 'Register - VerseFountain')

@section('auth-content')
    <x-auth-card title="Welcome to VerseFountain" description="Create a new account to join our community" activeTab="register">
        <form method="POST" action="{{ route('register') }}" class="space-y-5">
            @csrf

            <!-- Name -->
            <div class="space-y-2">
                <label for="name" class="block text-xs font-normal text-gray-600 uppercase tracking-wide">Name</label>
                <input id="name" type="text" name="name" value="{{ old('name') }}" required autofocus autocomplete="name" 
                       class="w-full px-3 py-2 border border-gray-300 focus:border-gray-500 bg-white focus:outline-none placeholder-gray-400 text-sm"
                       placeholder="Enter your full name">
                @error('name')
                    <p class="text-sm text-gray-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Email Address -->
            <div class="space-y-2">
                <label for="email" class="block text-xs font-normal text-gray-600 uppercase tracking-wide">Email</label>
                <input id="email" type="email" name="email" value="{{ old('email') }}" required autocomplete="username" 
                       class="w-full px-3 py-2 border border-gray-300 focus:border-gray-500 bg-white focus:outline-none placeholder-gray-400 text-sm"
                       placeholder="you@example.com">
                @error('email')
                    <p class="text-sm text-gray-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Password -->
            <div class="space-y-2">
                <label for="password" class="block text-xs font-normal text-gray-600 uppercase tracking-wide">Password</label>
                <input id="password" type="password" name="password" required autocomplete="new-password"
                       class="w-full px-3 py-2 border border-gray-300 focus:border-gray-500 bg-white focus:outline-none placeholder-gray-400 text-sm"
                       placeholder="Create a password">
                @error('password')
                    <p class="text-sm text-gray-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Confirm Password -->
            <div class="space-y-2">
                <label for="password_confirmation" class="block text-xs font-normal text-gray-600 uppercase tracking-wide">Confirm Password</label>
                <input id="password_confirmation" type="password" name="password_confirmation" required autocomplete="new-password"
                       class="w-full px-3 py-2 border border-gray-300 focus:border-gray-500 bg-white focus:outline-none placeholder-gray-400 text-sm"
                       placeholder="Confirm your password">
                @error('password_confirmation')
                    <p class="text-sm text-gray-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Submit Button -->
            <button type="submit" 
                    class="w-full bg-gray-800 text-white py-2.5 px-4 font-normal hover:bg-gray-700 transition-colors text-sm">
                Create Account
            </button>

            <!-- Login Link -->
            <div class="text-center">
                <a href="{{ route('login') }}" 
                   class="text-sm text-gray-600 hover:text-gray-900 font-light">
                    Already registered?
                </a>
            </div>
        </form>
    </x-auth-card>
@endsection
