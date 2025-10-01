/**
 * Medicine management system for browsing, searching, and filtering medicines
 */

const medicine = {
    medicines: [],
    filteredMedicines: [],
    cart: [],

    init() {
        this.loadMedicines();
        this.loadCart();
    },

    loadMedicines() {
        this.medicines = utils.getFromStorage('medicines', []);
        this.filteredMedicines = [...this.medicines];
        this.renderMedicines();
    },

    loadCart() {
        this.cart = utils.getFromStorage('cart', []);
        this.updateCartCount();
    },

    saveCart() {
        utils.saveToStorage('cart', this.cart);
    },

    renderMedicines() {
        const container = document.getElementById('medicine-grid');
        const noResults = document.getElementById('no-results');
        
        if (!container) return;

        if (this.filteredMedicines.length === 0) {
            container.innerHTML = this.getMedicineNotFoundCard();
            if (noResults) {
                noResults.style.display = 'none';
            }
            return;
        }

        if (noResults) {
            noResults.style.display = 'none';
        }

        container.innerHTML = this.filteredMedicines.map(medicine => {
            const cartItem = this.cart.find(item => item.medicineId === medicine.id);
            const quantity = cartItem ? cartItem.quantity : 0;
            
            return `
                <div class="medicine-card">
                    <h3>${medicine.name}</h3>
                    <div class="medicine-category">${medicine.category}</div>
                    <div class="medicine-price">${utils.formatCurrency(medicine.price)}</div>
                    <div class="medicine-stock">Stock: ${medicine.stock} units</div>
                    <div class="medicine-description">${medicine.description || 'No description available'}</div>
                    
                    <div class="medicine-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="medicine.updateQuantity(${medicine.id}, -1)" ${quantity <= 0 ? 'disabled' : ''}>-</button>
                            <span class="quantity-display" id="quantity-${medicine.id}">${quantity}</span>
                            <button class="quantity-btn" onclick="medicine.updateQuantity(${medicine.id}, 1)" ${quantity >= medicine.stock ? 'disabled' : ''}>+</button>
                        </div>
                        <button class="btn btn-primary add-to-cart-btn" onclick="medicine.addToCart(${medicine.id})" ${quantity > 0 ? 'style="display:none"' : ''}>
                            Add to Cart
                        </button>
                        <button class="btn btn-success cart-added-btn" onclick="medicine.viewCart()" ${quantity > 0 ? '' : 'style="display:none"'}>
                            In Cart (${quantity})
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    search() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;

        const query = searchInput.value.toLowerCase().trim();
        
        if (query === '') {
            this.filteredMedicines = [...this.medicines];
        } else {
            this.filteredMedicines = this.medicines.filter(medicine => 
                medicine.name.toLowerCase().includes(query) ||
                medicine.category.toLowerCase().includes(query) ||
                (medicine.description && medicine.description.toLowerCase().includes(query))
            );
        }

        this.renderMedicines();
    },

    filter() {
        const categoryFilter = document.getElementById('category-filter');
        if (!categoryFilter) return;

        const selectedCategory = categoryFilter.value;
        
        if (selectedCategory === '') {
            this.filteredMedicines = [...this.medicines];
        } else {
            this.filteredMedicines = this.medicines.filter(medicine => 
                medicine.category === selectedCategory
            );
        }

        this.renderMedicines();
    },

    sort() {
        const sortFilter = document.getElementById('sort-filter');
        if (!sortFilter) return;

        const sortBy = sortFilter.value;
        
        this.filteredMedicines.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'price':
                    return a.price - b.price;
                case 'stock':
                    return b.stock - a.stock;
                default:
                    return 0;
            }
        });

        this.renderMedicines();
    },

    addMedicine(medicineData) {
        const medicines = utils.getFromStorage('medicines', []);
        
        const newMedicine = {
            id: utils.generateId(),
            name: medicineData.name,
            category: medicineData.category,
            price: parseFloat(medicineData.price),
            stock: parseInt(medicineData.stock),
            description: medicineData.description || '',
            createdAt: new Date().toISOString()
        };

        medicines.push(newMedicine);
        utils.saveToStorage('medicines', medicines);
        
        this.loadMedicines();
        return newMedicine;
    },

    updateMedicine(medicineData) {
        const medicines = utils.getFromStorage('medicines', []);
        const index = medicines.findIndex(m => m.id === medicineData.id);
        
        if (index === -1) {
            throw new Error('Medicine not found');
        }

        medicines[index] = {
            ...medicines[index],
            name: medicineData.name,
            category: medicineData.category,
            price: parseFloat(medicineData.price),
            stock: parseInt(medicineData.stock),
            description: medicineData.description || '',
            updatedAt: new Date().toISOString()
        };

        utils.saveToStorage('medicines', medicines);
        this.loadMedicines();
        return medicines[index];
    },

    deleteMedicine(medicineId) {
        const medicines = utils.getFromStorage('medicines', []);
        const filteredMedicines = medicines.filter(m => m.id !== medicineId);
        
        utils.saveToStorage('medicines', filteredMedicines);
        this.loadMedicines();
    },

    getMedicineById(id) {
        return this.medicines.find(medicine => medicine.id === id);
    },

    getMedicinesByCategory(category) {
        return this.medicines.filter(medicine => medicine.category === category);
    },

    getLowStockMedicines(threshold = 10) {
        return this.medicines.filter(medicine => medicine.stock <= threshold);
    },

    // Cart functionality
    addToCart(medicineId) {
        // Use the updateQuantity function to add 1 to cart
        this.updateQuantity(medicineId, 1);
    },

    updateQuantity(medicineId, change) {
        const medicine = this.getMedicineById(medicineId);
        if (!medicine) return;

        let cartItem = this.cart.find(item => item.medicineId === medicineId);
        const currentQuantity = cartItem ? cartItem.quantity : 0;
        const newQuantity = currentQuantity + change;
        
        // If trying to go below 0, do nothing
        if (newQuantity < 0) {
            return;
        }

        // If trying to exceed stock, show error
        if (newQuantity > medicine.stock) {
            notifications.show('Cannot add more items. Stock limit reached!', 'error');
            return;
        }

        // If quantity becomes 0, remove from cart
        if (newQuantity === 0) {
            if (cartItem) {
                this.removeFromCart(medicineId);
            }
            return;
        }

        // If no cart item exists, create one
        if (!cartItem) {
            cartItem = {
                medicineId: medicineId,
                quantity: 0,
                addedAt: new Date().toISOString()
            };
            this.cart.push(cartItem);
        }

        // Update quantity
        cartItem.quantity = newQuantity;
        this.saveCart();
        this.renderMedicines();
        this.updateCartCount();
        
        // Show success notification for adding to cart
        if (currentQuantity === 0 && newQuantity > 0) {
            notifications.show(`${medicine.name} added to cart!`, 'success');
        }
    },

    removeFromCart(medicineId) {
        this.cart = this.cart.filter(item => item.medicineId !== medicineId);
        this.saveCart();
        this.renderMedicines();
        this.updateCartCount();
        notifications.show('Item removed from cart!', 'info');
    },

    viewCart() {
        // Create cart modal
        this.showCartModal();
    },

    showCartModal() {
        const cartItems = this.cart.map(item => {
            const medicine = this.getMedicineById(item.medicineId);
            return {
                ...item,
                medicine: medicine
            };
        }).filter(item => item.medicine);

        const totalPrice = cartItems.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0);

        const modalHTML = `
            <div class="cart-modal-overlay" onclick="medicine.closeCartModal()">
                <div class="cart-modal" onclick="event.stopPropagation()">
                    <div class="cart-modal-header">
                        <h3>Shopping Cart (${cartItems.length} items)</h3>
                        <button class="close-btn" onclick="medicine.closeCartModal()">&times;</button>
                    </div>
                    <div class="cart-modal-body">
                        ${cartItems.length === 0 ? 
                            '<p class="empty-cart">Your cart is empty</p>' :
                            cartItems.map(item => `
                                <div class="cart-item">
                                    <div class="cart-item-info">
                                        <h4>${item.medicine.name}</h4>
                                        <p class="cart-item-category">${item.medicine.category}</p>
                                        <p class="cart-item-price">${utils.formatCurrency(item.medicine.price)} each</p>
                                    </div>
                                    <div class="cart-item-controls">
                                        <div class="quantity-controls">
                                            <button class="quantity-btn" onclick="medicine.updateQuantity(${item.medicineId}, -1)">-</button>
                                            <span class="quantity-display">${item.quantity}</span>
                                            <button class="quantity-btn" onclick="medicine.updateQuantity(${item.medicineId}, 1)" ${item.quantity >= item.medicine.stock ? 'disabled' : ''}>+</button>
                                        </div>
                                        <button class="btn btn-danger btn-sm" onclick="medicine.removeFromCart(${item.medicineId})">Remove</button>
                                    </div>
                                    <div class="cart-item-total">
                                        ${utils.formatCurrency(item.medicine.price * item.quantity)}
                                    </div>
                                </div>
                            `).join('')
                        }
                    </div>
                    ${cartItems.length > 0 ? `
                        <div class="cart-modal-footer">
                            <div class="cart-total">
                                <strong>Total: ${utils.formatCurrency(totalPrice)}</strong>
                            </div>
                            <button class="btn btn-primary" onclick="medicine.checkout()">Checkout</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    closeCartModal() {
        const modal = document.querySelector('.cart-modal-overlay');
        if (modal) {
            modal.remove();
        }
    },

    checkout() {
        if (this.cart.length === 0) {
            notifications.show('Your cart is empty!', 'error');
            return;
        }

        // Simple checkout - just clear the cart
        this.cart = [];
        this.saveCart();
        this.renderMedicines();
        this.updateCartCount();
        this.closeCartModal();
        notifications.show('Order placed successfully! Thank you for your purchase.', 'success');
    },

    getCartCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    },

    updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = this.getCartCount();
        }
    },

    getMedicineNotFoundCard() {
        return `
            <div class="medicine-not-found">
                <div class="medicine-not-found-icon">🔍</div>
                <h3>No Medicines Found</h3>
                <p>We couldn't find any medicines matching your search criteria. Try adjusting your search terms or filters to find what you're looking for.</p>
                <div class="medicine-not-found-actions">
                    <button class="btn btn-primary" onclick="medicine.clearSearch()">
                        Clear Search
                    </button>
                    <button class="btn btn-secondary" onclick="medicine.showAllMedicines()">
                        Show All Medicines
                    </button>
                </div>
            </div>
        `;
    },

    clearSearch() {
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const sortFilter = document.getElementById('sort-filter');
        
        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (sortFilter) sortFilter.value = 'name';
        
        this.filteredMedicines = [...this.medicines];
        this.renderMedicines();
    },

    showAllMedicines() {
        this.clearSearch();
    }
};