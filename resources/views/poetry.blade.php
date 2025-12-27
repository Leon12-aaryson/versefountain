@extends('layouts.app')

@section('title', 'Poetry - VerseFountain')

@section('content')
    <div class="min-h-screen">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <!-- Page Header -->
            <div class="mb-8">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div class="mb-6 sm:mb-0">
                        <h1 class="text-3xl sm:text-4xl font-semibold text-gray-900 mb-2">
                            Poetry
                        </h1>
                        <p class="text-base text-gray-600 leading-relaxed max-w-2xl">
                            Discover beautiful poems from classic and contemporary poets
                        </p>
                    </div>
                    @auth
                        <div class="mt-4 sm:mt-0">
                            <a href="{{ route('poetry.create') }}"
                                class="inline-flex items-center px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                                <i class="bx bx-plus text-base mr-2"></i>
                                Create Poem
                            </a>
                        </div>
                    @endauth
                </div>
            </div>

            <!-- Search and Filter Section -->
            <div class="bg-white rounded-lg p-5 shadow-sm mb-8">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Search -->
                    <div class="sm:col-span-2 lg:col-span-1">
                        <label for="search" class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Search Poems</label>
                        <div class="relative">
                            <input type="text" id="search" placeholder="Search by title, author, or content..."
                                class="w-full pl-9 pr-3 py-2 shadow-sm focus:border-blue-600 text-sm bg-white focus:outline-none">
                            <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                <i class="bx bx-search text-base text-gray-400"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Category Filter -->
                    <div>
                        <label for="category" class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Category</label>
                        <select id="category"
                            class="w-full px-3 py-2 shadow-sm focus:border-blue-600 text-sm bg-white focus:outline-none appearance-none cursor-pointer">
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
                            class="w-full px-3 py-2 shadow-sm focus:border-blue-600 text-sm bg-white focus:outline-none appearance-none cursor-pointer">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="popular">Most Popular</option>
                            <option value="title">Title A-Z</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Poems Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                @forelse($poems as $poem)
                    <div class="bg-white rounded-lg shadow-sm  focus-within:border-blue-400 transition-colors"
                         data-poem-card
                         data-poem-id="{{ $poem->id }}"
                         data-initial-liked="{{ auth()->check() && $poem->userInteractions->where('user_id', auth()->id())->where('type', 'like')->count() > 0 ? 'true' : 'false' }}"
                         data-initial-rating="{{ auth()->check() ? ($poem->userInteractions->where('user_id', auth()->id())->where('type', 'rating')->first()?->rating ?? 0) : 0 }}">
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
                                    <button data-like-button
                                            class="flex items-center space-x-1 transition-colors {{ auth()->check() && $poem->userInteractions->where('user_id', auth()->id())->where('type', 'like')->count() > 0 ? 'text-red-500' : 'text-gray-500 hover:text-red-500' }}">
                                        <i class="{{ auth()->check() && $poem->userInteractions->where('user_id', auth()->id())->where('type', 'like')->count() > 0 ? 'bx bxs-heart' : 'bx bx-heart' }} text-sm"></i>
                                        <span data-likes-count>{{ $poem->userInteractions->where('type', 'like')->count() }}</span>
                                    </button>
                                    
                                    <!-- Comments -->
                                    <a href="{{ route('poetry.show', $poem) }}" class="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                                        <i class="bx bx-comment text-sm"></i>
                                        <span>{{ $poem->comments->count() }}</span>
                                    </a>
                                    
                                    <!-- Rating -->
                                    <div class="flex items-center space-x-1">
                                        @for($i = 1; $i <= 5; $i++)
                                            @php
                                                $userRating = auth()->check() ? ($poem->userInteractions->where('user_id', auth()->id())->where('type', 'rating')->first()?->rating ?? 0) : 0;
                                                $isActive = $userRating >= $i;
                                            @endphp
                                            <button data-rating="{{ $i }}"
                                                    class="transition-colors cursor-pointer {{ $isActive ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400' }}">
                                                <i class="{{ $isActive ? 'bx bxs-star' : 'bx bx-star' }} text-xs"></i>
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
                    <div class="col-span-full text-center py-20">
                        <div class="max-w-md mx-auto">
                            <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i class="bx bx-file text-5xl text-blue-500"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-gray-900 mb-3">No poems yet</h3>
                            <p class="text-base text-gray-600 mb-8">Be the first to share your poetry with the community.</p>
                            @auth
                                <a href="{{ route('poetry.create') }}" 
                                   class="inline-flex items-center px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                                    <i class="bx bx-plus text-base mr-2"></i>
                                    Create Your First Poem
                                </a>
                            @else
                                <a href="{{ route('register') }}" 
                                   class="inline-flex items-center px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
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
    // Poem card functionality (vanilla JavaScript)
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('[data-poem-card]').forEach(card => {
            const poemId = card.getAttribute('data-poem-id');
            const initialLiked = card.getAttribute('data-initial-liked') === 'true';
            const initialRating = parseInt(card.getAttribute('data-initial-rating') || '0');
            
            let isLiked = initialLiked;
            let likesCount = parseInt(card.querySelector('[data-likes-count]')?.textContent || '0');
            let currentRating = initialRating;
            let hoverRating = 0;
            
            // Like button
            const likeButton = card.querySelector('[data-like-button]');
            if (likeButton) {
                likeButton.addEventListener('click', async function() {
                    @guest
                        window.location.href = '/login';
                        return;
                    @endguest
                    
                    try {
                        const response = await fetch(`/api/poems/${poemId}/like`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                                'Accept': 'application/json'
                            },
                            credentials: 'same-origin'
                        });
                        
                        if (response.ok) {
                            const data = await response.json();
                            isLiked = data.liked;
                            likesCount = data.likes_count;
                            
                            const icon = likeButton.querySelector('i');
                            const countSpan = card.querySelector('[data-likes-count]');
                            
                            if (icon) {
                                icon.className = isLiked ? 'bx bxs-heart text-sm' : 'bx bx-heart text-sm';
                            }
                            if (countSpan) {
                                countSpan.textContent = likesCount;
                            }
                            likeButton.className = likeButton.className.replace(/text-(red|gray)-500/g, '') + (isLiked ? ' text-red-500' : ' text-gray-500 hover:text-red-500');
                        }
                    } catch (error) {
                        console.error('Error toggling like:', error);
                    }
                });
            }
            
            // Rating buttons
            for (let i = 1; i <= 5; i++) {
                const ratingButton = card.querySelector(`[data-rating="${i}"]`);
                if (ratingButton) {
                    ratingButton.addEventListener('click', async function() {
                        @guest
                            window.location.href = '/login';
                            return;
                        @endguest
                        
                        try {
                            const response = await fetch(`/api/poems/${poemId}/rate`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                                    'Accept': 'application/json'
                                },
                                body: JSON.stringify({ rating: i }),
                                credentials: 'same-origin'
                            });
                            
                            if (response.ok) {
                                const data = await response.json();
                                currentRating = parseInt(data.rating);
                                updateRatingDisplay();
                            }
                        } catch (error) {
                            console.error('Error rating poem:', error);
                        }
                    });
                    
                    ratingButton.addEventListener('mouseenter', function() {
                        hoverRating = i;
                        updateRatingDisplay();
                    });
                    
                    ratingButton.addEventListener('mouseleave', function() {
                        hoverRating = 0;
                        updateRatingDisplay();
                    });
                }
            }
            
            function updateRatingDisplay() {
                for (let i = 1; i <= 5; i++) {
                    const btn = card.querySelector(`[data-rating="${i}"]`);
                    const icon = btn?.querySelector('i');
                    if (btn && icon) {
                        const isActive = hoverRating >= i || currentRating >= i;
                        icon.className = isActive ? 'bx bxs-star text-xs' : 'bx bx-star text-xs';
                        btn.className = btn.className.replace(/text-(yellow|gray)-[0-9]+/g, '') + (isActive ? ' text-yellow-500' : ' text-gray-400 hover:text-yellow-400');
                    }
                }
            }
        });
    });
    </script>
@endsection