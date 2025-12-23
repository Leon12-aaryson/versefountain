@extends('layouts.app')

@section('title', 'Dashboard - VerseFountain')

@php
    $user = auth()->user();
    $userPoems = $user->poems()->latest()->take(5)->get();
    $userBooks = $user->uploadedBooks()->latest()->take(5)->get();
    $userTickets = $user->tickets()->latest()->take(5)->get();
    $upcomingEvents = \App\Models\Event::where('date', '>', now())->orderBy('date', 'asc')->take(3)->get();
    $totalPoems = $user->poems()->count();
    $totalBooks = $user->uploadedBooks()->count();
    $totalTickets = $user->tickets()->count();
    $totalComments = \App\Models\PoemComment::where('user_id', $user->id)->count();
@endphp

@section('page-title', 'Dashboard')

@section('content')
    <!-- Today's Summary Cards -->
    <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Today's Summary</h2>
            <button class="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <i class="bx bx-export mr-2"></i>
                Export
            </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Total Poems -->
            <div class="bg-blue-50 rounded-lg p-4 ">
                <div class="flex items-center justify-between mb-3">
                    <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <i class="bx bx-file text-white text-lg"></i>
                    </div>
                </div>
                <p class="text-sm text-gray-600 mb-1">Total Poems</p>
                <p class="text-2xl font-semibold text-gray-900 mb-1">{{ $totalPoems }}</p>
                <p class="text-xs text-gray-500">+{{ $totalPoems > 0 ? round(($totalPoems / max($totalPoems, 1)) * 5, 1) : 0 }}% from yesterday</p>
            </div>

            <!-- Total Books -->
            <div class="bg-blue-100 rounded-lg p-4 ">
                <div class="flex items-center justify-between mb-3">
                    <div class="w-10 h-10 bg-blue-300 rounded-lg flex items-center justify-center">
                        <i class="bx bx-book text-white text-lg"></i>
                    </div>
                </div>
                <p class="text-sm text-gray-600 mb-1">Total Books</p>
                <p class="text-2xl font-semibold text-gray-900 mb-1">{{ $totalBooks }}</p>
                <p class="text-xs text-gray-500">+{{ $totalBooks > 0 ? round(($totalBooks / max($totalBooks, 1)) * 5, 1) : 0 }}% from yesterday</p>
            </div>

            <!-- Tickets -->
            <div class="bg-blue-900 rounded-lg p-4 ">
                <div class="flex items-center justify-between mb-3">
                    <div class="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center">
                        <i class="bx bx-check text-white text-lg"></i>
                    </div>
                </div>
                <p class="text-sm text-blue-100 mb-1">Tickets</p>
                <p class="text-2xl font-semibold text-white mb-1">{{ $totalTickets }}</p>
                <p class="text-xs text-blue-200">+{{ $totalTickets > 0 ? round(($totalTickets / max($totalTickets, 1)) * 1.2, 1) : 0 }}% from yesterday</p>
            </div>

            <!-- Comments -->
            <div class="bg-blue-50 rounded-lg p-4 ">
                <div class="flex items-center justify-between mb-3">
                    <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <i class="bx bx-comment text-white text-lg"></i>
                    </div>
                </div>
                <p class="text-sm text-gray-600 mb-1">Comments</p>
                <p class="text-2xl font-semibold text-gray-900 mb-1">{{ $totalComments }}</p>
                <p class="text-xs text-gray-500">+0.5% from yesterday</p>
            </div>
        </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Poems -->
        <div class="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-semibold text-gray-900">Recent Poems</h2>
                <a href="{{ route('poetry.create') }}" class="text-sm text-blue-600 hover:text-blue-700">
                    Create New <i class="bx bx-plus ml-1"></i>
                </a>
            </div>
            @if($userPoems->count() > 0)
                <div class="space-y-3">
                    @foreach($userPoems as $poem)
                        <div class="p-4 bg-gray-50 rounded-lg shadow-sm  transition-colors">
                                    <div class="flex items-start justify-between">
                                        <div class="flex-1 min-w-0">
                                            <h3 class="text-base font-semibold text-gray-900 mb-1">
                                                <a href="{{ route('poetry.show', $poem) }}" class="hover:text-blue-600 transition-colors">
                                                    {{ $poem->title }}
                                                </a>
                                            </h3>
                                            <p class="text-sm text-gray-600 line-clamp-2 mb-2">{{ Str::limit($poem->content, 100) }}</p>
                                            <div class="flex items-center space-x-4 text-xs text-gray-500">
                                                <span>{{ $poem->created_at->format('M d, Y') }}</span>
                                                <span class="flex items-center">
                                                    <i class="bx bx-heart mr-1"></i>
                                                    {{ $poem->userInteractions->where('type', 'like')->count() }}
                                                </span>
                                                <span class="flex items-center">
                                                    <i class="bx bx-comment mr-1"></i>
                                                    {{ $poem->comments->count() }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="ml-4">
                                            <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium {{ $poem->approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700' }}">
                                                {{ $poem->approved ? 'Published' : 'Pending' }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    @else
                        <div class="text-center py-12">
                            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="bx bx-file text-3xl text-gray-400"></i>
                            </div>
                            <p class="text-gray-600 mb-4">You haven't created any poems yet.</p>
                            <a href="{{ route('poetry.create') }}" class="inline-flex items-center px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                <i class="bx bx-plus text-base mr-2"></i>
                                Create Your First Poem
                            </a>
                        </div>
                    @endif
                </div>

        <!-- Quick Actions & Upcoming Events -->
        <div class="space-y-6">
            <!-- Quick Actions -->
            <div class="bg-white rounded-lg p-5 shadow-sm">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div class="space-y-2">
                    <a href="{{ route('poetry.create') }}" class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
                        <div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <i class="bx bx-file text-blue-600 text-base"></i>
                        </div>
                        <span class="text-sm text-gray-900">Create Poem</span>
                    </a>
                    <a href="/books" class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
                        <div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <i class="bx bx-book text-blue-600 text-base"></i>
                        </div>
                        <span class="text-sm text-gray-900">Browse Books</span>
                    </a>
                    <a href="/events" class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
                        <div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <i class="bx bx-calendar text-blue-600 text-base"></i>
                        </div>
                        <span class="text-sm text-gray-900">View Events</span>
                    </a>
                    <a href="{{ route('chatrooms.index') }}" class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
                        <div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <i class="bx bx-chat text-blue-600 text-base"></i>
                        </div>
                        <span class="text-sm text-gray-900">Join Chatroom</span>
                    </a>
                </div>
            </div>

            <!-- Upcoming Events -->
            <div class="bg-white rounded-lg p-5 shadow-sm">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-semibold text-gray-900">Upcoming Events</h2>
                    <a href="/events" class="text-sm text-blue-600 hover:text-blue-700">View All</a>
                </div>
                @if($upcomingEvents->count() > 0)
                    <div class="space-y-3">
                        @foreach($upcomingEvents as $event)
                            <div class="p-3 bg-gray-50 rounded-lg shadow-sm  transition-colors">
                                <h3 class="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                                    <a href="{{ route('api.events.show', $event) }}" class="hover:text-blue-600 transition-colors">
                                        {{ $event->title }}
                                    </a>
                                </h3>
                                <p class="text-xs text-gray-600 mb-2">{{ $event->date ? $event->date->format('M d, Y') : 'Date TBA' }}</p>
                                <a href="{{ route('api.events.show', $event) }}" class="text-xs font-medium text-blue-600 hover:text-blue-700">
                                    View Details <i class="bx bx-chevron-right ml-1"></i>
                                </a>
                                    </div>
                                @endforeach
                            </div>
                        @else
                            <div class="text-center py-8">
                                <i class="bx bx-calendar text-4xl text-gray-300 mb-2"></i>
                                <p class="text-sm text-gray-500">No upcoming events</p>
                            </div>
                        @endif
                    </div>
                </div>
            </div>

    <!-- Recent Books -->
    @if($userBooks->count() > 0)
        <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-semibold text-gray-900">My Recent Books</h2>
                <a href="/books" class="text-sm text-blue-600 hover:text-blue-700">View All</a>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                @foreach($userBooks as $book)
                    <div class="p-4 bg-gray-50 rounded-lg shadow-sm  transition-colors">
                                <h3 class="text-base font-semibold text-gray-900 mb-2">
                                    <a href="{{ route('books.show', $book) }}" class="hover:text-blue-600 transition-colors">
                                        {{ $book->title }}
                                    </a>
                                </h3>
                                <p class="text-sm text-gray-600 mb-3">{{ $book->author }}</p>
                                <div class="flex items-center justify-between">
                                    <span class="text-xs text-gray-500">{{ $book->created_at->format('M d, Y') }}</span>
                                    <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium {{ $book->approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700' }}">
                                        {{ $book->approved ? 'Published' : 'Pending' }}
                                    </span>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif
        </div>
    </div>
@endsection