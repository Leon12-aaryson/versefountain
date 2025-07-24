@extends('layouts.app')

@section('title', 'Home - VerseFountain')

@section('content')
    <!-- Hero Section - Improved for mobile -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
        <div class="relative flex flex-col md:block">
            <img 
                src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Library books on shelves" 
                class="w-full h-48 md:h-64 lg:h-96 object-cover" 
            />
            <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent md:bg-gradient-to-r md:from-black/70 md:to-transparent flex flex-col justify-end p-4 sm:p-6 md:p-8">
                <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">Welcome to VerseFountain</h1>
                <p class="text-xs sm:text-sm md:text-base text-gray-200 max-w-full md:max-w-lg">Discover a world of poetry, books, and academic resources. Connect with a community of readers and writers.</p>
                <div class="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3">
                    <a href="/poetry" class="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm md:text-base py-1 px-3 h-auto sm:py-2 sm:px-4 md:h-10 rounded-lg font-medium transition-colors inline-flex items-center">
                        Explore Poetry
                    </a>
                    <a href="/books" class="bg-white hover:bg-gray-100 text-gray-800 text-xs sm:text-sm md:text-base py-1 px-3 h-auto sm:py-2 sm:px-4 md:h-10 rounded-lg font-medium transition-colors inline-flex items-center">
                        Browse Books
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Featured Sections -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <!-- Poetry Section -->
        <div class="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
            <div class="flex items-center mb-6">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900">Poetry</h2>
            </div>
            <p class="text-gray-600 mb-6">Discover beautiful poems from talented writers around the world. Share your own poetry and get feedback from the community.</p>
            <a href="/poetry" class="inline-flex items-center text-blue-600 font-medium hover:text-blue-700">
                Explore Poetry
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </a>
        </div>

        <!-- Events Section -->
        <div class="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
            <div class="flex items-center mb-6">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900">Events</h2>
            </div>
            <p class="text-gray-600 mb-6">Join poetry readings, book launches, and literary events. Connect with fellow poetry enthusiasts in person.</p>
            <a href="/events" class="inline-flex items-center text-purple-600 font-medium hover:text-purple-700">
                View Events
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </a>
        </div>
    </div>

    <!-- Books Grid -->
    <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Featured Books</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div class="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <svg class="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <div class="p-4">
                    <h3 class="font-semibold text-gray-900 mb-1">The Great Gatsby</h3>
                    <p class="text-gray-600 text-sm mb-2">F. Scott Fitzgerald</p>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">Fiction</span>
                        <button class="text-blue-600 text-sm font-medium hover:text-blue-700">Read</button>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div class="h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                    <svg class="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <div class="p-4">
                    <h3 class="font-semibold text-gray-900 mb-1">To Kill a Mockingbird</h3>
                    <p class="text-gray-600 text-sm mb-2">Harper Lee</p>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">Fiction</span>
                        <button class="text-blue-600 text-sm font-medium hover:text-blue-700">Read</button>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div class="h-48 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                    <svg class="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <div class="p-4">
                    <h3 class="font-semibold text-gray-900 mb-1">1984</h3>
                    <p class="text-gray-600 text-sm mb-2">George Orwell</p>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">Fiction</span>
                        <button class="text-blue-600 text-sm font-medium hover:text-blue-700">Read</button>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div class="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <svg class="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <div class="p-4">
                    <h3 class="font-semibold text-gray-900 mb-1">Pride and Prejudice</h3>
                    <p class="text-gray-600 text-sm mb-2">Jane Austen</p>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">Fiction</span>
                        <button class="text-blue-600 text-sm font-medium hover:text-blue-700">Read</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Academic Resources -->
    <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Academic Resources</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                    </div>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Poetry Analysis Guide</h3>
                <p class="text-gray-600 mb-4">Learn how to analyze and interpret poetry with our comprehensive guide</p>
                <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Read Guide
                </button>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </div>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Creative Writing Workshop</h3>
                <p class="text-gray-600 mb-4">Join our online workshop to improve your creative writing skills</p>
                <button class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    Join Workshop
                </button>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Literature Review</h3>
                <p class="text-gray-600 mb-4">Access our curated collection of literary reviews and critiques</p>
                <button class="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                    Browse Reviews
                </button>
            </div>
        </div>
    </div>

    <!-- Subscription Plans -->
    <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Subscription Plans</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-200">
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Free</h3>
                <p class="text-3xl font-bold text-gray-900 mb-4">$0<span class="text-lg text-gray-600">/month</span></p>
                <ul class="space-y-2 mb-6">
                    <li class="flex items-center text-gray-600">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Access to basic poetry
                    </li>
                    <li class="flex items-center text-gray-600">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Community chat rooms
                    </li>
                    <li class="flex items-center text-gray-600">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Basic events access
                    </li>
                </ul>
                <button class="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                    Get Started
                </button>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 border-2 border-blue-500 relative">
                <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">Popular</span>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Premium</h3>
                <p class="text-3xl font-bold text-gray-900 mb-4">$9.99<span class="text-lg text-gray-600">/month</span></p>
                <ul class="space-y-2 mb-6">
                    <li class="flex items-center text-gray-600">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Everything in Free
                    </li>
                    <li class="flex items-center text-gray-600">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Unlimited book access
                    </li>
                    <li class="flex items-center text-gray-600">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Priority event tickets
                    </li>
                    <li class="flex items-center text-gray-600">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Advanced analytics
                    </li>
                </ul>
                <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Upgrade Now
                </button>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-200">
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Pro</h3>
                <p class="text-3xl font-bold text-gray-900 mb-4">$19.99<span class="text-lg text-gray-600">/month</span></p>
                <ul class="space-y-2 mb-6">
                    <li class="flex items-center text-gray-600">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Everything in Premium
                    </li>
                    <li class="flex items-center text-gray-600">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Exclusive workshops
                    </li>
                    <li class="flex items-center text-gray-600">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Personal mentoring
                    </li>
                    <li class="flex items-center text-gray-600">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Publishing opportunities
                    </li>
                </ul>
                <button class="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                    Get Pro
                </button>
            </div>
        </div>
    </div>
@endsection 