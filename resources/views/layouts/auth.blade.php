<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', config('app.name', 'VerseFountain'))</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Box Icons -->
    <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
    @yield('head')
</head>
<body class="antialiased bg-gray-100">
    <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 class="text-center text-3xl font-light text-gray-800 tracking-wide">
                VerseFountain
            </h2>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-5xl">
            <div class="bg-white shadow-sm rounded-md py-8 px-4 sm:px-10">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Left Column - Auth Form -->
                    <div>
                        @yield('auth-content')
                    </div>

                    <!-- Right Column - Hero Section -->
                    <div class="hidden md:flex flex-col justify-center">
                        <div class="text-center mb-6">
                            <h2 class="text-3xl font-light text-gray-800 mb-4 tracking-wide">
                                Discover the World of Poetry
                            </h2>
                            <p class="text-gray-600 max-w-md mx-auto leading-relaxed font-light">
                                Join our community of readers and writers. Share your poetry, discover new books, and connect with like-minded literature enthusiasts.
                            </p>
                        </div>

                        <div class="flex flex-col space-y-4">
                            <a href="/poetry">
                                <div class="flex items-center bg-gray-50 rounded-md p-4 sm:p-6 transition-colors">
                                    <div class="w-10 h-10 bg-gray-100 flex items-center justify-center mr-4">
                                        <svg class="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 class="font-normal text-gray-800">Share Your Poetry</h3>
                                        <p class="text-sm text-gray-600 font-light">Publish your poems in text or video format</p>
                                    </div>
                                </div>
                            </a>

                            <a href="{{ route('chatrooms.index') }}">
                                <div class="flex items-center bg-gray-50 rounded-md p-4 sm:p-6 transition-colors">
                                    <div class="w-10 h-10 bg-gray-100 flex items-center justify-center mr-4">
                                        <svg class="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 class="font-normal text-gray-800">Engage in Chat Rooms</h3>
                                        <p class="text-sm text-gray-600 font-light">Discuss literature with fellow enthusiasts</p>
                                    </div>
                                </div>
                            </a>

                            <a href="/books">
                                <div class="flex items-center bg-gray-50 rounded-md p-4 sm:p-6 transition-colors">
                                    <div class="w-10 h-10 bg-gray-100 flex items-center justify-center mr-4">
                                        <svg class="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 class="font-normal text-gray-800">Explore Books</h3>
                                        <p class="text-sm text-gray-600 font-light">Access our vast collection of eBooks</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    @yield('scripts')
</body>
</html> 