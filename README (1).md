# CoalTrack PHP + MySQL Backend

This project includes a simple PHP and MySQL backend for real user accounts, orders, inventory, and shipments.

## 1. Install XAMPP
- Download and install XAMPP
- Start Apache and MySQL

## 2. Create database
- Open phpMyAdmin at http://localhost/phpmyadmin
- Import the file: `database/coaltrack.sql`

## 3. Place project in htdocs
Copy this project folder into:

`C:/xampp/htdocs/coaltrack`

## 4. Test the backend
Open in browser:

- http://localhost/coaltrack/api/login.php
- http://localhost/coaltrack/api/register.php
- http://localhost/coaltrack/api/dashboard.php?username=admin

## 5. Main API files
- `api/config.php` - database connection
- `api/register.php` - register new user
- `api/login.php` - login and auth
- `api/dashboard.php` - fetch dashboard data

## 6. Choose your backend language
You can keep this PHP version as the real backend, or later move the same logic to Java if you want a more enterprise-level setup.
