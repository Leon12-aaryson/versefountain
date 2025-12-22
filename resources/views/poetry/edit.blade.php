<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Edit Poem') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Edit Poem</h1>
                <p class="text-gray-600 dark:text-gray-400">Update your poetry</p>
            </div>

            <div class="bg-white dark:bg-blue-600 overflow-hidden sm:rounded-md border border-gray-200 dark:border-gray-700 p-6"
                 x-data="poemForm()">
                
                <form method="POST" action="{{ route('poetry.update', $poem) }}" @submit="handleSubmit">
                    @csrf
                    @method('PUT')
                    
                    <div class="space-y-6">
                        <!-- Title -->
                        <div>
                            <x-input-label for="title" :value="__('Title')" />
                            <x-text-input id="title" 
                                           name="title" 
                                           type="text" 
                                           class="mt-1 block w-full" 
                                           :value="old('title', $poem->title)"
                                           required 
                                           autofocus />
                            <x-input-error :messages="$errors->get('title')" class="mt-2" />
                        </div>

                        <!-- Poem Type Toggle -->
                        <div>
                            <x-input-label :value="__('Poem Type')" />
                            <div class="mt-2 flex space-x-4">
                                <label class="flex items-center">
                                    <input type="radio" 
                                           name="is_video" 
                                           value="0" 
                                           x-model="isVideo"
                                           class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-blue-700">
                                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Text Poem</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" 
                                           name="is_video" 
                                           value="1" 
                                           x-model="isVideo"
                                           class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-blue-700">
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
                                           :value="old('video_url', $poem->video_url)" />
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
                                      class="mt-1 block w-full border-2 border-gray-300 dark:border-gray-600 dark:bg-blue-700 dark:text-white focus:border-blue-600 focus:outline-none rounded-md resize-none transition-colors"
                                      placeholder="Write your poem here..."
                                      x-text="isVideo == 1 ? 'Describe your video poem...' : 'Write your poem here...'">{{ old('content', $poem->content) }}</textarea>
                            <div class="mt-2 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                                <span x-text="contentLength"></span>
                                <span>Maximum 10,000 characters</span>
                            </div>
                            <x-input-error :messages="$errors->get('content')" class="mt-2" />
                        </div>

                        <!-- Preview -->
                        <div x-show="showPreview" x-transition>
                            <x-input-label :value="__('Preview')" />
                            <div class="mt-2 bg-gray-50 dark:bg-blue-700 rounded-md p-4 border border-gray-200 dark:border-gray-600">
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
                                        class="inline-flex items-center px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-blue-600 hover:bg-gray-50 dark:hover:bg-blue-700 focus:outline-none focus:border-2 focus:border-blue-600">
                                    <span x-text="showPreview ? 'Hide Preview' : 'Show Preview'">Show Preview</span>
                                </button>
                            </div>
                            
                            <div class="flex space-x-3">
                                <a href="{{ route('poetry.show', $poem) }}" 
                                   class="inline-flex items-center px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-blue-600 hover:bg-gray-50 dark:hover:bg-blue-700 focus:outline-none focus:border-2 focus:border-blue-600">
                                    Cancel
                                </a>
                                <x-primary-button :disabled="isSubmitting || !isValid">
                                    <span x-text="isSubmitting ? 'Updating...' : 'Update Poem'">Update Poem</span>
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
            isVideo: '{{ $poem->is_video ? "1" : "0" }}',
            title: '{{ old("title", $poem->title) }}',
            content: '{{ old("content", $poem->content) }}',
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
</x-app-layout> 