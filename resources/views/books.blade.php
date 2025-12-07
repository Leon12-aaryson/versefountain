@extends('layouts.app')

@section('title', 'Books - VerseFountain')

@section('content')
<div class="min-h-screen bg-stone-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <!-- Page Header -->
        <div class="mb-10 sm:mb-12">
            <h1 class="text-3xl sm:text-4xl font-light text-gray-800 mb-2 tracking-wide">Books</h1>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">Explore our vast collection of eBooks and literary works</p>
        </div>

        <!-- Search and Filter Section -->
        <div class="bg-white border border-gray-200 p-5 sm:p-6 mb-8 sm:mb-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Search -->
            <div class="sm:col-span-2 lg:col-span-1">
                <label for="search" class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Search Books</label>
                <div class="relative">
                    <input type="text" id="search" placeholder="Search books, authors, or genres..." 
                           class="w-full pl-9 pr-3 py-2 border border-gray-300 focus:border-gray-500 text-sm bg-white focus:outline-none">
                    <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Genre Filter -->
            <div>
                <label for="genre" class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Genre</label>
                <select id="genre" class="w-full px-3 py-2 border border-gray-300 focus:border-gray-500 text-sm bg-white focus:outline-none appearance-none cursor-pointer">
                    <option value="">All Genres</option>
                    <option value="fiction">Fiction</option>
                    <option value="non-fiction">Non-Fiction</option>
                    <option value="poetry">Poetry</option>
                    <option value="drama">Drama</option>
                    <option value="biography">Biography</option>
                </select>
            </div>

            <!-- Language Filter -->
            <div>
                <label for="language" class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Language</label>
                <select id="language" class="w-full px-3 py-2 border border-gray-300 focus:border-gray-500 text-sm bg-white focus:outline-none appearance-none cursor-pointer">
                    <option value="">All Languages</option>
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="italian">Italian</option>
                </select>
            </div>
        </div>
    </div>

    @php
        $featuredBooks = [
            [
                'title' => 'The Great Gatsby',
                'author' => 'F. Scott Fitzgerald',
                'genre' => 'Fiction',
                'slug' => 'great-gatsby'
            ],
            [
                'title' => 'To Kill a Mockingbird',
                'author' => 'Harper Lee',
                'genre' => 'Fiction',
                'slug' => 'to-kill-mockingbird'
            ],
            [
                'title' => '1984',
                'author' => 'George Orwell',
                'genre' => 'Fiction',
                'slug' => '1984'
            ],
            [
                'title' => 'Pride and Prejudice',
                'author' => 'Jane Austen',
                'genre' => 'Fiction',
                'slug' => 'pride-prejudice'
            ]
        ];

        $recentBooks = [
            [
                'title' => 'The Midnight Library',
                'author' => 'Matt Haig',
                'added' => '2 days ago',
                'slug' => 'midnight-library'
            ],
            [
                'title' => 'Klara and the Sun',
                'author' => 'Kazuo Ishiguro',
                'added' => '1 week ago',
                'slug' => 'klara-sun'
            ],
            [
                'title' => 'Project Hail Mary',
                'author' => 'Andy Weir',
                'added' => '2 weeks ago',
                'slug' => 'project-hail-mary'
            ]
        ];
    @endphp

    <!-- Featured Books -->
    <div class="mb-10 sm:mb-12">
        <h2 class="text-xl sm:text-2xl font-light text-gray-800 mb-6 sm:mb-8 tracking-wide">Featured Books</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            @foreach($featuredBooks as $book)
            <div class="bg-white border border-gray-200 hover:border-gray-300 transition-colors">
                <div class="h-40 sm:h-48 bg-gray-100 flex items-center justify-center">
                    <svg class="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <div class="p-4 sm:p-6">
                    <h3 class="font-normal text-gray-900 mb-1 text-sm sm:text-base">{{ $book['title'] }}</h3>
                    <p class="text-gray-600 text-xs sm:text-sm mb-3 font-light">{{ $book['author'] }}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">{{ $book['genre'] }}</span>
                        <a href="/books/{{ $book['slug'] }}" class="text-xs text-gray-700 hover:text-gray-900 font-normal uppercase tracking-wide">Read →</a>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </div>

    <!-- Book Categories -->
    <div class="mb-10 sm:mb-12">
        <h2 class="text-xl sm:text-2xl font-light text-gray-800 mb-6 sm:mb-8 tracking-wide">Browse by Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div class="bg-white border border-gray-200 p-4 sm:p-6 text-center hover:border-gray-300 transition-colors cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <h3 class="font-normal text-gray-900 text-sm sm:text-base">Fiction</h3>
                <p class="text-xs sm:text-sm text-gray-500 mt-1">2,456 books</p>
            </div>

            <div class="bg-white border border-gray-200 p-4 sm:p-6 text-center hover:border-gray-300 transition-colors cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <h3 class="font-normal text-gray-900 text-sm sm:text-base">Non-Fiction</h3>
                <p class="text-xs sm:text-sm text-gray-500 mt-1">1,234 books</p>
            </div>

            <div class="bg-white border border-gray-200 p-4 sm:p-6 text-center hover:border-gray-300 transition-colors cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                    </svg>
                </div>
                <h3 class="font-normal text-gray-900 text-sm sm:text-base">Poetry</h3>
                <p class="text-xs sm:text-sm text-gray-500 mt-1">567 books</p>
            </div>

            <div class="bg-white border border-gray-200 p-4 sm:p-6 text-center hover:border-gray-300 transition-colors cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                </div>
                <h3 class="font-normal text-gray-900 text-sm sm:text-base">Drama</h3>
                <p class="text-xs sm:text-sm text-gray-500 mt-1">234 books</p>
            </div>
        </div>
    </div>

    <!-- Recent Additions -->
    <div class="mb-10 sm:mb-12">
        <h2 class="text-xl sm:text-2xl font-light text-gray-800 mb-6 sm:mb-8 tracking-wide">Recent Additions</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            @foreach($recentBooks as $book)
            <div class="bg-white border border-gray-200 p-4 sm:p-6 hover:border-gray-300 transition-colors">
                <div class="flex items-start space-x-4">
                    <div class="w-16 h-20 sm:w-20 sm:h-24 bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 class="font-normal text-gray-900 text-sm sm:text-base mb-1">{{ $book['title'] }}</h3>
                        <p class="text-gray-600 text-xs sm:text-sm mb-2 font-light">{{ $book['author'] }}</p>
                        <p class="text-xs text-gray-500 mb-3">Added {{ $book['added'] }}</p>
                        <a href="/books/{{ $book['slug'] }}" class="text-xs text-gray-700 hover:text-gray-900 font-normal uppercase tracking-wide">Read →</a>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </div>

    <!-- Load More Button -->
    <div class="text-center">
        <button class="px-6 py-2.5 bg-gray-800 text-white text-sm font-normal hover:bg-gray-700 transition-colors">
            Load More Books
        </button>
    </div>
    </div>
</div>
@endsection 