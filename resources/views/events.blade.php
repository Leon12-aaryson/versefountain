@extends('layouts.app')

@section('title', 'Events - VerseFountain')

@section('content')
    <x-page-header title="Events" description="Discover poetry readings, book launches, and literary events" />

    <x-search-filter placeholder="Search events, locations, or dates..." :filters="[
        ['options' => ['All Categories', 'Poetry Reading', 'Book Launch', 'Workshop', 'Conference']],
        ['options' => ['All Locations', 'New York', 'London', 'Paris', 'Online']]
    ]" />

    <!-- Featured Events -->
    <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Featured Events</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div class="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <svg class="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                </div>
                <div class="p-4">
                    <div class="flex items-center mb-2">
                        <span class="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Poetry Reading</span>
                        <span class="text-xs text-gray-500 ml-auto">Dec 15, 2024</span>
                    </div>
                    <h3 class="font-semibold text-gray-900 mb-1">Evening of Poetry</h3>
                    <p class="text-gray-600 text-sm mb-2">Central Park, New York</p>
                    <p class="text-gray-600 text-sm mb-4">Join us for an evening of beautiful poetry readings under the stars</p>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-500">Free</span>
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            Register
                        </button>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div class="h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                    <svg class="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <div class="p-4">
                    <div class="flex items-center mb-2">
                        <span class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Book Launch</span>
                        <span class="text-xs text-gray-500 ml-auto">Dec 20, 2024</span>
                    </div>
                    <h3 class="font-semibold text-gray-900 mb-1">New Poetry Collection Launch</h3>
                    <p class="text-gray-600 text-sm mb-2">The Strand Bookstore, NYC</p>
                    <p class="text-gray-600 text-sm mb-4">Celebrate the launch of "Whispers of the Heart" poetry collection</p>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-500">$25</span>
                        <button class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                            Buy Tickets
                        </button>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div class="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <svg class="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                </div>
                <div class="p-4">
                    <div class="flex items-center mb-2">
                        <span class="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Workshop</span>
                        <span class="text-xs text-gray-500 ml-auto">Dec 25, 2024</span>
                    </div>
                    <h3 class="font-semibold text-gray-900 mb-1">Creative Writing Workshop</h3>
                    <p class="text-gray-600 text-sm mb-2">Online Event</p>
                    <p class="text-gray-600 text-sm mb-4">Learn the art of creative writing with expert guidance</p>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-500">$50</span>
                        <button class="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                            Enroll
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Create Event -->
    <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 mb-8">
        <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Host Your Own Event</h2>
            <p class="text-gray-600 mb-6 max-w-2xl mx-auto">
                Share your passion for poetry and literature by hosting an event. Connect with like-minded individuals and build your community.
            </p>
            <button class="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Create Event
            </button>
        </div>
    </div>

    <!-- Event Categories -->
    <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900">Poetry Reading</h3>
                <p class="text-sm text-gray-500">15 events</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900">Book Launch</h3>
                <p class="text-sm text-gray-500">8 events</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900">Workshop</h3>
                <p class="text-sm text-gray-500">12 events</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                </div>
                <h3 class="font-semibold text-gray-900">Conference</h3>
                <p class="text-sm text-gray-500">3 events</p>
            </div>
        </div>
    </div>

    <!-- Upcoming Events -->
    <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900">Poetry Slam Night</h3>
                            <p class="text-sm text-gray-500">Dec 30, 2024 • 7:00 PM • The Blue Note, NYC</p>
                        </div>
                    </div>
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Register
                    </button>
                </div>
            </div>
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900">Author Meet & Greet</h3>
                            <p class="text-sm text-gray-500">Jan 5, 2025 • 2:00 PM • Barnes & Noble, NYC</p>
                        </div>
                    </div>
                    <button class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                        Register
                    </button>
                </div>
            </div>
            <div class="p-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900">Writing Retreat</h3>
                            <p class="text-sm text-gray-500">Jan 15, 2025 • 9:00 AM • Vermont Writing Center</p>
                        </div>
                    </div>
                    <button class="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                        Register
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Event Statistics -->
    <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Event Statistics</h2>
        <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600 mb-2">45</div>
                    <p class="text-gray-600">Events This Month</p>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-green-600 mb-2">1,234</div>
                    <p class="text-gray-600">Total Attendees</p>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-purple-600 mb-2">89%</div>
                    <p class="text-gray-600">Satisfaction Rate</p>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-red-600 mb-2">12</div>
                    <p class="text-gray-600">Cities Covered</p>
                </div>
            </div>
        </div>
    </div>
@endsection 