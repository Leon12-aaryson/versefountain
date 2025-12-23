@extends('layouts.app')

@section('title', 'Welcome - VerseFountain')
@section('page-title', 'Home')

@section('content')
            <!-- Hero Section -->
            <div class="relative bg-blue-500 rounded-lg overflow-hidden mb-6">
                <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=80');"></div>
                <div class="absolute inset-0 bg-blue-500/80"></div>
                <div class="absolute inset-0 bg-black/20"></div>
                <div class="relative flex flex-col items-center justify-center text-center px-6 sm:px-8 py-16 sm:py-20">
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4">
                        Welcome to VerseFountain
                    </h1>
                    <p class="text-lg sm:text-xl text-white/90 max-w-2xl mb-8 leading-relaxed">
                        Discover a world of poetry, books, and academic resources. Connect with a community of readers and writers.
                    </p>
                    <div class="flex flex-wrap gap-3 justify-center">
                        <a href="/poetry"
                            class="bg-white text-blue-500 px-6 py-3 text-base font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500 transition-colors">
                            Explore Poetry
                        </a>
                        <a href="/books"
                            class="bg-white/20 text-white border border-white/30 px-6 py-3 text-base font-medium rounded-lg hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500 transition-colors">
                            Browse Books
                        </a>
                    </div>
                </div>
            </div>

            <!-- Featured Sections -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <!-- Poetry Section -->
                <div class="bg-white rounded-lg p-6 shadow-sm transition-colors">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <i class="bx bx-file text-xl text-blue-600"></i>
                        </div>
                        <h2 class="text-xl font-semibold text-gray-900">Poetry</h2>
                    </div>
                    <p class="text-sm text-gray-600 mb-4 leading-relaxed">Explore beautiful poems from classic and contemporary poets. Discover new voices and share your own creations.</p>
                    <a href="/poetry"
                        class="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Browse Poetry
                        <i class="bx bx-chevron-right ml-1"></i>
                    </a>
                </div>

                <!-- Books Section -->
                <div class="bg-white rounded-lg p-6 shadow-sm transition-colors">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                            <i class="bx bx-book text-xl text-blue-600"></i>
                        </div>
                        <h2 class="text-xl font-semibold text-gray-900">Books</h2>
                    </div>
                    <p class="text-sm text-gray-600 mb-4 leading-relaxed">Access a vast collection of books, from literary classics to modern bestsellers. Find your next great read.</p>
                    <a href="/books"
                        class="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Browse Books
                        <i class="bx bx-chevron-right ml-1"></i>
                    </a>
                </div>

                <!-- Academics Section -->
                <div class="bg-white rounded-lg p-6 shadow-sm transition-colors">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-blue-300 rounded-lg flex items-center justify-center mr-3">
                            <i class="bx bx-book-reader text-xl text-blue-600"></i>
                        </div>
                        <h2 class="text-xl font-semibold text-gray-900">Academics</h2>
                    </div>
                    <p class="text-sm text-gray-600 mb-4 leading-relaxed">Access academic resources, research papers, and educational materials. Enhance your learning journey.</p>
                    <a href="/academics"
                        class="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Browse Academics
                        <i class="bx bx-chevron-right ml-1"></i>
                    </a>
                </div>
            </div>

            <!-- Events Section -->
            <div class="mb-12">
                <div class="bg-white rounded-lg p-6 shadow-sm">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-semibold text-gray-900">Upcoming Events</h2>
                        <a href="/events"
                            class="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center">
                            View All <i class="bx bx-chevron-right ml-1"></i>
                        </a>
                    </div>
                    @php
                        $upcomingEvents = \App\Models\Event::where('date', '>', now())
                            ->orderBy('date', 'asc')
                            ->take(3)
                            ->get();
                    @endphp
                    @if($upcomingEvents->count() > 0)
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            @foreach($upcomingEvents as $event)
                                <div class="p-4 bg-gray-50 rounded-lg transition-colors">
                                    <div class="flex items-center mb-3">
                                        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                            <i class="bx bx-calendar text-lg text-blue-600"></i>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <h3 class="text-sm font-medium text-gray-900 line-clamp-1">
                                                <a href="{{ route('api.events.show', $event) }}" class="hover:text-blue-600 transition-colors">
                                                    {{ $event->title }}
                                                </a>
                                            </h3>
                                            <p class="text-xs text-gray-500 mt-0.5">
                                                {{ $event->date ? $event->date->format('M d, Y • g:i A') : 'Date TBA' }}
                                            </p>
                                        </div>
                                    </div>
                                    <p class="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">
                                        {{ Str::limit($event->description ?? 'No description', 100) }}
                                    </p>
                                    <a href="{{ route('api.events.show', $event) }}"
                                        class="inline-flex items-center text-sm text-blue-600 hover:text-blue-700">
                                        Learn More <i class="bx bx-chevron-right ml-1"></i>
                                    </a>
                                </div>
                            @endforeach
                        </div>
                    @else
                        <div class="text-center py-12">
                            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="bx bx-calendar text-3xl text-gray-400"></i>
                            </div>
                            <p class="text-sm text-gray-500">No upcoming events at the moment. Check back soon!</p>
                        </div>
                    @endif
                </div>
            </div>

            <!-- Call to Action -->
            <div class="bg-blue-500 rounded-lg p-8 sm:p-12 text-center">
                <h2 class="text-2xl sm:text-3xl font-semibold text-white mb-4">Join Our Community</h2>
                <p class="text-base sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Connect with fellow poetry enthusiasts, discover new authors, and participate in literary events. Start your journey today!
                </p>
                <div class="flex flex-col sm:flex-row gap-3 justify-center">
                    <a href="/register"
                        class="bg-white text-blue-500 px-6 py-3 text-base font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500 transition-colors">
                        Get Started
                    </a>
                    <a href="/poetry"
                        class="bg-white/20 text-white border border-white/30 px-6 py-3 text-base font-medium rounded-lg hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500 transition-colors">
                        Explore Poetry
                    </a>
                </div>
            </div>
        </div>
    </div>
@endsection