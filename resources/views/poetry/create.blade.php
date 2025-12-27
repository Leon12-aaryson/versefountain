@extends('layouts.app')

@section('title', 'Create Poem - VerseFountain')

@section('content')
<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <div class="max-w-4xl mx-auto">
        <div class="mb-6 sm:mb-8">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create New Poem</h1>
            <p class="text-sm sm:text-base text-gray-600">Share your poetry with the world</p>
        </div>

        <div class="bg-white rounded-md p-4 sm:p-6">
            <form method="POST" action="/api/poems" id="poem-create-form" data-poem-form>
                @csrf
                
                <div class="space-y-6">
                    <!-- Title -->
                    <div>
                        <label for="title" class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input id="title" 
                               name="title" 
                               type="text" 
                               class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600" 
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
                                       checked
                                       class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
                                <span class="ml-2 text-sm text-gray-700">Text Poem</span>
                            </label>
                            <label class="flex items-center">
                                <input type="radio" 
                                       name="is_video" 
                                       value="1" 
                                       class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
                                <span class="ml-2 text-sm text-gray-700">Video Poem</span>
                            </label>
                        </div>
                    </div>

                    <!-- Video URL (conditional) -->
                    <div id="video-url-section" style="display: none;">
                        <label for="video_url" class="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
                        <input id="video_url" 
                               name="video_url" 
                               type="url" 
                               class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-600" 
                               value="{{ old('video_url') }}" />
                        <p class="mt-1 text-sm text-gray-500">
                            Enter the embed URL from YouTube or other video platforms
                        </p>
                        @error('video_url')
                            <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Content -->
                    <div>
                        <label for="content" class="block text-sm font-medium text-gray-700 mb-2">Content</label>
                        <textarea id="content" 
                                  name="content" 
                                  rows="12"
                                  required
                                  class="mt-1 block w-full border border-gray-300 focus:border-blue-600 focus:outline-none rounded-md resize-none transition-colors"
                                  placeholder="Write your poem here...">{{ old('content') }}</textarea>
                        <div class="mt-2 flex justify-between items-center text-sm text-gray-500">
                            <span data-content-length>0</span>
                            <span>Maximum 10,000 characters</span>
                        </div>
                        @error('content')
                            <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Preview -->
                    <div id="preview-section" data-preview-section style="display: none;">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                        <div class="mt-2 bg-gray-50 rounded-md p-4 shadow-sm">
                            <h3 class="font-semibold text-lg text-gray-900 mb-2" data-preview-title>Untitled</h3>
                            <div class="prose prose-sm max-w-none">
                                <p class="whitespace-pre-line text-gray-700" data-preview-content>No content yet</p>
                            </div>
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex items-center justify-between pt-6 border-t border-gray-200">
                        <div class="flex space-x-3">
                            <button type="button" 
                                    data-preview-toggle
                                    class="inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                                <span>Show Preview</span>
                            </button>
                        </div>
                        
                        <div class="flex space-x-3">
                            <a href="{{ route('poetry.index') }}" 
                               class="inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                                Cancel
                            </a>
                            <button type="submit" 
                                    class="inline-flex items-center px-4 py-2 bg-blue-600 rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none transition ease-in-out duration-150">
                                <span>Create Poem</span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('poem-create-form');
    if (!form) return;

    // Initialize PoemForm
    const poemForm = new PoemForm(form);

    // Handle video type toggle
    const videoRadios = form.querySelectorAll('input[name="is_video"]');
    const videoUrlSection = document.getElementById('video-url-section');
    const contentTextarea = form.querySelector('#content');

    videoRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === '1') {
                videoUrlSection.style.display = 'block';
                if (contentTextarea) {
                    contentTextarea.placeholder = 'Describe your video poem...';
                }
            } else {
                videoUrlSection.style.display = 'none';
                if (contentTextarea) {
                    contentTextarea.placeholder = 'Write your poem here...';
                }
            }
        });
    });
});
</script>
@endsection
