# 📚 Attendance Tracking System 📝

## 📋 Project Overview

This modern web application is designed for educational institutions like Deakin University to efficiently track student attendance. The system allows teachers to mark daily attendance for students enrolled in their subjects and provides comprehensive reporting with advanced filters and analytics.

## 🎯 Project Requirements

- Daily attendance marking for first-year students enrolled in subjects
- Students are enrolled in a minimum of 3 out of 5 total subjects
- Teacher-driven attendance marking using student registration numbers
- Advanced dashboard with search and filtering capabilities
- Fast response time (less than 1 second) even with large datasets

## ✨ Key Features

- 🧑‍🏫 Teacher authentication and role-based access control
- 👨‍👩‍👧‍👦 Student and group management
- 📋 Subject management with teacher assignments
- ✅ Daily attendance tracking by subject
- 📊 Advanced reporting with date range filters
- 📱 Responsive design with modern UI
- ⚡ Optimized for high performance with large datasets

## 🛠️ Built With

- **Backend**: Laravel
- **Frontend**: React with Inertia.js
- **Styling**: Tailwind CSS
- **Database**: MySQL/PostgreSQL (configurable)

## 🚀 How to Clone and Set Up This Project

### Step 1: Clone the repository

```bash
git clone https://github.com/rameezmuhammadh/attendance-tracking-system.git
cd attendance-tracking-system
```

### Step 2: Install PHP dependencies

```bash
composer install
```

### Step 3: Install JavaScript dependencies

```bash
npm install
```

### Step 4: Set up environment file

```bash
cp .env.example .env
php artisan key:generate
```

### Step 5: Configure your database

Edit the `.env` file and set up your database connection information:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=attendance_system
DB_USERNAME=root
DB_PASSWORD=
```

### Step 6: Run the migrations and seed the database

```bash
php artisan migrate
php artisan db:seed
```

### Step 7: Compile assets

```bash
npm run dev
```

### Step 8: Start the development server

```bash
php artisan serve
```

Visit [http://localhost:8000](http://localhost:8000) to see the application in action!

## 📝 License

This project is open-sourced under the [MIT license](https://opensource.org/licenses/MIT).
