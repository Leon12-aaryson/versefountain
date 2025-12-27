@extends('layouts.app')

@section('title', 'Academics - VerseFountain')

@section('content')
    <div class="min-h-screen bg-stone-50">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <!-- Page Header -->
            <div class="mb-10 sm:mb-12">
                <h1 class="text-3xl sm:text-4xl font-light text-gray-800 mb-2 tracking-wide">Academics</h1>
                <p class="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">Access educational resources,
                    research papers, and academic materials</p>
            </div>

            <!-- Search and Filter Section -->
            <div class="bg-white shadow-sm rounded-md p-5 sm:p-6 mb-8 sm:mb-10">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Search -->
                    <div class="sm:col-span-2 lg:col-span-1">
                        <label for="search"
                            class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Search
                            Resources</label>
                        <div class="relative">
                            <input type="text" id="search" placeholder="Search papers, subjects, or authors..."
                                class="w-full pl-9 pr-3 py-2 border border-gray-300 focus:border-blue-600 text-sm bg-white focus:outline-none">
                            <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                <i class="bx bx-search text-base text-gray-400"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Subject Filter -->
                    <div>
                        <label for="subject"
                            class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Subject</label>
                        <select id="subject"
                            class="w-full px-3 py-2 border border-gray-300 focus:border-blue-600 text-sm bg-white focus:outline-none appearance-none cursor-pointer">
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
                        <label for="type"
                            class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Type</label>
                        <select id="type"
                            class="w-full px-3 py-2 border border-gray-300 focus:border-blue-600 text-sm bg-white focus:outline-none appearance-none cursor-pointer">
                            <option value="">All Types</option>
                            <option value="research-paper">Research Paper</option>
                            <option value="essay">Essay</option>
                            <option value="thesis">Thesis</option>
                            <option value="study-guide">Study Guide</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Featured Resources -->
            @if($featuredResources->count() > 0)
                <div class="mb-10 sm:mb-12">
                    <h2 class="text-xl sm:text-2xl font-light text-gray-800 mb-6 sm:mb-8 tracking-wide">Featured Resources</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        @foreach($featuredResources as $resource)
                            <div class="bg-white shadow-sm rounded-md transition-colors">
                                <div class="h-40 sm:h-48 bg-gray-100 flex items-center justify-center">
                                    <i class="bx bx-file text-6xl text-gray-400"></i>
                                </div>
                                <div class="p-4 sm:p-6">
                                    <h3 class="font-normal text-gray-900 mb-1 text-sm sm:text-base">
                                        <a href="{{ route('academics.show', $resource) }}" class="hover:text-gray-700">
                                            {{ $resource->title }}
                                        </a>
                                    </h3>
                                    <p class="text-gray-600 text-xs sm:text-sm mb-3 font-light">
                                        {{ $resource->description ? Str::limit($resource->description, 50) : 'No description' }}</p>
                                    <div class="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                                        <span class="text-xs text-gray-500">{{ $resource->subject ?? 'General' }}</span>
                                        <span
                                            class="text-xs text-gray-500">{{ ucfirst(str_replace('_', ' ', $resource->type ?? 'Document')) }}</span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span
                                            class="text-xs text-gray-500">{{ ucfirst(str_replace('_', ' ', $resource->type ?? 'Document')) }}</span>
                                        <a href="{{ route('academics.show', $resource) }}"
                                            class="text-xs text-gray-700 hover:text-gray-900 font-normal uppercase tracking-wide">Read
                                            →</a>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif

            <!-- Academic Categories -->
            @if($subjects->count() > 0)
                <div class="mb-10 sm:mb-12">
                    <h2 class="text-xl sm:text-2xl font-light text-gray-800 mb-6 sm:mb-8 tracking-wide">Browse by Category</h2>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        @foreach($subjects->take(4) as $subject)
                            @php
                                $subjectCount = \App\Models\AcademicResource::where('subject', $subject)->count();
                                $icons = [
                                    'Literature' => 'bx-book',
                                    'History' => 'bx-book-reader',
                                    'Philosophy' => 'bx-brain',
                                    'Science' => 'bx-flask',
                                    'Mathematics' => 'bx-calculator',
                                ];
                                $icon = $icons[$subject] ?? 'bx-file';
                            @endphp
                            <a href="/academics?subject={{ urlencode($subject) }}"
                                class="bg-white shadow-sm rounded-md p-4 sm:p-6 transition-colors cursor-pointer block">
                                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                    <i class="bx {{ $icon }} text-xl sm:text-2xl text-gray-600"></i>
                                </div>
                                <h3 class="font-normal text-gray-900 text-sm sm:text-base">{{ $subject }}</h3>
                                <p class="text-xs sm:text-sm text-gray-500 mt-1">{{ $subjectCount }}
                                    {{ $subjectCount === 1 ? 'paper' : 'papers' }}</p>
                            </a>
                        @endforeach
                    </div>
                </div>
            @endif

            <!-- Recent Papers -->
            <div class="mb-10 sm:mb-12">
                <h2 class="text-xl sm:text-2xl font-light text-gray-800 mb-6 sm:mb-8 tracking-wide">Recent Papers</h2>
                @if($recentPapers->count() > 0)
                    <div class="space-y-5 sm:space-y-6">
                        @foreach($recentPapers as $paper)
                            <div class="bg-white shadow-sm rounded-md p-4 sm:p-6 transition-colors">
                                <div class="flex items-start space-x-4">
                                    <div
                                        class="w-12 h-16 sm:w-16 sm:h-20 bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        <i class="bx bx-file text-3xl sm:text-4xl text-gray-400"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <h3 class="font-normal text-gray-900 text-sm sm:text-base mb-1">
                                            <a href="{{ route('academics.show', $paper) }}" class="hover:text-gray-700">
                                                {{ $paper->title }}
                                            </a>
                                        </h3>
                                        <p class="text-gray-600 text-xs sm:text-sm mb-2 font-light">
                                            {{ $paper->subject ?? 'General' }} •
                                            {{ ucfirst(str_replace('_', ' ', $paper->type ?? 'Document')) }}</p>
                                        <p class="text-xs text-gray-500 mb-3">Published {{ $paper->created_at->diffForHumans() }}
                                        </p>
                                        @if($paper->description)
                                            <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                                                {{ Str::limit($paper->description, 100) }}</p>
                                        @endif
                                        <div class="flex items-center space-x-4">
                                            <a href="{{ route('academics.show', $paper) }}"
                                                class="text-xs text-gray-700 hover:text-gray-900 font-normal uppercase tracking-wide">Read
                                                Paper →</a>
                                            @if($paper->resourceUrl)
                                                <a href="{{ $paper->resourceUrl }}" target="_blank"
                                                    class="text-xs text-gray-500 hover:text-gray-700 font-normal">Download PDF</a>
                                            @else
                                                <a href="{{ route('academics.download', $paper) }}"
                                                    class="text-xs text-gray-500 hover:text-gray-700 font-normal">Download PDF</a>
                                            @endif
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>

                    <!-- Pagination -->
                    @if($recentPapers->hasPages())
                        <div class="text-center mt-10 sm:mt-12">
                            {{ $recentPapers->links() }}
                        </div>
                    @endif
                @else
                    <div class="text-center py-16 sm:py-20">
                        <div class="max-w-md mx-auto">
                            <i class="bx bx-file text-6xl text-gray-300 mb-4"></i>
                            <h3 class="text-lg font-normal text-gray-700 mb-2">No academic resources yet</h3>
                            <p class="text-sm text-gray-500 mb-6">Check back soon for educational resources and research papers.
                            </p>
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </div>
@endsection