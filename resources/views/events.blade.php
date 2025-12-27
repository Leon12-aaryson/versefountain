@extends('layouts.app')

@section('title', 'Events - VerseFountain')

@section('content')
    <div class="min-h-screen">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <!-- Page Header -->
            <div class="mb-8">
                <h1 class="text-3xl sm:text-4xl font-semibold text-gray-900 mb-2">Events</h1>
                <p class="text-base text-gray-600 leading-relaxed max-w-2xl">Discover poetry readings, workshops, and literary events</p>
            </div>

            <!-- Search and Filter Section -->
            <div class="bg-white rounded-lg p-5 shadow-sm mb-8">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Search -->
                    <div class="sm:col-span-2 lg:col-span-1">
                        <label for="search"
                            class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Search
                            Events</label>
                        <div class="relative">
                            <input type="text" id="search" placeholder="Search events, locations, or organizers..."
                                class="w-full pl-9 pr-3 py-2 border border-gray-300 focus:border-blue-600 text-sm bg-white focus:outline-none">
                            <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                <i class="bx bx-search text-base text-gray-400"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Category Filter -->
                    <div>
                        <label for="category"
                            class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Category</label>
                        <select id="category"
                            class="w-full px-3 py-2 border border-gray-300 focus:border-blue-600 text-sm bg-white focus:outline-none appearance-none cursor-pointer">
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
                            class="w-full px-3 py-2 border border-gray-300 focus:border-blue-600 text-sm bg-white focus:outline-none appearance-none cursor-pointer">
                            <option value="">All Dates</option>
                            <option value="today">Today</option>
                            <option value="tomorrow">Tomorrow</option>
                            <option value="this-week">This Week</option>
                            <option value="this-month">This Month</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Featured Events -->
            @if($featuredEvents->count() > 0)
                <div class="mb-10">
                    <h2 class="text-xl font-semibold text-gray-900 mb-6">Featured Events</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        @foreach($featuredEvents as $event)
                            <div class="bg-white rounded-lg shadow-sm transition-colors overflow-hidden">
                                <div class="h-40 sm:h-48 bg-gray-100 flex items-center justify-center">
                                    <i class="bx bx-calendar text-6xl text-gray-400"></i>
                                </div>
                                <div class="p-4 sm:p-6">
                                    <div class="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                                        <span
                                            class="text-xs text-gray-600 uppercase tracking-wide">{{ ucfirst(str_replace('_', ' ', $event->category ?? 'General')) }}</span>
                                        <span
                                            class="text-xs text-gray-500">{{ $event->isFree ? 'Free' : '$' . ($event->ticketPrice ?? 0) }}</span>
                                    </div>
                                    <h3 class="font-normal text-gray-900 mb-1 text-sm sm:text-base">
                                        <a href="{{ route('api.events.show', $event) }}" class="hover:text-gray-700">
                                            {{ $event->title }}
                                        </a>
                                    </h3>
                                    <p class="text-gray-600 text-xs sm:text-sm mb-3 font-light">
                                        {{ Str::limit($event->description ?? 'No description', 80) }}</p>
                                    <div class="flex items-center text-xs text-gray-500 mb-3">
                                        <i class="bx bx-map mr-1 text-sm"></i>
                                        <span>{{ $event->location ?? 'Location TBA' }}</span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span
                                            class="text-xs text-gray-500">{{ $event->date ? $event->date->format('M d, Y • g:i A') : 'Date TBA' }}</span>
                                        @auth
                                            <a href="{{ route('tickets.index') }}?event={{ $event->id }}"
                                                class="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-normal hover:bg-blue-700 transition-colors inline-block">
                                                Register
                                            </a>
                                        @else
                                            <a href="{{ route('login') }}"
                                                class="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-normal hover:bg-blue-700 transition-colors inline-block">
                                                Register
                                            </a>
                                        @endauth
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif

            <!-- Upcoming Events -->
            <div class="mb-10 sm:mb-12">
                <h2 class="text-xl sm:text-2xl font-light text-gray-800 mb-6 sm:mb-8 tracking-wide">Upcoming Events</h2>
                @if($upcomingEvents->count() > 0)
                    <div class="space-y-5 sm:space-y-6">
                        @foreach($upcomingEvents as $event)
                            <div class="bg-white shadow-sm rounded-md p-4 sm:p-6 transition-colors">
                                <div class="flex items-start space-x-4">
                                    <div
                                        class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        <i class="bx bx-calendar text-4xl sm:text-5xl text-gray-400"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-center justify-between mb-2">
                                            <span
                                                class="text-xs text-gray-600 uppercase tracking-wide">{{ ucfirst(str_replace('_', ' ', $event->category ?? 'General')) }}</span>
                                            <span
                                                class="text-xs text-gray-500">{{ $event->isFree ? 'Free' : '$' . ($event->ticketPrice ?? 0) }}</span>
                                        </div>
                                        <h3 class="font-normal text-gray-900 text-sm sm:text-base mb-1">
                                            <a href="{{ route('api.events.show', $event) }}" class="hover:text-gray-700">
                                                {{ $event->title }}
                                            </a>
                                        </h3>
                                        <p class="text-gray-600 text-xs sm:text-sm mb-3 font-light">
                                            {{ Str::limit($event->description ?? 'No description', 100) }}</p>
                                        <div class="flex items-center text-xs text-gray-500 mb-3">
                                            <i class="bx bx-map mr-1 text-sm"></i>
                                            <span>{{ $event->location ?? 'Location TBA' }}</span>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <span
                                                class="text-xs text-gray-500">{{ $event->date ? $event->date->format('M d, Y • g:i A') : 'Date TBA' }}</span>
                                            @auth
                                                <a href="{{ route('tickets.index') }}?event={{ $event->id }}"
                                                    class="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-normal hover:bg-blue-700 transition-colors inline-block">
                                                    Register
                                                </a>
                                            @else
                                                <a href="{{ route('login') }}"
                                                    class="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-normal hover:bg-blue-700 transition-colors inline-block">
                                                    Register
                                                </a>
                                            @endauth
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>

                    <!-- Pagination -->
                    @if($upcomingEvents->hasPages())
                        <div class="text-center mt-10 sm:mt-12">
                            {{ $upcomingEvents->links() }}
                        </div>
                    @endif
                @else
                    <div class="text-center py-16 sm:py-20">
                        <div class="max-w-md mx-auto">
                            <i class="bx bx-calendar text-6xl text-gray-300 mb-4"></i>
                            <h3 class="text-lg font-normal text-gray-700 mb-2">No upcoming events</h3>
                            <p class="text-sm text-gray-500 mb-6">Check back soon for new events and workshops.</p>
                        </div>
                    </div>
                @endif
            </div>

            <!-- Event Categories -->
            @if($categories->count() > 0)
                <div class="mb-10 sm:mb-12">
                    <h2 class="text-xl sm:text-2xl font-light text-gray-800 mb-6 sm:mb-8 tracking-wide">Browse by Category</h2>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        @foreach($categories->take(4) as $category)
                            @php
                                $categoryCount = \App\Models\Event::where('category', $category)->where('date', '>', now())->count();
                                $icons = [
                                    'poetry' => 'bx-book',
                                    'workshop' => 'bx-bulb',
                                    'book_launch' => 'bx-book-reader',
                                    'lecture' => 'bx-chalkboard',
                                    'general' => 'bx-calendar',
                                ];
                                $icon = $icons[$category] ?? 'bx-calendar';
                            @endphp
                            <a href="/events?category={{ urlencode($category) }}"
                                class="bg-white shadow-sm rounded-md p-4 sm:p-6 transition-colors cursor-pointer block">
                                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                    <i class="bx {{ $icon }} text-xl sm:text-2xl text-gray-600"></i>
                                </div>
                                <h3 class="font-normal text-gray-900 text-sm sm:text-base">
                                    {{ ucfirst(str_replace('_', ' ', $category)) }}</h3>
                                <p class="text-xs sm:text-sm text-gray-500 mt-1">{{ $categoryCount }}
                                    {{ $categoryCount === 1 ? 'event' : 'events' }}</p>
                            </a>
                        @endforeach
                    </div>
                </div>
            @endif
        </div>
    </div>
@endsection