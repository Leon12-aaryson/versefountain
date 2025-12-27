import './bootstrap';

// Global utilities
window.utils = {
    // Format date to relative time
    formatDate(dateString) {
        if (!dateString) return 'Unknown date';
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';
        
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Show toast notification
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-md ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    },

    // Copy text to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy text:', error);
            this.showToast('Failed to copy text', 'error');
        }
    },

    // Share content
    async shareContent(data) {
        if (navigator.share) {
            try {
                await navigator.share(data);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error sharing:', error);
                }
            }
        } else {
            // Fallback: copy to clipboard
            const text = `${data.title}\n\n${data.text}\n\n${data.url}`;
            await this.copyToClipboard(text);
        }
    }
};

// Global event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Auto-hide flash messages
    const flashMessages = document.querySelectorAll('.bg-green-50, .bg-red-50');
    flashMessages.forEach(message => {
        setTimeout(() => {
            message.style.transition = 'opacity 0.5s ease';
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 500);
        }, 5000);
    });

    // Handle form submissions
    document.addEventListener('submit', function(event) {
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Processing...';
        }
    });

    // Handle confirmation dialogs
    document.addEventListener('click', function(event) {
        if (event.target.matches('[data-confirm]')) {
            const message = event.target.getAttribute('data-confirm');
            if (!confirm(message)) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
    });
});

// CSRF token for AJAX requests
window.csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

// Add CSRF token to all AJAX requests
if (window.csrfToken) {
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
        if (options.method && options.method !== 'GET') {
            options.headers = {
                ...options.headers,
                'X-CSRF-TOKEN': window.csrfToken
            };
        }
        return originalFetch(url, options);
    };
}

// ============================================
// Vanilla JS Components
// ============================================

// Flash Message System
class FlashMessage {
    constructor(containerId = 'flash-message-container') {
        this.container = document.getElementById(containerId);
        this.messageElement = null;
    }

