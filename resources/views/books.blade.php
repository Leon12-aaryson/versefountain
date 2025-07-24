<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Books - {{ config('app.name', 'VerseFountain') }}</title>
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
                    <a href="/books" class="flex items-center space-x-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg font-medium">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                        <span>Books</span>
                    </a>
                    <a href="/academics" class="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
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
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Books Library</h1>
                    <p class="text-gray-600">Explore our vast collection of literature, poetry, and academic works</p>
                </div>

                <!-- Search and Filters -->
                <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex-1">
                            <input type="text" placeholder="Search books, authors..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div class="flex gap-2">
                            <select class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option>All Genres</option>
                                <option>Fiction</option>
                                <option>Poetry</option>
                                <option>Non-Fiction</option>
                                <option>Academic</option>
                            </select>
                            <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Featured Books -->
                <div class="mb-8">
                    <h2 class="text-xl font-semibold text-gray-900 mb-4">Featured Books</h2>
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

                <!-- Recent Additions -->
                <div class="mb-8">
                    <h2 class="text-xl font-semibold text-gray-900 mb-4">Recent Additions</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div class="bg-white rounded-lg shadow-sm p-6">
                            <div class="flex items-start space-x-4">
                                <div class="w-16 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded flex items-center justify-center flex-shrink-0">
                                    <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                    </svg>
                                </div>
                                <div class="flex-1">
                                    <h3 class="font-semibold text-gray-900 mb-1">The Alchemist</h3>
                                    <p class="text-gray-600 text-sm mb-2">Paulo Coelho</p>
                                    <p class="text-gray-500 text-xs mb-3">Added 2 days ago</p>
                                    <button class="text-blue-600 text-sm font-medium hover:text-blue-700">Read Now</button>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-lg shadow-sm p-6">
                            <div class="flex items-start space-x-4">
                                <div class="w-16 h-20 bg-gradient-to-br from-green-100 to-teal-100 rounded flex items-center justify-center flex-shrink-0">
                                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                    </svg>
                                </div>
                                <div class="flex-1">
                                    <h3 class="font-semibold text-gray-900 mb-1">The Catcher in the Rye</h3>
                                    <p class="text-gray-600 text-sm mb-2">J.D. Salinger</p>
                                    <p class="text-gray-500 text-xs mb-3">Added 3 days ago</p>
                                    <button class="text-blue-600 text-sm font-medium hover:text-blue-700">Read Now</button>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-lg shadow-sm p-6">
                            <div class="flex items-start space-x-4">
                                <div class="w-16 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded flex items-center justify-center flex-shrink-0">
                                    <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                    </svg>
                                </div>
                                <div class="flex-1">
                                    <h3 class="font-semibold text-gray-900 mb-1">Lord of the Flies</h3>
                                    <p class="text-gray-600 text-sm mb-2">William Golding</p>
                                    <p class="text-gray-500 text-xs mb-3">Added 5 days ago</p>
                                    <button class="text-blue-600 text-sm font-medium hover:text-blue-700">Read Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Browse All Button -->
                <div class="text-center">
                    <button class="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg">
                        Browse All Books
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