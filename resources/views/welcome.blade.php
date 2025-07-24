<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'VerseFountain') }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="antialiased bg-gray-50">
    <!-- Top Navigation Bar -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="container mx-auto px-3 md:px-4 lg:px-6 flex justify-between items-center h-14 md:h-16">
            <!-- Logo -->
            <div class="flex items-center space-x-2">
                <h1 class="text-primary text-xl md:text-2xl font-bold">VerseFountain</h1>
            </div>

            <!-- User Avatar -->
            <div class="flex items-center space-x-2 md:space-x-4">
                <div class="w-7 h-7 md:w-8 md:h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs md:text-sm font-semibold">
                    A
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content Area -->
    <div class="py-6 px-4 sm:px-6 lg:px-8">
        <!-- Hero Section -->
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
                        <button class="bg-primary hover:bg-blue-700 text-white text-xs sm:text-sm md:text-base py-1 px-3 h-auto sm:py-2 sm:px-4 md:h-10 rounded-lg font-medium transition-colors">
                            Explore Poetry
                        </button>
                        <button class="bg-white hover:bg-gray-100 text-gray-800 text-xs sm:text-sm md:text-base py-1 px-3 h-auto sm:py-2 sm:px-4 md:h-10 rounded-lg font-medium transition-colors">
                            Browse Books
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Featured Sections -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Featured Poetry -->
            <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold text-gray-800">Featured Poetry</h2>
                    <span class="text-primary text-sm font-medium cursor-pointer">View All</span>
                </div>
                <div class="space-y-4">
                    <div class="border-b border-gray-100 pb-4">
                        <div class="cursor-pointer">
                            <h3 class="text-gray-800 font-medium hover:text-primary mb-1">The Road Not Taken</h3>
                            <p class="text-gray-700 italic mb-2">Two roads diverged in a yellow wood, And sorry I could not travel both And be one traveler, long I stood...</p>
                        </div>
                        <div class="flex justify-between items-center">
                            <div class="flex items-center">
                                <div class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-2">
                                    R
                                </div>
                                <span class="text-sm font-medium text-gray-800">Robert Frost</span>
                            </div>
                        </div>
                    </div>
                    <div class="border-b border-gray-100 pb-4">
                        <div class="cursor-pointer">
                            <h3 class="text-gray-800 font-medium hover:text-primary mb-1">Still I Rise</h3>
                            <p class="text-gray-700 italic mb-2">You may write me down in history With your bitter, twisted lies, You may trod me in the very dirt...</p>
                        </div>
                        <div class="flex justify-between items-center">
                            <div class="flex items-center">
                                <div class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-2">
                                    M
                                </div>
                                <span class="text-sm font-medium text-gray-800">Maya Angelou</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Upcoming Events -->
            <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg sm:text-xl font-semibold text-gray-800">Upcoming Events</h2>
                    <span class="text-primary text-xs sm:text-sm font-medium cursor-pointer">View All</span>
                </div>
                <div class="space-y-4">
                    <div class="border border-gray-200 rounded-lg p-4">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-medium text-gray-800 text-sm">Poetry Reading Night</h3>
                            <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Free</span>
                        </div>
                        <p class="text-gray-600 text-xs mb-2">Join us for an evening of poetry readings from local authors</p>
                        <div class="flex items-center text-xs text-gray-500">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            Dec 15, 2024
                        </div>
                    </div>
                    <div class="border border-gray-200 rounded-lg p-4">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-medium text-gray-800 text-sm">Book Launch: "Whispers of the Heart"</h3>
                            <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">$15</span>
                        </div>
                        <p class="text-gray-600 text-xs mb-2">Celebrate the release of Sarah Johnson's latest poetry collection</p>
                        <div class="flex items-center text-xs text-gray-500">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            Dec 20, 2024
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Books Section -->
        <div class="mb-8">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg sm:text-xl font-semibold text-gray-800">Popular Books</h2>
                <span class="text-primary text-xs sm:text-sm font-medium cursor-pointer">Browse Library</span>
            </div>
            <div class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div class="h-48 bg-gray-200 flex items-center justify-center">
                        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                    </div>
                    <div class="p-4">
                        <h3 class="font-medium text-gray-800 text-sm mb-1">The Great Gatsby</h3>
                        <p class="text-gray-600 text-xs">F. Scott Fitzgerald</p>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div class="h-48 bg-gray-200 flex items-center justify-center">
                        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                    </div>
                    <div class="p-4">
                        <h3 class="font-medium text-gray-800 text-sm mb-1">To Kill a Mockingbird</h3>
                        <p class="text-gray-600 text-xs">Harper Lee</p>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div class="h-48 bg-gray-200 flex items-center justify-center">
                        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                    </div>
                    <div class="p-4">
                        <h3 class="font-medium text-gray-800 text-sm mb-1">1984</h3>
                        <p class="text-gray-600 text-xs">George Orwell</p>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div class="h-48 bg-gray-200 flex items-center justify-center">
                        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                    </div>
                    <div class="p-4">
                        <h3 class="font-medium text-gray-800 text-sm mb-1">Pride and Prejudice</h3>
                        <p class="text-gray-600 text-xs">Jane Austen</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Academic Resources Section -->
        <div class="mb-8">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg sm:text-xl font-semibold text-gray-800">Academic Resources</h2>
                <span class="text-primary text-xs sm:text-sm font-medium cursor-pointer">View All</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="bg-white rounded-xl shadow-sm p-6">
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

                <div class="bg-white rounded-xl shadow-sm p-6">
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

                <div class="bg-white rounded-xl shadow-sm p-6">
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

        <!-- Subscription Plans Section -->
        <div class="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 rounded-xl p-8 text-white">
            <div class="text-center mb-8">
                <h2 class="text-3xl font-bold mb-2">Upgrade Your Experience</h2>
                <p class="text-blue-100">Get unlimited access to all premium features with a subscription plan</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Free Plan -->
                <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <h3 class="text-xl font-semibold mb-2">Free</h3>
                    <p class="text-blue-100 text-sm mb-4">Basic access for casual readers</p>
                    <ul class="space-y-2 mb-6">
                        <li class="flex items-center text-sm">
                            <svg class="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            Read public poetry and books
                        </li>
                        <li class="flex items-center text-sm">
                            <svg class="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            Browse event listings
                        </li>
                        <li class="flex items-center text-sm">
                            <svg class="w-4 h-4 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                            </svg>
                            No interaction features
                        </li>
                    </ul>
                    <button class="w-full bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                        Current Plan
                    </button>
                </div>

                <!-- Standard Plan -->
                <div class="bg-white/20 backdrop-blur-sm rounded-lg p-6 border border-white/30 relative">
                    <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span class="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">POPULAR</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Standard</h3>
                    <p class="text-blue-100 text-sm mb-2">Full access for dedicated readers</p>
                    <p class="text-2xl font-bold mb-4">$4.99<span class="text-sm font-normal text-blue-100">/month</span></p>
                    <ul class="space-y-2 mb-6">
                        <li class="flex items-center text-sm">
                            <svg class="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            Full library access
                        </li>
                        <li class="flex items-center text-sm">
                            <svg class="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            Participate in chat rooms
                        </li>
                        <li class="flex items-center text-sm">
                            <svg class="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            Submit your own poetry
                        </li>
                    </ul>
                    <button class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Subscribe Now
                    </button>
                </div>

                <!-- Premium Plan -->
                <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <h3 class="text-xl font-semibold mb-2">Premium</h3>
                    <p class="text-blue-100 text-sm mb-2">Ultimate experience for enthusiasts</p>
                    <p class="text-2xl font-bold mb-4">$9.99<span class="text-sm font-normal text-blue-100">/month</span></p>
                    <ul class="space-y-2 mb-6">
                        <li class="flex items-center text-sm">
                            <svg class="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            Everything in Standard
                        </li>
                        <li class="flex items-center text-sm">
                            <svg class="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            Create private chat rooms
                        </li>
                        <li class="flex items-center text-sm">
                            <svg class="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            Event ticket discounts
                        </li>
                    </ul>
                    <button class="w-full bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                        Upgrade
                    </button>
                </div>
            </div>
        </div>
    </div>
</body>
</html> 