@extends('layouts.app')

@section('title', 'Poetry - VerseFountain')

@section('content')
    <x-page-header title="Poetry" description="Discover and share beautiful poems with our community" />

    <x-search-filter placeholder="Search poems, poets, or themes..." :filters="[
        ['options' => ['All Categories', 'Love', 'Nature', 'Life', 'Philosophy']],
        ['options' => ['All Languages', 'English', 'Spanish', 'French', 'German']]
    ]" />

    <!-- Featured Poems -->
    <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Featured Poems</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span class="text-blue-600 font-semibold">JD</span>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">John Doe</h3>
                        <p class="text-sm text-gray-500">2 hours ago</p>
                    </div>
                </div>
                <h4 class="font-semibold text-gray-900 mb-2">The Road Not Taken</h4>
                <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                    Two roads diverged in a yellow wood,<br>
                    And sorry I could not travel both<br>
                    And be one traveler, long I stood...
                </p>
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <button class="flex items-center text-gray-500 hover:text-blue-600">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                            <span class="text-sm">24</span>
                        </button>
                        <button class="flex items-center text-gray-500 hover:text-blue-600">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                            <span class="text-sm">8</span>
                        </button>
                    </div>
                    <button class="text-blue-600 text-sm font-medium hover:text-blue-700">Read More</button>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <span class="text-purple-600 font-semibold">JS</span>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">Jane Smith</h3>
                        <p class="text-sm text-gray-500">1 day ago</p>
                    </div>
                </div>
                <h4 class="font-semibold text-gray-900 mb-2">Sonnet 18</h4>
                <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                    Shall I compare thee to a summer's day?<br>
                    Thou art more lovely and more temperate:<br>
                    Rough winds do shake the darling buds of May...
                </p>
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <button class="flex items-center text-gray-500 hover:text-blue-600">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                            <span class="text-sm">42</span>
                        </button>
                        <button class="flex items-center text-gray-500 hover:text-blue-600">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                            <span class="text-sm">15</span>
                        </button>
                    </div>
                    <button class="text-blue-600 text-sm font-medium hover:text-blue-700">Read More</button>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span class="text-green-600 font-semibold">RW</span>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">Robert Wilson</h3>
                        <p class="text-sm text-gray-500">3 days ago</p>
                    </div>
                </div>
                <h4 class="font-semibold text-gray-900 mb-2">The Raven</h4>
                <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                    Once upon a midnight dreary, while I pondered, weak and weary,<br>
                    Over many a quaint and curious volume of forgotten lore—<br>
                    While I nodded, nearly napping, suddenly there came a tapping...
                </p>
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <button class="flex items-center text-gray-500 hover:text-blue-600">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                            <span class="text-sm">67</span>
                        </button>
                        <button class="flex items-center text-gray-500 hover:text-blue-600">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                            <span class="text-sm">23</span>
                        </button>
                    </div>
                    <button class="text-blue-600 text-sm font-medium hover:text-blue-700">Read More</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Write Poetry Section -->
    <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-8">
        <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Share Your Poetry</h2>
            <p class="text-gray-600 mb-6 max-w-2xl mx-auto">
                Express yourself through poetry. Share your thoughts, emotions, and creativity with our community of poetry enthusiasts.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Write a Poem
                </button>
                <button class="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors">
                    Upload Video Poem
                </button>
            </div>
        </div>
    </div>

    <!-- Poetry Categories -->
    <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Explore Categories</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900">Love</h3>
                <p class="text-sm text-gray-500">1,234 poems</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900">Nature</h3>
                <p class="text-sm text-gray-500">856 poems</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900">Philosophy</h3>
                <p class="text-sm text-gray-500">432 poems</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900">Life</h3>
                <p class="text-sm text-gray-500">1,567 poems</p>
            </div>
        </div>
    </div>

    <!-- Recent Activity -->
    <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span class="text-blue-600 text-sm font-semibold">JD</span>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-gray-900"><span class="font-semibold">John Doe</span> published a new poem</p>
                        <p class="text-xs text-gray-500">2 hours ago</p>
                    </div>
                </div>
            </div>
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <span class="text-purple-600 text-sm font-semibold">JS</span>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-gray-900"><span class="font-semibold">Jane Smith</span> liked a poem</p>
                        <p class="text-xs text-gray-500">4 hours ago</p>
                    </div>
                </div>
            </div>
            <div class="p-6">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span class="text-green-600 text-sm font-semibold">RW</span>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-gray-900"><span class="font-semibold">Robert Wilson</span> commented on a poem</p>
                        <p class="text-xs text-gray-500">6 hours ago</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection 