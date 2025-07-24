<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Poetry') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Poetry</h1>
                <p class="text-gray-600">Discover and share beautiful poetry from around the world</p>
            </div>

            @auth
                <div class="mb-6">
                    <a href="{{ route('poetry.create') }}" 
                       class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Create New Poem
                    </a>
                </div>
            @endauth

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @forelse($poems as $poem)
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-700"
                         x-data="poemCard({{ $poem->id }})">
                        <!-- Header -->
                        <div class="p-4 border-b border-gray-100 dark:border-gray-700">
                            <div class="flex items-start justify-between">
                                <div class="flex items-center space-x-3 flex-1 min-w-0">
                                    <div class="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {{ ($poem->author->first_name ?? 'A')[0] }}
                                        </span>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <h3 class="font-semibold text-gray-900 dark:text-white text-sm truncate">{{ $poem->title }}</h3>
                                        <div class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                                            <span class="font-medium">{{ $poem->author->first_name ?? 'Anonymous' }}</span>
                                            <span>•</span>
                                            <span>{{ $poem->created_at->diffForHumans() }}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                @auth
                                    @if(Auth::id() === $poem->author_id)
                                        <div class="relative" x-data="{ open: false }">
                                            <button @click="open = !open" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                                                </svg>
                                            </button>
                                            
                                            <div x-show="open" 
                                                 @click.away="open = false"
                                                 class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                                                <a href="{{ route('poetry.edit', $poem) }}" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    Edit
                                                </a>
                                                <button @click="deletePoem()" class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    @endif
                                @endauth
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="p-4">
                            <div class="prose prose-sm max-w-none dark:prose-invert">
                                <p class="text-gray-700 dark:text-gray-300 line-clamp-3">
                                    {{ Str::limit($poem->content, 150) }}
                                </p>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-4">
                                    <!-- Like Button -->
                                    <button @click="toggleLike()" 
                                            :class="isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'"
                                            class="flex items-center space-x-1 text-sm transition-colors">
                                        <svg class="w-4 h-4" :class="isLiked ? 'fill-current' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                        </svg>
                                        <span x-text="likesCount">{{ $poem->userInteractions->where('type', 'like')->count() }}</span>
                                    </button>

                                    <!-- Comment Count -->
                                    <div class="flex items-center space-x-1 text-gray-500 dark:text-gray-400 text-sm">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                        </svg>
                                        <span>{{ $poem->comments->count() }}</span>
                                    </div>

                                    <!-- Rating -->
                                    <div class="flex items-center space-x-1">
                                        @php
                                            $avgRating = $poem->userInteractions->where('type', 'rating')->avg('rating') ?? 0;
                                        @endphp
                                        @for($i = 1; $i <= 5; $i++)
                                            <svg class="w-3 h-3 text-yellow-400" :class="$i <= {{ $avgRating }} ? 'fill-current' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                            </svg>
                                        @endfor
                                    </div>
                                </div>

                                <!-- View Details Link -->
                                <a href="{{ route('poetry.show', $poem) }}" 
                                   class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                                    View Details
                                </a>
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="col-span-full text-center py-12">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No poems yet</h3>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating your first poem.</p>
                        @auth
                            <div class="mt-6">
                                <a href="{{ route('poetry.create') }}" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                    Create Poem
                                </a>
                            </div>
                        @else
                            <div class="mt-6">
                                <a href="{{ route('register') }}" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                    Join VerseFountain
                                </a>
                            </div>
                        @endauth
                    </div>
                @endforelse
            </div>

            <!-- Pagination -->
            @if($poems->hasPages())
                <div class="mt-8">
                    {{ $poems->links() }}
                </div>
            @endif
        </div>
    </div>

    <script>
    function poemCard(poemId) {
        return {
            poemId: poemId,
            isLiked: false,
            likesCount: 0,
            
            init() {
                // Initialize with current state
                this.likesCount = parseInt(this.$el.querySelector('[x-text="likesCount"]').textContent);
            },
            
            async toggleLike() {
                try {
                    const response = await fetch(`/api/poems/${this.poemId}/like`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                            'Accept': 'application/json'
                        }
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        this.isLiked = data.liked;
                        this.likesCount = data.likes_count;
                    }
                } catch (error) {
                    console.error('Error toggling like:', error);
                }
            },
            
            async deletePoem() {
                if (!confirm('Are you sure you want to delete this poem?')) {
                    return;
                }
                
                try {
                    const response = await fetch(`/api/poems/${this.poemId}`, {
                        method: 'DELETE',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        this.$el.remove();
                    } else {
                        alert('Failed to delete poem');
                    }
                } catch (error) {
                    console.error('Error deleting poem:', error);
                    alert('Failed to delete poem');
                }
            }
        }
    }
    </script>
</x-app-layout> 