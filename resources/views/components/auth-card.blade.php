@props(['title', 'description', 'activeTab' => 'login'])

<div class="bg-white rounded-lg border border-gray-200 shadow-sm">
    <div class="p-6">
        <div class="mb-6">
            <h3 class="text-xl font-semibold text-gray-900">{{ $title }}</h3>
            <p class="text-gray-600 mt-1">{{ $description }}</p>
        </div>

        <!-- Tabs -->
        <div class="mb-6">
            <div class="flex bg-gray-100 rounded-lg p-1">
                <a href="{{ route('register') }}" 
                   class="flex-1 text-center py-2 px-4 text-sm font-medium {{ $activeTab === 'register' ? 'bg-white text-blue-600 rounded-md shadow-sm' : 'text-gray-600 rounded-md hover:text-gray-900 transition-colors' }}">
                    Register
                </a>
                <a href="{{ route('login') }}" 
                   class="flex-1 text-center py-2 px-4 text-sm font-medium {{ $activeTab === 'login' ? 'bg-white text-blue-600 rounded-md shadow-sm' : 'text-gray-600 rounded-md hover:text-gray-900 transition-colors' }}">
                    Login
                </a>
            </div>
        </div>

        {{ $slot }}
    </div>
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <p class="text-center text-xs text-gray-600">
            @if($activeTab === 'login')
                By signing in, you agree to our Terms of Service and Privacy Policy.
            @else
                By creating an account, you agree to our Terms of Service and Privacy Policy.
            @endif
        </p>
    </div>
</div> 