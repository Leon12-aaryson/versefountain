<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Academics - {{ config('app.name', 'VerseFountain') }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="antialiased bg-gray-50">
    <!-- Top Navigation Bar -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="container mx-auto px-3 md:px-4 lg:px-6 flex justify-between items-center h-14 md:h-16">
            <!-- Logo -->
            <div class="flex items-center space-x-2">
                <a href="/" class="text-primary text-xl md:text-2xl font-bold">VerseFountain</a>
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
    <div class="flex min-h-screen">
        <!-- Left Sidebar (Desktop Only) -->
        <div class="hidden md:block w-64 bg-white shadow-lg fixed h-full sidebar-scroll overflow-y-auto" style="top: 64px;">
            <div class="p-6">
                <!-- Navigation -->
                <nav class="space-y-2">
                    <a href="/" class="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                        <span>Home</span>
                    </a>
                    <a href="/poetry" class="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span>Poetry</span>
                    </a>
                    <a href="/books" class="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                        <span>Books</span>
                    </a>
                    <a href="/academics" class="flex items-center space-x-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg font-medium">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                        </svg>
                        <span>Academics</span>
                    </a>
                    <a href="/chatrooms" class="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                        <span>Chat Rooms</span>
                    </a>
                    <a href="/events" class="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span>Events</span>
                    </a>
                    <a href="/tickets" class="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
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

        <!-- Main Content Area -->
        <div class="flex-1 md:ml-64">
            <div class="py-6 px-4 sm:px-6 lg:px-8">
                <!-- Page Header -->
                <div class="mb-8">
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Academic Resources</h1>
                    <p class="text-gray-600">Enhance your literary knowledge with our comprehensive academic materials</p>
                </div>

                <!-- Featured Resources -->
                <div class="mb-8">
                    <h2 class="text-xl font-semibold text-gray-900 mb-4">Featured Resources</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                <!-- Course Categories -->
                <div class="mb-8">
                    <h2 class="text-xl font-semibold text-gray-900 mb-4">Course Categories</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
                            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                            <h3 class="font-semibold text-gray-900 mb-2">Poetry</h3>
                            <p class="text-gray-600 text-sm mb-4">12 courses available</p>
                            <button class="text-blue-600 text-sm font-medium hover:text-blue-700">Explore</button>
                        </div>

                        <div class="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
                            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                </svg>
                            </div>
                            <h3 class="font-semibold text-gray-900 mb-2">Literature</h3>
                            <p class="text-gray-600 text-sm mb-4">8 courses available</p>
                            <button class="text-blue-600 text-sm font-medium hover:text-blue-700">Explore</button>
                        </div>

                        <div class="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
                            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </div>
                            <h3 class="font-semibold text-gray-900 mb-2">Writing</h3>
                            <p class="text-gray-600 text-sm mb-4">15 courses available</p>
                            <button class="text-blue-600 text-sm font-medium hover:text-blue-700">Explore</button>
                        </div>

                        <div class="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
                            <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                                </svg>
                            </div>
                            <h3 class="font-semibold text-gray-900 mb-2">Research</h3>
                            <p class="text-gray-600 text-sm mb-4">6 courses available</p>
                            <button class="text-blue-600 text-sm font-medium hover:text-blue-700">Explore</button>
                        </div>
                    </div>
                </div>

                <!-- Recent Publications -->
                <div class="mb-8">
                    <h2 class="text-xl font-semibold text-gray-900 mb-4">Recent Publications</h2>
                    <div class="space-y-4">
                        <div class="bg-white rounded-lg shadow-sm p-6">
                            <div class="flex justify-between items-start mb-3">
                                <h3 class="text-lg font-semibold text-gray-900">The Evolution of Modern Poetry</h3>
                                <span class="text-xs text-gray-500">Published 3 days ago</span>
                            </div>
                            <p class="text-gray-600 mb-4">An in-depth analysis of how poetry has evolved from classical forms to contemporary expressions...</p>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                        <span class="text-blue-600 font-semibold text-xs">DP</span>
                                    </div>
                                    <span class="text-sm text-gray-700">Dr. Patricia Smith</span>
                                </div>
                                <button class="text-blue-600 text-sm font-medium hover:text-blue-700">Read Full Paper</button>
                            </div>
                        </div>

                        <div class="bg-white rounded-lg shadow-sm p-6">
                            <div class="flex justify-between items-start mb-3">
                                <h3 class="text-lg font-semibold text-gray-900">Literary Criticism in the Digital Age</h3>
                                <span class="text-xs text-gray-500">Published 1 week ago</span>
                            </div>
                            <p class="text-gray-600 mb-4">Exploring how digital platforms have transformed the way we analyze and critique literature...</p>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                                        <span class="text-green-600 font-semibold text-xs">MJ</span>
                                    </div>
                                    <span class="text-sm text-gray-700">Prof. Michael Johnson</span>
                                </div>
                                <button class="text-blue-600 text-sm font-medium hover:text-blue-700">Read Full Paper</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Enroll in Courses Button -->
                <div class="text-center">
                    <button class="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg">
                        Enroll in Courses
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Mobile Bottom Navigation -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div class="flex justify-around py-2">
            <a href="/" class="flex flex-col items-center py-2 px-3 text-gray-600">
                <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span class="text-xs">Home</span>
            </a>
            <a href="/poetry" class="flex flex-col items-center py-2 px-3 text-gray-600">
                <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span class="text-xs">Poetry</span>
            </a>
            <a href="/chatrooms" class="flex flex-col items-center py-2 px-3 text-gray-600">
                <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <span class="text-xs">Chat</span>
            </a>
            <a href="/events" class="flex flex-col items-center py-2 px-3 text-gray-600">
                <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span class="text-xs">Events</span>
            </a>
            <a href="#" class="flex flex-col items-center py-2 px-3 text-gray-600">
                <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span class="text-xs">Profile</span>
            </a>
        </div>
    </nav>

    <!-- Mobile Bottom Padding -->
    <div class="md:hidden h-16"></div>
</body>
</html> 