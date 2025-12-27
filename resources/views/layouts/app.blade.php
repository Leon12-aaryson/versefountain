<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', config('app.name', 'VerseFountain'))</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Box Icons -->
    <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
    @yield('head')
</head>
<body class="antialiased bg-gray-100 overflow-x-hidden">
    <!-- Desktop Sidebar Navigation -->
    <div class="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:bg-white md:border-r md:border-gray-200 md:z-30">
            <!-- Logo -->
        <div class="px-6 py-6 border-b border-gray-200">
            <a href="/" class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <i class="bx bx-book text-white text-xl"></i>
            </div>
                <span class="text-xl font-semibold text-gray-900">VerseFountain</span>
            </a>
        </div>

        <!-- Navigation Menu -->
        <div class="flex-1 flex flex-col min-h-0 overflow-y-auto sidebar-scroll">
            <nav class="flex-1 px-4 py-6 space-y-1">
                <div class="space-y-1">
                    @auth
                        <a href="/dashboard" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {{ request()->is('dashboard*') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50' }}">
                            <i class="bx bx-grid-alt mr-3 text-lg {{ request()->is('dashboard*') ? 'text-blue-600' : 'text-gray-500' }}"></i>
                            Dashboard
                        </a>
                    @endauth
                    
                    <a href="/" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {{ request()->is('/') && !request()->is('dashboard*') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50' }}">
                        <i class="bx bx-home mr-3 text-lg {{ request()->is('/') && !request()->is('dashboard*') ? 'text-blue-600' : 'text-gray-500' }}"></i>
                        Home
                    </a>
                    
                    <a href="/poetry" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {{ request()->is('poetry*') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50' }}">
                        <i class="bx bx-file mr-3 text-lg {{ request()->is('poetry*') ? 'text-blue-600' : 'text-gray-500' }}"></i>
                        Poetry
                    </a>
                    
                    <a href="/books" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {{ request()->is('books*') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50' }}">
                        <i class="bx bx-book mr-3 text-lg {{ request()->is('books*') ? 'text-blue-600' : 'text-gray-500' }}"></i>
                        Books
                    </a>
                    
                    <a href="/academics" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {{ request()->is('academics*') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50' }}">
                        <i class="bx bx-book-reader mr-3 text-lg {{ request()->is('academics*') ? 'text-blue-600' : 'text-gray-500' }}"></i>
                        Academics
                    </a>
                    
                    @auth
                        <a href="{{ route('chatrooms.index') }}" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {{ request()->is('chat*') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50' }}">
                            <i class="bx bx-chat mr-3 text-lg {{ request()->is('chat*') ? 'text-blue-600' : 'text-gray-500' }}"></i>
                            Chatrooms
                        </a>
                    @endauth
                    
                    <a href="/events" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {{ request()->is('events*') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50' }}">
                        <i class="bx bx-calendar mr-3 text-lg {{ request()->is('events*') ? 'text-blue-600' : 'text-gray-500' }}"></i>
                        Events
                    </a>
                    
                    @auth
                        <a href="/tickets" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {{ request()->is('tickets*') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50' }}">
                            <i class="bx bx-receipt mr-3 text-lg {{ request()->is('tickets*') ? 'text-blue-600' : 'text-gray-500' }}"></i>
                            Tickets
                        </a>
                        
                        <a href="/profile" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {{ request()->is('profile*') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50' }}">
                            <i class="bx bx-user mr-3 text-lg {{ request()->is('profile*') ? 'text-blue-600' : 'text-gray-500' }}"></i>
                            Profile
                        </a>
                    @else
                        <a href="/login" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50">
                            <i class="bx bx-log-in mr-3 text-lg text-gray-500"></i>
                            Login
                        </a>
                    @endauth
                </div>
            </nav>
            
            @auth
                <!-- Upgrade Card -->
                <div class="px-4 pb-6">
                    <div class="bg-blue-600 rounded-lg p-4 text-white">
                        <h3 class="font-semibold mb-1">VerseFountain Pro</h3>
                        <p class="text-xs text-blue-100 mb-3">Get access to all features</p>
                        <a href="/subscriptions" class="block w-full bg-white text-blue-600 text-xs font-medium text-center py-2 rounded-lg hover:bg-blue-50 transition-colors">
                            Get Pro
                        </a>
                    </div>
                </div>
            @endauth
        </div>
    </div>

    <!-- Top Header Bar -->
    <header class="md:pl-64 bg-white border-b border-gray-200 sticky top-0 z-40">
        <div class="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            <!-- Page Title -->
            <div class="flex-1">
                <h1 class="text-xl font-semibold text-gray-900">@yield('page-title', auth()->check() ? 'Dashboard' : 'Home')</h1>
            </div>
            
            <!-- Search Bar -->
            <div class="hidden md:flex flex-1 max-w-md mx-8">
                <div class="relative w-full">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="bx bx-search text-gray-400"></i>
                    </div>
                    <input type="text" placeholder="Search here..." class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600">
                </div>
            </div>
            
            <!-- Right Side Actions -->
            <div class="flex items-center space-x-4">
                @auth
                    <!-- Notifications -->
                    <button class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                        <i class="bx bx-bell text-xl"></i>
                        <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    
                    <!-- User Profile -->
                    <div class="relative" id="user-dropdown-container">
                        <button id="user-dropdown-toggle" class="flex items-center space-x-2 px-2 py-1 hover:bg-gray-50 rounded-lg transition-colors">
                            <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                {{ strtoupper(substr(auth()->user()->first_name ?? auth()->user()->username ?? 'A', 0, 1)) }}
                            </div>
                            <div class="hidden lg:block text-left">
                                <p class="text-sm font-medium text-gray-900">{{ auth()->user()->first_name ?? auth()->user()->username ?? 'User' }}</p>
                                <p class="text-xs text-gray-500">{{ auth()->user()->role ?? 'User' }}</p>
                            </div>
                            <i class="bx bx-chevron-down text-gray-500 hidden lg:block"></i>
                        </button>
                        
                        <!-- Dropdown Menu -->
                        <div id="user-dropdown-menu" 
                             class="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 hidden transition-all duration-200"
                             style="transform: scale(0.95); opacity: 0;">
                            <a href="/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <i class="bx bx-grid-alt mr-2"></i>Dashboard
                            </a>
                            <a href="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <i class="bx bx-user mr-2"></i>Profile
                            </a>
                            <a href="/profile/edit" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <i class="bx bx-cog mr-2"></i>Settings
                            </a>
                            @if(auth()->user()->role === 'admin')
                                <a href="/admin-dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    <i class="bx bx-shield-quarter mr-2"></i>Admin Dashboard
                                </a>
                            @endif
                            <div class="border-t border-gray-200 mt-1">
                                <form method="POST" action="{{ route('logout') }}">
                                    @csrf
                                    <button type="submit" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                        <i class="bx bx-log-out mr-2"></i>Sign Out
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                @else
                    <!-- Login/Signup Buttons -->
                    <a href="/login" class="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        Log In
                    </a>
                    <a href="/register" class="bg-blue-600 text-white px-5 py-2 text-sm font-medium hover:bg-blue-700 rounded-lg transition-colors">
                        Sign Up
                    </a>
                @endauth
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="md:pl-64 min-h-screen pb-20 md:pb-0 bg-gray-100">
        <div class="px-4 sm:px-6 lg:px-8 py-6">
        @yield('content')
        </div>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div class="flex justify-around py-2 px-1">
            <a href="/" class="flex flex-col items-center py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-all duration-200 {{ request()->is('/') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900' }}">
                <i class="bx bx-home text-xl mb-1"></i>
                <span class="text-xs font-medium leading-tight">Home</span>
            </a>
            @auth
                <a href="/dashboard" class="flex flex-col items-center py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-all duration-200 {{ request()->is('dashboard*') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900' }}">
                    <i class="bx bx-grid-alt text-xl mb-1"></i>
                    <span class="text-xs font-medium leading-tight">Dashboard</span>
                </a>
            @endauth
            <a href="/poetry" class="flex flex-col items-center py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-all duration-200 {{ request()->is('poetry*') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900' }}">
                <i class="bx bx-file text-xl mb-1"></i>
                <span class="text-xs font-medium leading-tight">Poetry</span>
            </a>
            <a href="/books" class="flex flex-col items-center py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-all duration-200 {{ request()->is('books*') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900' }}">
                <i class="bx bx-book text-xl mb-1"></i>
                <span class="text-xs font-medium leading-tight">Books</span>
            </a>
            @auth
                <a href="/profile" class="flex flex-col items-center py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-all duration-200 {{ request()->is('profile*') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900' }}">
                    <i class="bx bx-user text-xl mb-1"></i>
                    <span class="text-xs font-medium leading-tight">Profile</span>
                </a>
            @else
                <a href="/login" class="flex flex-col items-center py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-900">
                    <i class="bx bx-log-in text-xl mb-1"></i>
                    <span class="text-xs font-medium leading-tight">Login</span>
                </a>
            @endauth
        </div>
    </nav>

    @yield('scripts')
    
    <script>
        // User dropdown functionality
        document.addEventListener('DOMContentLoaded', function() {
            const dropdownToggle = document.getElementById('user-dropdown-toggle');
            const dropdownMenu = document.getElementById('user-dropdown-menu');
            
            if (dropdownToggle && dropdownMenu) {
                dropdownToggle.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const isHidden = dropdownMenu.classList.contains('hidden');
                    
                    if (isHidden) {
                        dropdownMenu.classList.remove('hidden');
                        setTimeout(() => {
                            dropdownMenu.style.transform = 'scale(1)';
                            dropdownMenu.style.opacity = '1';
                        }, 10);
                    } else {
                        dropdownMenu.style.transform = 'scale(0.95)';
                        dropdownMenu.style.opacity = '0';
                        setTimeout(() => {
                            dropdownMenu.classList.add('hidden');
                        }, 100);
                    }
                });
                
                // Close dropdown when clicking outside
                document.addEventListener('click', function(e) {
                    if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                        dropdownMenu.style.transform = 'scale(0.95)';
                        dropdownMenu.style.opacity = '0';
                        setTimeout(() => {
                            dropdownMenu.classList.add('hidden');
                        }, 100);
                    }
                });
            }
        });
    </script>
</body>
</html>
