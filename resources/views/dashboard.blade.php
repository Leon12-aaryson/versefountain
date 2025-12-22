@extends('layouts.app')

@section('title', 'Dashboard - VerseFountain')

@section('content')
    <div class="min-h-screen bg-stone-50">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <!-- Page Header -->
            <div class="mb-10 sm:mb-12">
                <h1 class="text-3xl sm:text-4xl font-light text-gray-800 mb-2 tracking-wide">Dashboard</h1>
                <p class="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">Welcome back! Here's an overview of
                    your activity.</p>
            </div>

            <!-- Dashboard Content -->
            <div class="bg-white border-2 border-gray-200 rounded-md p-6 sm:p-8">
                <div class="text-gray-900 font-light">
                    {{ __("You're logged in!") }}
                </div>
            </div>
        </div>
    </div>
@endsection