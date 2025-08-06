@extends('layouts.app')

@section('title', 'Academics - VerseFountain')

@section('content')
<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <!-- Page Header -->
    <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Academics</h1>
        <p class="text-sm sm:text-base text-gray-600">Access educational resources, research papers, and academic materials</p>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Search -->
            <div class="sm:col-span-2 lg:col-span-1">
                <label for="search" class="block text-sm font-medium text-gray-700 mb-2">Search Resources</label>
                <div class="relative">
                    <input type="text" id="search" placeholder="Search papers, subjects, or authors..." 
                           class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Subject Filter -->
            <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select id="subject" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base">
                    <option value="">All Subjects</option>
                    <option value="literature">Literature</option>
                    <option value="history">History</option>
                    <option value="philosophy">Philosophy</option>
                    <option value="science">Science</option>
                    <option value="mathematics">Mathematics</option>
                </select>
            </div>

            <!-- Type Filter -->
            <div>
                <label for="type" class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select id="type" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base">
                    <option value="">All Types</option>
                    <option value="research-paper">Research Paper</option>
                    <option value="essay">Essay</option>
                    <option value="thesis">Thesis</option>
                    <option value="study-guide">Study Guide</option>
                </select>
            </div>
        </div>
    </div>

    <!-- Featured Resources -->
    <div class="mb-8 sm:mb-12">
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Featured Resources</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div class="h-40 sm:h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <svg class="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <div class="p-4 sm:p-6">
                    <h3 class="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Modern Poetry Analysis</h3>
                    <p class="text-gray-600 text-xs sm:text-sm mb-2">Dr. Sarah Johnson</p>
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-xs text-gray-500">Literature</span>
                        <span class="text-xs text-gray-500">Research Paper</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">📄 15 pages</span>
                        <button class="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700">Read</button>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div class="h-40 sm:h-48 bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
                    <svg class="w-12 h-12 sm:w-16 sm:h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <div class="p-4 sm:p-6">
                    <h3 class="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Shakespeare's Influence</h3>
                    <p class="text-gray-600 text-xs sm:text-sm mb-2">Prof. Michael Chen</p>
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-xs text-gray-500">Literature</span>
                        <span class="text-xs text-gray-500">Essay</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">📄 8 pages</span>
                        <button class="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700">Read</button>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div class="h-40 sm:h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <svg class="w-12 h-12 sm:w-16 sm:h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                </div>
                <div class="p-4 sm:p-6">
                    <h3 class="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Creative Writing Guide</h3>
                    <p class="text-gray-600 text-xs sm:text-sm mb-2">Dr. Emily Rodriguez</p>
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-xs text-gray-500">Literature</span>
                        <span class="text-xs text-gray-500">Study Guide</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">📄 25 pages</span>
                        <button class="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700">Read</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Academic Categories -->
    <div class="mb-8 sm:mb-12">
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Browse by Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900 text-sm sm:text-base">Literature</h3>
                <p class="text-xs sm:text-sm text-gray-500">1,234 papers</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900 text-sm sm:text-base">History</h3>
                <p class="text-xs sm:text-sm text-gray-500">567 papers</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900 text-sm sm:text-base">Philosophy</h3>
                <p class="text-xs sm:text-sm text-gray-500">234 papers</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900 text-sm sm:text-base">Science</h3>
                <p class="text-xs sm:text-sm text-gray-500">789 papers</p>
            </div>
        </div>
    </div>

    <!-- Recent Papers -->
    <div class="mb-8 sm:mb-12">
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Recent Papers</h2>
        <div class="space-y-4 sm:space-y-6">
            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-16 sm:w-16 sm:h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-gray-900 text-sm sm:text-base mb-1">The Evolution of Poetry in Digital Age</h3>
                        <p class="text-gray-600 text-xs sm:text-sm mb-2">Dr. Lisa Thompson • Literature</p>
                        <p class="text-xs text-gray-500 mb-3">Published 3 days ago • 12 pages</p>
                        <div class="flex items-center space-x-4">
                            <button class="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700">Read Paper</button>
                            <button class="text-gray-600 text-xs sm:text-sm hover:text-gray-800">Download PDF</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-16 sm:w-16 sm:h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-gray-900 text-sm sm:text-base mb-1">Comparative Analysis of Modern Poets</h3>
                        <p class="text-gray-600 text-xs sm:text-sm mb-2">Prof. David Wilson • Literature</p>
                        <p class="text-xs text-gray-500 mb-3">Published 1 week ago • 18 pages</p>
                        <div class="flex items-center space-x-4">
                            <button class="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700">Read Paper</button>
                            <button class="text-gray-600 text-xs sm:text-sm hover:text-gray-800">Download PDF</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-16 sm:w-16 sm:h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-gray-900 text-sm sm:text-base mb-1">The Impact of Social Media on Literature</h3>
                        <p class="text-gray-600 text-xs sm:text-sm mb-2">Dr. Maria Garcia • Literature</p>
                        <p class="text-xs text-gray-500 mb-3">Published 2 weeks ago • 22 pages</p>
                        <div class="flex items-center space-x-4">
                            <button class="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700">Read Paper</button>
                            <button class="text-gray-600 text-xs sm:text-sm hover:text-gray-800">Download PDF</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Load More Button -->
    <div class="text-center">
        <button class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium">
            Load More Papers
        </button>
    </div>
</div>
@endsection 