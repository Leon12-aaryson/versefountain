@extends('layouts.app')

@section('title', 'Chat Rooms - VerseFountain')

@section('content')
    <x-page-header title="Chat Rooms" description="Connect with fellow poetry enthusiasts and discuss literature" />

    <x-search-filter placeholder="Search chat rooms or topics..." :filters="[
        ['options' => ['All Categories', 'Poetry Discussion', 'Book Club', 'Writing Tips', 'General']],
        ['options' => ['All Languages', 'English', 'Spanish', 'French']]
    ]" />

    <!-- Active Chat Rooms -->
    <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Active Chat Rooms</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">Poetry Discussion</h3>
                        <p class="text-sm text-gray-500">156 online</p>
                    </div>
                </div>
                <p class="text-gray-600 text-sm mb-4">Discuss your favorite poems and discover new ones</p>
                <div class="flex items-center justify-between">
                    <span class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Join Chat
                    </button>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">Book Club</h3>
                        <p class="text-sm text-gray-500">89 online</p>
                    </div>
                </div>
                <p class="text-gray-600 text-sm mb-4">Monthly book discussions and recommendations</p>
                <div class="flex items-center justify-between">
                    <span class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
                    <button class="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                        Join Chat
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
                        <h3 class="font-semibold text-gray-900">Writing Tips</h3>
                        <p class="text-sm text-gray-500">67 online</p>
                    </div>
                </div>
                <p class="text-gray-600 text-sm mb-4">Share writing advice and get feedback</p>
                <div class="flex items-center justify-between">
                    <span class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
                    <button class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                        Join Chat
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Create New Chat Room -->
    <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-8">
        <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Create Your Own Chat Room</h2>
            <p class="text-gray-600 mb-6 max-w-2xl mx-auto">
                Start a conversation about your favorite topic. Create a dedicated space for discussing specific poets, books, or literary themes.
            </p>
            <button class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Create Chat Room
            </button>
        </div>
    </div>

    <!-- Recent Messages -->
    <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Recent Messages</h2>
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-start">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span class="text-blue-600 text-sm font-semibold">JD</span>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center mb-1">
                            <span class="font-semibold text-gray-900">John Doe</span>
                            <span class="text-xs text-gray-500 ml-2">2 minutes ago</span>
                        </div>
                        <p class="text-sm text-gray-600">Has anyone read the latest collection by Mary Oliver? Her nature poetry is absolutely breathtaking!</p>
                    </div>
                </div>
            </div>
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-start">
                    <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <span class="text-purple-600 text-sm font-semibold">JS</span>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center mb-1">
                            <span class="font-semibold text-gray-900">Jane Smith</span>
                            <span class="text-xs text-gray-500 ml-2">5 minutes ago</span>
                        </div>
                        <p class="text-sm text-gray-600">I'm looking for recommendations for contemporary poets. Any suggestions?</p>
                    </div>
                </div>
            </div>
            <div class="p-6">
                <div class="flex items-start">
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span class="text-green-600 text-sm font-semibold">RW</span>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center mb-1">
                            <span class="font-semibold text-gray-900">Robert Wilson</span>
                            <span class="text-xs text-gray-500 ml-2">10 minutes ago</span>
                        </div>
                        <p class="text-sm text-gray-600">Just finished writing my first sonnet! Would love some feedback from the community.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Chat Room Categories -->
    <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Browse Categories</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900">Poetry</h3>
                <p class="text-sm text-gray-500">12 rooms</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900">Books</h3>
                <p class="text-sm text-gray-500">8 rooms</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900">Writing</h3>
                <p class="text-sm text-gray-500">6 rooms</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900">General</h3>
                <p class="text-sm text-gray-500">4 rooms</p>
            </div>
        </div>
    </div>

    <!-- Chat Statistics -->
    <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Community Statistics</h2>
        <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600 mb-2">1,234</div>
                    <p class="text-gray-600">Active Users</p>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-green-600 mb-2">30</div>
                    <p class="text-gray-600">Chat Rooms</p>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-purple-600 mb-2">5,678</div>
                    <p class="text-gray-600">Messages Today</p>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-red-600 mb-2">89%</div>
                    <p class="text-gray-600">Response Rate</p>
                </div>
            </div>
        </div>
    </div>
@endsection 