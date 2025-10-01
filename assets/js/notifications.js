/**
 * Notification system for showing success, error, and info messages
 */

const notifications = {
    container: null,

    init() {
        this.container = document.getElementById('notification-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
        }
    },

    show(message, type = 'info', duration = 5000) {
        this.init();
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        this.container.appendChild(notification);
        
        // Auto remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
        
        return notification;
    },

    showSuccess(message, duration = 5000) {
        return this.show(message, 'success', duration);
    },

    showError(message, duration = 7000) {
        return this.show(message, 'error', duration);
    },

    showInfo(message, duration = 5000) {
        return this.show(message, 'info', duration);
    },

    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
};