    show(message, type = 'success') {
        if (!this.container) {
            // Create container if it doesn't exist
            this.container = document.createElement('div');
            this.container.id = 'flash-message-container';
            this.container.className = 'fixed top-16 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4';
            document.body.appendChild(this.container);
        }

        // Remove existing message
        if (this.messageElement) {
            this.messageElement.remove();
        }

        // Create new message
        this.messageElement = document.createElement('div');
        this.messageElement.className = `p-4 rounded-md flex items-center justify-between ${
            type === 'success' 
                ? 'bg-blue-50 border border-blue-200 text-blue-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
        }`;
        
        this.messageElement.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="bx ${type === 'success' ? 'bx-check-circle' : 'bx-error-circle'} text-lg"></i>
                <span class="text-sm font-normal">${message}</span>
            </div>
            <button onclick="this.parentElement.remove()" class="ml-4 ${
                type === 'success' 
                    ? 'text-blue-600 hover:text-blue-800' 
                    : 'text-red-600 hover:text-red-800'
            }">
                <i class="bx bx-x text-lg"></i>
            </button>
        `;

        this.container.appendChild(this.messageElement);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (this.messageElement && this.messageElement.parentElement) {
                this.messageElement.style.transition = 'opacity 0.5s ease';
                this.messageElement.style.opacity = '0';
                setTimeout(() => {
                    if (this.messageElement && this.messageElement.parentElement) {
                        this.messageElement.remove();
                    }
                }, 500);
            }
        }, 5000);
    }

    hide() {
        if (this.messageElement) {
            this.messageElement.remove();
        }
    }
}

// Poem Detail Component
class PoemDetail {
    constructor(container, options = {}) {
        this.container = container;
        this.poemId = options.poemId;
        this.isLiked = options.isLiked || false;
        this.likesCount = options.likesCount || 0;
        this.currentRating = options.currentRating || 0;
        this.avgRating = options.avgRating || 0;
        this.ratingCount = options.ratingCount || 0;
        this.showComments = false;
        this.showShareMenu = false;
        this.poemUrl = options.poemUrl || window.location.href;
        this.apiBaseUrl = options.apiBaseUrl || '/api/poems';
        this.isAuthenticated = options.isAuthenticated || false;
        
        this.init();
    }

    init() {
        // Like button
        const likeBtn = this.container.querySelector('[data-like-button]');
        if (likeBtn) {
            likeBtn.addEventListener('click', () => this.toggleLike());
        }

        // Rating buttons
        for (let i = 1; i <= 5; i++) {
            const ratingBtn = this.container.querySelector(`[data-rating="${i}"]`);
            if (ratingBtn) {
                ratingBtn.addEventListener('click', () => this.ratePoem(i));
            }
        }

        // Comments toggle
        const commentsBtn = this.container.querySelector('[data-comments-toggle]');
        if (commentsBtn) {
            commentsBtn.addEventListener('click', () => this.toggleComments());
        }

        // Share menu toggle
        const shareBtn = this.container.querySelector('[data-share-toggle]');
        if (shareBtn) {
            shareBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleShareMenu();
            });
        }

        // Share actions
        const copyLinkBtn = this.container.querySelector('[data-share-copy]');
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', () => this.copyLink());
        }

        // Comment form
        const commentForm = this.container.querySelector('[data-comment-form]');
        if (commentForm) {
            commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitComment();
            });
        }

        // Close share menu on outside click
        document.addEventListener('click', (e) => {
            if (this.showShareMenu && !this.container.querySelector('[data-share-menu]')?.contains(e.target) && 
                !this.container.querySelector('[data-share-toggle]')?.contains(e.target)) {
                this.toggleShareMenu();
            }
        });
    }

    async toggleLike() {
        if (!this.isAuthenticated) {
            window.location.href = '/login';
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/${this.poemId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': window.csrfToken,
                    'Accept': 'application/json'
                },
                credentials: 'same-origin'
            });

            if (response.ok) {
                const data = await response.json();
                this.isLiked = data.liked;
                this.likesCount = data.likes_count;
                this.updateLikeDisplay();
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    }

    updateLikeDisplay() {
        const likeBtn = this.container.querySelector('[data-like-button]');
        const likesCountEl = this.container.querySelector('[data-likes-count]');
        const likeIcon = likeBtn?.querySelector('i');

        if (likeBtn) {
            likeBtn.className = likeBtn.className.replace(/text-(red|gray)-500/g, '') + 
                (this.isLiked ? ' text-red-500' : ' text-gray-500 hover:text-red-500');
        }

        if (likeIcon) {
            likeIcon.className = this.isLiked ? 'bx bxs-heart text-sm' : 'bx bx-heart text-sm';
        }

        if (likesCountEl) {
            likesCountEl.textContent = this.likesCount;
        }
    }

    async ratePoem(rating) {
        if (!this.isAuthenticated) {
            window.location.href = '/login';
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/${this.poemId}/rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': window.csrfToken,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ rating }),
                credentials: 'same-origin'
            });

            if (response.ok) {
                const data = await response.json();
                this.currentRating = parseInt(data.rating);
                if (data.average_rating !== undefined) {
                    this.avgRating = parseFloat(data.average_rating).toFixed(1);
                }
                if (data.rating_count !== undefined) {
                    this.ratingCount = parseInt(data.rating_count);
                }
                this.updateRatingDisplay();
            }
        } catch (error) {
            console.error('Error rating poem:', error);
        }
    }

    updateRatingDisplay() {
        for (let i = 1; i <= 5; i++) {
            const btn = this.container.querySelector(`[data-rating="${i}"]`);
            const icon = btn?.querySelector('i');
            if (btn && icon) {
                const isActive = this.currentRating >= i;
                icon.className = isActive ? 'bx bxs-star text-xs' : 'bx bx-star text-xs';
                btn.className = btn.className.replace(/text-(yellow|gray)-[0-9]+/g, '') + 
                    (isActive ? ' text-yellow-500' : ' text-gray-400 hover:text-yellow-400');
            }
        }
        
        // Update rating display text
        const ratingDisplay = this.container.querySelector('[data-rating-display]');
        if (ratingDisplay && this.avgRating !== undefined && this.ratingCount !== undefined) {
            ratingDisplay.textContent = `${this.avgRating} (${this.ratingCount})`;
        }
    }

    toggleComments() {
        this.showComments = !this.showComments;
        const commentsSection = this.container.querySelector('[data-comments-section]');
        if (commentsSection) {
            commentsSection.style.display = this.showComments ? 'block' : 'none';
            if (this.showComments) {
                commentsSection.classList.add('transition', 'ease-out', 'duration-300');
            }
        }
    }

    toggleShareMenu() {
        this.showShareMenu = !this.showShareMenu;
        const shareMenu = this.container.querySelector('[data-share-menu]');
        if (shareMenu) {
            shareMenu.style.display = this.showShareMenu ? 'block' : 'none';
        }
    }

    async copyLink() {
        try {
            await navigator.clipboard.writeText(this.poemUrl);
            if (window.flashMessage) {
                window.flashMessage.show('Link copied to clipboard!', 'success');
            }
            this.toggleShareMenu();
        } catch (error) {
            console.error('Failed to copy link:', error);
        }
    }

    async submitComment() {
        const commentForm = this.container.querySelector('[data-comment-form]');
        const textarea = commentForm?.querySelector('textarea');
        const commentText = textarea?.value.trim();

        if (!commentText) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/${this.poemId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': window.csrfToken,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ content: commentText }),
                credentials: 'same-origin'
            });

            if (response.ok) {
                const data = await response.json();
                if (textarea) textarea.value = '';
                // Reload page to show new comment
                window.location.reload();
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    }
}

// Poem Form Handler
class PoemForm {
    constructor(formElement) {
        this.form = formElement;
        this.titleInput = this.form.querySelector('[name="title"]');
        this.contentInput = this.form.querySelector('[name="content"]');
        this.isVideoInput = this.form.querySelector('[name="is_video"]');
        this.showPreview = false;
        this.isSubmitting = false;

        this.init();
    }

    init() {
        // Preview toggle
        const previewBtn = this.form.querySelector('[data-preview-toggle]');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.togglePreview());
        }

        // Form validation
        this.form.addEventListener('submit', (e) => {
            if (!this.isValid()) {
                e.preventDefault();
                return false;
            }
            this.isSubmitting = true;
        });

        // Content length display
        if (this.contentInput) {
            this.contentInput.addEventListener('input', () => this.updateContentLength());
        }
    }

    isValid() {
        const hasTitle = this.titleInput && this.titleInput.value.trim().length > 0;
        const hasContent = this.contentInput && this.contentInput.value.trim().length > 0;
        const contentNotTooLong = this.contentInput && this.contentInput.value.length <= 10000;
        return hasTitle && hasContent && contentNotTooLong;
    }

    togglePreview() {
        this.showPreview = !this.showPreview;
        const previewSection = this.form.querySelector('[data-preview-section]');
        const previewBtn = this.form.querySelector('[data-preview-toggle]');
        
        if (previewSection) {
            previewSection.style.display = this.showPreview ? 'block' : 'none';
        }

        if (previewBtn) {
            previewBtn.textContent = this.showPreview ? 'Hide Preview' : 'Show Preview';
        }

        // Update preview content
        if (this.showPreview) {
            const previewTitle = previewSection?.querySelector('[data-preview-title]');
            const previewContent = previewSection?.querySelector('[data-preview-content]');
            
            if (previewTitle && this.titleInput) {
                previewTitle.textContent = this.titleInput.value || 'Untitled';
            }
            if (previewContent && this.contentInput) {
                previewContent.textContent = this.contentInput.value || 'No content yet';
            }
        }
    }

    updateContentLength() {
        const lengthDisplay = this.form.querySelector('[data-content-length]');
        if (lengthDisplay && this.contentInput) {
            const length = this.contentInput.value.length;
            lengthDisplay.textContent = length;
            
            // Update color if approaching limit
            if (length > 9000) {
                lengthDisplay.classList.add('text-red-600');
                lengthDisplay.classList.remove('text-gray-500');
            } else {
                lengthDisplay.classList.remove('text-red-600');
                lengthDisplay.classList.add('text-gray-500');
            }
        }
    }
}

// Chat Interface
class ChatInterface {
    constructor(container, options = {}) {
        this.container = container;
        this.roomId = options.roomId;
        this.apiBaseUrl = options.apiBaseUrl || '/chat/rooms';
        this.newMessages = [];
        this.isSending = false;

        this.init();
    }

    init() {
        const messageForm = this.container.querySelector('[data-message-form]');
        if (messageForm) {
            messageForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }

        // Poll for new messages
        this.pollForNewMessages();
    }

    async sendMessage() {
        const messageInput = this.container.querySelector('[data-message-input]');
        const messageContent = messageInput?.value.trim();

        if (!messageContent || this.isSending) return;

        this.isSending = true;
        messageInput.value = '';

        try {
            const response = await fetch(`${this.apiBaseUrl}/${this.roomId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': window.csrfToken,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ message: messageContent })
            });

            if (response.ok) {
                const data = await response.json();
                this.addNewMessage(data);
            } else {
                const errorData = await response.json();
                messageInput.value = messageContent; // Restore on error
                if (window.flashMessage) {
                    window.flashMessage.show(errorData.message || 'Failed to send message', 'error');
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            messageInput.value = messageContent; // Restore on error
        } finally {
            this.isSending = false;
        }
    }

    addNewMessage(message) {
        // Handle both local messages and WebSocket messages
        const messageData = {
            id: message.id || Date.now(),
            content: message.message || message.content || '',
            user_name: message.user?.first_name || message.username || message.user_name || 'Anonymous',
            user_initial: ((message.user?.first_name || message.username || message.user_name || 'U')[0]).toUpperCase(),
            time_ago: message.created_at ? this.formatTimeAgo(new Date(message.created_at)) : 'just now'
        };

        this.newMessages.push(messageData);
        this.renderNewMessages();
    }

    formatTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + ' minutes ago';
        if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + ' hours ago';
        return Math.floor(diffInSeconds / 86400) + ' days ago';
    }

    renderNewMessages() {
        const container = this.container.querySelector('[data-new-messages]');
        if (!container) return;

        container.innerHTML = '';
        container.style.display = this.newMessages.length > 0 ? 'block' : 'none';

        this.newMessages.forEach(message => {
            const messageEl = document.createElement('div');
            messageEl.className = 'flex space-x-3 mb-4';
            messageEl.innerHTML = `
                <div class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span class="text-xs font-normal text-gray-700">${message.user_initial}</span>
                </div>
                <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                        <span class="text-sm font-normal text-gray-900">${message.user_name}</span>
                        <span class="text-xs text-gray-500">${message.time_ago}</span>
                    </div>
                    <div class="bg-gray-50 px-3 py-2">
                        <p class="text-sm text-gray-800 font-light">${message.content}</p>
                    </div>
                </div>
            `;
            container.appendChild(messageEl);
        });

        // Scroll to bottom
        const messagesContainer = this.container.querySelector('[data-messages-container]');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    pollForNewMessages() {
        // Implement polling or WebSocket connection here
        setInterval(() => {
            // Poll for new messages
        }, 5000);
    }
}

