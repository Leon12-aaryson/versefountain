@extends('layouts.app')

@section('title', ($resource->title ?? 'Resource') . ' - VerseFountain')

@section('content')
<div class="min-h-screen bg-stone-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <!-- Back Button -->
        <div class="mb-6">
            <a href="{{ route('academics.index') }}" 
               class="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm font-normal">
                <i class="bx bx-arrow-back text-base mr-1"></i>
                Back to resources
            </a>
        </div>

        <div class="max-w-4xl mx-auto">
            <div class="bg-white shadow-sm rounded-md">
                <!-- Header -->
                <div class="p-6 sm:p-8 border-b border-gray-200">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <h1 class="text-2xl md:text-3xl font-light text-gray-800 mb-3 tracking-wide">{{ $resource->title ?? 'Untitled' }}</h1>
                            <div class="flex items-center space-x-4 text-gray-600">
                                <div class="flex items-center space-x-2">
                                    <span class="text-sm font-light">{{ $resource->author ?? 'Unknown' }}</span>
                                </div>
                                <span class="text-gray-400">•</span>
                                <span class="text-sm text-gray-500">{{ $resource->subject ?? 'General' }}</span>
                                <span class="text-gray-400">•</span>
                                <span class="text-sm text-gray-500">{{ $resource->type ?? 'Document' }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Content -->
                <div class="p-6 sm:p-8">
                    <div class="prose prose-lg max-w-none">
                        <div class="whitespace-pre-line text-gray-700 leading-relaxed font-light">
                            {{ $resource->description ?? 'No description available.' }}
                        </div>
                    </div>

                    @if(isset($resource->pages) && $resource->pages > 0)
                    <div class="mt-8 pt-6 border-t border-gray-200">
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-600">Pages: {{ $resource->pages }}</span>
                            @if(isset($resource->id) && $resource->id > 0)
                                <a href="/academics/{{ $resource->id }}/download" class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-normal hover:bg-blue-700 transition-colors focus:outline-none">
                                    Download PDF
                                </a>
                            @endif
                        </div>
                    </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
