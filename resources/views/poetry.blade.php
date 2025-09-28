@extends('layouts.app')

@section('title', 'Poetry - VerseFountain')

@section('content')
<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <!-- Page Header -->
    <div class="mb-6 sm:mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Poetry</h1>
                <p class="text-sm sm:text-base text-gray-600">Discover beautiful poems from classic and contemporary poets</p>
            </div>
            @auth
            <div class="mt-4 sm:mt-0">
                <a href="/poetry/create" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Create Poem
                </a>
            </div>
            @endauth
        </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
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

    @php
        $poems = [
            [
                'title' => 'The Road Not Taken',
                'author' => 'Robert Frost',
                'year' => '1916',
                'excerpt' => 'Two roads diverged in a yellow wood, And sorry I could not travel both And be one traveler, long I stood And looked down one as far as I could...',
                'likes' => '1.2k',
                'comments' => '45',
                'slug' => 'road-not-taken'
            ],
            [
                'title' => 'Sonnet 18',
                'author' => 'William Shakespeare',
                'year' => '1609',
                'excerpt' => 'Shall I compare thee to a summer\'s day? Thou art more lovely and more temperate: Rough winds do shake the darling buds of May...',
                'likes' => '2.1k',
                'comments' => '78',
                'slug' => 'sonnet-18'
            ],
            [
                'title' => 'Still I Rise',
                'author' => 'Maya Angelou',
                'year' => '1978',
                'excerpt' => 'You may write me down in history With your bitter, twisted lies, You may trod me in the very dirt But still, like dust, I\'ll rise...',
                'likes' => '3.4k',
                'comments' => '156',
                'slug' => 'still-i-rise'
            ],
            [
                'title' => 'Do Not Go Gentle',
                'author' => 'Dylan Thomas',
                'year' => '1951',
                'excerpt' => 'Do not go gentle into that good night, Old age should burn and rave at close of day; Rage, rage against the dying of the light...',
                'likes' => '892',
                'comments' => '23',
                'slug' => 'do-not-go-gentle'
            ],
            [
                'title' => 'The Waste Land',
                'author' => 'T.S. Eliot',
                'year' => '1922',
                'excerpt' => 'April is the cruellest month, breeding Lilacs out of the dead land, mixing Memory and desire, stirring Dull roots with spring rain...',
                'likes' => '567',
                'comments' => '34',
                'slug' => 'waste-land'
            ],
            [
                'title' => 'Howl',
                'author' => 'Allen Ginsberg',
                'year' => '1956',
                'excerpt' => 'I saw the best minds of my generation destroyed by madness, starving hysterical naked, dragging themselves through the negro streets...',
                'likes' => '1.8k',
                'comments' => '67',
                'slug' => 'howl'
            ]
        ];
    @endphp

    <!-- Poems Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        @foreach($poems as $poem)
        <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div class="p-4">
                <div class="flex items-start justify-between mb-3">
                    <h3 class="text-lg font-semibold text-gray-900 truncate pr-2">{{ $poem['title'] }}</h3>
                    <button class="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </button>
                </div>
                <p class="text-sm text-gray-600 mb-3 line-clamp-3">
                    {{ $poem['excerpt'] }}
                </p>
                <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{{ $poem['author'] }}</span>
                    <span>{{ $poem['year'] }}</span>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3 text-xs text-gray-500">
                        <div class="flex items-center space-x-1">
                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            <span>{{ $poem['likes'] }}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                            <span>{{ $poem['comments'] }}</span>
                        </div>
                    </div>
                    <a href="/poetry/{{ $poem['slug'] }}" class="text-blue-600 hover:text-blue-700 text-sm font-medium">Read More</a>
                </div>
            </div>
        </div>
        @endforeach
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