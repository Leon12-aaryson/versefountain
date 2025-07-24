@extends('layouts.app')

@section('title', 'Poetry - VerseFountain')

@section('content')
<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <!-- Page Header -->
    <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Poetry</h1>
        <p class="text-sm sm:text-base text-gray-600">Discover beautiful poems from classic and contemporary poets</p>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Search -->
            <div class="sm:col-span-2 lg:col-span-1">
                <label for="search" class="block text-sm font-medium text-gray-700 mb-2">Search Poems</label>
                <div class="relative">
                    <input type="text" id="search" placeholder="Search by title, author, or content..." 
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
                    <option value="love">Love</option>
                    <option value="nature">Nature</option>
                    <option value="life">Life</option>
                    <option value="death">Death</option>
                    <option value="war">War</option>
                    <option value="peace">Peace</option>
                </select>
            </div>

            <!-- Sort By -->
            <div>
                <label for="sort" class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select id="sort" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base">
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="title">Title A-Z</option>
                </select>
            </div>
        </div>
    </div>

    <!-- Poems Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <!-- Poem Card 1 -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div class="p-4 sm:p-6">
                <div class="flex items-start justify-between mb-3">
                    <h3 class="text-lg sm:text-xl font-semibold text-gray-900">The Road Not Taken</h3>
                    <button class="text-gray-400 hover:text-red-500 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </button>
                </div>
                <p class="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3">
                    Two roads diverged in a yellow wood, And sorry I could not travel both And be one traveler, long I stood And looked down one as far as I could To where it bent in the undergrowth...
                </p>
                <div class="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4">
                    <span>Robert Frost</span>
                    <span>1916</span>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
                        <span>❤️ 1.2k</span>
                        <span>💬 45</span>
                    </div>
                    <a href="/poetry/road-not-taken" class="text-blue-600 hover:text-blue-700 text-sm font-medium">Read More</a>
                </div>
            </div>
        </div>

        <!-- Poem Card 2 -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div class="p-4 sm:p-6">
                <div class="flex items-start justify-between mb-3">
                    <h3 class="text-lg sm:text-xl font-semibold text-gray-900">Sonnet 18</h3>
                    <button class="text-gray-400 hover:text-red-500 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </button>
                </div>
                <p class="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3">
                    Shall I compare thee to a summer's day? Thou art more lovely and more temperate: Rough winds do shake the darling buds of May, And summer's lease hath all too short a date...
                </p>
                <div class="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4">
                    <span>William Shakespeare</span>
                    <span>1609</span>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
                        <span>❤️ 2.1k</span>
                        <span>💬 78</span>
                    </div>
                    <a href="/poetry/sonnet-18" class="text-blue-600 hover:text-blue-700 text-sm font-medium">Read More</a>
                </div>
            </div>
        </div>

        <!-- Poem Card 3 -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div class="p-4 sm:p-6">
                <div class="flex items-start justify-between mb-3">
                    <h3 class="text-lg sm:text-xl font-semibold text-gray-900">Still I Rise</h3>
                    <button class="text-gray-400 hover:text-red-500 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </button>
                </div>
                <p class="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3">
                    You may write me down in history With your bitter, twisted lies, You may trod me in the very dirt But still, like dust, I'll rise...
                </p>
                <div class="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4">
                    <span>Maya Angelou</span>
                    <span>1978</span>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
                        <span>❤️ 3.4k</span>
                        <span>💬 156</span>
                    </div>
                    <a href="/poetry/still-i-rise" class="text-blue-600 hover:text-blue-700 text-sm font-medium">Read More</a>
                </div>
            </div>
        </div>

        <!-- Poem Card 4 -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div class="p-4 sm:p-6">
                <div class="flex items-start justify-between mb-3">
                    <h3 class="text-lg sm:text-xl font-semibold text-gray-900">Do Not Go Gentle</h3>
                    <button class="text-gray-400 hover:text-red-500 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </button>
                </div>
                <p class="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3">
                    Do not go gentle into that good night, Old age should burn and rave at close of day; Rage, rage against the dying of the light...
                </p>
                <div class="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4">
                    <span>Dylan Thomas</span>
                    <span>1951</span>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
                        <span>❤️ 892</span>
                        <span>💬 23</span>
                    </div>
                    <a href="/poetry/do-not-go-gentle" class="text-blue-600 hover:text-blue-700 text-sm font-medium">Read More</a>
                </div>
            </div>
        </div>

        <!-- Poem Card 5 -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div class="p-4 sm:p-6">
                <div class="flex items-start justify-between mb-3">
                    <h3 class="text-lg sm:text-xl font-semibold text-gray-900">The Waste Land</h3>
                    <button class="text-gray-400 hover:text-red-500 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </button>
                </div>
                <p class="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3">
                    April is the cruellest month, breeding Lilacs out of the dead land, mixing Memory and desire, stirring Dull roots with spring rain...
                </p>
                <div class="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4">
                    <span>T.S. Eliot</span>
                    <span>1922</span>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
                        <span>❤️ 567</span>
                        <span>💬 34</span>
                    </div>
                    <a href="/poetry/waste-land" class="text-blue-600 hover:text-blue-700 text-sm font-medium">Read More</a>
                </div>
            </div>
        </div>

        <!-- Poem Card 6 -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div class="p-4 sm:p-6">
                <div class="flex items-start justify-between mb-3">
                    <h3 class="text-lg sm:text-xl font-semibold text-gray-900">Howl</h3>
                    <button class="text-gray-400 hover:text-red-500 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </button>
                </div>
                <p class="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3">
                    I saw the best minds of my generation destroyed by madness, starving hysterical naked, dragging themselves through the negro streets at dawn looking for an angry fix...
                </p>
                <div class="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4">
                    <span>Allen Ginsberg</span>
                    <span>1956</span>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
                        <span>❤️ 1.8k</span>
                        <span>💬 67</span>
                    </div>
                    <a href="/poetry/howl" class="text-blue-600 hover:text-blue-700 text-sm font-medium">Read More</a>
                </div>
            </div>
        </div>
    </div>

    <!-- Load More Button -->
    <div class="text-center mt-8 sm:mt-12">
        <button class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium">
            Load More Poems
        </button>
    </div>
</div>

<style>
    .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
@endsection 