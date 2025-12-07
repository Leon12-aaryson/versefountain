@extends('layouts.app')

@section('title', 'Welcome - VerseFountain')

@section('content')
<div class="min-h-screen bg-stone-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <!-- Hero Section -->
        <div class="bg-white border border-gray-200 overflow-hidden mb-10 sm:mb-12">
            <div class="relative flex flex-col md:block">
                <img
                    src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    alt="Library books on shelves"
                    class="w-full h-48 sm:h-56 md:h-64 lg:h-96 object-cover"
                />
                <div class="absolute inset-0 bg-black/60 md:bg-black/50 flex flex-col justify-end p-4 sm:p-6 md:p-8">
                    <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-white mb-2 sm:mb-3 tracking-wide">Welcome to VerseFountain</h1>
                    <p class="text-xs sm:text-sm md:text-base text-gray-200 max-w-full md:max-w-lg mb-4 sm:mb-5 leading-relaxed">Discover a world of poetry, books, and academic resources. Connect with a community of readers and writers.</p>
                    <div class="flex flex-wrap gap-2 sm:gap-3">
                        <a href="/poetry" class="bg-gray-800 hover:bg-gray-700 text-white text-xs sm:text-sm md:text-base py-2 px-4 sm:py-2.5 sm:px-5 md:py-3 md:px-6 font-normal transition-colors inline-flex items-center">
                            Explore Poetry
                        </a>
                        <a href="/books" class="bg-white hover:bg-gray-50 text-gray-800 text-xs sm:text-sm md:text-base py-2 px-4 sm:py-2.5 sm:px-5 md:py-3 md:px-6 font-normal transition-colors inline-flex items-center border border-gray-200">
                            Browse Books
                        </a>
                    </div>
                </div>
            </div>
        </div>

    <!-- Featured Sections -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-10 sm:mb-12">
        <!-- Poetry Section -->
        <div class="bg-white border border-gray-200 p-5 sm:p-6 hover:border-gray-300 transition-colors">
            <div class="flex items-center mb-4 sm:mb-5">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mr-3 sm:mr-4">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <h2 class="text-lg sm:text-xl font-light text-gray-900 tracking-wide">Poetry</h2>
            </div>
            <p class="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 leading-relaxed font-light">Explore beautiful poems from classic and contemporary poets. Discover new voices and share your own creations.</p>
            <a href="/poetry" class="inline-flex items-center text-gray-700 hover:text-gray-900 text-sm sm:text-base font-normal uppercase tracking-wide">
                Browse Poetry
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7"></path>
                </svg>
            </a>
        </div>

        <!-- Books Section -->
        <div class="bg-white border border-gray-200 p-5 sm:p-6 hover:border-gray-300 transition-colors">
            <div class="flex items-center mb-4 sm:mb-5">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mr-3 sm:mr-4">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <h2 class="text-lg sm:text-xl font-light text-gray-900 tracking-wide">Books</h2>
            </div>
            <p class="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 leading-relaxed font-light">Access a vast collection of books, from literary classics to modern bestsellers. Find your next great read.</p>
            <a href="/books" class="inline-flex items-center text-gray-700 hover:text-gray-900 text-sm sm:text-base font-normal uppercase tracking-wide">
                Browse Books
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7"></path>
                </svg>
            </a>
        </div>

        <!-- Academics Section -->
        <div class="bg-white border border-gray-200 p-5 sm:p-6 hover:border-gray-300 transition-colors">
            <div class="flex items-center mb-4 sm:mb-5">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mr-3 sm:mr-4">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                    </svg>
                </div>
                <h2 class="text-lg sm:text-xl font-light text-gray-900 tracking-wide">Academics</h2>
            </div>
            <p class="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 leading-relaxed font-light">Access academic resources, research papers, and educational materials. Enhance your learning journey.</p>
            <a href="/academics" class="inline-flex items-center text-gray-700 hover:text-gray-900 text-sm sm:text-base font-normal uppercase tracking-wide">
                Browse Academics
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7"></path>
                </svg>
            </a>
        </div>
    </div>

    <!-- Events Section -->
    <div class="mb-10 sm:mb-12">
        <div class="bg-white border border-gray-200 p-5 sm:p-6 lg:p-8">
            <div class="flex items-center justify-between mb-6 sm:mb-8">
                <h2 class="text-xl sm:text-2xl font-light text-gray-800 tracking-wide">Upcoming Events</h2>
                <a href="/events" class="text-xs text-gray-600 hover:text-gray-900 font-normal uppercase tracking-wide">View All →</a>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                <!-- Event Card 1 -->
                <div class="border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                    <div class="flex items-center mb-3">
                        <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 flex items-center justify-center mr-3">
                            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-sm sm:text-base font-normal text-gray-900">Poetry Reading Night</h3>
                            <p class="text-xs sm:text-sm text-gray-500">July 25, 2024 • 7:00 PM</p>
                        </div>
                    </div>
                    <p class="text-xs sm:text-sm text-gray-600 mb-3 font-light leading-relaxed">Join us for an evening of poetry readings from local and international poets.</p>
                    <a href="/events" class="text-xs text-gray-700 hover:text-gray-900 font-normal uppercase tracking-wide">Learn More →</a>
                </div>

                <!-- Event Card 2 -->
                <div class="border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                    <div class="flex items-center mb-3">
                        <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 flex items-center justify-center mr-3">
                            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-sm sm:text-base font-normal text-gray-900">Book Club Meeting</h3>
                            <p class="text-xs sm:text-sm text-gray-500">July 28, 2024 • 6:30 PM</p>
                        </div>
                    </div>
                    <p class="text-xs sm:text-sm text-gray-600 mb-3 font-light leading-relaxed">Discuss the latest book selection with fellow literature enthusiasts.</p>
                    <a href="/events" class="text-xs text-gray-700 hover:text-gray-900 font-normal uppercase tracking-wide">Learn More →</a>
                </div>

                <!-- Event Card 3 -->
                <div class="border border-gray-200 p-4 hover:border-gray-300 transition-colors sm:col-span-2 lg:col-span-1">
                    <div class="flex items-center mb-3">
                        <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 flex items-center justify-center mr-3">
                            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-sm sm:text-base font-normal text-gray-900">Writing Workshop</h3>
                            <p class="text-xs sm:text-sm text-gray-500">August 2, 2024 • 2:00 PM</p>
                        </div>
                    </div>
                    <p class="text-xs sm:text-sm text-gray-600 mb-3 font-light leading-relaxed">Improve your writing skills with our expert-led creative writing workshop.</p>
                    <a href="/events" class="text-xs text-gray-700 hover:text-gray-900 font-normal uppercase tracking-wide">Learn More →</a>
                </div>
            </div>
        </div>
    </div>

    <!-- Call to Action -->
    <div class="bg-gray-800 border border-gray-700 p-6 sm:p-8 lg:p-12 text-center">
        <h2 class="text-xl sm:text-2xl lg:text-3xl font-light text-white mb-3 sm:mb-4 tracking-wide">Join Our Community</h2>
        <p class="text-sm sm:text-base lg:text-lg text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed font-light">Connect with fellow poetry enthusiasts, discover new authors, and participate in literary events. Start your journey today!</p>
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a href="/register" class="bg-white text-gray-800 px-6 py-3 font-normal hover:bg-gray-100 transition-colors text-sm sm:text-base">
                Get Started
            </a>
            <a href="/poetry" class="border border-white text-white px-6 py-3 font-normal hover:bg-white hover:text-gray-800 transition-colors text-sm sm:text-base">
                Explore Poetry
            </a>
        </div>
    </div>
    </div>
</div>
@endsection 