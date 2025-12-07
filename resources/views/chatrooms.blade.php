@extends('layouts.app')

@section('title', 'Chatrooms - VerseFountain')

@section('content')
@php
    $chatrooms = App\Models\ChatRoom::with('members')->get();
@endphp

<div class="min-h-screen bg-stone-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <!-- Page Header -->
        <div class="mb-10 sm:mb-12">
            <h1 class="text-3xl sm:text-4xl font-light text-gray-800 mb-2 tracking-wide">Chatrooms</h1>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">Connect with fellow poetry enthusiasts and writers</p>
        </div>

        <!-- Search and Filter Section -->
        <div class="bg-white border border-gray-200 p-5 sm:p-6 mb-8 sm:mb-10">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Search -->
                <div class="sm:col-span-2 lg:col-span-1">
                    <label for="search" class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Search Chatrooms</label>
                    <div class="relative">
                        <input type="text" id="search" placeholder="Search chatrooms or topics..." 
                               class="w-full pl-9 pr-3 py-2 border border-gray-300 focus:border-gray-500 text-sm bg-white focus:outline-none">
                        <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Category Filter -->
                <div>
                    <label for="category" class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Category</label>
                    <select id="category" class="w-full px-3 py-2 border border-gray-300 focus:border-gray-500 text-sm bg-white focus:outline-none appearance-none cursor-pointer">
                        <option value="">All Categories</option>
                        <option value="general">General Discussion</option>
                        <option value="poetry">Poetry</option>
                        <option value="writing">Writing Tips</option>
                        <option value="books">Book Discussion</option>
                    </select>
                </div>

                <!-- Sort By -->
                <div>
                    <label for="sort" class="block text-xs font-normal text-gray-600 mb-1.5 uppercase tracking-wide">Sort By</label>
                    <select id="sort" class="w-full px-3 py-2 border border-gray-300 focus:border-gray-500 text-sm bg-white focus:outline-none appearance-none cursor-pointer">
                        <option value="active">Most Active</option>
                        <option value="recent">Recently Created</option>
                        <option value="members">Most Members</option>
                    </select>
                </div>
            </div>
        </div>

    <!-- All Chatrooms -->
    <div class="mb-10 sm:mb-12">
        <h2 class="text-xl sm:text-2xl font-light text-gray-800 mb-6 sm:mb-8 tracking-wide">Available Chatrooms</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            @foreach($chatrooms as $index => $room)
            <div class="bg-white border border-gray-200 hover:border-gray-300 transition-colors">
                <div class="h-40 sm:h-48 bg-gray-100 flex items-center justify-center">
                    <svg class="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                </div>
                <div class="p-4 sm:p-6">
                    <div class="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                        <span class="text-xs text-gray-600 uppercase tracking-wide">
                            {{ ['Poetry', 'Writing', 'Books', 'General', 'Critique', 'Haiku', 'Spoken Word', 'Challenges', 'Classic', 'Modern', 'Translation', 'Education'][$index % 12] }}
                        </span>
                        <span class="text-xs text-gray-500">{{ $room->members->count() }} members</span>
                    </div>
                    <h3 class="font-normal text-gray-900 mb-1 text-sm sm:text-base">{{ $room->name }}</h3>
                    <p class="text-gray-600 text-xs sm:text-sm mb-3 font-light line-clamp-2">{{ $room->description }}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">Active now</span>
                        <div class="flex space-x-2">
                            @auth
                                @if($room->members->contains(auth()->id()))
                                    <a href="{{ route('chatroom.show', $room) }}" 
                                       class="px-3 py-1 bg-gray-800 text-white text-xs font-normal hover:bg-gray-700 transition-colors">
                                        Enter Chat
                                    </a>
                                    <button onclick="leaveChatroom({{ $room->id }})" 
                                            class="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-normal hover:bg-gray-50 transition-colors">
                                        Leave
                                    </button>
                                @else
                                    <button class="px-3 py-1 bg-gray-800 text-white text-xs font-normal hover:bg-gray-700 transition-colors" 
                                            data-room-id="{{ $room->id }}"
                                            onclick="joinChatroom({{ $room->id }})">
                                        Join
                                    </button>
                                @endif
                            @else
                                <a href="{{ route('login') }}" 
                                   class="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-normal hover:bg-gray-50 transition-colors">
                                    Login to Join
                                </a>
                            @endauth
                        </div>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </div>

    <!-- Create New Chatroom Button -->
    @auth
    <div class="text-center mb-10 sm:mb-12">
        <button class="px-6 py-2.5 bg-gray-800 text-white text-sm font-normal hover:bg-gray-700 transition-colors">
            Create New Chatroom
        </button>
    </div>
    @endauth
    </div>
