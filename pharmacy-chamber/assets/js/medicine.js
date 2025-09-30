/**
 * Medicine management system for browsing, searching, and filtering medicines
 */

const medicine = {
    medicines: [],
    filteredMedicines: [],

    init() {
        this.loadMedicines();
    },

    loadMedicines() {
        this.medicines = utils.getFromStorage('medicines', []);
        this.filteredMedicines = [...this.medicines];
        this.renderMedicines();
    },

    renderMedicines() {
        const container = document.getElementById('medicine-grid');
        const noResults = document.getElementById('no-results');
        
        if (!container) return;

        if (this.filteredMedicines.length === 0) {
            container.innerHTML = '';
            if (noResults) {
                noResults.style.display = 'block';
            }
            return;
        }

        if (noResults) {
            noResults.style.display = 'none';
        }

        container.innerHTML = this.filteredMedicines.map(medicine => `
            <div class="medicine-card">
                <h3>${medicine.name}</h3>
                <div class="medicine-category">${medicine.category}</div>
                <div class="medicine-price">${utils.formatCurrency(medicine.price)}</div>
                <div class="medicine-stock">Stock: ${medicine.stock} units</div>
                <div class="medicine-description">${medicine.description || 'No description available'}</div>
            </div>
        `).join('');
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
    }
};