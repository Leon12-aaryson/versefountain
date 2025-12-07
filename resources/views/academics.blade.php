@extends('layouts.app')

@section('title', 'Academics - VerseFountain')

@section('content')
<div class="min-h-screen bg-stone-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <!-- Page Header -->
        <div class="mb-10 sm:mb-12">
            <h1 class="text-3xl sm:text-4xl font-light text-gray-800 mb-2 tracking-wide">Academics</h1>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">Access educational resources, research papers, and academic materials</p>
        </div>

        <!-- Search and Filter Section -->
        <div class="bg-white border border-gray-200 p-5 sm:p-6 mb-8 sm:mb-10">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Search -->
                <div class="sm:col-span-2 lg:col-span-1">
                    <label for="search" class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Search Resources</label>
                    <div class="relative">
                        <input type="text" id="search" placeholder="Search papers, subjects, or authors..." 
                               class="w-full pl-9 pr-3 py-2 border border-gray-300 focus:border-gray-500 text-sm bg-white focus:outline-none">
                        <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Subject Filter -->
                <div>
                    <label for="subject" class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Subject</label>
                    <select id="subject" class="w-full px-3 py-2 border border-gray-300 focus:border-gray-500 text-sm bg-white focus:outline-none appearance-none cursor-pointer">
                        <option value="">All Subjects</option>
                        <option value="literature">Literature</option>
                        <option value="history">History</option>
                        <option value="philosophy">Philosophy</option>
                        <option value="science">Science</option>
                        <option value="mathematics">Mathematics</option>
                    </select>
                </div>

                <!-- Type Filter -->
                <div>
                    <label for="type" class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Type</label>
                    <select id="type" class="w-full px-3 py-2 border border-gray-300 focus:border-gray-500 text-sm bg-white focus:outline-none appearance-none cursor-pointer">
                        <option value="">All Types</option>
                        <option value="research-paper">Research Paper</option>
                        <option value="essay">Essay</option>
                        <option value="thesis">Thesis</option>
                        <option value="study-guide">Study Guide</option>
                    </select>
                </div>
            </div>
        </div>

    @php
        $featuredResources = [
            [
                'title' => 'Modern Poetry Analysis',
                'author' => 'Dr. Sarah Johnson',
                'subject' => 'Literature',
                'type' => 'Research Paper',
                'pages' => '15',
                'slug' => 'modern-poetry-analysis'
            ],
            [
                'title' => 'Shakespeare\'s Influence',
                'author' => 'Prof. Michael Chen',
                'subject' => 'Literature',
                'type' => 'Essay',
                'pages' => '8',
                'slug' => 'shakespeare-influence'
            ],
            [
                'title' => 'Creative Writing Guide',
                'author' => 'Dr. Emily Rodriguez',
                'subject' => 'Literature',
                'type' => 'Study Guide',
                'pages' => '25',
                'slug' => 'creative-writing-guide'
            ]
        ];

        $recentPapers = [
            [
                'title' => 'The Evolution of Poetry in Digital Age',
                'author' => 'Dr. Lisa Thompson',
                'subject' => 'Literature',
                'published' => '3 days ago',
                'pages' => '12',
                'slug' => 'evolution-poetry-digital'
            ],
            [
                'title' => 'Comparative Analysis of Modern Poets',
                'author' => 'Prof. David Wilson',
                'subject' => 'Literature',
                'published' => '1 week ago',
                'pages' => '18',
                'slug' => 'comparative-analysis-poets'
            ],
            [
                'title' => 'The Impact of Social Media on Literature',
                'author' => 'Dr. Maria Garcia',
                'subject' => 'Literature',
                'published' => '2 weeks ago',
                'pages' => '22',
                'slug' => 'social-media-literature'
            ]
        ];
    @endphp

    <!-- Featured Resources -->
    <div class="mb-10 sm:mb-12">
        <h2 class="text-xl sm:text-2xl font-light text-gray-800 mb-6 sm:mb-8 tracking-wide">Featured Resources</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            @foreach($featuredResources as $resource)
            <div class="bg-white border border-gray-200 hover:border-gray-300 transition-colors">
                <div class="h-40 sm:h-48 bg-gray-100 flex items-center justify-center">
                    <svg class="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <div class="p-4 sm:p-6">
                    <h3 class="font-normal text-gray-900 mb-1 text-sm sm:text-base">{{ $resource['title'] }}</h3>
                    <p class="text-gray-600 text-xs sm:text-sm mb-3 font-light">{{ $resource['author'] }}</p>
                    <div class="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                        <span class="text-xs text-gray-500">{{ $resource['subject'] }}</span>
                        <span class="text-xs text-gray-500">{{ $resource['type'] }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">{{ $resource['pages'] }} pages</span>
                        <a href="/academics/{{ $resource['slug'] }}" class="text-xs text-gray-700 hover:text-gray-900 font-normal uppercase tracking-wide">Read →</a>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </div>

    <!-- Academic Categories -->
    <div class="mb-10 sm:mb-12">
        <h2 class="text-xl sm:text-2xl font-light text-gray-800 mb-6 sm:mb-8 tracking-wide">Browse by Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div class="bg-white border border-gray-200 p-4 sm:p-6 text-center hover:border-gray-300 transition-colors cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <h3 class="font-normal text-gray-900 text-sm sm:text-base">Literature</h3>
                <p class="text-xs sm:text-sm text-gray-500 mt-1">1,234 papers</p>
            </div>

            <div class="bg-white border border-gray-200 p-4 sm:p-6 text-center hover:border-gray-300 transition-colors cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <h3 class="font-normal text-gray-900 text-sm sm:text-base">History</h3>
                <p class="text-xs sm:text-sm text-gray-500 mt-1">567 papers</p>
            </div>

            <div class="bg-white border border-gray-200 p-4 sm:p-6 text-center hover:border-gray-300 transition-colors cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                </div>
                <h3 class="font-normal text-gray-900 text-sm sm:text-base">Philosophy</h3>
                <p class="text-xs sm:text-sm text-gray-500 mt-1">234 papers</p>
            </div>

            <div class="bg-white border border-gray-200 p-4 sm:p-6 text-center hover:border-gray-300 transition-colors cursor-pointer">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                    </svg>
                </div>
                <h3 class="font-normal text-gray-900 text-sm sm:text-base">Science</h3>
                <p class="text-xs sm:text-sm text-gray-500 mt-1">789 papers</p>
            </div>
        </div>
    </div>

    <!-- Recent Papers -->
    <div class="mb-10 sm:mb-12">
        <h2 class="text-xl sm:text-2xl font-light text-gray-800 mb-6 sm:mb-8 tracking-wide">Recent Papers</h2>
        <div class="space-y-5 sm:space-y-6">
            @foreach($recentPapers as $paper)
            <div class="bg-white border border-gray-200 p-4 sm:p-6 hover:border-gray-300 transition-colors">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-16 sm:w-16 sm:h-20 bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 class="font-normal text-gray-900 text-sm sm:text-base mb-1">{{ $paper['title'] }}</h3>
                        <p class="text-gray-600 text-xs sm:text-sm mb-2 font-light">{{ $paper['author'] }} • {{ $paper['subject'] }}</p>
                        <p class="text-xs text-gray-500 mb-3">Published {{ $paper['published'] }} • {{ $paper['pages'] }} pages</p>
                        <div class="flex items-center space-x-4">
                            <a href="/academics/{{ $paper['slug'] }}" class="text-xs text-gray-700 hover:text-gray-900 font-normal uppercase tracking-wide">Read Paper →</a>
                            <a href="/academics/{{ $paper['slug'] }}/download" class="text-xs text-gray-500 hover:text-gray-700 font-normal">Download PDF</a>
                        </div>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </div>

    <!-- Load More Button -->
    <div class="text-center">
        <button class="px-6 py-2.5 bg-gray-800 text-white text-sm font-normal hover:bg-gray-700 transition-colors">
            Load More Papers
        </button>
    </div>
    </div>
</div>
@endsection 