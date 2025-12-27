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
            <div class="bg-white shadow-sm rounded-md p-4 sm:p-6 mb-6 sm:mb-8">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <a href="{{ route('chatrooms.index') }}"
                            class="text-gray-600 hover:text-gray-900 transition-colors">
                            <i class="bx bx-arrow-back text-xl"></i>
                        </a>
                        <div>
                            <h1 class="text-xl sm:text-2xl font-light text-gray-800 tracking-wide">{{ $chatroom->name }}
                            </h1>
                            <p class="text-sm text-gray-600 font-light">{{ $chatroom->description }}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="text-sm text-gray-500">{{ $chatroom->members->count() }} members</span>
                        @if($isMember)
                            <button onclick="leaveChatroom()" class="text-gray-600 hover:text-gray-900 text-sm font-normal">
                                Leave Room
                            </button>
                        @endif
                    </div>
                </div>
            </div>

            @if($isMember)
                <!-- Chat Interface -->
                <div class="bg-white shadow-sm rounded-md" data-chat-interface">

                    <!-- Messages Area -->
                    <div class="h-96 sm:h-[500px] overflow-y-auto p-4 sm:p-6 space-y-4" data-messages-container>

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
                        <div data-new-messages style="display: none;"></div>
                    </div>

                    <!-- Message Input -->
                    <div class="border-t border-gray-200 p-4 sm:p-6">
                        <form data-message-form class="flex space-x-3">
                            <div class="flex-1">
                                <input data-message-input type="text" placeholder="Type your message..."
                                    class="w-full px-3 py-2 border border-gray-300 focus:border-blue-600 bg-white focus:outline-none text-sm">
                            </div>
                            <button type="submit"
                                class="px-4 py-2 bg-blue-600 text-white text-sm font-normal hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                <span data-send-text>Send</span>
                                <span data-sending-text style="display: none;">Sending...</span>
                            </button>
                        </form>
                    </div>
                </div>
            @else
                <!-- Join Prompt -->
                <div class="bg-white shadow-sm rounded-md p-8 sm:p-12 text-center">
                    <div class="max-w-md mx-auto">
                        <i class="bx bx-message-dots text-gray-400 mx-auto mb-4"></i>
                        <h3 class="text-lg font-light text-gray-800 mb-2 tracking-wide">Join this chatroom</h3>
                        <p class="text-gray-600 mb-4 font-light">You need to join this chatroom to participate in the
                            conversation.</p>
                        <button onclick="joinChatroom({{ $chatroom->id }})"
                            class="px-6 py-2.5 bg-blue-600 text-white text-sm font-normal hover:bg-blue-700 transition-colors focus:outline-none">
                            Join Chatroom
                        </button>
                    </div>
                </div>
            @endif
        </div>
    </div>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const apiBaseUrl = "{{ url('/chat/rooms') }}";
        const chatUrl = "{{ url('/chat/rooms') }}";
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const roomId = {{ $chatroom->id }};

        @if($isMember)
            // Initialize ChatInterface
            const chatContainer = document.querySelector('[data-chat-interface]');
            if (chatContainer) {
                const chatInterface = new ChatInterface(chatContainer, {
                    roomId: roomId,
                    apiBaseUrl: apiBaseUrl
                });

                // Store globally for WebSocket access
                window.chatInterfaceInstance = chatInterface;

                // Update send button state
                const messageForm = chatContainer.querySelector('[data-message-form]');
                const messageInput = chatContainer.querySelector('[data-message-input]');
                const sendText = chatContainer.querySelector('[data-send-text]');
                const sendingText = chatContainer.querySelector('[data-sending-text]');

                if (messageForm) {
                    messageForm.addEventListener('submit', async function(e) {
                        e.preventDefault();
                        const message = messageInput?.value.trim();
                        if (!message) return;

                        // Update UI
                        if (sendText) sendText.style.display = 'none';
                        if (sendingText) sendingText.style.display = 'inline';
                        messageInput.disabled = true;

                        try {
                            const response = await fetch(`${apiBaseUrl}/${roomId}/messages`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRF-TOKEN': csrfToken,
                                    'Accept': 'application/json'
                                },
                                body: JSON.stringify({ message })
                            });

                            if (response.ok) {
                                const data = await response.json();
                                chatInterface.addNewMessage(data);
                                messageInput.value = '';
                            } else {
                                const errorData = await response.json();
                                if (window.flashMessage) {
                                    window.flashMessage.show(errorData.message || 'Failed to send message', 'error');
                                }
                            }
                        } catch (error) {
                            console.error('Error sending message:', error);
                            if (window.flashMessage) {
                                window.flashMessage.show('Failed to send message', 'error');
                            }
                        } finally {
                            if (sendText) sendText.style.display = 'inline';
                            if (sendingText) sendingText.style.display = 'none';
                            messageInput.disabled = false;
                        }
                    });
                }
            }

            // Initialize Echo for real-time messaging
            if (typeof Echo !== 'undefined') {
                window.Echo.join(`chat.room.${roomId}`)
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
                        if (window.chatInterfaceInstance) {
                            window.chatInterfaceInstance.addNewMessage(e);
                        }
                    });
            }
        @endif

        async function joinChatroom(roomId) {
            try {
                const response = await fetch(`${chatUrl}/${roomId}/join`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json'
                    },
                    credentials: 'same-origin'
                });

                if (response.ok) {
                    if (window.flashMessage) {
                        window.flashMessage.show('Successfully joined the chatroom!', 'success');
                    }
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    const data = await response.json();
                    if (window.flashMessage) {
                        window.flashMessage.show(data.message || 'Failed to join chatroom', 'error');
                    }
                }
            } catch (error) {
                console.error('Error joining chatroom:', error);
                if (window.flashMessage) {
                    window.flashMessage.show('An error occurred while joining the chatroom', 'error');
                }
            }
        }

        async function leaveChatroom() {
            if (!confirm('Are you sure you want to leave this chatroom?')) {
                return;
            }

            try {
                const response = await fetch(`${chatUrl}/${roomId}/leave`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json'
                    },
                    credentials: 'same-origin'
                });

                if (response.ok) {
                    if (window.flashMessage) {
                        window.flashMessage.show('Left the chatroom', 'success');
                    }
                    setTimeout(() => {
                        window.location.href = "{{ route('chatrooms.index') }}";
                    }, 1000);
                } else {
                    if (window.flashMessage) {
                        window.flashMessage.show('Failed to leave chatroom', 'error');
                    }
                }
            } catch (error) {
                console.error('Error leaving chatroom:', error);
                if (window.flashMessage) {
                    window.flashMessage.show('An error occurred while leaving the chatroom', 'error');
                }
            }
        }

        // Make functions globally available
        window.joinChatroom = joinChatroom;
        window.leaveChatroom = leaveChatroom;
    });
    </script>
@endsection
