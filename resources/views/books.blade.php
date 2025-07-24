@extends('layouts.app')

@section('title', 'Books - VerseFountain')

@section('content')
    <x-page-header title="Books" description="Explore our vast collection of eBooks and literary works" />

    <x-search-filter placeholder="Search books, authors, or genres..." :filters="[
        ['options' => ['All Genres', 'Fiction', 'Non-Fiction', 'Poetry', 'Drama', 'Biography']],
        ['options' => ['All Languages', 'English', 'Spanish', 'French', 'German', 'Italian']]
    ]" />

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

    <!-- Book Categories -->
    <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900">Fiction</h3>
                <p class="text-sm text-gray-500">2,456 books</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900">Poetry</h3>
                <p class="text-sm text-gray-500">1,234 books</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900">Biography</h3>
                <p class="text-sm text-gray-500">856 books</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900">Drama</h3>
                <p class="text-sm text-gray-500">432 books</p>
            </div>
        </div>
    </div>

    <!-- Reading Lists -->
    <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Curated Reading Lists</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                    </div>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Classic Literature</h3>
                <p class="text-gray-600 mb-4">Timeless masterpieces that have shaped literature for generations</p>
                <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    View List
                </button>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Modern Poetry</h3>
                <p class="text-gray-600 mb-4">Contemporary voices and innovative poetic expressions</p>
                <button class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    View List
                </button>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Must-Read Novels</h3>
                <p class="text-gray-600 mb-4">Essential novels that every reader should experience</p>
                <button class="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                    View List
                </button>
            </div>
        </div>
    </div>

    <!-- Reading Progress -->
    <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Your Reading Progress</h2>
        <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600 mb-2">12</div>
                    <p class="text-gray-600">Books Read</p>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-green-600 mb-2">5</div>
                    <p class="text-gray-600">Currently Reading</p>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-purple-600 mb-2">23</div>
                    <p class="text-gray-600">Want to Read</p>
                </div>
            </div>
        </div>
    </div>
@endsection 