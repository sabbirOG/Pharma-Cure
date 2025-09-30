/**
 * Admin panel management system
 */

const admin = {
    currentTab: 'medicines',

    init() {
        this.loadDashboard();
    },

    loadDashboard() {
        this.updateStats();
    },

    updateStats() {
        const medicines = utils.getFromStorage('medicines', []);
        const doctors = utils.getFromStorage('doctors', []);
        const appointments = utils.getFromStorage('appointments', []);
        const users = utils.getFromStorage('users', []);
        
        const todayAppointments = appointments.filter(apt => utils.isToday(apt.date));

        document.getElementById('total-medicines').textContent = medicines.length;
        document.getElementById('total-doctors').textContent = doctors.length;
        document.getElementById('today-appointments').textContent = todayAppointments.length;
        document.getElementById('total-customers').textContent = users.filter(u => u.role === 'customer').length;
    },

    showTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        document.getElementById(`${tabName}-tab`).classList.add('active');
        document.querySelector(`[onclick="admin.showTab('${tabName}')"]`).classList.add('active');

        this.currentTab = tabName;

        // Load tab content
        switch (tabName) {
            case 'medicines':
                this.loadMedicines();
                break;
            case 'doctors':
                this.loadDoctors();
                break;
            case 'appointments':
                this.loadAppointments();
                break;
        }
    },

    loadMedicines() {
        const medicines = utils.getFromStorage('medicines', []);
        const container = document.getElementById('medicines-list');
        
        if (!container) return;

        if (medicines.length === 0) {
            container.innerHTML = '<p>No medicines found. Add some medicines to get started.</p>';
            return;
        }

        container.innerHTML = medicines.map(medicine => `
            <div class="admin-item">
                <div class="admin-item-info">
                    <h4>${medicine.name}</h4>
                    <div class="admin-item-details">
                        <div>Category: ${medicine.category}</div>
                        <div>Price: ${utils.formatCurrency(medicine.price)}</div>
                        <div>Stock: ${medicine.stock} units</div>
                    </div>
                </div>
                <div class="admin-item-actions">
                    <button class="btn btn-secondary" onclick="admin.editMedicine('${medicine.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="admin.deleteMedicine('${medicine.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    },

    loadDoctors() {
        const doctors = utils.getFromStorage('doctors', []);
        const container = document.getElementById('doctors-list');
        
        if (!container) return;

        if (doctors.length === 0) {
            container.innerHTML = '<p>No doctors found. Add some doctors to get started.</p>';
            return;
        }

        container.innerHTML = doctors.map(doctor => `
            <div class="admin-item">
                <div class="admin-item-info">
                    <h4>${doctor.name}</h4>
                    <div class="admin-item-details">
                        <div>Specialization: ${doctor.specialization}</div>
                        <div>Experience: ${doctor.experience} years</div>
                        <div>Phone: ${doctor.phone}</div>
                    </div>
                </div>
                <div class="admin-item-actions">
                    <button class="btn btn-secondary" onclick="admin.editDoctor('${doctor.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="admin.deleteDoctor('${doctor.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    },

    loadAppointments() {
        const appointments = utils.getFromStorage('appointments', []);
        const doctors = utils.getFromStorage('doctors', []);
        const users = utils.getFromStorage('users', []);
        const container = document.getElementById('appointments-list');
        
        if (!container) return;

        if (appointments.length === 0) {
            container.innerHTML = '<p>No appointments found.</p>';
            return;
        }

        container.innerHTML = appointments.map(appointment => {
            const doctor = doctors.find(d => d.id === appointment.doctorId);
            const user = users.find(u => u.id === appointment.userId);
            return `
                <div class="admin-item">
                    <div class="admin-item-info">
                        <h4>${doctor ? doctor.name : 'Unknown Doctor'}</h4>
                        <div class="admin-item-details">
                            <div>Patient: ${user ? user.name : 'Unknown User'}</div>
                            <div>Date: ${utils.formatDate(appointment.date)}</div>
                            <div>Time: ${appointment.timeSlot}</div>
                            <div>Reason: ${appointment.reason || 'Not specified'}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    showMedicineModal(medicineId = null) {
        const modal = document.getElementById('medicine-modal');
        const title = document.getElementById('medicine-modal-title');
        
        if (!modal) return;

        if (medicineId) {
            const medicine = utils.getFromStorage('medicines', []).find(m => m.id === medicineId);
            if (medicine) {
                document.getElementById('medicine-id').value = medicine.id;
                document.getElementById('medicine-name').value = medicine.name;
                document.getElementById('medicine-category').value = medicine.category;
                document.getElementById('medicine-price').value = medicine.price;
                document.getElementById('medicine-stock').value = medicine.stock;
                document.getElementById('medicine-description').value = medicine.description || '';
                title.textContent = 'Edit Medicine';
            }
        } else {
            document.getElementById('medicine-form').reset();
            title.textContent = 'Add Medicine';
        }

        modal.classList.add('show');
    },

    showDoctorModal(doctorId = null) {
        const modal = document.getElementById('doctor-modal');
        const title = document.getElementById('doctor-modal-title');
        
        if (!modal) return;

        if (doctorId) {
            const doctor = utils.getFromStorage('doctors', []).find(d => d.id === doctorId);
            if (doctor) {
                document.getElementById('doctor-id').value = doctor.id;
                document.getElementById('doctor-name').value = doctor.name;
                document.getElementById('doctor-specialization').value = doctor.specialization;
                document.getElementById('doctor-experience').value = doctor.experience;
                document.getElementById('doctor-phone').value = doctor.phone;
                document.getElementById('doctor-bio').value = doctor.bio || '';
                title.textContent = 'Edit Doctor';
            }
        } else {
            document.getElementById('doctor-form').reset();
            title.textContent = 'Add Doctor';
        }

        modal.classList.add('show');
    },

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
    },

    editMedicine(medicineId) {
        this.showMedicineModal(medicineId);
    },

    editDoctor(doctorId) {
        this.showDoctorModal(doctorId);
    },

    deleteMedicine(medicineId) {
        if (confirm('Are you sure you want to delete this medicine?')) {
            medicine.deleteMedicine(medicineId);
            this.loadMedicines();
            notifications.showSuccess('Medicine deleted successfully!');
        }
    },

    deleteDoctor(doctorId) {
        if (confirm('Are you sure you want to delete this doctor?')) {
            doctor.deleteDoctor(doctorId);
            this.loadDoctors();
            notifications.showSuccess('Doctor deleted successfully!');
        }
    },

    addMedicine(medicineData) {
        return medicine.addMedicine(medicineData);
    },

    updateMedicine(medicineData) {
        return medicine.updateMedicine(medicineData);
    },

    addDoctor(doctorData) {
        return doctor.addDoctor(doctorData);
    },

    updateDoctor(doctorData) {
        return doctor.updateDoctor(doctorData);
    },

    handlePhotoUpload(input) {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                input.dataset.base64 = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
};