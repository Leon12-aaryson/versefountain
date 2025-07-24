<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'VerseFountain') }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <!-- Heroicons for icons -->
    <script src="https://unpkg.com/@heroicons/react@2.0.18/24/outline/esm/index.js"></script>
</head>
<body class="antialiased bg-gray-50">
    <div class="min-h-screen flex">
        <!-- Left Sidebar -->
        <div class="w-64 bg-white shadow-lg fixed h-full sidebar-scroll overflow-y-auto">
            <div class="p-6">
                <!-- Logo -->
                <div class="mb-8">
                    <h1 class="text-2xl font-bold text-blue-600">VerseFountain</h1>
                </div>

                <!-- Navigation -->
                <nav class="space-y-2">
                    <a href="#" class="flex items-center space-x-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg font-medium">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                        <span>Home</span>
                    </a>
                    <a href="#" class="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span>Poetry</span>
                    </a>
                    <a href="#" class="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                        <span>Books</span>
                    </a>
                    <a href="#" class="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                        </svg>
                        <span>Academics</span>
                    </a>
                    <a href="#" class="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                        <span>Chat Rooms</span>
                    </a>
                    <a href="#" class="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span>Events</span>
                    </a>
                    <a href="#" class="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                        </svg>
                        <span>Tickets</span>
                    </a>
                </nav>

                <!-- Subscription Section -->
                <div class="mt-8">
                    <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">SUBSCRIPTIONS</h3>
                    <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                        <h4 class="font-semibold text-gray-900 mb-2">Upgrade to Premium</h4>
                        <p class="text-sm text-gray-600 mb-3">Get unlimited access to all books and premium features.</p>
                        <button class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="ml-64 flex-1">
            <!-- Header -->
            <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex-1 max-w-lg">
                        <div class="relative">
                            <input type="text" placeholder="Search books, poetry, events..." 
                                   class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="ml-4">
                        <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            A
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Content Area -->
            <main class="p-6">
                <!-- Feature Cards Section -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <!-- Chat Rooms Card -->
                    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 card-hover">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                </svg>
                            </div>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Chat Rooms</h3>
                        <p class="text-gray-600 mb-4">Join real-time discussions about books and poetry</p>
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            Explore Chat Rooms
                        </button>
                    </div>

                    <!-- Share Your Poetry Card -->
                    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 card-hover">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </div>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Share Your Poetry</h3>
                        <p class="text-gray-600 mb-4">Submit your own poetry and get feedback from the community</p>
                        <button class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                            Submit Poetry
                        </button>
                    </div>

                    <!-- Attend Events Card -->
                    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 card-hover">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Attend Events</h3>
                        <p class="text-gray-600 mb-4">Join poetry readings, book launches, and author meetups</p>
                        <button class="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                            View Events
                        </button>
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
            </main>
        </div>
    </div>
</body>
</html> 