</div>

<script>
const joinUrl = "{{ url('/chat/rooms') }}";
const chatUrl = "{{ url('/chat/rooms') }}";
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

async function joinChatroom(roomId) {
    const button = event.target;
    const originalText = button.textContent;
    
    try {
        // Show loading state
        button.textContent = 'Joining...';
        button.disabled = true;
        button.classList.add('opacity-50');
        
        const response = await fetch(joinUrl + '/' + roomId + '/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json'
            },
            credentials: 'same-origin'
        });

        const data = await response.json();

        if (response.ok) {
            // Update button to show joined state
            button.outerHTML = `
                <a href="${chatUrl}/${roomId}" 
                   class="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700 transition-colors">
                    Enter Chat
                </a>
                <button onclick="leaveChatroom(${roomId})" 
                        class="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700 transition-colors">
                    Leave
                </button>
            `;
            
            // Update member count
            updateMemberCount(roomId, 1);
            
            // Show success message
            showNotification('Successfully joined the chatroom!', 'success');
        } else {
            // Reset button state
            button.textContent = originalText;
            button.disabled = false;
            button.classList.remove('opacity-50');
            
            // Show error message
            showNotification(data.message || 'Failed to join chatroom', 'error');
        }
    } catch (error) {
        console.error('Error joining chatroom:', error);
        
        // Reset button state
        button.textContent = originalText;
        button.disabled = false;
        button.classList.remove('opacity-50');
        
        // Show error message
        showNotification('An error occurred while joining the chatroom', 'error');
    }
}

function showNotification(message, type) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 shadow-lg ' +
        (type === 'success' ? 'bg-green-500' : 'bg-red-500');
    notification.textContent = message;
    
    // Add animation classes
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.3s ease-out';
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Add search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('category');
    const sortSelect = document.getElementById('sort');
    const chatroomCards = document.querySelectorAll('.bg-white.rounded-lg.shadow-sm');
    
    function filterChatrooms() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value;
        
        chatroomCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const category = card.querySelector('span').textContent.toLowerCase();
            
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesCategory = !selectedCategory || category.includes(selectedCategory);
            
            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    searchInput.addEventListener('input', filterChatrooms);
    categorySelect.addEventListener('change', filterChatrooms);
    sortSelect.addEventListener('change', function() {
        // Add sorting logic here if needed
        console.log('Sort by:', this.value);
    });
});

async function leaveChatroom(roomId) {
    if (!confirm('Are you sure you want to leave this chatroom?')) {
        return;
    }
    
    try {
        const response = await fetch(joinUrl + '/' + roomId + '/leave', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json'
            },
            credentials: 'same-origin'
        });

        if (response.ok) {
            // Find the chatroom card and update buttons
            const chatroomCard = document.querySelector(`[data-room-id="${roomId}"]`)?.closest('.bg-white.rounded-lg.shadow-sm');
            if (chatroomCard) {
                const buttonContainer = chatroomCard.querySelector('.flex.space-x-2');
                buttonContainer.innerHTML = `
                    <button class="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors" 
                            data-room-id="${roomId}"
                            onclick="joinChatroom(${roomId})">
                        Join
                    </button>
                `;
            }
            
            // Update member count
            updateMemberCount(roomId, -1);
            
            showNotification('Left the chatroom', 'success');
        } else {
            const data = await response.json();
            showNotification(data.message || 'Failed to leave chatroom', 'error');
        }
    } catch (error) {
        console.error('Error leaving chatroom:', error);
        showNotification('An error occurred while leaving the chatroom', 'error');
    }
}

function updateMemberCount(roomId, change) {
    const chatroomCard = document.querySelector(`[data-room-id="${roomId}"]`)?.closest('.bg-white.rounded-lg.shadow-sm');
    if (chatroomCard) {
        const memberCountElement = chatroomCard.querySelector('.text-xs.text-gray-500');
        if (memberCountElement) {
            const currentCount = parseInt(memberCountElement.textContent.split(' ')[0]);
            const newCount = Math.max(0, currentCount + change);
            memberCountElement.textContent = `${newCount} members`;
        }
    }
}
</script>
@endsection