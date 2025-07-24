@extends('layouts.app')

@section('title', 'Academics - VerseFountain')

@section('content')
    <x-page-header title="Academics" description="Educational resources, courses, and literary analysis tools" />

    <x-search-filter placeholder="Search courses, resources, or topics..." :filters="[
        ['options' => ['All Categories', 'Poetry Analysis', 'Creative Writing', 'Literature Review', 'Research']],
        ['options' => ['All Levels', 'Beginner', 'Intermediate', 'Advanced']]
    ]" />

    <!-- Featured Courses -->
    <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Featured Courses</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">Poetry Analysis</h3>
                        <p class="text-sm text-gray-500">4 weeks</p>
                    </div>
                </div>
                <p class="text-gray-600 mb-4">Learn how to analyze and interpret poetry with our comprehensive guide</p>
                <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500">Free</span>
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Enroll
                    </button>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">Creative Writing</h3>
                        <p class="text-sm text-gray-500">8 weeks</p>
                    </div>
                </div>
                <p class="text-gray-600 mb-4">Develop your creative writing skills with expert guidance</p>
                <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500">$49</span>
                    <button class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                        Enroll
                    </button>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">Literature Review</h3>
                        <p class="text-sm text-gray-500">6 weeks</p>
                    </div>
                </div>
                <p class="text-gray-600 mb-4">Master the art of writing comprehensive literature reviews</p>
                <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500">$39</span>
                    <button class="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                        Enroll
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Research Tools -->
    <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Research Tools</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Literature Database</h3>
                <p class="text-gray-600 mb-4">Access thousands of academic papers and literary works</p>
                <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Explore
                </button>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                <p class="text-gray-600 mb-4">Track your reading progress and analyze patterns</p>
                <button class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    View Dashboard
                </button>
            </div>
        </div>
    </div>

    <!-- Study Groups -->
    <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Study Groups</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span class="text-blue-600 font-semibold">SG</span>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">Shakespeare Group</h3>
                        <p class="text-sm text-gray-500">15 members</p>
                    </div>
                </div>
                <p class="text-gray-600 text-sm mb-4">Weekly discussions on Shakespeare's works</p>
                <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Join Group
                </button>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <span class="text-purple-600 font-semibold">MG</span>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">Modern Poetry</h3>
                        <p class="text-sm text-gray-500">23 members</p>
                    </div>
                </div>
                <p class="text-gray-600 text-sm mb-4">Exploring contemporary poetry</p>
                <button class="w-full bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                    Join Group
                </button>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span class="text-green-600 font-semibold">WG</span>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">Writing Workshop</h3>
                        <p class="text-sm text-gray-500">8 members</p>
                    </div>
                </div>
                <p class="text-gray-600 text-sm mb-4">Creative writing practice and feedback</p>
                <button class="w-full bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    Join Group
                </button>
            </div>
        </div>
    </div>

    <!-- Academic Resources -->
    <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Academic Resources</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900">Style Guides</h3>
                <p class="text-sm text-gray-500">MLA, APA, Chicago</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900">Citation Tools</h3>
                <p class="text-sm text-gray-500">Auto-generate citations</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900">Research Papers</h3>
                <p class="text-sm text-gray-500">Academic publications</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900">Study Guides</h3>
                <p class="text-sm text-gray-500">Comprehensive guides</p>
            </div>
        </div>
    </div>

    <!-- Learning Progress -->
    <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Your Learning Progress</h2>
        <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600 mb-2">3</div>
                    <p class="text-gray-600">Courses Enrolled</p>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-green-600 mb-2">2</div>
                    <p class="text-gray-600">Courses Completed</p>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-purple-600 mb-2">75%</div>
                    <p class="text-gray-600">Average Score</p>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-red-600 mb-2">12</div>
                    <p class="text-gray-600">Study Hours</p>
                </div>
            </div>
        </div>
    </div>
@endsection 