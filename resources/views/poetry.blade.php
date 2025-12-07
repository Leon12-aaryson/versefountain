@extends('layouts.app')

@section('title', 'Poetry - VerseFountain')

@section('content')
    <div class="min-h-screen bg-stone-50">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <!-- Page Header -->
            <div class="mb-10 sm:mb-12">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div class="mb-6 sm:mb-0">
                        <h1 class="text-3xl sm:text-4xl font-light text-gray-800 mb-2 tracking-wide">
                            Poetry
                        </h1>
                        <p class="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
                            Discover beautiful poems from classic and contemporary poets
                        </p>
                    </div>
                    @auth
                        <div class="mt-4 sm:mt-0">
                            <a href="/poetry/create"
                                class="inline-flex items-center px-5 py-2.5 bg-gray-800 text-white text-sm font-normal rounded-sm hover:bg-gray-700 transition-colors">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4">
                                    </path>
                                </svg>
                                Create Poem
                            </a>
                        </div>
                    @endauth
                </div>
            </div>

            <!-- Search and Filter Section -->
            <div class="bg-white border border-gray-200 p-5 sm:p-6 mb-8 sm:mb-10">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Search -->
                    <div class="sm:col-span-2 lg:col-span-1">
                        <label for="search" class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Search Poems</label>
                        <div class="relative">
                            <input type="text" id="search" placeholder="Search by title, author, or content..."
                                class="w-full pl-9 pr-3 py-2 border border-gray-300 focus:border-gray-500 text-sm bg-white focus:outline-none">
                            <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- Category Filter -->
                    <div>
                        <label for="category" class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Category</label>
                        <select id="category"
                            class="w-full px-3 py-2 border border-gray-300 focus:border-gray-500 text-sm bg-white focus:outline-none appearance-none cursor-pointer">
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
                        <label for="sort" class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Sort By</label>
                        <select id="sort"
                            class="w-full px-3 py-2 border border-gray-300 focus:border-gray-500 text-sm bg-white focus:outline-none appearance-none cursor-pointer">
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
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                @foreach($poems as $poem)
                    <div class="bg-white border border-gray-200 hover:border-gray-300 transition-colors">
                        <div class="p-6 sm:p-8">
                            <!-- Title -->
                            <h3 class="text-lg font-normal text-gray-900 mb-4 leading-snug">
                                {{ $poem['title'] }}
                            </h3>
                            
                            <!-- Poem Excerpt -->
                            <p class="text-sm text-gray-700 mb-6 line-clamp-4 leading-relaxed font-light">
                                {{ $poem['excerpt'] }}
                            </p>
                            
                            <!-- Author and Year -->
                            <div class="mb-6 pb-6 border-b border-gray-200">
                                <p class="text-xs text-gray-600 font-normal">{{ $poem['author'] }}</p>
                                <p class="text-xs text-gray-500 mt-0.5">{{ $poem['year'] }}</p>
                            </div>
                            
                            <!-- Engagement Metrics and Read More -->
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-4 text-xs text-gray-500">
                                    <!-- Likes -->
                                    <div class="flex items-center space-x-1">
                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                        </svg>
                                        <span>{{ $poem['likes'] }}</span>
                                    </div>
                                    
                                    <!-- Comments -->
                                    <div class="flex items-center space-x-1">
                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                        </svg>
                                        <span>{{ $poem['comments'] }}</span>
                                    </div>
                                </div>
                                
                                <!-- Read More Link -->
                                <a href="/poetry/{{ $poem['slug'] }}" class="text-xs text-gray-700 hover:text-gray-900 font-normal uppercase tracking-wide">
                                    Read →
                                </a>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>

            <!-- Load More Button -->
            <div class="text-center mt-10 sm:mt-12">
                <button class="px-6 py-2.5 bg-gray-800 text-white text-sm font-normal hover:bg-gray-700 transition-colors">
                    Load More Poems
                </button>
            </div>
        </div>
    </div>

    <style>
        .line-clamp-4 {
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    </style>
@endsection