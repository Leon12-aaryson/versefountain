@extends('layouts.app')

@section('title', $chatroom->name . ' - VerseFountain')

@section('content')
@php
    $isMember = auth()->check() && $chatroom->members()->where('user_id', auth()->id())->exists();
    $messages = $chatroom->messages()->with('user')->latest()->take(50)->get()->reverse();
@endphp

<div class="min-h-screen bg-stone-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <!-- Chatroom Header -->
        <div class="bg-white border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <a href="{{ route('chatrooms.index') }}" 
                       class="text-gray-600 hover:text-gray-900 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                    </a>
                    <div>
                        <h1 class="text-xl sm:text-2xl font-light text-gray-800 tracking-wide">{{ $chatroom->name }}</h1>
                        <p class="text-sm text-gray-600 font-light">{{ $chatroom->description }}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="text-sm text-gray-500">{{ $chatroom->members->count() }} members</span>
                    @if($isMember)
                        <button onclick="leaveChatroom()" 
                                class="text-gray-600 hover:text-gray-900 text-sm font-normal">
                            Leave Room
                        </button>
                    @endif
                </div>
            </div>
        </div>

    @if($isMember)
        <!-- Chat Interface -->
        <div class="bg-white border border-gray-200" 
             x-data="chatInterface({{ $chatroom->id }})">
            
            <!-- Messages Area -->
            <div class="h-96 sm:h-[500px] overflow-y-auto p-4 sm:p-6 space-y-4" 
                 x-ref="messagesContainer"
                 @scroll="handleScroll()">
                
                @forelse($messages as $message)
                <div class="flex space-x-3">
                    <div class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <span class="text-xs font-normal text-gray-700">
                            {{ strtoupper(($message->user->first_name ?? $message->user->username ?? 'U')[0]) }}
                        </span>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-1">
                            <span class="text-sm font-normal text-gray-900">
                                {{ $message->user->first_name ?? $message->user->username ?? 'Anonymous' }}
                            </span>
                            <span class="text-xs text-gray-500">
                                {{ $message->created_at->diffForHumans() }}
                            </span>
                        </div>
                        <div class="bg-gray-50 px-3 py-2">
                            <p class="text-sm text-gray-800 font-light">{{ $message->message }}</p>
                        </div>
                    </div>
                </div>
                @empty
                <div class="text-center text-gray-500 py-8 font-light">
                    <p>No messages yet. Start the conversation!</p>
                </div>
                @endforelse
                
                <!-- New messages will appear here -->
                <div x-show="newMessages.length > 0" x-transition>
                    <template x-for="message in newMessages" :key="message.id">
                        <div class="flex space-x-3">
                            <div class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <span class="text-xs font-normal text-gray-700" x-text="message.user_initial"></span>
                            </div>
                            <div class="flex-1">
                                <div class="flex items-center space-x-2 mb-1">
                                    <span class="text-sm font-normal text-gray-900" x-text="message.user_name"></span>
                                    <span class="text-xs text-gray-500" x-text="message.time_ago"></span>
                                </div>
                                <div class="bg-gray-50 px-3 py-2">
                                    <p class="text-sm text-gray-800 font-light" x-text="message.content"></p>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- Message Input -->
            <div class="border-t border-gray-200 p-4 sm:p-6">
                <form @submit.prevent="sendMessage()" class="flex space-x-3">
                    <div class="flex-1">
                        <input x-model="newMessage" 
                               type="text" 
                               placeholder="Type your message..." 
                               class="w-full px-3 py-2 border border-gray-300 focus:border-gray-500 bg-white focus:outline-none text-sm"
                               :disabled="isSending">
                    </div>
                    <button type="submit" 
                            :disabled="!newMessage.trim() || isSending"
                            class="px-4 py-2 bg-gray-800 text-white text-sm font-normal hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <span x-show="!isSending">Send</span>
                        <span x-show="isSending">Sending...</span>
                    </button>
                </form>
            </div>
        </div>
    @else
        <!-- Join Prompt -->
        <div class="bg-white border border-gray-200 p-8 sm:p-12 text-center">
            <div class="max-w-md mx-auto">
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <h3 class="text-lg font-light text-gray-800 mb-2 tracking-wide">Join this chatroom</h3>
                <p class="text-gray-600 mb-4 font-light">You need to join this chatroom to participate in the conversation.</p>
                <button onclick="joinChatroom({{ $chatroom->id }})" 
                        class="px-6 py-2.5 bg-gray-800 text-white text-sm font-normal hover:bg-gray-700 transition-colors">
                    Join Chatroom
                </button>
            </div>
        </div>
    @endif
    </div>
</div>

