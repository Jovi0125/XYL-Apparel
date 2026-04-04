# XYLO APPAREL - Admin Dashboard Setup Commands
# Run these commands in order from the Xylo directory

# ============================================
# STEP 1: Install Dependencies (REQUIRED)
# ============================================
# Run in Command Prompt or PowerShell:

npm install

# This will install the new recharts dependency for charts

# ============================================
# STEP 2: Restart Dev Servers
# ============================================
# If already running, restart both:

# Terminal 1 - Laravel backend:
php artisan serve

# Terminal 2 - Vite frontend:
npm run dev

# ============================================
# STEP 3: Test the Application
# ============================================
# Open browser: http://127.0.0.1:8000/login
#
# Login credentials:
# Email: admin@xylo.com
# Password: password

# ============================================
# FILE STRUCTURE AFTER SETUP
# ============================================
# resources/js/
# ├── Components/
# │   └── admin/
# │       ├── index.js              (Component exports)
# │       ├── EmptyState.jsx        (Reusable empty state)
# │       ├── StatCard.jsx          (Metric cards)
# │       ├── ChartCard.jsx         (Chart wrapper)
# │       ├── TableCard.jsx         (Table wrapper)
# │       ├── SalesChart.jsx        (Sales line chart)
# │       ├── CustomerMap.jsx       (World map)
# │       ├── DeviceChart.jsx       (Donut chart)
# │       ├── RecentOrdersTable.jsx (Orders table)
# │       ├── AdminSidebar.jsx
# │       ├── AdminSidebarSection.jsx
# │       └── AdminSidebarItem.jsx
# ├── Layouts/
# │   └── AdminLayout.jsx
# └── Pages/
#     └── Admin/
#         └── Dashboard.jsx

# ============================================
# TESTING EMPTY STATES vs DATA STATES
# ============================================
# By default, the dashboard shows EMPTY STATES.
# 
# To test with SAMPLE DATA, edit:
# app/Http/Controllers/Admin/DashboardController.php
#
# Change:  $stats = [...];  (with null values)
# To:      $stats = $this->getStatsWithData();
#
# The getStatsWithData() method returns sample data.

# ============================================
# TROUBLESHOOTING
# ============================================
# If you get "Vite manifest not found":
# - Make sure npm run dev is running
# - Try: npm run build

# If charts don't render:
# - Run: npm install
# - Check that recharts is in package.json
# - Restart npm run dev

# If login fails:
# - Check database connection in .env
# - Re-run: php artisan migrate:fresh --seed

# If dashboard shows errors:
# - Check console for import errors
# - Verify all files are in correct locations
# - Clear cache: php artisan config:clear && php artisan cache:clear
