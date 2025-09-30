# Pharma-Cure

**A dynamic frontend pharmacy chamber platform — bilingual (English & Bangla) and fully interactive.**

---

## Project Overview

PharmaCure is a **frontend-only pharmacy management system** designed to simulate the operations of a real pharmacy chamber. It allows customers to browse medicines, book doctor appointments, and manage their profiles, while the admin can manage medicines, doctors, and view appointments — all without a backend.

This project is **demo project**, showcasing **role-based access, dynamic UI, bilingual support, and LocalStorage data persistence**.

---

## Features

### Customer Features

* Signup & login using phone number and password
* Browse, search, filter, and sort medicines
* Book and cancel doctor appointments
* Edit profile (name & phone number)
* Bilingual support: English & Bangla
* Responsive design for mobile and desktop

### Admin Features

* Predefined admin login (**Sabbir Ahmed**)
* Manage medicines: add, update, delete
* Manage doctors: add, delete, upload photos
* View all appointments
* Dashboard with stats and charts (optional)
* Edit name only
* Bilingual support
* Notifications & alerts

### General Features

* Role-based access control
* Notifications & toast messages
* Daily appointment reset
* Doctor photo upload (stored as Base64 in LocalStorage)
* Modular JS files for maintainability

---

## Tech Stack

* HTML, CSS
* JavaScript (Vanilla)
* LocalStorage for data persistence
* Optional: Chart.js for admin dashboard stats

---

## Data Structure (LocalStorage)

**Users**

```json
[
  { "name": "Sabbir Ahmed", "phone": "01870243704", "password": "0112230346", "role": "admin" },
  { "name": "Md Dipu", "phone": "01712345678", "password": "user123", "role": "customer" }
]
```

**Medicines**

```json
[
  { "id": 1, "name": "Paracetamol", "category": "Tablet", "price": 10, "stock": 50, "expiryDate": "2025-12-31" }
]
```

**Doctors**

```json
[
  { "id": 1, "name": "Dr. Rahman", "specialization": "Cardiology", "availableSlots": ["9:00","10:00"], "photo": "BASE64_STRING" }
]
```

**Appointments**

```json
[
  { "id": 1, "customerPhone": "01712345678", "doctorId": 1, "date": "2025-10-01", "slot": "9:00", "nameAtBooking": "John Doe", "phoneAtBooking": "01712345678" }
]
```

---

## Installation & Usage

1. Clone the repository:

```bash
git clone https://github.com/sabbirOG/Pharma-Cure.git
```

2. Open `index.html` in your browser


## Portfolio Notes

* Fully functional **frontend-only** project
* Showcases **role-based access, dynamic UI, bilingual support, and professional design**
* Ideal for **frontend developer portfolios**

---

## License

MIT License
---
***Developed By Sabbir Ahmed***
