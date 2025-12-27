@extends('layouts.app')

@section('title', 'Tickets - VerseFountain')

@section('content')
    <div class="min-h-screen bg-stone-50">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <!-- Page Header -->
            <div class="mb-10 sm:mb-12">
                <h1 class="text-3xl sm:text-4xl font-light text-gray-800 mb-2 tracking-wide">Tickets</h1>
                <p class="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">Purchase tickets for upcoming poetry
                    events and workshops</p>
            </div>

            <!-- Search and Filter Section -->
            <div class="bg-white rounded-md p-5 sm:p-6 mb-8 sm:mb-10">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Search -->
                    <div class="sm:col-span-2 lg:col-span-1">
                        <label for="search"
                            class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Search
                            Events</label>
                        <div class="relative">
                            <input type="text" id="search" placeholder="Search events, locations, or organizers..."
                                class="w-full pl-9 pr-3 py-2 focus:border-blue-600 text-sm bg-white focus:outline-none">
                            <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                <i class="bx bx-search text-gray-400"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Category Filter -->
                    <div>
                        <label for="category"
                            class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Category</label>
                        <select id="category"
                            class="w-full px-3 py-2 focus:border-blue-600 text-sm bg-white focus:outline-none appearance-none cursor-pointer">
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
                            class="w-full px-3 py-2 focus:border-blue-600 text-sm bg-white focus:outline-none appearance-none cursor-pointer">
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
                        'price' => '$15',
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
                        <div class="bg-white shadow-sm rounded-md transition-colors">
                            <div class="h-40 sm:h-48 bg-gray-100 flex items-center justify-center">
                                <i class="bx bx-calendar text-gray-400"></i>
                            </div>
                            <div class="p-4 sm:p-6">
                                <div class="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                                    <span class="text-xs text-gray-600 uppercase tracking-wide">{{ $event['category'] }}</span>
                                    <span class="text-xs text-gray-500">{{ $event['price'] }}</span>
                                </div>
                                <h3 class="font-normal text-gray-900 mb-1 text-sm sm:text-base">{{ $event['title'] }}</h3>
                                <p class="text-gray-600 text-xs sm:text-sm mb-3 font-light">{{ $event['description'] }}</p>
                                <div class="flex items-center text-xs text-gray-500 mb-3">
                                    <i class="bx bx-map text-gray-600 mr-1"></i>
                                    <span>{{ $event['location'] }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-xs text-gray-500">{{ $event['date'] }}</span>
                                    <button
                                        class="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-normal hover:bg-blue-700 transition-colors focus:outline-none">
                                        Buy Ticket
                                    </button>
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
                        <div class="bg-white shadow-sm rounded-md p-4 sm:p-6 transition-colors">
                            <div class="flex items-start space-x-4">
                                <div
                                    class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <i class="bx bx-calendar text-gray-400"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center justify-between mb-2">
                                        <span
                                            class="text-xs text-gray-600 uppercase tracking-wide">{{ $event['category'] }}</span>
                                        <span class="text-xs text-gray-500">{{ $event['price'] }}</span>
                                    </div>
                                    <h3 class="font-normal text-gray-900 text-sm sm:text-base mb-1">{{ $event['title'] }}</h3>
                                    <p class="text-gray-600 text-xs sm:text-sm mb-3 font-light">{{ $event['description'] }}</p>
                                    <div class="flex items-center text-xs text-gray-500 mb-3">
                                        <i class="bx bx-map text-gray-600 mr-1"></i>
                                        <span>{{ $event['location'] }}</span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs text-gray-500">{{ $event['date'] }}</span>
                                        <button
                                            class="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-normal hover:bg-blue-700 transition-colors focus:outline-none">
                                            Buy Ticket
                                        </button>
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
                    <div class="bg-white shadow-sm rounded-md p-4 sm:p-6 transition-colors cursor-pointer">
                        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mx-auto mb-3">
                            <i class="bx bx-book-reader text-gray-600"></i>
                        </div>
                        <h3 class="font-normal text-gray-900 text-sm sm:text-base">Poetry Readings</h3>
                        <p class="text-xs sm:text-sm text-gray-500 mt-1">12 events</p>
                    </div>

                    <div class="bg-white shadow-sm rounded-md p-4 sm:p-6 transition-colors cursor-pointer">
                        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mx-auto mb-3">
                            <i class="bx bx-bulb text-gray-600"></i>
                        </div>
                        <h3 class="font-normal text-gray-900 text-sm sm:text-base">Workshops</h3>
                        <p class="text-xs sm:text-sm text-gray-500 mt-1">8 events</p>
                    </div>

                    <div class="bg-white shadow-sm rounded-md p-4 sm:p-6 transition-colors cursor-pointer">
                        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mx-auto mb-3">
                            <i class="bx bx-book-reader text-gray-600"></i>
                        </div>
                        <h3 class="font-normal text-gray-900 text-sm sm:text-base">Book Launches</h3>
                        <p class="text-xs sm:text-sm text-gray-500 mt-1">5 events</p>
                    </div>

                    <div class="bg-white shadow-sm rounded-md p-4 sm:p-6 transition-colors cursor-pointer">
                        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mx-auto mb-3">
                            <i class="bx bx-conference text-gray-600"></i>
                        </div>
                        <h3 class="font-normal text-gray-900 text-sm sm:text-base">Conferences</h3>
                        <p class="text-xs sm:text-sm text-gray-500 mt-1">3 events</p>
                    </div>
                </div>
            </div>

            <!-- My Tickets Section -->
            <div class="mb-10 sm:mb-12">
                <h2 class="text-xl sm:text-2xl font-light text-gray-800 mb-6 sm:mb-8 tracking-wide">My Tickets</h2>
                <div class="bg-white shadow-sm rounded-md p-4 sm:p-6">
                    <div class="text-center py-8">
                        <i class="bx bx-ticket text-gray-400 mx-auto mb-4"></i>
                        <h3 class="text-lg sm:text-xl font-light text-gray-900 mb-2">No tickets yet</h3>
                        <p class="text-sm sm:text-base text-gray-600 mb-4 font-light">Purchase tickets for upcoming events
                            to see them here.</p>
                        <button
                            class="px-6 py-2.5 bg-blue-600 text-white text-sm font-normal hover:bg-blue-700 transition-colors focus:outline-none">
                            Browse Events
                        </button>
                    </div>
                </div>
            </div>

            <!-- Load More Button -->
            <div class="text-center">
                <button
                    class="px-6 py-2.5 bg-blue-600 text-white text-sm font-normal hover:bg-blue-700 transition-colors focus:outline-none">
                    Load More Events
                </button>
            </div>
        </div>
    </div>
@endsection