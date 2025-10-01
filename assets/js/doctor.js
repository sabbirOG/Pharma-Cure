/**
 * Doctor management and appointment booking system
 */

const doctor = {
    doctors: [],
    appointments: [],

    init() {
        this.loadDoctors();
        this.loadAppointments();
    },

    loadDoctors() {
        this.doctors = utils.getFromStorage('doctors', []);
        this.renderDoctors();
    },

    loadAppointments() {
        this.appointments = utils.getFromStorage('appointments', []);
        this.renderAppointments();
    },

    renderDoctors() {
        const container = document.getElementById('doctors-list');
        if (!container) return;

        if (this.doctors.length === 0) {
            container.innerHTML = '<p>No doctors available at the moment.</p>';
            return;
        }

        container.innerHTML = this.doctors.map(doctor => `
            <div class="doctor-card">
                ${doctor.photo ? `<img src="${doctor.photo}" alt="${doctor.name}" class="doctor-photo">` : '<div class="doctor-photo" style="background: #ddd; display: flex; align-items: center; justify-content: center; color: #666;">👨‍⚕️</div>'}
                <h3>${doctor.name}</h3>
                <div class="doctor-specialization">${doctor.specialization}</div>
                <div class="doctor-experience">${doctor.experience} years experience</div>
                <div class="doctor-bio">${doctor.bio || 'No bio available'}</div>
                <button class="btn btn-primary" onclick="doctor.showAppointmentModal('${doctor.id}')">Book Appointment</button>
            </div>
        `).join('');
    },

    renderAppointments() {
        const container = document.getElementById('appointments-list');
        if (!container) return;

        const currentUser = auth.getCurrentUser();
        if (!currentUser) return;

        const userAppointments = this.appointments.filter(apt => apt.userId === currentUser.id);
        
        if (userAppointments.length === 0) {
            container.innerHTML = '<p>No appointments booked yet.</p>';
            return;
        }

        container.innerHTML = userAppointments.map(appointment => {
            const doctor = this.doctors.find(d => d.id === appointment.doctorId);
            return `
                <div class="appointment-card">
                    <div class="appointment-info">
                        <h4>${doctor ? doctor.name : 'Unknown Doctor'}</h4>
                        <div class="appointment-details">
                            <div>Date: ${utils.formatDate(appointment.date)}</div>
                            <div>Time: ${appointment.timeSlot}</div>
                            <div>Reason: ${appointment.reason || 'Not specified'}</div>
                        </div>
                    </div>
                    <div class="appointment-actions">
                        <button class="btn btn-danger" onclick="doctor.cancelAppointment('${appointment.id}')">Cancel</button>
                    </div>
                </div>
            `;
        }).join('');
    },

    showAppointmentModal(doctorId) {
        const modal = document.getElementById('appointment-modal');
        const doctor = this.doctors.find(d => d.id === doctorId);
        
        if (!modal || !doctor) return;

        document.getElementById('doctor-id').value = doctorId;
        document.getElementById('doctor-name').value = doctor.name;
        document.getElementById('appointment-date').value = utils.getToday();
        document.getElementById('appointment-date').min = utils.getToday();
        document.getElementById('time-slot').value = '';
        document.getElementById('reason').value = '';

        modal.classList.add('show');
    },

    closeModal() {
        const modal = document.getElementById('appointment-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    },

    bookAppointment(appointmentData) {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) {
            throw new Error('User not authenticated');
        }

        const existingAppointment = this.appointments.find(apt => 
            apt.doctorId === appointmentData.doctorId &&
            apt.date === appointmentData.date &&
            apt.timeSlot === appointmentData.timeSlot
        );

        if (existingAppointment) {
            throw new Error('This time slot is already booked');
        }

        if (utils.isPastDate(appointmentData.date)) {
            throw new Error('Cannot book appointment for past dates');
        }

        const newAppointment = {
            id: utils.generateId(),
            userId: currentUser.id,
            doctorId: appointmentData.doctorId,
            date: appointmentData.date,
            timeSlot: appointmentData.timeSlot,
            reason: appointmentData.reason || '',
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        this.appointments.push(newAppointment);
        utils.saveToStorage('appointments', this.appointments);
        
        auth.logActivity(currentUser.id, `Appointment booked with ${this.doctors.find(d => d.id === appointmentData.doctorId)?.name || 'doctor'}`);
        
        this.loadAppointments();
        return newAppointment;
    },

    cancelAppointment(appointmentId) {
        const appointmentIndex = this.appointments.findIndex(apt => apt.id === appointmentId);
        
        if (appointmentIndex === -1) {
            throw new Error('Appointment not found');
        }

        const appointment = this.appointments[appointmentIndex];
        this.appointments.splice(appointmentIndex, 1);
        utils.saveToStorage('appointments', this.appointments);
        
        auth.logActivity(appointment.userId, 'Appointment cancelled');
        
        this.loadAppointments();
    }
};