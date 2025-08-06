@extends('layouts.app')

@section('title', 'Chatrooms - VerseFountain')

@section('content')
<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <!-- Page Header -->
    <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Chatrooms</h1>
        <p class="text-sm sm:text-base text-gray-600">Connect with fellow poetry enthusiasts and writers</p>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Search -->
            <div class="sm:col-span-2 lg:col-span-1">
                <label for="search" class="block text-sm font-medium text-gray-700 mb-2">Search Chatrooms</label>
                <div class="relative">
                    <input type="text" id="search" placeholder="Search chatrooms or topics..." 
                           class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Category Filter -->
            <div>
                <label for="category" class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select id="category" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base">
                    <option value="">All Categories</option>
                    <option value="general">General Discussion</option>
                    <option value="poetry">Poetry</option>
                    <option value="writing">Writing Tips</option>
                    <option value="books">Book Discussion</option>
                </select>
            </div>

            <!-- Sort By -->
            <div>
                <label for="sort" class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select id="sort" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base">
                    <option value="active">Most Active</option>
                    <option value="recent">Recently Created</option>
                    <option value="members">Most Members</option>
                </select>
            </div>
        </div>
    </div>

    <!-- Featured Chatrooms -->
    <div class="mb-8 sm:mb-12">
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Featured Chatrooms</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div class="h-40 sm:h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <svg class="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                </div>
                <div class="p-4 sm:p-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Poetry
                        </span>
                        <span class="text-xs text-gray-500">1.2k members</span>
                    </div>
                    <h3 class="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Poetry Enthusiasts</h3>
                    <p class="text-gray-600 text-xs sm:text-sm mb-3">Share and discuss your favorite poems</p>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">Active now</span>
                        <button class="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors">
                            Join
                        </button>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div class="h-40 sm:h-48 bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
                    <svg class="w-12 h-12 sm:w-16 sm:h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                </div>
                <div class="p-4 sm:p-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Writing Tips
                        </span>
                        <span class="text-xs text-gray-500">856 members</span>
                    </div>
                    <h3 class="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Writing Workshop</h3>
                    <p class="text-gray-600 text-xs sm:text-sm mb-3">Get feedback on your writing</p>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">15 min ago</span>
                        <button class="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors">
                            Join
                        </button>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div class="h-40 sm:h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <svg class="w-12 h-12 sm:w-16 sm:h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <div class="p-4 sm:p-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Book Discussion
                        </span>
                        <span class="text-xs text-gray-500">634 members</span>
                    </div>
                    <h3 class="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Book Club</h3>
                    <p class="text-gray-600 text-xs sm:text-sm mb-3">Discuss your favorite books</p>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">1 hour ago</span>
                        <button class="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors">
                            Join
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Active Chatrooms -->
    <div class="mb-8 sm:mb-12">
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Active Chatrooms</h2>
        <div class="space-y-4 sm:space-y-6">
            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between mb-2">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                General Discussion
                            </span>
                            <span class="text-xs text-gray-500">2.1k members</span>
                        </div>
                        <h3 class="font-semibold text-gray-900 text-sm sm:text-base mb-1">General Poetry Discussion</h3>
                        <p class="text-gray-600 text-xs sm:text-sm mb-3">Open discussion about all things poetry</p>
                        <div class="flex items-center justify-between">
                            <span class="text-xs text-gray-500">Active now • 45 messages today</span>
                            <button class="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors">
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between mb-2">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Writing Tips
                            </span>
                            <span class="text-xs text-gray-500">1.5k members</span>
                        </div>
                        <h3 class="font-semibold text-gray-900 text-sm sm:text-base mb-1">Creative Writing Tips</h3>
                        <p class="text-gray-600 text-xs sm:text-sm mb-3">Share writing techniques and advice</p>
                        <div class="flex items-center justify-between">
                            <span class="text-xs text-gray-500">5 min ago • 23 messages today</span>
                            <button class="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors">
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between mb-2">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Book Discussion
                            </span>
                            <span class="text-xs text-gray-500">987 members</span>
                        </div>
                        <h3 class="font-semibold text-gray-900 text-sm sm:text-base mb-1">Classic Literature</h3>
                        <p class="text-gray-600 text-xs sm:text-sm mb-3">Discuss classic books and authors</p>
                        <div class="flex items-center justify-between">
                            <span class="text-xs text-gray-500">30 min ago • 12 messages today</span>
                            <button class="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors">
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Chatroom Categories -->
    <div class="mb-8 sm:mb-12">
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Browse by Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900 text-sm sm:text-base">General</h3>
                <p class="text-xs sm:text-sm text-gray-500">15 rooms</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900 text-sm sm:text-base">Poetry</h3>
                <p class="text-xs sm:text-sm text-gray-500">8 rooms</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900 text-sm sm:text-base">Writing Tips</h3>
                <p class="text-xs sm:text-sm text-gray-500">6 rooms</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900 text-sm sm:text-base">Book Discussion</h3>
                <p class="text-xs sm:text-sm text-gray-500">4 rooms</p>
            </div>
        </div>
    </div>

    <!-- Create New Chatroom -->
    <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8 sm:mb-12">
        <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Create Your Own Chatroom</h3>
        <p class="text-sm sm:text-base text-gray-600 mb-4">Start a new discussion or create a community around your interests</p>
        <button class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium">
            Create Chatroom
        </button>
    </div>

    <!-- Load More Button -->
    <div class="text-center">
        <button class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium">
            Load More Chatrooms
        </button>
    </div>
</div>
@endsection 