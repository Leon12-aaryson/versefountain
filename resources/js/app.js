import './bootstrap';
import Alpine from 'alpinejs';

// Initialize Alpine.js
Alpine.start();

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
        toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-md shadow-lg ${
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