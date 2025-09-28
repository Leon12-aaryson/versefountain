@extends('layouts.app')

@section('title', 'Create Poem - VerseFountain')

@section('content')
<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <div class="max-w-4xl mx-auto">
        <div class="mb-6 sm:mb-8">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create New Poem</h1>
            <p class="text-sm sm:text-base text-gray-600">Share your poetry with the world</p>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6"
             x-data="poemForm()">
                
                <form method="POST" action="/api/poems" @submit="handleSubmit">
                    @csrf
                    
                    <div class="space-y-6">
                        <!-- Title -->
                        <div>
                            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <input id="title" 
                                   name="title" 
                                   type="text" 
                                   class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                                   value="{{ old('title') }}"
                                   required 
                                   autofocus />
                            @error('title')
                                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Poem Type Toggle -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Poem Type</label>
                            <div class="mt-2 flex space-x-4">
                                <label class="flex items-center">
                                    <input type="radio" 
                                           name="is_video" 
                                           value="0" 
                                           x-model="isVideo"
                                           class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Text Poem</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" 
                                           name="is_video" 
                                           value="1" 
                                           x-model="isVideo"
                                           class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Video Poem</span>
                                </label>
                            </div>
                        </div>

                        <!-- Video URL (conditional) -->
                        <div x-show="isVideo == 1" x-transition>
                            <x-input-label for="video_url" :value="__('Video URL')" />
                            <x-text-input id="video_url" 
                                           name="video_url" 
                                           type="url" 
                                           class="mt-1 block w-full" 
                                           :value="old('video_url')" />
                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Enter the embed URL from YouTube or other video platforms
                            </p>
                            <x-input-error :messages="$errors->get('video_url')" class="mt-2" />
                        </div>

                        <!-- Content -->
                        <div>
                            <x-input-label for="content" :value="__('Content')" />
                            <textarea id="content" 
                                      name="content" 
                                      rows="12"
                                      required
                                      class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm resize-none"
                                      placeholder="Write your poem here..."
                                      x-text="isVideo == 1 ? 'Describe your video poem...' : 'Write your poem here...'">{{ old('content') }}</textarea>
                            <div class="mt-2 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                                <span x-text="contentLength"></span>
                                <span>Maximum 10,000 characters</span>
                            </div>
                            <x-input-error :messages="$errors->get('content')" class="mt-2" />
                        </div>

                        <!-- Preview -->
                        <div x-show="showPreview" x-transition>
                            <x-input-label :value="__('Preview')" />
                            <div class="mt-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                <h3 class="font-semibold text-lg text-gray-900 dark:text-white mb-2" x-text="title || 'Untitled'">Untitled</h3>
                                <div class="prose prose-sm max-w-none dark:prose-invert">
                                    <p class="whitespace-pre-line text-gray-700 dark:text-gray-300" x-text="content || 'No content yet'">No content yet</p>
                                </div>
                            </div>
                        </div>

                        <!-- Form Actions -->
                        <div class="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div class="flex space-x-3">
                                <button type="button" 
                                        @click="showPreview = !showPreview"
                                        class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <span x-text="showPreview ? 'Hide Preview' : 'Show Preview'">Show Preview</span>
                                </button>
                            </div>
                            
                            <div class="flex space-x-3">
                                <a href="{{ route('poetry.index') }}" 
                                   class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Cancel
                                </a>
                                <x-primary-button :disabled="isSubmitting || !isValid">
                                    <span x-text="isSubmitting ? 'Creating...' : 'Create Poem'">Create Poem</span>
                                </x-primary-button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
    function poemForm() {
        return {
            isVideo: '0',
            title: '{{ old("title") }}',
            content: '{{ old("content") }}',
            showPreview: false,
            isSubmitting: false,
            
            get contentLength() {
                return this.content ? this.content.length : 0;
            },
            
            get isValid() {
                const hasTitle = this.title && this.title.trim().length > 0;
                const hasContent = this.content && this.content.trim().length > 0;
                const contentNotTooLong = this.content && this.content.length <= 10000;
                
                if (this.isVideo == '1') {
                    return hasTitle && hasContent && contentNotTooLong;
                }
                
                return hasTitle && hasContent && contentNotTooLong;
            },
            
            handleSubmit(event) {
                if (!this.isValid) {
                    event.preventDefault();
                    return false;
                }
                
                this.isSubmitting = true;
            }
        }
    }
    </script>
    </div>
</div>
@endsection 