@extends('layouts.app')

@section('title', 'Profile - VerseFountain')

@section('content')
<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <!-- Page Header -->
    <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p class="text-sm sm:text-base text-gray-600">Manage your account and view your activity</p>
    </div>

    <!-- User Info Card -->
    <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
        <div class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <!-- User Avatar -->
            <div class="w-20 h-20 sm:w-24 sm:h-24 bg-primary text-white rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold">
                {{ strtoupper(substr($user->name ?? 'A', 0, 1)) }}
            </div>
            
            <!-- User Details -->
            <div class="text-center sm:text-left flex-1">
                <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-1">{{ $user->name ?? 'User' }}</h2>
                <p class="text-sm text-gray-600 mb-2">{{ $user->email }}</p>
                <p class="text-xs text-gray-500 mb-3">Member since {{ $user->created_at->format('M Y') }}</p>
                
                <!-- Status Badges -->
                <div class="flex flex-wrap justify-center sm:justify-start gap-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg class="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="3" />
                        </svg>
                        Active
                    </span>
                    
                    @if($user->role === 'admin')
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Admin
                        </span>
                    @endif
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="flex flex-col sm:flex-row gap-2">
                <a href="/profile/edit" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center">
                    Edit Profile
                </a>
                <a href="/poetry/create" class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors text-center">
                    Write Poem
                </a>
            </div>
        </div>
    </div>

    <!-- Content Tabs -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <!-- Tab Navigation -->
        <div class="border-b border-gray-200">
            <nav class="flex space-x-8 px-4 sm:px-6" aria-label="Tabs">
                <button class="tab-button active py-4 px-1 border-b-2 border-blue-500 text-sm font-medium text-blue-600" data-tab="profile">
                    My Poems
                </button>
                <button class="tab-button py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300" data-tab="tickets">
                    My Tickets
                </button>
                <button class="tab-button py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300" data-tab="settings">
                    Account Settings
                </button>
            </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-4 sm:p-6">
            <!-- Profile Tab -->
            <div id="profile-content" class="tab-content active space-y-6 sm:space-y-8">
                <!-- My Poems Section -->
                <div>
                    <div class="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 class="text-lg sm:text-xl font-semibold text-gray-900">My Poems</h3>
                        <a href="/poetry/create" class="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            Write New Poem
                        </a>
                    </div>
                    
                    <!-- Sample Poems (Replace with actual data) -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <h4 class="font-medium text-gray-900 mb-2">Whispers of the Wind</h4>
                            <p class="text-sm text-gray-600 mb-3">A gentle breeze carries secrets through the trees...</p>
                            <div class="flex items-center justify-between text-xs text-gray-500">
                                <span>Published 2 days ago</span>
                                <div class="flex items-center space-x-4">
                                    <span>❤️ 12 likes</span>
                                    <span>💬 3 comments</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <h4 class="font-medium text-gray-900 mb-2">Midnight Dreams</h4>
                            <p class="text-sm text-gray-600 mb-3">In the quiet hours when the world sleeps...</p>
                            <div class="flex items-center justify-between text-xs text-gray-500">
                                <span>Published 1 week ago</span>
                                <div class="flex items-center space-x-4">
                                    <span>❤️ 8 likes</span>
                                    <span>💬 1 comment</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div class="hidden text-center py-8">
                        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">No poems yet</h3>
                        <p class="text-gray-600 mb-4">Start your poetic journey by writing your first poem.</p>
                        <a href="/poetry/create" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            Write Your First Poem
                        </a>
                    </div>
                </div>
            </div>

            <!-- Tickets Tab -->
            <div id="tickets-content" class="tab-content hidden space-y-6 sm:space-y-8">
                <div>
                    <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">My Tickets</h3>
                    
                    <!-- Sample Tickets -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div class="flex items-center justify-between mb-2">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Poetry Reading
                                </span>
                                <span class="text-xs text-gray-500">$15</span>
                            </div>
                            <h4 class="font-medium text-gray-900 mb-2">Open Mic Night</h4>
                            <p class="text-sm text-gray-600 mb-3">Dec 15, 2024 • 7:00 PM</p>
                            <div class="flex items-center justify-between">
                                <span class="text-xs text-gray-500">Central Library</span>
                                <span class="text-xs text-green-600 font-medium">Confirmed</span>
                            </div>
                        </div>
                        
                        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div class="flex items-center justify-between mb-2">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Workshop
                                </span>
                                <span class="text-xs text-gray-500">$25</span>
                            </div>
                            <h4 class="font-medium text-gray-900 mb-2">Creative Writing Workshop</h4>
                            <p class="text-sm text-gray-600 mb-3">Dec 20, 2024 • 2:00 PM</p>
                            <div class="flex items-center justify-between">
                                <span class="text-xs text-gray-500">Community Center</span>
                                <span class="text-xs text-green-600 font-medium">Confirmed</span>
                            </div>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div class="hidden text-center py-8">
                        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                        </svg>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
                        <p class="text-gray-600 mb-4">Purchase tickets for upcoming events to see them here.</p>
                        <a href="/tickets" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            Browse Events
                        </a>
                    </div>
                </div>
            </div>

            <!-- Settings Tab -->
            <div id="settings-content" class="tab-content hidden space-y-6 sm:space-y-8">
                <div>
                    <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Account Settings</h3>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div class="bg-gray-50 rounded-lg p-4 sm:p-6">
                            <h4 class="font-medium text-gray-900 mb-2">Profile Information</h4>
                            <p class="text-sm text-gray-600 mb-4">Update your account profile information and email address.</p>
                            <a href="/profile/edit" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Edit Profile →
                            </a>
                        </div>
                        
                        <div class="bg-gray-50 rounded-lg p-4 sm:p-6">
                            <h4 class="font-medium text-gray-900 mb-2">Change Password</h4>
                            <p class="text-sm text-gray-600 mb-4">Ensure your account is using a long, random password to stay secure.</p>
                            <a href="/profile/edit" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Change Password →
                            </a>
                        </div>
                        
                        <div class="bg-gray-50 rounded-lg p-4 sm:p-6">
                            <h4 class="font-medium text-gray-900 mb-2">Email Notifications</h4>
                            <p class="text-sm text-gray-600 mb-4">Manage your email notification preferences.</p>
                            <a href="/profile/edit" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Manage Notifications →
                            </a>
                        </div>
                        
                        <div class="bg-gray-50 rounded-lg p-4 sm:p-6">
                            <h4 class="font-medium text-gray-900 mb-2">Privacy Settings</h4>
                            <p class="text-sm text-gray-600 mb-4">Control your privacy and data sharing preferences.</p>
                            <a href="/profile/edit" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Privacy Settings →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active classes from all buttons and contents
            tabButtons.forEach(btn => {
                btn.classList.remove('active', 'border-blue-500', 'text-blue-600');
                btn.classList.add('border-transparent', 'text-gray-500');
            });
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.classList.add('hidden');
            });
            
            // Add active classes to clicked button and corresponding content
            button.classList.add('active', 'border-blue-500', 'text-blue-600');
            button.classList.remove('border-transparent', 'text-gray-500');
            
            const targetContent = document.getElementById(targetTab + '-content');
            if (targetContent) {
                targetContent.classList.add('active');
                targetContent.classList.remove('hidden');
            }
        });
    });
});
</script>
@endsection 