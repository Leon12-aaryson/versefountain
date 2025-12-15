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
                                <i class="bx bx-plus text-base mr-2"></i>
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
                                <i class="bx bx-search text-base text-gray-400"></i>
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

            <!-- Poems Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                @forelse($poems as $poem)
                    <div class="bg-white border border-gray-200 hover:border-gray-300 transition-colors"
                         x-data="poemCard({{ $poem->id }}, {{ auth()->check() && $poem->userInteractions->where('user_id', auth()->id())->where('type', 'like')->count() > 0 ? 'true' : 'false' }}, {{ auth()->check() ? ($poem->userInteractions->where('user_id', auth()->id())->where('type', 'rating')->first()?->rating ?? 0) : 0 }})">
                        <div class="p-6 sm:p-8">
                            <!-- Title -->
                            <h3 class="text-lg font-normal text-gray-900 mb-4 leading-snug">
                                <a href="{{ route('poetry.show', $poem) }}" class="hover:text-gray-700">
                                    {{ $poem->title }}
                                </a>
                            </h3>
                            
                            <!-- Poem Excerpt -->
                            <p class="text-sm text-gray-700 mb-6 line-clamp-4 leading-relaxed font-light">
                                {{ Str::limit($poem->content, 150) }}
                            </p>
                            
                            <!-- Author and Year -->
                            <div class="mb-6 pb-6 border-b border-gray-200">
                                <p class="text-xs text-gray-600 font-normal">{{ $poem->author->first_name ?? 'Anonymous' }} {{ $poem->author->last_name ?? '' }}</p>
                                <p class="text-xs text-gray-500 mt-0.5">{{ $poem->created_at->format('Y') }}</p>
                            </div>
                            
                            <!-- Engagement Metrics and Read More -->
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-4 text-xs text-gray-500">
                                    <!-- Likes -->
                                    <button @click="toggleLike()" 
                                            :class="isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'"
                                            class="flex items-center space-x-1 transition-colors">
                                        <i :class="isLiked ? 'bx bxs-heart' : 'bx bx-heart'" class="text-sm"></i>
                                        <span x-text="likesCount">{{ $poem->userInteractions->where('type', 'like')->count() }}</span>
                                    </button>
                                    
                                    <!-- Comments -->
                                    <a href="{{ route('poetry.show', $poem) }}" class="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                                        <i class="bx bx-comment text-sm"></i>
                                        <span>{{ $poem->comments->count() }}</span>
                                    </a>
                                    
                                    <!-- Rating -->
                                    <div class="flex items-center space-x-1">
                                        @for($i = 1; $i <= 5; $i++)
                                            <button @click="ratePoem({{ $i }})" 
                                                    @mouseenter="hoverRating = {{ $i }}"
                                                    @mouseleave="hoverRating = 0"
                                                    class="transition-colors cursor-pointer"
                                                    :class="(hoverRating >= {{ $i }} || currentRating >= {{ $i }}) ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400'">
                                                <i :class="(hoverRating >= {{ $i }} || currentRating >= {{ $i }}) ? 'bx bxs-star' : 'bx bx-star'" class="text-xs"></i>
                                            </button>
                                        @endfor
                                    </div>
                                </div>
                                
                                <!-- Read More Link -->
                                <a href="{{ route('poetry.show', $poem) }}" class="text-xs text-gray-700 hover:text-gray-900 font-normal uppercase tracking-wide">
                                    Read →
                                </a>
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="col-span-full text-center py-16 sm:py-20">
                        <div class="max-w-md mx-auto">
                            <i class="bx bx-file text-6xl text-gray-300 mb-4"></i>
                            <h3 class="text-lg font-normal text-gray-700 mb-2">No poems yet</h3>
                            <p class="text-sm text-gray-500 mb-6">Be the first to share your poetry with the community.</p>
                            @auth
                                <a href="{{ route('poetry.create') }}" 
                                   class="inline-flex items-center px-5 py-2.5 bg-gray-800 text-white text-sm font-normal rounded-sm hover:bg-gray-700 transition-colors">
                                    <i class="bx bx-plus text-base mr-2"></i>
                                    Create Your First Poem
                                </a>
                            @else
                                <a href="{{ route('register') }}" 
                                   class="inline-flex items-center px-5 py-2.5 bg-gray-800 text-white text-sm font-normal rounded-sm hover:bg-gray-700 transition-colors">
                                    <i class="bx bx-user-plus text-base mr-2"></i>
                                    Sign Up to Get Started
                                </a>
                            @endauth
                        </div>
                    </div>
                @endforelse
            </div>

            <!-- Pagination -->
            @if($poems->hasPages())
                <div class="text-center mt-10 sm:mt-12">
                    {{ $poems->links() }}
                </div>
            @endif
        </div>
    </div>

    <script>
    function poemCard(poemId, initialLiked, initialRating) {
        return {
            poemId: poemId,
            isLiked: initialLiked,
            likesCount: 0,
            currentRating: initialRating || 0,
            hoverRating: 0,
            avgRating: 0,
            ratingCount: 0,
            
            init() {
                // Initialize with current state
                const likesElement = this.$el.querySelector('[x-text="likesCount"]');
                if (likesElement) {
                    this.likesCount = parseInt(likesElement.textContent) || 0;
                }
                
                // Fetch user's current rating and stats
                @auth
                this.fetchUserRating();
                @endauth
            },
            
            async fetchUserRating() {
                try {
                    const response = await fetch(`{{ url('/api/poems') }}/${this.poemId}/user-status`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        credentials: 'same-origin'
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        this.currentRating = parseInt(data.rating || 0);
                        this.avgRating = parseFloat(data.average_rating || 0).toFixed(1);
                        this.ratingCount = parseInt(data.rating_count || 0);
                    }
                } catch (error) {
                    console.error('Error fetching user rating:', error);
                }
            },
            
            async toggleLike() {
                @guest
                    window.location.href = '/login';
                    return;
                @endguest
                
                try {
                    const response = await fetch(`{{ url('/api/poems') }}/${this.poemId}/like`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        credentials: 'same-origin'
                    });
                    
                    if (!response.ok) {
                        if (response.status === 401) {
                            window.location.href = '/login';
                            return;
                        }
                        throw new Error('Failed to toggle like');
                    }
                    
                    const data = await response.json();
                    this.isLiked = data.liked;
                    this.likesCount = data.likes_count;
                } catch (error) {
                    console.error('Error toggling like:', error);
                }
            },
            
            async ratePoem(rating) {
                @guest
                    window.location.href = '/login';
                    return;
                @endguest
                
                try {
                    const response = await fetch(`{{ url('/api/poems') }}/${this.poemId}/rate`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify({ rating: rating })
                    });
                    
                    if (!response.ok) {
                        if (response.status === 401) {
                            window.location.href = '/login';
                            return;
                        }
                        throw new Error('Failed to rate poem');
                    }
                    
                    const data = await response.json();
                    this.currentRating = parseInt(data.rating);
                    this.avgRating = parseFloat(data.average_rating).toFixed(1);
                    if (data.rating_count !== undefined) {
                        this.ratingCount = parseInt(data.rating_count);
                    }
                } catch (error) {
                    console.error('Error rating poem:', error);
                }
            }
        }
    }
    </script>

    <style>
        .line-clamp-4 {
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    </style>
@endsection