// Modal Component
class Modal {
    constructor(modalElement, options = {}) {
        this.modal = modalElement;
        this.name = options.name || modalElement.getAttribute('data-modal-name');
        this.show = options.show || false;
        this.focusableSelector = 'a, button, input:not([type="hidden"]), textarea, select, details, [tabindex]:not([tabindex="-1"])';

        this.init();
    }

    init() {
        // Set initial state
        if (this.show) {
            this.show();
        } else {
            this.hide();
        }

        // Close buttons
        const closeButtons = this.modal.querySelectorAll('[data-modal-close]');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.hide());
        });

        // Backdrop click
        const backdrop = this.modal.querySelector('[data-modal-backdrop]');
        if (backdrop) {
            backdrop.addEventListener('click', () => this.hide());
        }

        // Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape' && this.show) {
                this.hide();
            }
        };
        document.addEventListener('keydown', escapeHandler);
        this.modal._escapeHandler = escapeHandler;

        // Tab trapping
        const tabHandler = (e) => {
            if (e.key === 'Tab' && this.show) {
                this.trapFocus(e);
            }
        };
        this.modal.addEventListener('keydown', tabHandler);
        this.modal._tabHandler = tabHandler;

        // Listen for open/close events
        const openHandler = (e) => {
            if (e.detail === this.name) {
                this.show();
            }
        };
        window.addEventListener('open-modal', openHandler);
        this.modal._openHandler = openHandler;

        const closeHandler = (e) => {
            if (e.detail === this.name) {
                this.hide();
            }
        };
        window.addEventListener('close-modal', closeHandler);
        this.modal._closeHandler = closeHandler;
    }

    show() {
        this.show = true;
        const backdrop = this.modal.querySelector('[data-modal-backdrop]');
        const content = this.modal.querySelector('[data-modal-content]');
        
        if (backdrop) backdrop.style.display = 'block';
        if (content) content.style.display = 'block';
        this.modal.style.display = 'block';
        document.body.classList.add('overflow-y-hidden');
        
        // Focus first element
        setTimeout(() => {
            const firstFocusable = this.getFocusables()[0];
            if (firstFocusable) firstFocusable.focus();
        }, 100);
    }

    hide() {
        this.show = false;
        const backdrop = this.modal.querySelector('[data-modal-backdrop]');
        const content = this.modal.querySelector('[data-modal-content]');
        
        if (backdrop) backdrop.style.display = 'none';
        if (content) content.style.display = 'none';
        this.modal.style.display = 'none';
        document.body.classList.remove('overflow-y-hidden');
    }

    getFocusables() {
        return Array.from(this.modal.querySelectorAll(this.focusableSelector))
            .filter(el => !el.hasAttribute('disabled'));
    }

    trapFocus(e) {
        const focusables = this.getFocusables();
        const firstFocusable = focusables[0];
        const lastFocusable = focusables[focusables.length - 1];
        const currentIndex = focusables.indexOf(document.activeElement);

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    }
}

