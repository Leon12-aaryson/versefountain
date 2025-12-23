@extends('layouts.app')

@section('title', ($book->title ?? 'Book') . ' - VerseFountain')

@section('content')
<div class="min-h-screen bg-stone-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <!-- Back Button -->
        <div class="mb-6">
            <a href="{{ route('books.index') }}" 
               class="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm font-normal">
                <i class="bx bx-arrow-back text-base mr-1"></i>
                Back to books
            </a>
        </div>

        <div class="max-w-4xl mx-auto">
            <div class="bg-white shadow-sm rounded-md">
                <!-- Header -->
                <div class="p-6 sm:p-8 border-b border-gray-200">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <h1 class="text-2xl md:text-3xl font-light text-gray-800 mb-3 tracking-wide">{{ $book->title ?? 'Untitled' }}</h1>
                            <div class="flex items-center space-x-4 text-gray-600">
                                <div class="flex items-center space-x-2">
                                    <span class="text-sm font-light">By {{ $book->author ?? 'Unknown' }}</span>
                                </div>
                                <span class="text-gray-400">•</span>
                                <span class="text-sm text-gray-500">{{ $book->genre ?? 'General' }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Content -->
                <div class="p-6 sm:p-8">
                    <div class="prose prose-lg max-w-none">
                        <div class="whitespace-pre-line text-gray-700 leading-relaxed font-light">
                            {{ $book->description ?? 'No description available.' }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
