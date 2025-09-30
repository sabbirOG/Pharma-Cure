# PharmaCure - Pharmacy Management System

A complete frontend pharmacy management system built with HTML, CSS, and JavaScript. Features role-based authentication, medicine management, doctor appointments, and bilingual support (English & Bangla).

## 🚀 Features

### Customer Features
- **User Registration & Login**: Secure authentication with phone number and password
- **Medicine Corner**: Browse, search, filter, and sort medicines by category, price, and stock
- **Doctor Appointments**: Book and manage appointments with available doctors
- **Profile Management**: Update personal information and preferences
- **Bilingual Support**: Switch between English and Bangla languages
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Admin Features
- **Dashboard**: Overview of medicines, doctors, appointments, and customers
- **Medicine Management**: Add, edit, and delete medicines with categories and pricing
- **Doctor Management**: Manage doctor profiles with photos and specializations
- **Appointment Overview**: View all customer appointments
- **User Management**: Monitor customer accounts and activities

## 📁 Project Structure

```
pharmacy-chamber/
├── index.html              # Customer Dashboard
├── login.html              # Authentication
├── signup.html             # User Registration
├── medicine.html           # Medicine Corner
├── doctor.html             # Doctor Appointments
├── admin.html              # Admin Panel
├── profile.html            # User Profile
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   ├── auth.js         # Authentication system
│   │   ├── medicine.js     # Medicine management
│   │   ├── doctor.js       # Doctor & appointments
│   │   ├── admin.js        # Admin panel logic
│   │   ├── profile.js      # Profile management
│   │   ├── notifications.js # Toast notifications
│   │   ├── language.js     # Bilingual support
│   │   └── utils.js        # Helper functions
│   └── img/                # Images and icons
├── data/
│   └── sampleMedicines.json # Sample medicine data
└── README.md               # Project documentation
```

## 🔐 Authentication

### Admin Credentials
- **Phone**: 01870243704
- **Password**: 0112230346
- **Name**: Sabbir Ahmed

### Customer Registration
Customers can register with:
- Full Name
- Phone Number (Bangladeshi format: 01XXXXXXXXX)
- Age
- Address
- Password

## 🛠️ Installation & Setup

1. **Clone or Download** the project files
2. **Open** `pharmacy-chamber` folder in VS Code or any code editor
3. **Start** a local server (recommended):
   - Using Live Server extension in VS Code
   - Using Python: `python -m http.server 8000`
   - Using Node.js: `npx http-server`
4. **Open** `http://localhost:8000` in your browser
5. **Start** with the login page or admin credentials

## 📱 Usage

### For Customers
1. **Sign Up** with your details or use existing credentials
2. **Browse Medicines** in the Medicine Corner
3. **Book Appointments** with available doctors
4. **Manage Profile** and language preferences

### For Admins
1. **Login** with admin credentials
2. **Manage Medicines** - add, edit, delete medicines
3. **Manage Doctors** - add doctor profiles with photos
4. **View Appointments** - monitor all customer appointments
5. **Dashboard Stats** - overview of system data

## 🗄️ Data Storage

The application uses **LocalStorage** for data persistence:
- `users` - User accounts and profiles
- `medicines` - Medicine inventory
- `doctors` - Doctor profiles
- `appointments` - Booking records
- `activities` - User activity logs
- `settings` - App preferences

## 🌐 Bilingual Support

The application supports two languages:
- **English** (default)
- **বাংলা** (Bangla)

Users can switch languages from their profile page. All static text and UI elements are translated.

## 📊 Sample Data

The project includes sample medicine data in `data/sampleMedicines.json` with:
- 15 different medicines
- 5 categories: Pain Relief, Antibiotics, Vitamins, Cold & Flu, Digestive
- Realistic pricing in Bangladeshi Taka (৳)
- Stock quantities and descriptions

## 🎨 Design Features

- **Modern UI**: Clean, professional design with gradient backgrounds
- **Responsive Layout**: Mobile-first design that works on all screen sizes
- **Interactive Elements**: Hover effects, smooth transitions, and animations
- **Color Scheme**: Professional blue and purple gradients
- **Typography**: Clean, readable fonts with proper hierarchy

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid
- **Vanilla JavaScript**: No external dependencies
- **LocalStorage**: Client-side data persistence
- **Responsive Design**: Mobile and desktop compatibility

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🚀 Future Enhancements

Potential improvements for the system:
- Backend integration with database
- Payment gateway integration
- Email/SMS notifications
- Advanced search and filtering
- Medicine inventory alerts
- Prescription management
- Analytics and reporting
- Multi-language support for more languages

## 📝 Portfolio Notes

This project demonstrates:
- **Full-Stack Frontend Development**: Complete single-page application
- **Role-Based Authentication**: Admin and customer access control
- **Data Management**: CRUD operations with LocalStorage
- **Internationalization**: Bilingual support implementation
- **Responsive Design**: Mobile and desktop compatibility
- **Modern JavaScript**: ES6+ features and modular architecture
- **User Experience**: Intuitive interface and smooth interactions

## 🤝 Contributing

This is a portfolio project. Feel free to:
- Fork the repository
- Submit issues and suggestions
- Create pull requests for improvements
- Use as a learning resource

## 📄 License

This project is open source and available under the MIT License.

---

**PharmaCure** - Your trusted pharmacy management solution! 💊🏥