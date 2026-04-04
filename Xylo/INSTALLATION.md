# XYLO APPAREL - Installation & Setup Guide

## 📋 Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js & npm
- MySQL (or SQLite for development)
- Cloudinary account (for image uploads)

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

---

### 2. Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

---

### 3. Database Setup

Update `.env` with your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=xylo_apparel
DB_USERNAME=root
DB_PASSWORD=
```

Or use SQLite for development:

```env
DB_CONNECTION=sqlite
```

Run migrations and seed admin user:

```bash
php artisan migrate:fresh --seed
```

---

### 4. Cloudinary Setup (Required for Images)

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your credentials from the [Dashboard](https://cloudinary.com/console)
3. Update `.env`:

```env
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

For complete Cloudinary documentation, see: **`CLOUDINARY_SETUP.md`**

---

### 5. Start Development Servers

**Option A: Separate Terminals**

```bash
# Terminal 1 - Backend
php artisan serve

# Terminal 2 - Frontend
npm run dev
```

**Option B: Single Command (Recommended)**

```bash
composer run dev
```

This runs both servers concurrently.

---

### 6. Access the Application

- Login: http://127.0.0.1:8000/login
- Admin Dashboard: http://127.0.0.1:8000/admin/dashboard

**Default Admin Credentials:**
```
Email: admin@xylo.com
Password: password
```

---

## 📁 Project Structure

```
xylo/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/
│   │   │   └── Auth/
│   │   └── Middleware/
│   ├── Models/
│   └── helpers.php (Cloudinary helpers)
├── config/
│   └── cloudinary.php
├── database/
│   ├── migrations/
│   └── seeders/
├── resources/
│   ├── css/
│   │   └── app.css
│   └── js/
│       ├── Components/
│       │   └── admin/
│       ├── Layouts/
│       ├── Pages/
│       │   ├── Admin/
│       │   └── Auth/
│       └── app.jsx
├── routes/
│   └── web.php
├── .env.example
├── CLOUDINARY_SETUP.md
├── SETUP_COMMANDS.md
└── README.md
```

---

## 🧪 Testing

```bash
# Run tests
composer test

# or
php artisan test
```

---

## 🔧 Common Commands

### Clear Cache

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### Rebuild Assets

```bash
npm run build
```

### Fresh Database

```bash
php artisan migrate:fresh --seed
```

### Autoload Helper Functions

```bash
composer dump-autoload
```

---

## 🐛 Troubleshooting

### Vite Manifest Not Found

```bash
# Make sure npm run dev is running
npm run dev

# Or build for production
npm run build
```

### Login Fails

```bash
# Reset database
php artisan migrate:fresh --seed

# Check .env database connection
```

### Cloudinary Upload Fails

- Verify credentials in `.env`
- Check `CLOUDINARY_SETUP.md` for detailed setup
- Ensure `composer dump-autoload` has been run

### Dashboard Shows Blank

- Check browser console for errors
- Verify all npm dependencies are installed
- Ensure both servers are running

---

## 📦 Dependencies

### Backend (PHP)

- Laravel 12
- Inertia.js Laravel Adapter
- Cloudinary Laravel SDK

### Frontend (JavaScript)

- React 19
- Inertia.js React Adapter
- Tailwind CSS v4
- Recharts (for dashboard charts)
- Vite

---

## 🔒 Security Notes

- CSRF protection enabled
- Session-based authentication
- Password hashing with bcrypt
- Role-based middleware
- File validation for uploads

---

## 🚀 What's Next?

After setup, you can:

1. **Explore the Admin Dashboard**
   - View empty state widgets
   - Test sidebar navigation
   - Check responsive design

2. **Test Cloudinary Integration**
   - See `CLOUDINARY_SETUP.md`
   - Create a test product upload

3. **Build Product Management**
   - Create product CRUD operations
   - Integrate image uploads
   - Add categories

4. **Customize the UI**
   - Modify Tailwind theme
   - Add more dashboard widgets
   - Create custom components

---

## 📚 Documentation Files

- `README.md` - Project overview
- `INSTALLATION.md` - This file
- `CLOUDINARY_SETUP.md` - Complete Cloudinary guide
- `SETUP_COMMANDS.md` - Quick command reference

---

## 💡 Development Tips

1. Keep both servers running during development
2. Use `composer run dev` for convenience
3. Check Laravel logs: `storage/logs/laravel.log`
4. Use browser DevTools for React debugging
5. Test empty states before adding real data

---

## 🆘 Getting Help

- Check the documentation files
- Review Laravel docs: https://laravel.com/docs
- Review Inertia.js docs: https://inertiajs.com
- Review Cloudinary docs: https://cloudinary.com/documentation

---

Happy coding! 🎉