<script>
const apiBaseUrl = "{{ url('/chat/rooms') }}";
const chatUrl = "{{ url('/chat/rooms') }}";
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// Initialize Echo for real-time messaging
if (typeof Echo !== 'undefined') {
    window.Echo.join('chat.room.{{ $chatroom->id }}')
        .here((users) => {
            console.log('Users currently in chatroom:', users);
        })
        .joining((user) => {
            console.log('User joining:', user);
        })
        .leaving((user) => {
            console.log('User leaving:', user);
        })
        .listen('ChatMessageSent', (e) => {
            console.log('New message received:', e);
            // Add the new message to the chat
            if (window.chatInterfaceInstance) {
                window.chatInterfaceInstance.addNewMessage(e);
            }
        });
}

function chatInterface(roomId) {
    const instance = {
        roomId: roomId,
        newMessage: '',
        newMessages: [],
        isSending: false,
        
        init() {
            // Set up real-time updates (you can implement WebSocket here)
            this.pollForNewMessages();
        },
        
        async sendMessage() {
            if (!this.newMessage.trim() || this.isSending) return;
            
            this.isSending = true;
            const messageContent = this.newMessage;
            this.newMessage = '';
            
            try {
                const response = await fetch(apiBaseUrl + '/' + this.roomId + '/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ message: messageContent })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    this.addNewMessage(data);
                } else {
                    const errorData = await response.json();
                    this.newMessage = messageContent; // Restore message on error
                    showNotification(errorData.message || 'Failed to send message', 'error');
                }
            } catch (error) {
                console.error('Error sending message:', error);
                this.newMessage = messageContent; // Restore message on error
                showNotification('Failed to send message', 'error');
            } finally {
                this.isSending = false;
            }
        },
        
        addNewMessage(message) {
            // Handle both local messages and WebSocket messages
            const messageData = {
                id: message.id,
                content: message.message || message.content,
                user_name: message.username || message.user_name,
                user_initial: (message.username || message.user_name || 'U')[0],
                time_ago: message.timestamp ? this.formatTimeAgo(new Date(message.timestamp)) : 'just now'
            };
            
            this.newMessages.push(messageData);
            
            // Scroll to bottom
            this.$nextTick(() => {
                if (this.$refs.messagesContainer) {
                    this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
                }
            });
        },
        
        formatTimeAgo(date) {
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);
            
            if (diffInSeconds < 60) return 'just now';
            if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + ' minutes ago';
            if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + ' hours ago';
            return Math.floor(diffInSeconds / 86400) + ' days ago';
        },
        
        pollForNewMessages() {
            // Simple polling for new messages (replace with WebSocket in production)
            setInterval(() => {
                this.checkForNewMessages();
            }, 3000);
        },
        
        async checkForNewMessages() {
            try {
                const response = await fetch(apiBaseUrl + '/' + this.roomId + '/messages?since=' + Date.now(), {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    data.forEach(message => {
                        if (!this.newMessages.find(m => m.id === message.id)) {
                            this.addNewMessage(message);
                        }
                    });
                }
            } catch (error) {
                console.error('Error checking for new messages:', error);
            }
        },
        
        handleScroll() {
            // Implement infinite scroll or other scroll behaviors here
        }
    };
    
    // Store the instance globally for WebSocket access
    window.chatInterfaceInstance = instance;
    return instance;
}

async function joinChatroom(roomId) {
    try {
        const response = await fetch(chatUrl + '/' + roomId + '/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json'
            },
            credentials: 'same-origin'
        });

        if (response.ok) {
            showNotification('Successfully joined the chatroom!', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            const data = await response.json();
            showNotification(data.message || 'Failed to join chatroom', 'error');
        }
    } catch (error) {
        console.error('Error joining chatroom:', error);
        showNotification('An error occurred while joining the chatroom', 'error');
    }
}

async function leaveChatroom() {
    if (!confirm('Are you sure you want to leave this chatroom?')) {
        return;
    }
    
    try {
        const response = await fetch(chatUrl + '/' + {{ $chatroom->id }} + '/leave', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json'
            },
            credentials: 'same-origin'
        });

        if (response.ok) {
            showNotification('Left the chatroom', 'success');
            setTimeout(() => {
                window.location.href = "{{ route('chatrooms.index') }}";
            }, 1000);
        } else {
            showNotification('Failed to leave chatroom', 'error');
        }
    } catch (error) {
        console.error('Error leaving chatroom:', error);
        showNotification('An error occurred while leaving the chatroom', 'error');
    }
}

function showNotification(message, type) {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 shadow-lg ' +
        (type === 'success' ? 'bg-green-500' : 'bg-red-500');
    notification.textContent = message;
    
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.3s ease-out';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}
</script>
@endsection
