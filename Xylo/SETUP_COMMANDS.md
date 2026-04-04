# XYLO APPAREL - Admin Auth Setup Commands
# Run these commands in order from the Xylo directory

# ============================================
# STEP 1: Create Required Directories
# ============================================
# Run in PowerShell or Command Prompt:

mkdir app\Http\Controllers\Auth
mkdir app\Http\Controllers\Admin
mkdir app\Http\Middleware
mkdir resources\js\Pages\Auth
mkdir resources\js\Pages\Admin
mkdir resources\js\Layouts

# ============================================
# STEP 2: Move Files to Correct Locations
# ============================================
# Move PHP files:
move ___AuthController.php app\Http\Controllers\Auth\AuthController.php
move ___DashboardController.php app\Http\Controllers\Admin\DashboardController.php
move ___RoleMiddleware.php app\Http\Middleware\RoleMiddleware.php

# Move JSX files:
move ___Login.jsx resources\js\Pages\Auth\Login.jsx
move ___Dashboard.jsx resources\js\Pages\Admin\Dashboard.jsx
move ___AdminLayout.jsx resources\js\Layouts\AdminLayout.jsx

# Delete old app.js (we're using app.jsx now):
del resources\js\app.js

# ============================================
# STEP 3: Install Composer Dependencies
# ============================================
composer require inertiajs/inertia-laravel

# ============================================
# STEP 4: Install NPM Dependencies
# ============================================
npm install

# ============================================
# STEP 5: Configure Database
# ============================================
# Make sure your .env file has correct database settings:
# DB_CONNECTION=mysql (or sqlite)
# DB_DATABASE=xylo_store
# etc.

# ============================================
# STEP 6: Run Migrations & Seeders
# ============================================
php artisan migrate:fresh --seed

# ============================================
# STEP 7: Start Development Servers
# ============================================
# Open TWO terminal windows:

# Terminal 1 - Laravel backend:
php artisan serve

# Terminal 2 - Vite frontend:
npm run dev

# ============================================
# STEP 8: Test the Application
# ============================================
# Open browser: http://127.0.0.1:8000/login
#
# Login credentials:
# Email: admin@xylo.com
# Password: password

# ============================================
# TROUBLESHOOTING
# ============================================
# If you get "Vite manifest not found":
# - Make sure npm run dev is running
# - Try: npm run build

# If login fails:
# - Check database connection in .env
# - Re-run: php artisan migrate:fresh --seed

# If pages don't load:
# - Check that all files are in correct locations
# - Clear cache: php artisan config:clear && php artisan cache:clear
