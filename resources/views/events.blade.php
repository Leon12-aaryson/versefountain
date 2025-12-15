@extends('layouts.app')

@section('title', 'Events - VerseFountain')

@section('content')
    <div class="min-h-screen bg-stone-50">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <!-- Page Header -->
            <div class="mb-10 sm:mb-12">
                <h1 class="text-3xl sm:text-4xl font-light text-gray-800 mb-2 tracking-wide">Events</h1>
                <p class="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">Discover poetry readings, workshops,
                    and literary events</p>
            </div>

            <!-- Search and Filter Section -->
            <div class="bg-white border border-gray-200 p-5 sm:p-6 mb-8 sm:mb-10">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Search -->
                    <div class="sm:col-span-2 lg:col-span-1">
                        <label for="search"
                            class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Search
                            Events</label>
                        <div class="relative">
                            <input type="text" id="search" placeholder="Search events, locations, or organizers..."
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
                        <label for="category"
                            class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Category</label>
                        <select id="category"
                            class="w-full px-3 py-2 border border-gray-300 focus:border-gray-500 text-sm bg-white focus:outline-none appearance-none cursor-pointer">
                            <option value="">All Categories</option>
                            <option value="poetry-reading">Poetry Reading</option>
                            <option value="workshop">Workshop</option>
                            <option value="book-launch">Book Launch</option>
                            <option value="conference">Conference</option>
                        </select>
                    </div>

                    <!-- Date Filter -->
                    <div>
                        <label for="date"
                            class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Date</label>
                        <select id="date"
                            class="w-full px-3 py-2 border border-gray-300 focus:border-gray-500 text-sm bg-white focus:outline-none appearance-none cursor-pointer">
                            <option value="">All Dates</option>
                            <option value="today">Today</option>
                            <option value="tomorrow">Tomorrow</option>
                            <option value="this-week">This Week</option>
                            <option value="this-month">This Month</option>
                        </select>
                    </div>
                </div>
            </div>

    @php
        $featuredEvents = [
            [
                'title' => 'Open Mic Night',
                'category' => 'Poetry Reading',
                'price' => 'Free',
                'description' => 'Share your poetry with fellow enthusiasts',
                'location' => 'Central Library, Downtown',
                'date' => 'Dec 15, 2024 • 7:00 PM',
                'slug' => 'open-mic-night'
            ],
            [
                'title' => 'Creative Writing Workshop',
                'category' => 'Workshop',
                'price' => '$25',
                'description' => 'Learn techniques from published authors',
                'location' => 'Community Center',
                'date' => 'Dec 20, 2024 • 2:00 PM',
                'slug' => 'creative-writing-workshop'
            ],
            [
                'title' => 'New Poetry Collection Launch',
                'category' => 'Book Launch',
                'price' => 'Free',
                'description' => 'Celebrate the release of "Whispers of Dawn"',
                'location' => 'Local Bookstore',
                'date' => 'Dec 25, 2024 • 6:00 PM',
                'slug' => 'poetry-collection-launch'
            ]
        ];

        $upcomingEvents = [
            [
                'title' => 'Poetry Festival 2024',
                'category' => 'Conference',
                'price' => '$50',
                'description' => 'A three-day celebration of contemporary poetry',
                'location' => 'Convention Center',
                'date' => 'Jan 15-17, 2025 • 9:00 AM',
                'slug' => 'poetry-festival-2024'
            ],
            [
                'title' => 'Haiku Writing Masterclass',
                'category' => 'Workshop',
                'price' => '$30',
                'description' => 'Master the art of Japanese haiku poetry',
                'location' => 'Cultural Center',
                'date' => 'Jan 22, 2025 • 3:00 PM',
                'slug' => 'haiku-masterclass'
            ]
        ];
    @endphp

    <!-- Featured Events -->
    <div class="mb-10 sm:mb-12">
        <h2 class="text-xl sm:text-2xl font-light text-gray-800 mb-6 sm:mb-8 tracking-wide">Featured Events</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            @foreach($featuredEvents as $event)
            <div class="bg-white border border-gray-200 hover:border-gray-300 transition-colors">
                <div class="h-40 sm:h-48 bg-gray-100 flex items-center justify-center">
                    <svg class="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                </div>
                <div class="p-4 sm:p-6">
                    <div class="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                        <span class="text-xs text-gray-600 uppercase tracking-wide">{{ $event['category'] }}</span>
                        <span class="text-xs text-gray-500">{{ $event['price'] }}</span>
                    </div>
                    <h3 class="font-normal text-gray-900 mb-1 text-sm sm:text-base">{{ $event['title'] }}</h3>
                    <p class="text-gray-600 text-xs sm:text-sm mb-3 font-light">{{ $event['description'] }}</p>
                    <div class="flex items-center text-xs text-gray-500 mb-3">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span>{{ $event['location'] }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">{{ $event['date'] }}</span>
                        @auth
                            <a href="{{ route('tickets.index') }}?event={{ $event['slug'] }}" class="px-3 py-1 bg-gray-800 text-white text-xs font-normal hover:bg-gray-700 transition-colors inline-block">
                                Register
                            </a>
                        @else
                            <a href="{{ route('login') }}" class="px-3 py-1 bg-gray-800 text-white text-xs font-normal hover:bg-gray-700 transition-colors inline-block">
                                Register
                            </a>
                        @endauth
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </div>

    <!-- Upcoming Events -->
    <div class="mb-10 sm:mb-12">
        <h2 class="text-xl sm:text-2xl font-light text-gray-800 mb-6 sm:mb-8 tracking-wide">Upcoming Events</h2>
        <div class="space-y-5 sm:space-y-6">
            @foreach($upcomingEvents as $event)
            <div class="bg-white border border-gray-200 p-4 sm:p-6 hover:border-gray-300 transition-colors">
                <div class="flex items-start space-x-4">
                    <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-xs text-gray-600 uppercase tracking-wide">{{ $event['category'] }}</span>
                            <span class="text-xs text-gray-500">{{ $event['price'] }}</span>
                        </div>
                        <h3 class="font-normal text-gray-900 text-sm sm:text-base mb-1">{{ $event['title'] }}</h3>
                        <p class="text-gray-600 text-xs sm:text-sm mb-3 font-light">{{ $event['description'] }}</p>
                        <div class="flex items-center text-xs text-gray-500 mb-3">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span>{{ $event['location'] }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-xs text-gray-500">{{ $event['date'] }}</span>
                            @auth
                                <a href="/tickets" class="px-3 py-1 bg-gray-800 text-white text-xs font-normal hover:bg-gray-700 transition-colors inline-block">
                                    Register
                                </a>
                            @else
                                <a href="{{ route('login') }}" class="px-3 py-1 bg-gray-800 text-white text-xs font-normal hover:bg-gray-700 transition-colors inline-block">
                                    Register
                                </a>
                            @endauth
                        </div>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </div>

    <!-- Event Categories -->
    <div class="mb-10 sm:mb-12">
        <h2 class="text-xl sm:text-2xl font-light text-gray-800 mb-6 sm:mb-8 tracking-wide">Browse by Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div class="bg-white border border-gray-200 p-4 sm:p-6 text-center hover:border-gray-300 transition-colors cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                </div>
                <h3 class="font-normal text-gray-900 text-sm sm:text-base">Poetry Readings</h3>
                <p class="text-xs sm:text-sm text-gray-500 mt-1">12 events</p>
            </div>

            <div class="bg-white border border-gray-200 p-4 sm:p-6 text-center hover:border-gray-300 transition-colors cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                </div>
                <h3 class="font-normal text-gray-900 text-sm sm:text-base">Workshops</h3>
                <p class="text-xs sm:text-sm text-gray-500 mt-1">8 events</p>
            </div>

            <div class="bg-white border border-gray-200 p-4 sm:p-6 text-center hover:border-gray-300 transition-colors cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <h3 class="font-normal text-gray-900 text-sm sm:text-base">Book Launches</h3>
                <p class="text-xs sm:text-sm text-gray-500 mt-1">5 events</p>
            </div>

            <div class="bg-white border border-gray-200 p-4 sm:p-6 text-center hover:border-gray-300 transition-colors cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                </div>
                <h3 class="font-normal text-gray-900 text-sm sm:text-base">Conferences</h3>
                <p class="text-xs sm:text-sm text-gray-500 mt-1">3 events</p>
            </div>
        </div>
    </div>

    <!-- Load More Button -->
    <div class="text-center">
        <button class="px-6 py-2.5 bg-gray-800 text-white text-sm font-normal hover:bg-gray-700 transition-colors">
            Load More Events
        </button>
    </div>
    </div>
</div>
@endsection