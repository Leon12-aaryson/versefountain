@extends('layouts.app')

@section('title', 'Books - VerseFountain')

@section('content')
<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <!-- Page Header -->
    <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Books</h1>
        <p class="text-sm sm:text-base text-gray-600">Explore our vast collection of eBooks and literary works</p>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Search -->
            <div class="sm:col-span-2 lg:col-span-1">
                <label for="search" class="block text-sm font-medium text-gray-700 mb-2">Search Books</label>
                <div class="relative">
                    <input type="text" id="search" placeholder="Search books, authors, or genres..." 
                           class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Genre Filter -->
            <div>
                <label for="genre" class="block text-sm font-medium text-gray-700 mb-2">Genre</label>
                <select id="genre" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base">
                    <option value="">All Genres</option>
                    <option value="fiction">Fiction</option>
                    <option value="non-fiction">Non-Fiction</option>
                    <option value="poetry">Poetry</option>
                    <option value="drama">Drama</option>
                    <option value="biography">Biography</option>
                </select>
            </div>

            <!-- Language Filter -->
            <div>
                <label for="language" class="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select id="language" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base">
                    <option value="">All Languages</option>
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="italian">Italian</option>
                </select>
            </div>
        </div>
    </div>

    <!-- Featured Books -->
    <div class="mb-8 sm:mb-12">
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Featured Books</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div class="h-40 sm:h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <svg class="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <div class="p-4 sm:p-6">
                    <h3 class="font-semibold text-gray-900 mb-1 text-sm sm:text-base">The Great Gatsby</h3>
                    <p class="text-gray-600 text-xs sm:text-sm mb-2">F. Scott Fitzgerald</p>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">Fiction</span>
                        <button class="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700">Read</button>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div class="h-40 sm:h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                    <svg class="w-12 h-12 sm:w-16 sm:h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <div class="p-4 sm:p-6">
                    <h3 class="font-semibold text-gray-900 mb-1 text-sm sm:text-base">To Kill a Mockingbird</h3>
                    <p class="text-gray-600 text-xs sm:text-sm mb-2">Harper Lee</p>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">Fiction</span>
                        <button class="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700">Read</button>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div class="h-40 sm:h-48 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                    <svg class="w-12 h-12 sm:w-16 sm:h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <div class="p-4 sm:p-6">
                    <h3 class="font-semibold text-gray-900 mb-1 text-sm sm:text-base">1984</h3>
                    <p class="text-gray-600 text-xs sm:text-sm mb-2">George Orwell</p>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">Fiction</span>
                        <button class="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700">Read</button>
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
                    <h3 class="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Pride and Prejudice</h3>
                    <p class="text-gray-600 text-xs sm:text-sm mb-2">Jane Austen</p>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">Fiction</span>
                        <button class="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700">Read</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Book Categories -->
    <div class="mb-8 sm:mb-12">
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Browse by Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900 text-sm sm:text-base">Fiction</h3>
                <p class="text-xs sm:text-sm text-gray-500">2,456 books</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900 text-sm sm:text-base">Non-Fiction</h3>
                <p class="text-xs sm:text-sm text-gray-500">1,234 books</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900 text-sm sm:text-base">Poetry</h3>
                <p class="text-xs sm:text-sm text-gray-500">567 books</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900 text-sm sm:text-base">Drama</h3>
                <p class="text-xs sm:text-sm text-gray-500">234 books</p>
            </div>
        </div>
    </div>

    <!-- Recent Additions -->
    <div class="mb-8 sm:mb-12">
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Recent Additions</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div class="flex items-start space-x-4">
                    <div class="w-16 h-20 sm:w-20 sm:h-24 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-gray-900 text-sm sm:text-base mb-1">The Midnight Library</h3>
                        <p class="text-gray-600 text-xs sm:text-sm mb-2">Matt Haig</p>
                        <p class="text-xs text-gray-500 mb-3">Added 2 days ago</p>
                        <button class="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700">Read Now</button>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div class="flex items-start space-x-4">
                    <div class="w-16 h-20 sm:w-20 sm:h-24 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-gray-900 text-sm sm:text-base mb-1">Klara and the Sun</h3>
                        <p class="text-gray-600 text-xs sm:text-sm mb-2">Kazuo Ishiguro</p>
                        <p class="text-xs text-gray-500 mb-3">Added 1 week ago</p>
                        <button class="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700">Read Now</button>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div class="flex items-start space-x-4">
                    <div class="w-16 h-20 sm:w-20 sm:h-24 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-gray-900 text-sm sm:text-base mb-1">Project Hail Mary</h3>
                        <p class="text-gray-600 text-xs sm:text-sm mb-2">Andy Weir</p>
                        <p class="text-xs text-gray-500 mb-3">Added 2 weeks ago</p>
                        <button class="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700">Read Now</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Load More Button -->
    <div class="text-center">
        <button class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium">
            Load More Books
        </button>
    </div>
</div>
@endsection 