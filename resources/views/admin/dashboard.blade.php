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
            <div class="bg-white rounded-md hover:transition-colors p-3 sm:p-4">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="bx bx-user text-blue-600 mr-3"></i>
                    </div>
                    <div class="ml-2 sm:ml-3">
                        <p class="text-xs font-medium text-gray-500">Users</p>
                        <p class="text-lg sm:text-xl font-semibold text-gray-900">{{ $stats['total_users'] }}</p>
                    </div>
                </div>
            </div>

            <!-- Pending Books -->
            <div class="bg-white rounded-md hover:transition-colors p-3 sm:p-4">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="bx bx-book text-yellow-600 mr-3"></i>
                    </div>
                    <div class="ml-2 sm:ml-3">
                        <p class="text-xs font-medium text-gray-500">Books</p>
                        <p class="text-lg sm:text-xl font-semibold text-gray-900">{{ $stats['pending_books'] }}</p>
                    </div>
                </div>
            </div>

            <!-- Pending Poems -->
            <div class="bg-white rounded-md hover:transition-colors p-3 sm:p-4">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="bx bx-file text-blue-600 mr-3"></i>
                    </div>
                    <div class="ml-2 sm:ml-3">
                        <p class="text-xs font-medium text-gray-500">Poems</p>
                        <p class="text-lg sm:text-xl font-semibold text-gray-900">{{ $stats['pending_poems'] }}</p>
                    </div>
                </div>
            </div>

            <!-- Total Tickets -->
            <div class="bg-white rounded-md hover:transition-colors p-3 sm:p-4">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="bx bx-ticket text-blue-600 mr-3"></i>
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
            <div class="bg-white rounded-md">
                <div class="px-4 sm:px-6 py-3 border-b border-gray-200">
                    <h3 class="text-sm sm:text-base font-medium text-gray-900">Quick Actions</h3>
                </div>
                <div class="p-4 sm:p-6">
                    <div class="space-y-2">
                        <a href="#" class="flex items-center p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                            <i class="bx bx-user text-blue-600 mr-3"></i>
                            <span class="text-sm font-medium text-gray-900">Manage Users</span>
                        </a>
                        
                        <a href="#" class="flex items-center p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                            <i class="bx bx-check-circle text-yellow-600 mr-3"></i>
                            <span class="text-sm font-medium text-gray-900">Review Content</span>
                        </a>
                        
                        <a href="#" class="flex items-center p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                            <i class="bx bx-chart text-blue-600 mr-3"></i>
                            <span class="text-sm font-medium text-gray-900">View Analytics</span>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-white rounded-md">
                <div class="px-4 sm:px-6 py-3 border-b border-gray-200">
                    <h3 class="text-sm sm:text-base font-medium text-gray-900">Recent Activity</h3>
                </div>
                <div class="p-4 sm:p-6">
                    <div class="space-y-2">
                        <div class="flex items-center text-xs sm:text-sm">
                            <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
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
                            <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            <span class="text-gray-600">Event created</span>
                            <span class="ml-auto text-gray-400 text-xs">5h ago</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- System Status -->
            <div class="bg-white rounded-md">
                <div class="px-4 sm:px-6 py-3 border-b border-gray-200">
                    <h3 class="text-sm sm:text-base font-medium text-gray-900">System Status</h3>
                </div>
                <div class="p-4 sm:p-6">
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-xs sm:text-sm text-gray-600">Database</span>
                            <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Online</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-xs sm:text-sm text-gray-600">API</span>
                            <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Online</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-xs sm:text-sm text-gray-600">Storage</span>
                            <span class="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">75%</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-xs sm:text-sm text-gray-600">Cache</span>
                            <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <!-- Recent Payments -->
            <div class="bg-white rounded-md">
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
                                        {{ $payment->status === 'completed' ? 'bg-blue-100 text-blue-800' : 
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
            <div class="bg-white rounded-md">
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
@endsection