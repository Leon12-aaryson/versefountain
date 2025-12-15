@extends('layouts.app')

@section('title', ($poem->title ?? 'Poem') . ' - VerseFountain')

@section('content')
<div class="min-h-screen bg-stone-50" x-data="{ flashMessage: { show: false, message: '', type: 'success' } }" id="poetry-show-container">
    <!-- Flash Messages -->
    <div x-show="flashMessage.show" 
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0 transform translate-y-2"
         x-transition:enter-end="opacity-100 transform translate-y-0"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="opacity-100 transform translate-y-0"
         x-transition:leave-end="opacity-0 transform translate-y-2"
         class="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4"
         style="display: none;">
        <div x-bind:class="flashMessage.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'"
             class="p-4 rounded-lg shadow-lg flex items-center justify-between">
            <div class="flex items-center space-x-2">
                <i x-bind:class="flashMessage.type === 'success' ? 'bx bx-check-circle text-lg' : 'bx bx-error-circle text-lg'"></i>
                <span x-text="flashMessage.message" class="text-sm font-normal"></span>
            </div>
            <button @click="flashMessage.show = false" class="ml-4 text-gray-400 hover:text-gray-600">
                <i class="bx bx-x text-lg"></i>
            </button>
        </div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <!-- Back Button -->
        <div class="mb-6">
            <a href="{{ route('poetry.index') }}" 
               class="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm font-normal">
                <i class="bx bx-arrow-back text-base mr-1"></i>
                Back to poems
            </a>
        </div>

        <div class="max-w-4xl mx-auto">
            <!-- Server-side Flash Messages -->
            @if(session('success'))
                <div class="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <i class="bx bx-check-circle text-lg"></i>
                        <span class="text-sm font-normal">{{ session('success') }}</span>
                    </div>
                    <button onclick="this.parentElement.remove()" class="ml-4 text-green-600 hover:text-green-800">
                        <i class="bx bx-x text-lg"></i>
                    </button>
                </div>
            @endif

            @if(session('error'))
                <div class="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <i class="bx bx-error-circle text-lg"></i>
                        <span class="text-sm font-normal">{{ session('error') }}</span>
                    </div>
                    <button onclick="this.parentElement.remove()" class="ml-4 text-red-600 hover:text-red-800">
                        <i class="bx bx-x text-lg"></i>
                    </button>
                </div>
            @endif

            <div class="bg-white border border-gray-200"
                 x-data="poemDetail({{ $poem->id }}, {{ $isLiked ? 'true' : 'false' }})">
                
                <!-- Header -->
                <div class="p-6 sm:p-8 border-b border-gray-200">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <h1 class="text-2xl md:text-3xl font-light text-gray-800 mb-3 tracking-wide">{{ $poem->title ?? 'Untitled' }}</h1>
                            <div class="flex items-center space-x-4 text-gray-600">
                                <div class="flex items-center space-x-2">
                                    <div class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                        <span class="text-xs font-normal text-gray-700">
                                            {{ strtoupper(($poem->author->first_name ?? 'A')[0]) }}
                                        </span>
                                    </div>
                                    <span class="text-sm font-light">{{ $poem->author->first_name ?? 'Anonymous' }}</span>
                                </div>
                                <span class="text-gray-400">•</span>
                                <span class="text-sm text-gray-500">{{ $poem->created_at->diffForHumans() ?? '' }}</span>
                            </div>
                        </div>
                        
                        @auth
                            @if(Auth::id() === $poem->author_id)
                                <div class="flex space-x-2">
                                    <a href="{{ route('poetry.edit', $poem) }}" 
                                       class="inline-flex items-center px-3 py-2 border border-gray-200 text-sm font-normal text-gray-700 hover:bg-gray-50 transition-colors">
                                        Edit
                                    </a>
                                    <button @click="deletePoem()" 
                                            class="inline-flex items-center px-3 py-2 border border-gray-200 text-sm font-normal text-gray-700 hover:bg-gray-50 transition-colors">
                                        Delete
                                    </button>
                                </div>
                            @endif
                        @endauth
                    </div>
                </div>

                <!-- Content -->
                <div class="p-6 sm:p-8">
                    @if($poem->is_video && $poem->video_url)
                        <div class="mb-8">
                            <div class="aspect-video bg-gray-100 overflow-hidden">
                                <iframe src="{{ $poem->video_url }}" 
                                        class="w-full h-full" 
                                        allowfullscreen
                                        title="{{ $poem->title ?? 'Poem Video' }}">
                                </iframe>
                            </div>
                        </div>
                    @endif
                    
                    <div class="prose prose-lg max-w-none">
                        <div class="whitespace-pre-line text-gray-700 leading-relaxed font-light">
                            {{ $poem->content ?? '' }}
                        </div>
                    </div>
                </div>

                <!-- Engagement Section -->
                <div class="px-6 sm:px-8 py-4 border-t border-gray-200 bg-gray-50">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-6">
                            <!-- Like Button -->
                            <button @click="toggleLike()" 
                                    :class="isLiked ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'"
                                    class="flex items-center space-x-2 text-sm font-normal transition-colors">
                                <i :class="isLiked ? 'bx bxs-heart' : 'bx bx-heart'" class="text-base"></i>
                                <span x-text="likesCount">{{ $poem->userInteractions->where('type', 'like')->count() ?? 0 }}</span>
                            </button>

                            <!-- Comment Button -->
                            <button @click="showComments = !showComments" 
                                    class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm font-normal transition-colors">
                                <i class="bx bx-comment text-base"></i>
                                <span>{{ $poem->comments->count() ?? 0 }} Comments</span>
                            </button>

                            <!-- Rating -->
                            <div class="flex items-center space-x-1">
                                @php
                                    $avgRating = $poem->userInteractions->where('type', 'rating')->avg('rating') ?? 0;
                                    $ratingCount = $poem->userInteractions->where('type', 'rating')->count();
                                @endphp
                                @for($i = 1; $i <= 5; $i++)
                                    <button @click="ratePoem({{ $i }})" 
                                            class="text-gray-400 hover:text-gray-600 transition-colors">
                                        <i x-bind:class="currentRating >= {{ $i }} ? 'bx bxs-star text-yellow-500' : 'bx bx-star'" class="text-base"></i>
                                    </button>
                                @endfor
                                <span class="text-xs text-gray-500 ml-2">
                                    {{ number_format($avgRating, 1) }} ({{ $ratingCount }})
                                </span>
                            </div>
                        </div>

                        <!-- Share Button -->
                        <button @click="sharePoem()" 
                                class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm font-normal transition-colors">
                            <i class="bx bx-share-alt text-base"></i>
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
                     class="border-t border-gray-200">
                    
                    <!-- Comment Form -->
                    @auth
                        <div class="p-6 border-b border-gray-200">
                            <form @submit.prevent="submitComment()">
                                <div class="flex space-x-3">
                                    <div class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        <span class="text-xs font-normal text-gray-700">
                                            {{ strtoupper((Auth::user()->first_name ?? 'U')[0]) }}
                                        </span>
                                    </div>
                                    <div class="flex-1">
                                        <textarea x-model="newComment" 
                                                  placeholder="Write a comment..." 
                                                  class="w-full px-3 py-2 border border-gray-300 focus:border-gray-500 bg-white focus:outline-none resize-none text-sm"
                                                  rows="3"></textarea>
                                        <div class="mt-2 flex justify-end">
                                            <button type="submit" 
                                                    :disabled="!newComment.trim()"
                                                    class="px-4 py-2 bg-gray-800 text-white text-sm font-normal hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
                        <h3 class="text-lg font-light text-gray-800 mb-4 tracking-wide">Comments ({{ $poem->comments->count() ?? 0 }})</h3>
                        
                        <div class="space-y-4">
                            @forelse($poem->comments ?? [] as $comment)
                                <div class="flex space-x-3">
                                    <div class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        <span class="text-xs font-normal text-gray-700">
                                            {{ strtoupper(($comment->user->first_name ?? 'U')[0]) }}
                                        </span>
                                    </div>
                                    <div class="flex-1">
                                        <div class="bg-gray-50 px-4 py-3">
                                            <div class="flex items-center justify-between mb-1">
                                                <span class="text-sm font-normal text-gray-900">{{ $comment->user->first_name ?? 'Anonymous' }}</span>
                                                <span class="text-xs text-gray-500">{{ $comment->created_at->diffForHumans() ?? '' }}</span>
                                            </div>
                                            <p class="text-sm text-gray-700 font-light">{{ $comment->content ?? '' }}</p>
                                        </div>
                                    </div>
                                </div>
                            @empty
                                <p class="text-gray-500 text-center py-4 font-light">No comments yet. Be the first to comment!</p>
                            @endforelse
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

    <script>
    const apiBaseUrl = "{{ url('/api/poems') }}";
    const poemTitle = "{{ addslashes($poem->title ?? '') }}";
    const poemContent = "{{ addslashes(Str::limit($poem->content ?? '', 200)) }}";
    const poetryIndexUrl = "{{ route('poetry.index') }}";
    const isAuthenticated = {{ auth()->check() ? 'true' : 'false' }};
    
    // Flash message function
    function showFlashMessage(message, type = 'success') {
        // Find the Alpine.js component
        const container = document.getElementById('poetry-show-container');
        if (container && container.__x) {
            const alpineData = container.__x.$data;
            alpineData.flashMessage.show = true;
            alpineData.flashMessage.message = message;
            alpineData.flashMessage.type = type;
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                alpineData.flashMessage.show = false;
            }, 5000);
        } else {
            // Fallback: create flash message element
            const flashDiv = document.createElement('div');
            flashDiv.className = `fixed top-16 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4`;
            flashDiv.innerHTML = `
                <div class="p-4 rounded-lg shadow-lg flex items-center justify-between ${type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}">
                    <div class="flex items-center space-x-2">
                        <i class="bx ${type === 'success' ? 'bx-check-circle' : 'bx-error-circle'} text-lg"></i>
                        <span class="text-sm font-normal">${message}</span>
                    </div>
                    <button onclick="this.parentElement.parentElement.remove()" class="ml-4 ${type === 'success' ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'}">
                        <i class="bx bx-x text-lg"></i>
                    </button>
                </div>
            `;
            document.body.appendChild(flashDiv);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (flashDiv.parentElement) {
                    flashDiv.remove();
                }
            }, 5000);
        }
    }
    
    function poemDetail(poemId, initialLiked) {
        return {
            poemId: poemId,
            isLiked: initialLiked,
            likesCount: {{ $poem->userInteractions->where('type', 'like')->count() ?? 0 }},
            currentRating: {{ round($poem->userInteractions->where('type', 'rating')->avg('rating') ?? 0) }},
            showComments: false,
            newComment: '',
            
            async toggleLike() {
                if (!isAuthenticated) {
                    window.location.href = '/login';
                    return;
                }
                
                try {
                    const response = await fetch(apiBaseUrl + '/' + this.poemId + '/like', {
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
                    showFlashMessage(data.liked ? 'Poem liked!' : 'Like removed.', 'success');
                } catch (error) {
                    console.error('Error toggling like:', error);
                    showFlashMessage('Failed to toggle like. Please try again.', 'error');
                }
            },
            
            async ratePoem(rating) {
                if (!isAuthenticated) {
                    window.location.href = '/login';
                    return;
                }
                
                try {
                    const response = await fetch(apiBaseUrl + '/' + this.poemId + '/rate', {
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
                    this.currentRating = data.rating;
                    showFlashMessage(`Rated ${rating} star${rating > 1 ? 's' : ''}!`, 'success');
                    // Update the rating display without reload
                    setTimeout(() => location.reload(), 1000);
                } catch (error) {
                    console.error('Error rating poem:', error);
                    showFlashMessage('Failed to rate poem. Please try again.', 'error');
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
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify({ content: this.newComment })
                    });
                    
                    if (!response.ok) {
                        if (response.status === 401) {
                            window.location.href = '/login';
                            return;
                        }
                        throw new Error('Failed to submit comment');
                    }
                    
                    this.newComment = '';
                    showFlashMessage('Comment added successfully!', 'success');
                    setTimeout(() => window.location.reload(), 1000);
                } catch (error) {
                    console.error('Error submitting comment:', error);
                    showFlashMessage('Failed to submit comment. Please try again.', 'error');
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
                        showFlashMessage('Poem deleted successfully!', 'success');
                        setTimeout(() => window.location.href = poetryIndexUrl, 1000);
                    } else {
                        showFlashMessage('Failed to delete poem.', 'error');
                    }
                } catch (error) {
                    console.error('Error deleting poem:', error);
                    showFlashMessage('Failed to delete poem.', 'error');
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
                        showFlashMessage('Poem content copied to clipboard!', 'success');
                    } catch (error) {
                        showFlashMessage('Failed to share poem.', 'error');
                    }
                }
            }
        }
    }
    </script>
@endsection