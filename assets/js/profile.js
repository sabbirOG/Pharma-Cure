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

        // Validate password strength
        const passwordStrength = this.validatePasswordStrength(passwordData.newPassword);
        if (!passwordStrength.isValid) {
            throw new Error(passwordStrength.message);
        }

        // Check if new password is different from current
        if (passwordData.currentPassword === passwordData.newPassword) {
            throw new Error('New password must be different from current password');
        }

        return auth.changePassword(currentUser.id, passwordData.currentPassword, passwordData.newPassword);
    },

    validatePasswordStrength(password) {
        if (password.length < 6) {
            return { isValid: false, message: 'Password must be at least 6 characters long' };
        }

        if (password.length > 50) {
            return { isValid: false, message: 'Password must be less than 50 characters' };
        }

        // Check for at least one number
        if (!/\d/.test(password)) {
            return { isValid: false, message: 'Password must contain at least one number' };
        }

        // Check for at least one letter
        if (!/[a-zA-Z]/.test(password)) {
            return { isValid: false, message: 'Password must contain at least one letter' };
        }

        return { isValid: true, message: 'Password is strong' };
    },

    deleteAccount() {
        this.showDeleteConfirmation();
    },

    showDeleteConfirmation() {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) return;

        const modalHTML = `
            <div class="modal show" id="delete-confirmation-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Delete Account</h3>
                        <span class="close" onclick="profile.closeDeleteConfirmation()">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="delete-warning">
                            <div class="warning-icon">⚠️</div>
                            <h4>Are you sure you want to delete your account?</h4>
                            <p>This action cannot be undone. All your data including:</p>
                            <ul>
                                <li>Profile information</li>
                                <li>Order history</li>
                                <li>Appointment records</li>
                                <li>All other account data</li>
                            </ul>
                            <p><strong>will be permanently deleted.</strong></p>
                            
                            <div class="form-group">
                                <label for="confirm-delete">Type "DELETE" to confirm:</label>
                                <input type="text" id="confirm-delete" placeholder="Type DELETE here" required>
                            </div>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary" onclick="profile.closeDeleteConfirmation()">Cancel</button>
                            <button type="button" class="btn btn-danger" onclick="profile.confirmDeleteAccount()" id="confirm-delete-btn" disabled>Delete Account</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Enable delete button only when user types "DELETE"
        const confirmInput = document.getElementById('confirm-delete');
        const confirmBtn = document.getElementById('confirm-delete-btn');
        
        confirmInput.addEventListener('input', function() {
            confirmBtn.disabled = this.value !== 'DELETE';
        });
    },

    closeDeleteConfirmation() {
        const modal = document.getElementById('delete-confirmation-modal');
        if (modal) {
            modal.remove();
        }
    },

    confirmDeleteAccount() {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) return;

        try {
            auth.deleteAccount(currentUser.id);
            notifications.showSuccess('Account deleted successfully! Redirecting to login...');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } catch (error) {
            notifications.showError('Failed to delete account: ' + error.message);
        }
    },

    changeLanguage(lang) {
        language.setLanguage(lang);
        notifications.showSuccess(`Language changed to ${lang === 'en' ? 'English' : 'বাংলা'}`);
    },

    updatePasswordStrength(password) {
        const strengthText = document.getElementById('password-strength-text');
        const strengthBar = document.getElementById('password-strength-bar');
        
        if (!strengthText || !strengthBar) return;

        const strength = this.calculatePasswordStrength(password);
        
        // Update text
        strengthText.textContent = strength.text;
        strengthText.className = `password-strength ${strength.level}`;
        
        // Update bar
        strengthBar.className = `password-strength-bar ${strength.level}`;
    },

    calculatePasswordStrength(password) {
        if (password.length === 0) {
            return { level: '', text: '' };
        }

        if (password.length < 6) {
            return { level: 'weak', text: 'Password is too short' };
        }

        let score = 0;
        
        // Length check
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        
        // Character variety
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        if (score < 3) {
            return { level: 'weak', text: 'Weak password' };
        } else if (score < 5) {
            return { level: 'medium', text: 'Medium strength password' };
        } else {
            return { level: 'strong', text: 'Strong password' };
        }
    }
};