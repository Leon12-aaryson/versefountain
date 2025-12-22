@extends('layouts.app')

@section('title', 'Welcome - VerseFountain')

@section('content')
    <div class="min-h-screen bg-stone-50">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <!-- Hero Section -->
            <div class="bg-white border-2 border-gray-200 rounded-md overflow-hidden mb-10 sm:mb-12">
                <div class="relative flex flex-col md:block">
                    <img src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                        alt="Library books on shelves" class="w-full h-48 sm:h-56 md:h-64 lg:h-96 object-cover" />
                    <div class="absolute inset-0 bg-black/60 md:bg-black/50 flex flex-col justify-end p-4 sm:p-6 md:p-8">
                        <h1
                            class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-white mb-2 sm:mb-3 tracking-wide">
                            Welcome to VerseFountain</h1>
                        <p
                            class="text-xs sm:text-sm md:text-base text-gray-200 max-w-full md:max-w-lg mb-4 sm:mb-5 leading-relaxed">
                            Discover a world of poetry, books, and academic resources. Connect with a community of readers
                            and writers.</p>
                        <div class="flex flex-wrap gap-2 sm:gap-3">
                            <a href="/poetry"
                                class="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm md:text-base py-2 px-4 sm:py-2.5 sm:px-5 md:py-3 md:px-6 font-normal transition-colors inline-flex items-center">
                                Explore Poetry
                            </a>
                            <a href="/books"
                                class="bg-white hover:bg-gray-50 text-gray-800 text-xs sm:text-sm md:text-base py-2 px-4 sm:py-2.5 sm:px-5 md:py-3 md:px-6 font-normal transition-colors inline-flex items-center border border-gray-200">
                                Browse Books
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Featured Sections -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-10 sm:mb-12">
                <!-- Poetry Section -->
                <div class="bg-white border-2 border-gray-200 rounded-md p-5 sm:p-6 hover:border-gray-300 transition-colors">
                    <div class="flex items-center mb-4 sm:mb-5">
                        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mr-3 sm:mr-4">
                            <i class="bx bx-file text-xl sm:text-2xl text-gray-600"></i>
                        </div>
                        <h2 class="text-lg sm:text-xl font-light text-gray-900 tracking-wide">Poetry</h2>
                    </div>
                    <p class="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 leading-relaxed font-light">Explore beautiful
                        poems from classic and contemporary poets. Discover new voices and share your own creations.</p>
                    <a href="/poetry"
                        class="inline-flex items-center text-gray-700 hover:text-gray-900 text-sm sm:text-base font-normal uppercase tracking-wide">
                        Browse Poetry
                        <i class="bx bx-chevron-right text-base ml-1"></i>
                    </a>
                </div>

                <!-- Books Section -->
                <div class="bg-white border-2 border-gray-200 rounded-md p-5 sm:p-6 hover:border-gray-300 transition-colors">
                    <div class="flex items-center mb-4 sm:mb-5">
                        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mr-3 sm:mr-4">
                            <i class="bx bx-book text-xl sm:text-2xl text-gray-600"></i>
                        </div>
                        <h2 class="text-lg sm:text-xl font-light text-gray-900 tracking-wide">Books</h2>
                    </div>
                    <p class="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 leading-relaxed font-light">Access a vast
                        collection of books, from literary classics to modern bestsellers. Find your next great read.</p>
                    <a href="/books"
                        class="inline-flex items-center text-gray-700 hover:text-gray-900 text-sm sm:text-base font-normal uppercase tracking-wide">
                        Browse Books
                        <i class="bx bx-chevron-right text-base ml-1"></i>
                    </a>
                </div>

                <!-- Academics Section -->
                <div class="bg-white border-2 border-gray-200 rounded-md p-5 sm:p-6 hover:border-gray-300 transition-colors">
                    <div class="flex items-center mb-4 sm:mb-5">
                        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mr-3 sm:mr-4">
                            <i class="bx bx-book-reader text-xl sm:text-2xl text-gray-600"></i>
                        </div>
                        <h2 class="text-lg sm:text-xl font-light text-gray-900 tracking-wide">Academics</h2>
                    </div>
                    <p class="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 leading-relaxed font-light">Access academic
                        resources, research papers, and educational materials. Enhance your learning journey.</p>
                    <a href="/academics"
                        class="inline-flex items-center text-gray-700 hover:text-gray-900 text-sm sm:text-base font-normal uppercase tracking-wide">
                        Browse Academics
                        <i class="bx bx-chevron-right text-base ml-1"></i>
                    </a>
                </div>
            </div>

            <!-- Events Section -->
            <div class="mb-10 sm:mb-12">
                <div class="bg-white border-2 border-gray-200 rounded-md p-5 sm:p-6 lg:p-8">
                    <div class="flex items-center justify-between mb-6 sm:mb-8">
                        <h2 class="text-xl sm:text-2xl font-light text-gray-800 tracking-wide">Upcoming Events</h2>
                        <a href="/events"
                            class="text-xs text-gray-600 hover:text-gray-900 font-normal uppercase tracking-wide">View All
                            →</a>
                    </div>
                    @php
                        $upcomingEvents = \App\Models\Event::where('date', '>', now())
                            ->orderBy('date', 'asc')
                            ->take(3)
                            ->get();
                    @endphp
                    @if($upcomingEvents->count() > 0)
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                            @foreach($upcomingEvents as $event)
                                <div class="border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                                    <div class="flex items-center mb-3">
                                        <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 flex items-center justify-center mr-3">
                                            <i class="bx bx-calendar text-xl sm:text-2xl text-gray-600"></i>
                                        </div>
                                        <div>
                                            <h3 class="text-sm sm:text-base font-normal text-gray-900">
                                                <a href="{{ route('api.events.show', $event) }}" class="hover:text-gray-700">
                                                    {{ $event->title }}
                                                </a>
                                            </h3>
                                            <p class="text-xs sm:text-sm text-gray-500">
                                                {{ $event->date ? $event->date->format('M d, Y • g:i A') : 'Date TBA' }}</p>
                                        </div>
                                    </div>
                                    <p class="text-xs sm:text-sm text-gray-600 mb-3 font-light leading-relaxed">
                                        {{ Str::limit($event->description ?? 'No description', 80) }}</p>
                                    <a href="{{ route('api.events.show', $event) }}"
                                        class="text-xs text-gray-700 hover:text-gray-900 font-normal uppercase tracking-wide">Learn
                                        More →</a>
                                </div>
                            @endforeach
                        </div>
                    @else
                        <div class="text-center py-12">
                            <i class="bx bx-calendar text-5xl text-gray-300 mb-4"></i>
                            <p class="text-sm text-gray-500">No upcoming events at the moment. Check back soon!</p>
                        </div>
                    @endif
                </div>
            </div>

            <!-- Call to Action -->
            <div class="bg-blue-600 border border-gray-700 p-6 sm:p-8 lg:p-12 text-center">
                <h2 class="text-xl sm:text-2xl lg:text-3xl font-light text-white mb-3 sm:mb-4 tracking-wide">Join Our
                    Community</h2>
                <p
                    class="text-sm sm:text-base lg:text-lg text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed font-light">
                    Connect with fellow poetry enthusiasts, discover new authors, and participate in literary events. Start
                    your journey today!</p>
                <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <a href="/register"
                        class="bg-white text-gray-800 px-6 py-3 font-normal hover:bg-gray-100 transition-colors text-sm sm:text-base">
                        Get Started
                    </a>
                    <a href="/poetry"
                        class="border border-white text-white px-6 py-3 font-normal hover:bg-white hover:text-gray-800 transition-colors text-sm sm:text-base">
                        Explore Poetry
                    </a>
                </div>
            </div>
        </div>
    </div>
@endsection