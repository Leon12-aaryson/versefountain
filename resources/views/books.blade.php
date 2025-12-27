@extends('layouts.app')

@section('title', 'Books - VerseFountain')

@section('content')
    <div class="min-h-screen">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <!-- Page Header -->
            <div class="mb-8">
                <h1 class="text-3xl sm:text-4xl font-semibold text-gray-900 mb-2">Books</h1>
                <p class="text-base text-gray-600 leading-relaxed max-w-2xl">Explore our vast collection of eBooks and literary works</p>
            </div>

            <!-- Search and Filter Section -->
            <div class="bg-white rounded-lg p-5 shadow-sm mb-8">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Search -->
                    <div class="sm:col-span-2 lg:col-span-1">
                        <label for="search"
                            class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Search
                            Books</label>
                        <div class="relative">
                            <input type="text" id="search" placeholder="Search books, authors, or genres..."
                                class="w-full pl-9 pr-3 py-2 border border-gray-300 focus:border-blue-600 text-sm bg-white focus:outline-none">
                            <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                <i class="bx bx-search text-base text-gray-400"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Genre Filter -->
                    <div>
                        <label for="genre"
                            class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Genre</label>
                        <select id="genre"
                            class="w-full px-3 py-2 border border-gray-300 focus:border-blue-600 text-sm bg-white focus:outline-none appearance-none cursor-pointer">
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
                        <label for="language"
                            class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Language</label>
                        <select id="language"
                            class="w-full px-3 py-2 border border-gray-300 focus:border-blue-600 text-sm bg-white focus:outline-none appearance-none cursor-pointer">
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

            <!-- Featured Books -->
            @if($featuredBooks->count() > 0)
                <div class="mb-10">
                    <h2 class="text-xl font-semibold text-gray-900 mb-6">Featured Books</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        @foreach($featuredBooks as $book)
                            <div class="bg-white rounded-lg shadow-sm transition-colors overflow-hidden">
                                <div class="h-40 sm:h-48 bg-gray-100 flex items-center justify-center">
                                    @if($book->coverImage)
                                        <img src="{{ $book->coverImage }}" alt="{{ $book->title }}" class="w-full h-full object-cover">
                                    @else
                                        <i class="bx bx-book text-6xl text-gray-400"></i>
                                    @endif
                                </div>
                                <div class="p-4 sm:p-6">
                                    <h3 class="font-normal text-gray-900 mb-1 text-sm sm:text-base">
                                        <a href="{{ route('books.show', $book) }}" class="hover:text-gray-700">
                                            {{ $book->title }}
                                        </a>
                                    </h3>
                                    <p class="text-gray-600 text-xs sm:text-sm mb-3 font-light">{{ $book->author }}</p>
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs text-gray-500">{{ $book->genre ?? 'General' }}</span>
                                        <a href="{{ route('books.show', $book) }}"
                                            class="text-xs text-gray-700 hover:text-gray-900 font-normal uppercase tracking-wide">Read
                                            →</a>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif

            <!-- Book Categories -->
            @if($genres->count() > 0)
                <div class="mb-10 sm:mb-12">
                    <h2 class="text-xl sm:text-2xl font-light text-gray-800 mb-6 sm:mb-8 tracking-wide">Browse by Category</h2>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        @foreach($genres->take(4) as $genre)
                            @php
                                $genreCount = \App\Models\Book::where('genre', $genre)->where('approved', true)->count();
                                $icons = [
                                    'Fiction' => 'bx-book',
                                    'Non-Fiction' => 'bx-file',
                                    'Poetry' => 'bx-book-reader',
                                    'Drama' => 'bx-theatre',
                                    'Biography' => 'bx-user',
                                ];
                                $icon = $icons[$genre] ?? 'bx-book';
                            @endphp
                            <a href="/books?genre={{ urlencode($genre) }}"
                                class="bg-white shadow-sm rounded-md p-4 sm:p-6 transition-colors cursor-pointer block">
                                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                    <i class="bx {{ $icon }} text-xl sm:text-2xl text-gray-600"></i>
                                </div>
                                <h3 class="font-normal text-gray-900 text-sm sm:text-base">{{ $genre }}</h3>
                                <p class="text-xs sm:text-sm text-gray-500 mt-1">{{ $genreCount }}
                                    {{ $genreCount === 1 ? 'book' : 'books' }}</p>
                            </a>
                        @endforeach
                    </div>
                </div>
            @endif

            <!-- Recent Additions -->
            <div class="mb-10">
                <h2 class="text-xl font-semibold text-gray-900 mb-6">Recent Additions</h2>
                @if($recentBooks->count() > 0)
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        @foreach($recentBooks as $book)
                            <div class="bg-white rounded-lg shadow-sm p-5 transition-colors">
                                <div class="flex items-start space-x-4">
                                    <div
                                        class="w-16 h-20 sm:w-20 sm:h-24 bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        @if($book->coverImage)
                                            <img src="{{ $book->coverImage }}" alt="{{ $book->title }}"
                                                class="w-full h-full object-cover">
                                        @else
                                            <i class="bx bx-book text-4xl sm:text-5xl text-gray-400"></i>
                                        @endif
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <h3 class="font-normal text-gray-900 text-sm sm:text-base mb-1">
                                            <a href="{{ route('books.show', $book) }}" class="hover:text-gray-700">
                                                {{ $book->title }}
                                            </a>
                                        </h3>
                                        <p class="text-gray-600 text-xs sm:text-sm mb-2 font-light">{{ $book->author }}</p>
                                        <p class="text-xs text-gray-500 mb-3">Added {{ $book->created_at->diffForHumans() }}</p>
                                        @if($book->description)
                                            <p class="text-xs text-gray-600 mb-3 line-clamp-2">{{ Str::limit($book->description, 80) }}
                                            </p>
                                        @endif
                                        <a href="{{ route('books.show', $book) }}"
                                            class="text-xs text-gray-700 hover:text-gray-900 font-normal uppercase tracking-wide">Read
                                            →</a>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>

                    <!-- Pagination -->
                    @if($recentBooks->hasPages())
                        <div class="text-center mt-10 sm:mt-12">
                            {{ $recentBooks->links() }}
                        </div>
                    @endif
                @else
                    <div class="text-center py-16 sm:py-20">
                        <div class="max-w-md mx-auto">
                            <i class="bx bx-book text-6xl text-gray-300 mb-4"></i>
                            <h3 class="text-lg font-normal text-gray-700 mb-2">No books yet</h3>
                            <p class="text-sm text-gray-500 mb-6">Check back soon for new book additions.</p>
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </div>
@endsection