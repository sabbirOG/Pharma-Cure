/**
 * Authentication system for user login, signup, and role management
 */

const auth = {
    currentUser: null,

    init() {
        this.currentUser = this.getCurrentUser();
    },

    signup(userData) {
        const users = utils.getFromStorage('users', []);
        
        // Check if user already exists
        const existingUser = users.find(user => user.phone === userData.phone);
        if (existingUser) {
            throw new Error('User with this phone number already exists');
        }

        // Validate required fields
        if (!userData.name || !userData.phone || !userData.password) {
            throw new Error('Name, phone, and password are required');
        }

        // Validate phone format
        if (!utils.validatePhone(userData.phone)) {
            throw new Error('Invalid phone number format');
        }

        // Create new user
        const newUser = {
            id: utils.generateId(),
            name: userData.name,
            phone: userData.phone,
            password: userData.password,
            age: userData.age,
            address: userData.address,
            role: 'customer',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        utils.saveToStorage('users', users);

        // Log activity
        this.logActivity(newUser.id, 'Account created successfully');

        return newUser;
    },

    login(phone, password) {
        const users = utils.getFromStorage('users', []);
        
        // Check for admin credentials first
        if (phone === '01870243704' && password === '0112230346') {
            const adminUser = {
                id: 'admin-001',
                name: 'Sabbir Ahmed',
                phone: '01870243704',
                role: 'admin',
                createdAt: new Date().toISOString()
            };
            
            this.currentUser = adminUser;
            utils.saveToStorage('currentUser', adminUser);
            
            this.logActivity(adminUser.id, 'Admin logged in');
            return adminUser;
        }

        // Check regular users
        const user = users.find(u => u.phone === phone && u.password === password);
        if (!user) {
            throw new Error('Invalid phone number or password');
        }

        this.currentUser = user;
        utils.saveToStorage('currentUser', user);
        
        this.logActivity(user.id, 'User logged in');
        return user;
    },

    logout() {
        if (this.currentUser) {
            this.logActivity(this.currentUser.id, 'User logged out');
        }
        
        this.currentUser = null;
        utils.removeFromStorage('currentUser');
        window.location.href = 'login.html';
    },

    getCurrentUser() {
        if (this.currentUser) {
            return this.currentUser;
        }
        
        const user = utils.getFromStorage('currentUser');
        this.currentUser = user;
        return user;
    },

    isAuthenticated() {
        return this.getCurrentUser() !== null;
    },

    hasRole(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    },

    updateProfile(userId, profileData) {
        const users = utils.getFromStorage('users', []);
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            throw new Error('User not found');
        }

        const user = users[userIndex];
        
        // Update allowed fields based on role
        if (user.role === 'admin') {
            // Admin can only change name
            user.name = profileData.name;
        } else {
            // Customer can change name and phone
            user.name = profileData.name;
            user.phone = profileData.phone;
            user.age = profileData.age;
            user.address = profileData.address;
        }

        users[userIndex] = user;
        utils.saveToStorage('users', users);
        
        // Update current user if it's the same user
        if (this.currentUser && this.currentUser.id === userId) {
            this.currentUser = user;
            utils.saveToStorage('currentUser', user);
        }

        this.logActivity(userId, 'Profile updated');
        return user;
    },

    changePassword(userId, currentPassword, newPassword) {
        const users = utils.getFromStorage('users', []);
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            throw new Error('User not found');
        }

        const user = users[userIndex];
        
        // Check current password
        if (user.password !== currentPassword) {
            throw new Error('Current password is incorrect');
        }

        // Update password
        user.password = newPassword;
        users[userIndex] = user;
        utils.saveToStorage('users', users);

        this.logActivity(userId, 'Password changed');
        return user;
    },

    deleteAccount(userId) {
        const users = utils.getFromStorage('users', []);
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            throw new Error('User not found');
        }

        // Remove user
        users.splice(userIndex, 1);
        utils.saveToStorage('users', users);

        // Logout if it's the current user
        if (this.currentUser && this.currentUser.id === userId) {
            this.logout();
        }

        this.logActivity(userId, 'Account deleted');
    },

    logActivity(userId, description) {
        const activities = utils.getFromStorage('activities', []);
        activities.push({
            id: utils.generateId(),
            userId: userId,
            description: description,
            timestamp: new Date().toISOString()
        });
        utils.saveToStorage('activities', activities);
    }
};