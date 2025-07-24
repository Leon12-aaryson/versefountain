@extends('layouts.app')

@section('title', 'Settings - VerseFountain')

@section('content')
<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <div class="max-w-4xl mx-auto">
        <!-- Page Header -->
        <div class="mb-6 sm:mb-8">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p class="text-sm sm:text-base text-gray-600">Manage your account settings and preferences</p>
        </div>

        <!-- Settings Tabs -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
            <!-- Success Messages -->
            @if (session('status') === 'profile-updated')
                <div class="bg-green-50 border border-green-200 rounded-t-xl p-4">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-green-800">Profile updated successfully!</p>
                        </div>
                    </div>
                </div>
            @endif

            @if (session('status') === 'password-updated')
                <div class="bg-green-50 border border-green-200 rounded-t-xl p-4">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-green-800">Password updated successfully!</p>
                        </div>
                    </div>
                </div>
            @endif

            <!-- Tab Navigation -->
            <div class="border-b border-gray-200">
                <nav class="flex flex-wrap sm:flex-nowrap space-x-0 sm:space-x-8 px-4 sm:px-6" aria-label="Tabs">
                    <button id="profile-tab" class="tab-button active py-4 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600 flex-1 sm:flex-none">
                        Profile Information
                    </button>
                    <button id="password-tab" class="tab-button py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 flex-1 sm:flex-none">
                        Change Password
                    </button>
                    <button id="account-tab" class="tab-button py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 flex-1 sm:flex-none">
                        Account Settings
                    </button>
                </nav>
            </div>

            <!-- Tab Content -->
            <div class="p-4 sm:p-6">
                <!-- Profile Information Tab -->
                <div id="profile-content" class="tab-content active">
                    <form method="post" action="{{ route('profile.update') }}" class="space-y-6">
                        @csrf
                        @method('patch')

                        <!-- Name -->
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input type="text" name="name" id="name" value="{{ old('name', $user->name) }}" required 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base">
                            @error('name')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Email -->
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input type="email" name="email" id="email" value="{{ old('email', $user->email) }}" required 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base">
                            @error('email')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Bio -->
                        <div>
                            <label for="bio" class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                            <textarea name="bio" id="bio" rows="4" 
                                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                      placeholder="Tell us about yourself...">{{ old('bio', $user->bio ?? '') }}</textarea>
                            @error('bio')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Save Button -->
                        <div class="flex justify-end">
                            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base font-medium">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Change Password Tab -->
                <div id="password-content" class="tab-content hidden">
                    <form method="post" action="{{ route('password.update') }}" class="space-y-6">
                        @csrf
                        @method('put')

                        <!-- Current Password -->
                        <div>
                            <label for="current_password" class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                            <input type="password" name="current_password" id="current_password" required 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base">
                            @error('current_password')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- New Password -->
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <input type="password" name="password" id="password" required 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base">
                            @error('password')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Confirm New Password -->
                        <div>
                            <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                            <input type="password" name="password_confirmation" id="password_confirmation" required 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base">
                        </div>

                        <!-- Save Button -->
                        <div class="flex justify-end">
                            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base font-medium">
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Account Settings Tab -->
                <div id="account-content" class="tab-content hidden">
                    <div class="space-y-6">
                        <!-- Account Information -->
                        <div class="bg-gray-50 rounded-lg p-4 sm:p-6">
                            <h3 class="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                            <div class="space-y-3">
                                <div class="flex flex-col sm:flex-row sm:justify-between">
                                    <span class="text-sm text-gray-600">Member since:</span>
                                    <span class="text-sm text-gray-900">{{ $user->created_at->format('M d, Y') }}</span>
                                </div>
                                <div class="flex flex-col sm:flex-row sm:justify-between">
                                    <span class="text-sm text-gray-600">Last login:</span>
                                    <span class="text-sm text-gray-900">{{ $user->last_login_at ?? 'Never' }}</span>
                                </div>
                                <div class="flex flex-col sm:flex-row sm:justify-between">
                                    <span class="text-sm text-gray-600">Account status:</span>
                                    <span class="text-sm text-green-600 font-medium">Active</span>
                                </div>
                            </div>
                        </div>

                        <!-- Email Verification -->
                        @if (!$user->hasVerifiedEmail())
                            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
                                <div class="flex">
                                    <div class="flex-shrink-0">
                                        <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <div class="ml-3">
                                        <h3 class="text-sm font-medium text-yellow-800">Email not verified</h3>
                                        <div class="mt-2 text-sm text-yellow-700">
                                            <p>Please verify your email address to access all features.</p>
                                        </div>
                                        <div class="mt-4">
                                            <form method="post" action="{{ route('verification.send') }}">
                                                @csrf
                                                <button type="submit" class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-yellow-200">
                                                    Resend verification email
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endif

                        <!-- Delete Account -->
                        <div class="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
                            <h3 class="text-lg font-medium text-red-900 mb-4">Delete Account</h3>
                            <p class="text-sm text-red-700 mb-4">
                                Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.
                            </p>
                            <button type="button" onclick="openDeleteModal()" class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm sm:text-base font-medium">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Delete Account Modal -->
<div id="delete-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
    <div class="relative top-20 mx-auto p-5 border w-11/12 sm:w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mt-4">Delete Account</h3>
            <div class="mt-2 px-7 py-3">
                <p class="text-sm text-gray-500">
                    Are you sure you want to delete your account? This action cannot be undone.
                </p>
            </div>
            <div class="items-center px-4 py-3">
                <form method="post" action="{{ route('profile.destroy') }}" class="space-y-4">
                    @csrf
                    @method('delete')
                    
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Enter your password to confirm</label>
                        <input type="password" name="password" id="password" required 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-sm sm:text-base">
                    </div>
                    
                    <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                        <button type="button" onclick="closeDeleteModal()" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 text-sm sm:text-base font-medium">
                            Cancel
                        </button>
                        <button type="submit" class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm sm:text-base font-medium">
                            Delete Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    // Tab functionality
    document.addEventListener('DOMContentLoaded', function() {
        const tabs = document.querySelectorAll('.tab-button');
        const contents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const target = this.id.replace('-tab', '-content');
                
                // Remove active class from all tabs and contents
                tabs.forEach(t => {
                    t.classList.remove('active', 'border-blue-500', 'text-blue-600');
                    t.classList.add('border-transparent', 'text-gray-500');
                });
                contents.forEach(c => c.classList.add('hidden'));

                // Add active class to clicked tab and show content
                this.classList.add('active', 'border-blue-500', 'text-blue-600');
                this.classList.remove('border-transparent', 'text-gray-500');
                document.getElementById(target).classList.remove('hidden');
            });
        });
    });

    // Delete modal functionality
    function openDeleteModal() {
        document.getElementById('delete-modal').classList.remove('hidden');
    }

    function closeDeleteModal() {
        document.getElementById('delete-modal').classList.add('hidden');
    }

    // Close modal when clicking outside
    document.getElementById('delete-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeDeleteModal();
        }
    });
</script>
@endsection
