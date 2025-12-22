<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', config('app.name', 'VerseFountain'))</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Box Icons -->
    <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
    @yield('head')
</head>
<body class="antialiased bg-stone-50 overflow-x-hidden">
    <!-- Top Navigation Bar -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 flex justify-between items-center h-14 sm:h-16">
            <!-- Logo -->
            <div class="flex items-center space-x-2">
                <a href="/" class="text-gray-800 text-lg sm:text-xl md:text-2xl font-light hover:text-gray-900 transition-colors tracking-wide">VerseFountain</a>
            </div>

            <!-- User Avatar / Auth Buttons -->
            <div class="flex items-center space-x-2 sm:space-x-4">
                @auth
                    <!-- Profile Avatar with Dropdown -->
                    <div class="relative" id="user-dropdown-container">
                        <button id="user-dropdown-toggle" class="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-normal cursor-pointer hover:bg-blue-700 focus:outline-none focus:border-2 focus:border-blue-800 transition-colors border-2 border-transparent">
                            {{ strtoupper(substr(auth()->user()->first_name ?? auth()->user()->username ?? 'A', 0, 1)) }}
                        </button>
                        
                        <!-- Dropdown Menu -->
                        <div id="user-dropdown-menu" 
                             class="absolute right-0 mt-2 w-48 bg-white border-2 border-gray-200 rounded-md py-1 z-50 hidden transition-all duration-100"
                             style="transform: scale(0.95); opacity: 0;">
                            <div class="px-4 py-2 border-b border-gray-200">
                                <p class="text-sm font-normal text-gray-900">{{ auth()->user()->first_name ?? auth()->user()->username ?? 'User' }}</p>
                                <p class="text-xs text-gray-500">{{ auth()->user()->email }}</p>
                            </div>
                            <a href="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</a>
                            <a href="/profile/edit" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</a>
                            @if(auth()->user()->role === 'admin')
                                <a href="/admin-dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Admin Dashboard</a>
                            @endif
                            <div class="border-t border-gray-200">
                                <form method="POST" action="{{ route('logout') }}">
                                    @csrf
                                    <button type="submit" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                        Log Out
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                @else
                    <!-- Login/Signup Buttons - Only show when not authenticated -->
                    <a href="/login" class="hidden sm:block text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:border-2 focus:border-blue-600 rounded-md px-2 py-1 transition-colors">
                        Log In
                    </a>
                    <a href="/register" class="hidden sm:block bg-blue-600 text-white px-3 sm:px-4 py-2 text-sm font-normal hover:bg-blue-700 focus:outline-none focus:border-2 focus:border-blue-800 transition-colors rounded-md">
                        Sign Up
                    </a>
                @endauth
            </div>
        </div>
    </header>

    <!-- Desktop Sidebar Navigation -->
    <div class="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-16 lg:pb-0 lg:bg-white lg:border-r lg:border-gray-200">
        <div class="flex-1 flex flex-col min-h-0 overflow-y-auto">
            <nav class="flex-1 px-4 py-6 space-y-2">
                <div class="space-y-1">
                    <a href="/" class="flex items-center px-3 py-2 text-sm font-normal focus:outline-none focus:border-l-2 focus:border-blue-600 {{ request()->is('/') ? 'text-gray-900 border-l-2 border-blue-600' : 'text-gray-600 hover:text-gray-900' }}">
                        <i class="bx bx-home mr-3 text-lg {{ request()->is('/') ? 'text-gray-800' : 'text-gray-400' }}"></i>
                        Home
                    </a>
                    
                    <a href="/poetry" class="flex items-center px-3 py-2 text-sm font-normal focus:outline-none focus:border-l-2 focus:border-blue-600 {{ request()->is('poetry*') ? 'text-gray-900 border-l-2 border-blue-600' : 'text-gray-600 hover:text-gray-900' }}">
                        <i class="bx bx-file mr-3 text-lg {{ request()->is('poetry*') ? 'text-gray-800' : 'text-gray-400' }}"></i>
                        Poetry
                    </a>
                    
                    <a href="/books" class="flex items-center px-3 py-2 text-sm font-normal focus:outline-none focus:border-l-2 focus:border-blue-600 {{ request()->is('books*') ? 'text-gray-900 border-l-2 border-blue-600' : 'text-gray-600 hover:text-gray-900' }}">
                        <i class="bx bx-book mr-3 text-lg {{ request()->is('books*') ? 'text-gray-800' : 'text-gray-400' }}"></i>
                        Books
                    </a>
                    
                    <a href="/academics" class="flex items-center px-3 py-2 text-sm font-normal focus:outline-none focus:border-l-2 focus:border-blue-600 {{ request()->is('academics*') ? 'text-gray-900 border-l-2 border-blue-600' : 'text-gray-600 hover:text-gray-900' }}">
                        <i class="bx bx-book-reader mr-3 text-lg {{ request()->is('academics*') ? 'text-gray-800' : 'text-gray-400' }}"></i>
                        Academics
                    </a>
                    
                    @auth
                        <a href="{{ route('chatrooms.index') }}" class="flex items-center px-3 py-2 text-sm font-normal focus:outline-none focus:border-l-2 focus:border-blue-600 {{ request()->is('chat*') ? 'text-gray-900 border-l-2 border-blue-600' : 'text-gray-600 hover:text-gray-900' }}">
                            <i class="bx bx-chat mr-3 text-lg {{ request()->is('chat*') ? 'text-gray-800' : 'text-gray-400' }}"></i>
                            Chatrooms
                        </a>
                    @endauth
                    
                    <a href="/events" class="flex items-center px-3 py-2 text-sm font-normal focus:outline-none focus:border-l-2 focus:border-blue-600 {{ request()->is('events*') ? 'text-gray-900 border-l-2 border-blue-600' : 'text-gray-600 hover:text-gray-900' }}">
                        <i class="bx bx-calendar mr-3 text-lg {{ request()->is('events*') ? 'text-gray-800' : 'text-gray-400' }}"></i>
                        Events
                    </a>
                    
                    @auth
                        <a href="/tickets" class="flex items-center px-3 py-2 text-sm font-normal focus:outline-none focus:border-l-2 focus:border-blue-600 {{ request()->is('tickets*') ? 'text-gray-900 border-l-2 border-blue-600' : 'text-gray-600 hover:text-gray-900' }}">
                            <i class="bx bx-ticket mr-3 text-lg {{ request()->is('tickets*') ? 'text-gray-800' : 'text-gray-400' }}"></i>
                            Tickets
                        </a>
                        
                        <a href="/profile" class="flex items-center px-3 py-2 text-sm font-normal focus:outline-none focus:border-l-2 focus:border-blue-600 {{ request()->is('profile*') ? 'text-gray-900 border-l-2 border-blue-600' : 'text-gray-600 hover:text-gray-900' }}">
                            <i class="bx bx-user mr-3 text-lg {{ request()->is('profile*') ? 'text-gray-800' : 'text-gray-400' }}"></i>
                            Profile
                        </a>
                    @else
                        <a href="/login" class="flex items-center px-3 py-2 text-sm font-normal text-gray-600 hover:text-gray-900">
                            <i class="bx bx-log-in mr-3 text-lg text-gray-400"></i>
                            Login
                        </a>
                    @endauth
                </div>
            </nav>
        </div>
    </div>

    <!-- Main Content -->
    <main class="lg:pl-64 min-h-screen pb-20 md:pb-0">
        @yield('content')
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div class="flex justify-around py-1 px-1">
            <a href="/" class="flex flex-col items-center py-1 px-1 focus:outline-none focus:border-2 focus:border-blue-600 rounded-md {{ request()->is('/') ? 'text-gray-900' : 'text-gray-600' }}">
                <i class="bx bx-home text-lg mb-0.5"></i>
                <span class="text-xs leading-tight">Home</span>
            </a>
            <a href="/poetry" class="flex flex-col items-center py-1 px-1 focus:outline-none focus:border-2 focus:border-blue-600 rounded-md {{ request()->is('poetry*') ? 'text-gray-900' : 'text-gray-600' }}">
                <i class="bx bx-file text-lg mb-0.5"></i>
                <span class="text-xs leading-tight">Poetry</span>
            </a>
            <a href="/books" class="flex flex-col items-center py-1 px-1 focus:outline-none focus:border-2 focus:border-blue-600 rounded-md {{ request()->is('books*') ? 'text-gray-900' : 'text-gray-600' }}">
                <i class="bx bx-book text-lg mb-0.5"></i>
                <span class="text-xs leading-tight">Books</span>
            </a>
            <a href="/academics" class="flex flex-col items-center py-1 px-1 focus:outline-none focus:border-2 focus:border-blue-600 rounded-md {{ request()->is('academics*') ? 'text-gray-900' : 'text-gray-600' }}">
                <i class="bx bx-book-reader text-lg mb-0.5"></i>
                <span class="text-xs leading-tight">Academics</span>
            </a>
            @auth
                <a href="{{ route('chatrooms.index') }}" class="flex flex-col items-center py-1 px-1 focus:outline-none focus:border-2 focus:border-blue-600 rounded-md {{ request()->is('chat*') ? 'text-gray-900' : 'text-gray-600' }}">
                    <i class="bx bx-chat text-lg mb-0.5"></i>
                    <span class="text-xs leading-tight">Chat</span>
                </a>
            @endauth
            <a href="/events" class="flex flex-col items-center py-1 px-1 focus:outline-none focus:border-2 focus:border-blue-600 rounded-md {{ request()->is('events*') ? 'text-gray-900' : 'text-gray-600' }}">
                <i class="bx bx-calendar text-lg mb-0.5"></i>
                <span class="text-xs leading-tight">Events</span>
            </a>
            @auth
                <a href="/profile" class="flex flex-col items-center py-1 px-1 focus:outline-none focus:border-2 focus:border-blue-600 rounded-md {{ request()->is('profile*') ? 'text-gray-900' : 'text-gray-600' }}">
                    <i class="bx bx-user text-lg mb-0.5"></i>
                    <span class="text-xs leading-tight">Profile</span>
                </a>
            @else
                <a href="/login" class="flex flex-col items-center py-1 px-1 focus:outline-none focus:border-2 focus:border-blue-600 rounded-md text-gray-600">
                    <i class="bx bx-log-in text-lg mb-0.5"></i>
                    <span class="text-xs leading-tight">Login</span>
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
