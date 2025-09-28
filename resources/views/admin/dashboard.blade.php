@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <!-- Header -->
        <div class="mb-4 sm:mb-6">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p class="mt-1 text-sm text-gray-600">Manage your VerseFountain platform</p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <!-- Total Users -->
            <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                        </svg>
                    </div>
                    <div class="ml-2 sm:ml-3">
                        <p class="text-xs font-medium text-gray-500">Users</p>
                        <p class="text-lg sm:text-xl font-semibold text-gray-900">{{ $stats['total_users'] }}</p>
                    </div>
                </div>
            </div>

            <!-- Pending Books -->
            <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                    </div>
                    <div class="ml-2 sm:ml-3">
                        <p class="text-xs font-medium text-gray-500">Books</p>
                        <p class="text-lg sm:text-xl font-semibold text-gray-900">{{ $stats['pending_books'] }}</p>
                    </div>
                </div>
            </div>

            <!-- Pending Poems -->
            <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 sm:h-6 sm:w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <div class="ml-2 sm:ml-3">
                        <p class="text-xs font-medium text-gray-500">Poems</p>
                        <p class="text-lg sm:text-xl font-semibold text-gray-900">{{ $stats['pending_poems'] }}</p>
                    </div>
                </div>
            </div>

            <!-- Total Tickets -->
            <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                        </svg>
                    </div>
                    <div class="ml-2 sm:ml-3">
                        <p class="text-xs font-medium text-gray-500">Tickets</p>
                        <p class="text-lg sm:text-xl font-semibold text-gray-900">{{ $stats['total_tickets'] }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <!-- Quick Actions -->
            <div class="bg-white rounded-lg shadow-sm">
                <div class="px-4 sm:px-6 py-3 border-b border-gray-200">
                    <h3 class="text-sm sm:text-base font-medium text-gray-900">Quick Actions</h3>
                </div>
                <div class="p-4 sm:p-6">
                    <div class="space-y-2">
                        <a href="#" class="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <svg class="h-4 w-4 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                            </svg>
                            <span class="text-sm font-medium text-gray-900">Manage Users</span>
                        </a>
                        
                        <a href="#" class="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <svg class="h-4 w-4 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                            <span class="text-sm font-medium text-gray-900">Review Content</span>
                        </a>
                        
                        <a href="#" class="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <svg class="h-4 w-4 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                            <span class="text-sm font-medium text-gray-900">View Analytics</span>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-white rounded-lg shadow-sm">
                <div class="px-4 sm:px-6 py-3 border-b border-gray-200">
                    <h3 class="text-sm sm:text-base font-medium text-gray-900">Recent Activity</h3>
                </div>
                <div class="p-4 sm:p-6">
                    <div class="space-y-2">
                        <div class="flex items-center text-xs sm:text-sm">
                            <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span class="text-gray-600">New user registered</span>
                            <span class="ml-auto text-gray-400 text-xs">2m ago</span>
                        </div>
                        <div class="flex items-center text-xs sm:text-sm">
                            <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            <span class="text-gray-600">Poem published</span>
                            <span class="ml-auto text-gray-400 text-xs">1h ago</span>
                        </div>
                        <div class="flex items-center text-xs sm:text-sm">
                            <div class="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                            <span class="text-gray-600">Book pending review</span>
                            <span class="ml-auto text-gray-400 text-xs">3h ago</span>
                        </div>
                        <div class="flex items-center text-xs sm:text-sm">
                            <div class="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                            <span class="text-gray-600">Event created</span>
                            <span class="ml-auto text-gray-400 text-xs">5h ago</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- System Status -->
            <div class="bg-white rounded-lg shadow-sm">
                <div class="px-4 sm:px-6 py-3 border-b border-gray-200">
                    <h3 class="text-sm sm:text-base font-medium text-gray-900">System Status</h3>
                </div>
                <div class="p-4 sm:p-6">
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-xs sm:text-sm text-gray-600">Database</span>
                            <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Online</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-xs sm:text-sm text-gray-600">API</span>
                            <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Online</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-xs sm:text-sm text-gray-600">Storage</span>
                            <span class="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">75%</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-xs sm:text-sm text-gray-600">Cache</span>
                            <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <!-- Recent Payments -->
            <div class="bg-white rounded-lg shadow-sm">
                <div class="px-4 sm:px-6 py-3 border-b border-gray-200">
                    <h3 class="text-sm sm:text-base font-medium text-gray-900">Recent Payments</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-3 sm:px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th class="px-3 sm:px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th class="px-3 sm:px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-3 sm:px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            @forelse($stats['recent_payments'] as $payment)
                            <tr>
                                <td class="px-3 sm:px-6 py-2 whitespace-nowrap text-xs font-medium text-gray-900">#{{ $payment->id }}</td>
                                <td class="px-3 sm:px-6 py-2 whitespace-nowrap text-xs text-gray-900">${{ number_format($payment->amount, 2) }}</td>
                                <td class="px-3 sm:px-6 py-2 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        {{ $payment->status === 'completed' ? 'bg-green-100 text-green-800' : 
                                           ($payment->status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                           'bg-red-100 text-red-800') }}">
                                        {{ ucfirst($payment->status) }}
                                    </span>
                                </td>
                                <td class="px-3 sm:px-6 py-2 whitespace-nowrap text-xs text-gray-500">{{ $payment->created_at ? $payment->created_at->format('M d') : 'N/A' }}</td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="4" class="px-3 sm:px-6 py-4 text-center text-xs text-gray-500">No recent payments</td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Platform Overview -->
            <div class="bg-white rounded-lg shadow-sm">
                <div class="px-4 sm:px-6 py-3 border-b border-gray-200">
                    <h3 class="text-sm sm:text-base font-medium text-gray-900">Platform Overview</h3>
                </div>
                <div class="p-4 sm:p-6">
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-xs sm:text-sm text-gray-600">Total Content</span>
                            <span class="text-xs sm:text-sm font-medium">{{ $stats['total_users'] + $stats['pending_books'] + $stats['pending_poems'] }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-xs sm:text-sm text-gray-600">Active Users</span>
                            <span class="text-xs sm:text-sm font-medium">{{ $stats['total_users'] }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-xs sm:text-sm text-gray-600">Pending Reviews</span>
                            <span class="text-xs sm:text-sm font-medium">{{ $stats['pending_books'] + $stats['pending_poems'] }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-xs sm:text-sm text-gray-600">Events</span>
                            <span class="text-xs sm:text-sm font-medium">{{ $stats['total_tickets'] }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
@endsection