// Dropdown Component
class Dropdown {
    constructor(dropdownElement) {
        this.dropdown = dropdownElement;
        this.toggle = dropdownElement.querySelector('[data-dropdown-toggle]');
        this.menu = dropdownElement.querySelector('[data-dropdown-menu]');
        this.open = false;

        this.init();
    }

    init() {
        if (this.toggle) {
            this.toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });
        }

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.open && !this.dropdown.contains(e.target)) {
                this.close();
            }
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.open) {
                this.close();
            }
        });
    }

    toggleMenu() {
        this.open = !this.open;
        if (this.menu) {
            this.menu.style.display = this.open ? 'block' : 'none';
        }
    }

    close() {
        this.open = false;
        if (this.menu) {
            this.menu.style.display = 'none';
        }
    }
}

// Initialize components on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize FlashMessage
    window.flashMessage = new FlashMessage();

    // Initialize modals (only if not already initialized by component script)
    document.querySelectorAll('[data-modal]').forEach(modal => {
        if (!modal.dataset.modalInitialized) {
            const name = modal.getAttribute('data-modal-name');
            new Modal(modal, { name });
            modal.dataset.modalInitialized = 'true';
        }
    });

    // Initialize dropdowns (only if not already initialized by component script)
    document.querySelectorAll('[data-dropdown]').forEach(dropdown => {
        if (!dropdown.dataset.initialized) {
            new Dropdown(dropdown);
            dropdown.dataset.initialized = 'true';
        }
    });
});

// Export classes for global use
window.FlashMessage = FlashMessage;
window.PoemDetail = PoemDetail;
window.PoemForm = PoemForm;
window.ChatInterface = ChatInterface;
window.Modal = Modal;
window.Dropdown = Dropdown; 