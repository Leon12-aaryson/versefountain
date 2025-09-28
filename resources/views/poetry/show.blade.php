<x-app-layout>
    <x-slot name="header">
        <div class="flex items-center justify-between">
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                {{ $poem->title }}
            </h2>
            <a href="{{ route('poetry.index') }}" 
               class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to poems
            </a>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-700"
                 x-data="poemDetail({{ $poem->id }}, {{ $isLiked ? 'true' : 'false' }})">
                
                <!-- Header -->
                <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ $poem->title }}</h1>
                            <div class="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                                <div class="flex items-center space-x-2">
                                    <div class="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {{ ($poem->author->first_name ?? 'A')[0] }}
                                        </span>
                                    </div>
                                    <span class="font-medium">{{ $poem->author->first_name ?? 'Anonymous' }}</span>
                                </div>
                                <span>•</span>
                                <span>{{ $poem->created_at->diffForHumans() }}</span>
                            </div>
                        </div>
                        
                        @auth
                            @if(Auth::id() === $poem->author_id)
                                <div class="flex space-x-2">
                                    <a href="{{ route('poetry.edit', $poem) }}" 
                                       class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        Edit
                                    </a>
                                    <button @click="deletePoem()" 
                                            class="inline-flex items-center px-3 py-2 border border-red-300 dark:border-red-600 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                        Delete
                                    </button>
                                </div>
                            @endif
                        @endauth
                    </div>
                </div>

                <!-- Content -->
                <div class="p-6">
                    @if($poem->is_video && $poem->video_url)
                        <div class="mb-6">
                            <div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                <iframe src="{{ $poem->video_url }}" 
                                        class="w-full h-full" 
                                        allowfullscreen
                                        title="{{ $poem->title }}">
                                </iframe>
                            </div>
                        </div>
                    @endif
                    
                    <div class="prose prose-lg max-w-none dark:prose-invert">
                        <div class="whitespace-pre-line text-gray-800 dark:text-gray-200 leading-relaxed">
                            {{ $poem->content }}
                        </div>
                    </div>
                </div>

                <!-- Engagement Section -->
                <div class="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-6">
                            <!-- Like Button -->
                            <button @click="toggleLike()" 
                                    :class="isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'"
                                    class="flex items-center space-x-2 text-sm font-medium transition-colors">
                                <svg class="w-5 h-5" :class="isLiked ? 'fill-current' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                </svg>
                                <span x-text="likesCount">{{ $poem->userInteractions->where('type', 'like')->count() }}</span>
                                <span x-text="isLiked ? 'Liked' : 'Like'">Like</span>
                            </button>

                            <!-- Comment Button -->
                            <button @click="showComments = !showComments" 
                                    class="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm font-medium transition-colors">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                </svg>
                                <span>{{ $poem->comments->count() }} Comments</span>
                            </button>

                            <!-- Rating -->
                            <div class="flex items-center space-x-1">
                                @php
                                    $avgRating = $poem->userInteractions->where('type', 'rating')->avg('rating') ?? 0;
                                    $ratingCount = $poem->userInteractions->where('type', 'rating')->count();
                                @endphp
                                @for($i = 1; $i <= 5; $i++)
                                    <button @click="ratePoem({{ $i }})" 
                                            class="text-yellow-400 hover:text-yellow-500 transition-colors">
                                        <svg class="w-5 h-5" :class="$i <= currentRating ? 'fill-current' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                        </svg>
                                    </button>
                                @endfor
                                <span class="text-sm text-gray-600 dark:text-gray-400 ml-2">
                                    {{ number_format($avgRating, 1) }} ({{ $ratingCount }})
                                </span>
                            </div>
                        </div>

                        <!-- Share Button -->
                        <button @click="sharePoem()" 
                                class="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm font-medium transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                            </svg>
                            <span>Share</span>
                        </button>
                    </div>
                </div>

                <!-- Comments Section -->
                <div x-show="showComments" 
                     x-transition:enter="transition ease-out duration-300"
                     x-transition:enter-start="opacity-0 transform -translate-y-2"
                     x-transition:enter-end="opacity-100 transform translate-y-0"
                     x-transition:leave="transition ease-in duration-200"
                     x-transition:leave-start="opacity-100 transform translate-y-0"
                     x-transition:leave-end="opacity-0 transform -translate-y-2"
                     class="border-t border-gray-100 dark:border-gray-700">
                    
                    <!-- Comment Form -->
                    @auth
                        <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                            <form @submit.prevent="submitComment()">
                                <div class="flex space-x-3">
                                    <div class="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {{ Auth::user()->first_name[0] ?? 'U' }}
                                        </span>
                                    </div>
                                    <div class="flex-1">
                                        <textarea x-model="newComment" 
                                                  placeholder="Write a comment..." 
                                                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none dark:bg-gray-700 dark:text-white"
                                                  rows="3"></textarea>
                                        <div class="mt-2 flex justify-end">
                                            <button type="submit" 
                                                    :disabled="!newComment.trim()"
                                                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                                                Comment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    @endauth

                    <!-- Comments List -->
                    <div class="p-6">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Comments ({{ $poem->comments->count() }})</h3>
                        
                        <div class="space-y-4">
                            @forelse($poem->comments as $comment)
                                <div class="flex space-x-3">
                                    <div class="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {{ $comment->user->first_name[0] ?? 'U' }}
                                        </span>
                                    </div>
                                    <div class="flex-1">
                                        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
                                            <div class="flex items-center justify-between mb-1">
                                                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $comment->user->first_name ?? 'Anonymous' }}</span>
                                                <span class="text-xs text-gray-500 dark:text-gray-400">{{ $comment->created_at->diffForHumans() }}</span>
                                            </div>
                                            <p class="text-sm text-gray-700 dark:text-gray-300">{{ $comment->content }}</p>
                                        </div>
                                    </div>
                                </div>
                            @empty
                                <p class="text-gray-500 dark:text-gray-400 text-center py-4">No comments yet. Be the first to comment!</p>
                            @endforelse
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    const apiBaseUrl = "{{ url('/api/poems') }}";
    const poemTitle = "{{ addslashes($poem->title) }}";
    const poemContent = "{{ addslashes(Str::limit($poem->content, 200)) }}";
    const poetryIndexUrl = "{{ route('poetry.index') }}";
    
    function poemDetail(poemId, initialLiked) {
        return {
            poemId: poemId,
            isLiked: initialLiked,
            likesCount: {{ $poem->userInteractions->where('type', 'like')->count() }},
            currentRating: {{ $poem->userInteractions->where('type', 'rating')->avg('rating') ?? 0 }},
            showComments: false,
            newComment: '',
            
            async toggleLike() {
                try {
                    const response = await fetch(apiBaseUrl + '/' + this.poemId + '/like', {
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
            
            async ratePoem(rating) {
                try {
                    const response = await fetch(apiBaseUrl + '/' + this.poemId + '/rate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({ rating: rating })
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        this.currentRating = data.rating;
                        window.location.reload();
                    }
                } catch (error) {
                    console.error('Error rating poem:', error);
                }
            },
            
            async submitComment() {
                if (!this.newComment.trim()) return;
                
                try {
                    const response = await fetch(apiBaseUrl + '/' + this.poemId + '/comments', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({ content: this.newComment })
                    });
                    
                    if (response.ok) {
                        this.newComment = '';
                        window.location.reload();
                    }
                } catch (error) {
                    console.error('Error submitting comment:', error);
                }
            },
            
            async deletePoem() {
                if (!confirm('Are you sure you want to delete this poem?')) {
                    return;
                }
                
                try {
                    const response = await fetch(apiBaseUrl + '/' + this.poemId, {
                        method: 'DELETE',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        window.location.href = poetryIndexUrl;
                    } else {
                        alert('Failed to delete poem');
                    }
                } catch (error) {
                    console.error('Error deleting poem:', error);
                    alert('Failed to delete poem');
                }
            },
            
            async sharePoem() {
                const poemData = {
                    title: poemTitle,
                    text: poemContent,
                    url: window.location.href
                };
                
                if (navigator.share) {
                    try {
                        await navigator.share(poemData);
                    } catch (error) {
                        console.log('Share cancelled');
                    }
                } else {
                    try {
                        await navigator.clipboard.writeText(
                            poemData.title + '\n\n' + poemData.text + '\n\n' + poemData.url + '\n\nShared from VerseFountain'
                        );
                        alert('Poem content copied to clipboard!');
                    } catch (error) {
                        alert('Failed to share poem');
                    }
                }
            }
        }
    }
    </script>
</x-app-layout>