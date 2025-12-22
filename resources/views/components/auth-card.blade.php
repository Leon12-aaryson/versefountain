@props(['title', 'description', 'activeTab' => 'login'])

<div class="bg-white border-2 border-gray-200 rounded-md">
    <div class="p-6">
        <div class="mb-6">
            <h3 class="text-xl font-light text-gray-800 tracking-wide">{{ $title }}</h3>
            <p class="text-gray-600 mt-2 font-light">{{ $description }}</p>
        </div>

        <!-- Tabs -->
        <div class="mb-6">
            <div class="flex border border-gray-200">
                <a href="{{ route('register') }}" 
                   class="flex-1 text-center py-2 px-4 text-sm font-normal rounded-md {{ $activeTab === 'register' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors' }}">
                    Register
                </a>
                <a href="{{ route('login') }}" 
                   class="flex-1 text-center py-2 px-4 text-sm font-normal rounded-md {{ $activeTab === 'login' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors' }}">
                    Login
                </a>
            </div>
        </div>

        {{ $slot }}
    </div>
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <p class="text-center text-xs text-gray-500 font-light">
            @if($activeTab === 'login')
                By signing in, you agree to our Terms of Service and Privacy Policy.
            @else
                By creating an account, you agree to our Terms of Service and Privacy Policy.
            @endif
        </p>
    </div>
</div> 