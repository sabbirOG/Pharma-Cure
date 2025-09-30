/**
 * Profile management system
 */

const profile = {
    init() {
        this.loadProfile();
    },

    loadProfile() {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) return;

        // Populate form fields
        document.getElementById('profile-name').value = currentUser.name || '';
        document.getElementById('profile-phone').value = currentUser.phone || '';

        // Show/hide customer fields based on role
        const customerFields = document.getElementById('customer-fields');
        if (currentUser.role === 'admin') {
            if (customerFields) customerFields.style.display = 'none';
        } else {
            if (customerFields) customerFields.style.display = 'block';
            document.getElementById('profile-age').value = currentUser.age || '';
            document.getElementById('profile-address').value = currentUser.address || '';
        }

        // Set language preference
        const settings = utils.getFromStorage('settings', { language: 'en' });
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = settings.language;
        }
    },

    updateProfile(profileData) {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) {
            throw new Error('User not authenticated');
        }

        return auth.updateProfile(currentUser.id, profileData);
    },

    changePassword() {
        const modal = document.getElementById('password-modal');
        if (modal) {
            modal.classList.add('show');
        }
    },

    closePasswordModal() {
        const modal = document.getElementById('password-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    },

    changePassword(passwordData) {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) {
            throw new Error('User not authenticated');
        }

        return auth.changePassword(currentUser.id, passwordData.currentPassword, passwordData.newPassword);
    },

    deleteAccount() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            const currentUser = auth.getCurrentUser();
            if (currentUser) {
                auth.deleteAccount(currentUser.id);
                notifications.showSuccess('Account deleted successfully!');
            }
        }
    },

    changeLanguage(lang) {
        language.setLanguage(lang);
        notifications.showSuccess(`Language changed to ${lang === 'en' ? 'English' : 'বাংলা'}`);
    }
};