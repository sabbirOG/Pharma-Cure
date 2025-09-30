/**
 * Utility functions for PharmaCure application
 */

const utils = {
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
    },

    getFromStorage(key, defaultValue = null) {
    try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
    },

    removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        }
    },

    formatDate(date) {
        const d = new Date(date);
        const options = { 
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
        };
        return d.toLocaleDateString('en-US', options);
    },

    formatDateForInput(date) {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    },

    isToday(date) {
        const today = new Date();
        const checkDate = new Date(date);
        return today.toDateString() === checkDate.toDateString();
    },

    isPastDate(date) {
        const today = new Date();
        const checkDate = new Date(date);
        today.setHours(0, 0, 0, 0);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate < today;
    },

    getToday() {
        return this.formatDateForInput(new Date());
    },

    validatePhone(phone) {
        const phoneRegex = /^01[3-9]\d{8}$/;
        return phoneRegex.test(phone);
    },

    formatCurrency(amount) {
        return `৳${amount.toFixed(2)}`;
    },

    initializeDefaultData() {
        if (!this.getFromStorage('medicines')) {
            this.saveToStorage('medicines', []);
        }
        if (!this.getFromStorage('doctors')) {
            this.saveToStorage('doctors', []);
        }
        if (!this.getFromStorage('appointments')) {
            this.saveToStorage('appointments', []);
        }
        if (!this.getFromStorage('activities')) {
            this.saveToStorage('activities', []);
        }
        if (!this.getFromStorage('users')) {
            this.saveToStorage('users', []);
        }
        if (!this.getFromStorage('settings')) {
            this.saveToStorage('settings', {
                language: 'en',
                theme: 'light'
            });
        }
    }
};

utils.initializeDefaultData();