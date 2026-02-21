# XYLO APPAREL — Multi-Vendor E-Commerce Marketplace

A full-featured multi-vendor fashion e-commerce marketplace built with **Laravel 12**, **Blade**, **Tailwind CSS v4**, **Alpine.js**, and **MySQL**. The platform supports four user roles — **Admin**, **Seller**, **Customer**, and **Logistics** — each with dedicated dashboards, features, and access controls.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack & Dependencies](#tech-stack--dependencies)
4. [Prerequisites](#prerequisites)
5. [Installation (Step by Step)](#installation-step-by-step)
6. [Configuration](#configuration)
7. [Database Schema](#database-schema)
8. [Project Structure](#project-structure)
9. [User Roles & Permissions](#user-roles--permissions)
10. [Routes Overview](#routes-overview)
11. [Demo Accounts](#demo-accounts)
12. [Seeders & Test Data](#seeders--test-data)
13. [Development Workflow](#development-workflow)
14. [Screenshots Roadmap](#screenshots-roadmap)
15. [License](#license)

---

## Project Overview

**XYLO APPAREL** is a curated multi-vendor fashion marketplace inspired by minimalist e-commerce platforms like UNIQLO. It connects independent fashion sellers with customers in a single platform, with built-in logistics and delivery tracking.

### How It Works

1. **Sellers** register, set up their shop profile, and list products with variants (sizes, colors, stock, SKU).
2. **Customers** browse products across all sellers, add to cart, apply discount codes, and checkout.
3. **Logistics** couriers receive shipment assignments, update delivery status, and upload proof of delivery.
4. **Admins** oversee the entire platform — manage users, approve sellers, view orders, configure settings, and generate reports.

---

## Features

### Admin Module
- Dashboard with platform-wide statistics (revenue, users, orders, sellers)
- Category management (CRUD with parent/child hierarchy)
- User management with ban/unban functionality
- Seller approvals with approve/ban/unban controls
- Order monitoring across all sellers
- Platform settings (commission rate, shipping fee, currency)
- Reports & analytics (seller performance, product performance, revenue by period)

### Seller Module
- Dashboard with sales stats, recent orders, low stock alerts
- Shop profile management (name, bio, logo, banner, address, hours)
- Product management (CRUD with variants, images, specifications)
- Order management with status updates (pending → processing → ready → completed)
- Discount code management (percentage or fixed, min order, expiry dates)
- Sales reports and product analytics

### Customer Module
- Public landing page with collections, features, and call-to-action sections
- Browse products with category filtering and seller shop pages
- Product detail pages with variant selection
- Shopping cart with quantity management
- Checkout with discount code application and multiple payment methods
- Wishlist functionality (add/remove toggle)
- Order history with cancellation option
- Profile and password management

### Logistics Module
- Dashboard with shipment statistics and pending deliveries
- Shipment listing with status filters
- Delivery status updates (unassigned → assigned → picked up → in transit → out for delivery → delivered → failed)
- Tracking event creation with location and remarks
- Proof of delivery upload (photo + signature + receiver name)
- Profile management

### Platform-Wide
- Role-based authentication (admin, seller, customer, logistics)
- Role middleware protecting all route groups
- Responsive UI with Tailwind CSS v4 and Alpine.js interactivity
- Dashboard layout with collapsible sidebar navigation
- Polished landing page with hero, stats, collections grid, features, and footer

---

## Tech Stack & Dependencies

### Backend (PHP / Composer)

| Package | Version | Purpose |
|---------|---------|---------|
| PHP | ^8.2 | Runtime |
| Laravel Framework | ^12.0 | Core MVC framework |
| Laravel Tinker | ^2.10.1 | REPL for debugging and testing |
| Faker PHP | ^1.23 | Test data generation (dev) |
| Laravel Pail | ^1.2.2 | Real-time log viewer (dev) |
| Laravel Pint | ^1.24 | Code style fixer (dev) |
| Laravel Sail | ^1.41 | Docker dev environment (dev) |
| Mockery | ^1.6 | Mocking framework for tests (dev) |
| Nunomaduro Collision | ^8.6 | Pretty error reporting (dev) |
| PHPUnit | ^11.5.3 | Unit & feature testing (dev) |

### Frontend (Node.js / npm)

| Package | Version | Purpose |
|---------|---------|---------|
| Vite | ^7.0.7 | Build tool and dev server |
| Laravel Vite Plugin | ^2.0.0 | Laravel integration for Vite |
| Tailwind CSS | ^4.0.0 | Utility-first CSS framework |
| @tailwindcss/vite | ^4.0.0 | Tailwind CSS Vite plugin |
| Alpine.js | ^3.15.8 | Lightweight JS framework for interactivity |
| Axios | ^1.11.0 | HTTP client for API requests |
| Concurrently | ^9.0.1 | Run multiple commands in parallel (dev) |

### Infrastructure

| Tool | Purpose |
|------|---------|
| XAMPP | Local PHP + MySQL server |
| MySQL | Database engine |
| Node.js | JavaScript runtime for build tools |
| Composer | PHP dependency manager |
| npm | Node.js package manager |
| Git | Version control |

---

## Prerequisites

Before setting up this project, make sure you have the following installed on your machine:

1. **XAMPP** (or any local server with PHP ^8.2 and MySQL)
   - Download: https://www.apachefriends.org/
   - Make sure Apache and MySQL services are running

2. **Composer** (PHP dependency manager)
   - Download: https://getcomposer.org/download/
   - Verify: `composer --version`

3. **Node.js** (v18 or higher recommended) and **npm**
   - Download: https://nodejs.org/
   - Verify: `node -v` and `npm -v`

4. **Git**
   - Download: https://git-scm.com/
   - Verify: `git --version`

---

## Installation (Step by Step)

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/XYLO_APPAREL.git
cd XYLO_APPAREL
```

### Step 2: Install PHP Dependencies

```bash
composer install
```

This downloads all Laravel framework packages and PHP libraries into the `vendor/` directory.

### Step 3: Install Node.js Dependencies

```bash
npm install
```

This downloads Tailwind CSS, Vite, Alpine.js, and other frontend packages into the `node_modules/` directory.

### Step 4: Create the Environment File

```bash
cp .env.example .env
```

On Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

### Step 5: Generate Application Key

```bash
php artisan key:generate
```

This generates a unique encryption key for your app and places it in the `.env` file.

### Step 6: Configure the Database

Open `.env` and set your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=xylo_apparel
DB_USERNAME=root
DB_PASSWORD=
```

Then create the database in MySQL:

```sql
CREATE DATABASE xylo_apparel;
```

You can do this via phpMyAdmin (http://localhost/phpmyadmin) or MySQL CLI:
```bash
mysql -u root -e "CREATE DATABASE xylo_apparel;"
```

### Step 7: Run Migrations

```bash
php artisan migrate
```

This creates all 19 database tables (users, categories, products, orders, shipments, etc.).

### Step 8: Seed the Database

```bash
php artisan db:seed
```

This populates the database with demo data — users, categories, seller shops, products, orders, and shipments.

Or run both migrations and seeding at once:
```bash
php artisan migrate:fresh --seed
```

### Step 9: Create Storage Symlink

```bash
php artisan storage:link
```

This creates a symbolic link from `public/storage` to `storage/app/public` for serving uploaded files.

### Step 10: Build Frontend Assets

For development (with hot reload):
```bash
npm run dev
```

For production build:
```bash
npm run build
```

### Step 11: Start the Development Server

```bash
php artisan serve
```

Visit **http://127.0.0.1:8000** in your browser to see the landing page.

---

## Configuration

### Key `.env` Settings

| Setting | Value | Description |
|---------|-------|-------------|
| `APP_NAME` | XYLO APPAREL | Application name |
| `APP_URL` | http://localhost:8000 | Base URL |
| `DB_DATABASE` | xylo_apparel | MySQL database name |
| `DB_USERNAME` | root | Database username |
| `DB_PASSWORD` | *(empty)* | Database password |

### System Settings (via Admin Panel)

These are configurable from Admin > Settings:

| Setting | Default | Description |
|---------|---------|-------------|
| Commission Rate | 10% | Platform fee per order |
| Shipping Fee | ₱50.00 | Default shipping fee |
| Currency | PHP | Currency symbol |

---

## Database Schema

The project uses **19 migration files** creating the following tables:

### Core Tables

| Table | Description |
|-------|-------------|
| `users` | All platform users with `role` (admin/seller/customer/logistics), soft deletes |
| `seller_profiles` | Seller shop details — name, slug, bio, logo, banner, address, city, status, commission rate |
| `categories` | Hierarchical product categories with `parent_id`, slug, image, sort order |
| `products` | Products linked to seller profiles and categories — price, sale price, specifications (JSON), views count |
| `product_variants` | Size/color/stock/SKU variations per product with optional price override |
| `product_images` | Product gallery images with primary flag and sort order |

### Order & Payment Tables

| Table | Description |
|-------|-------------|
| `orders` | Customer orders tied to seller — status, totals, shipping info, payment method/status |
| `order_items` | Individual line items — product name snapshot, variant label, quantity, prices |
| `discount_codes` | Seller-created codes — type (percentage/fixed), value, min order, max uses, expiry |

### Logistics Tables

| Table | Description |
|-------|-------------|
| `logistics_profiles` | Courier profiles — name, phone, service area, active status |
| `shipments` | Order shipments — tracking number, delivery status, pickup/delivery addresses, timestamps |
| `shipment_tracking_events` | Status change history — status, location, remarks, created by |
| `proof_of_deliveries` | Delivery proof — photo, signature, receiver name, timestamp |

### Platform Tables

| Table | Description |
|-------|-------------|
| `system_settings` | Key-value settings store (commission, shipping fee, currency) |
| `wishlists` | Customer product wishlists |
| `carts` | Shopping cart items with product variant and quantity |
| `events` | Platform events linked to seller profiles |
| `cache` | Framework cache storage |
| `jobs` / `job_batches` / `failed_jobs` | Queue system tables |

### Entity Relationship Summary

```
Users ──┬── SellerProfile ──┬── Products ──┬── ProductVariants
        │                   │              ├── ProductImages
        │                   │              └── Wishlists
        │                   ├── Orders ────┬── OrderItems
        │                   │              └── Shipments ──┬── TrackingEvents
        │                   │                              └── ProofOfDelivery
        │                   └── DiscountCodes
        │
        ├── LogisticsProfile ── Shipments
        │
        ├── Orders (as customer)
        ├── Wishlists
        └── Carts

Categories (self-referencing parent/child) ── Products
```

---

## Project Structure

```
XYLO_APPAREL/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/                    # 7 controllers
│   │   │   │   ├── CategoryController.php
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── OrderController.php
│   │   │   │   ├── ReportController.php
│   │   │   │   ├── SellerController.php
│   │   │   │   ├── SettingsController.php
│   │   │   │   └── UserController.php
│   │   │   ├── Auth/                     # 3 controllers
│   │   │   │   ├── LoginController.php
│   │   │   │   ├── LogoutController.php
│   │   │   │   └── RegisterController.php
│   │   │   ├── Customer/                 # 7 controllers
│   │   │   │   ├── BrowseController.php
│   │   │   │   ├── CartController.php
│   │   │   │   ├── CheckoutController.php
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── OrderController.php
│   │   │   │   ├── ProfileController.php
│   │   │   │   └── WishlistController.php
│   │   │   ├── Logistics/                # 5 controllers
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── ProfileController.php
│   │   │   │   ├── ProofOfDeliveryController.php
│   │   │   │   ├── ShipmentController.php
│   │   │   │   └── TrackingController.php
│   │   │   └── Seller/                   # 6 controllers
│   │   │       ├── DashboardController.php
│   │   │       ├── DiscountCodeController.php
│   │   │       ├── OrderController.php
│   │   │       ├── ProductController.php
│   │   │       ├── ReportController.php
│   │   │       └── ShopController.php
│   │   ├── Middleware/
│   │   │   └── RoleMiddleware.php         # Role-based access control
│   │   └── Requests/                      # Form request validations
│   │       ├── CategoryRequest.php
│   │       ├── CheckoutRequest.php
│   │       ├── DiscountCodeRequest.php
│   │       └── ProductRequest.php
│   ├── Models/                            # 17 Eloquent models
│   │   ├── Cart.php
│   │   ├── Category.php
│   │   ├── DiscountCode.php
│   │   ├── Event.php
│   │   ├── LogisticsProfile.php
│   │   ├── Order.php
│   │   ├── OrderItem.php
│   │   ├── Product.php
│   │   ├── ProductImage.php
│   │   ├── ProductVariant.php
│   │   ├── ProofOfDelivery.php
│   │   ├── SellerProfile.php
│   │   ├── Shipment.php
│   │   ├── ShipmentTrackingEvent.php
│   │   ├── SystemSetting.php
│   │   ├── User.php
│   │   └── Wishlist.php
│   └── Providers/
│       └── AppServiceProvider.php
│
├── database/
│   ├── migrations/                        # 19 migration files
│   └── seeders/                           # 6 seeder files
│       ├── DatabaseSeeder.php             # Main seeder (orchestrator)
│       ├── SystemSettingsSeeder.php       # Platform settings
│       ├── CategorySeeder.php             # 27 categories (6 parent + 21 child)
│       ├── SellerProfileSeeder.php        # 3 sellers + extra users + logistics
│       ├── ProductSeeder.php              # 14 products, 61 variants, 3 discounts
│       └── OrderSeeder.php               # 8 orders, shipments, tracking events
│
├── resources/
│   ├── css/
│   │   └── app.css                        # Tailwind CSS v4 imports + Inter font
│   ├── js/
│   │   ├── app.js                         # Alpine.js + Axios bootstrap
│   │   └── bootstrap.js                   # Axios defaults
│   └── views/                             # 56+ Blade templates
│       ├── welcome.blade.php              # Public landing page
│       ├── layouts/
│       │   ├── app.blade.php              # Base layout (head, Vite, body)
│       │   ├── dashboard.blade.php        # Dashboard layout with sidebar
│       │   └── guest.blade.php            # Centered card layout for auth
│       ├── components/
│       │   ├── sidebar.blade.php          # Sidebar wrapper component
│       │   ├── sidebar-link.blade.php     # Nav link component
│       │   └── stat-card.blade.php        # Stats card component
│       ├── auth/
│       │   ├── login.blade.php
│       │   └── register.blade.php
│       ├── admin/                         # 14 admin views
│       ├── seller/                        # 13 seller views
│       ├── customer/                      # 10 customer views
│       └── logistics/                     # 7 logistics views
│
├── routes/
│   └── web.php                            # 86 routes (all role-protected)
│
├── public/
│   ├── index.php                          # Application entry point
│   └── build/                             # Compiled Vite assets
│
├── bootstrap/
│   └── app.php                            # Middleware registration (RoleMiddleware)
│
├── composer.json                          # PHP dependencies
├── package.json                           # Node.js dependencies
├── vite.config.js                         # Vite build configuration
└── .env                                   # Environment configuration
```

---

## User Roles & Permissions

The application uses a `role` column on the `users` table with a custom `RoleMiddleware` to protect route groups.

| Role | Access | Middleware |
|------|--------|-----------|
| **Admin** | Full platform control — users, sellers, categories, orders, settings, reports | `role:admin` |
| **Seller** | Own shop management — products, orders, discounts, reports | `role:seller` |
| **Customer** | Shopping experience — browse, cart, checkout, wishlist, orders, profile | `role:customer` |
| **Logistics** | Delivery management — shipments, tracking, proof of delivery, profile | `role:logistics` |

### Middleware Registration

In `bootstrap/app.php`:
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'role' => \App\Http\Middleware\RoleMiddleware::class,
    ]);
})
```

### Route Protection Example

```php
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    // Only admin users can access these routes
});
```

---

## Routes Overview

The application has **86 registered routes** organized by role:

### Public Routes (3)
| Method | URI | Description |
|--------|-----|-------------|
| GET | `/` | Landing page |
| GET | `/login` | Login form |
| GET | `/register` | Registration form |

### Auth Routes (3)
| Method | URI | Description |
|--------|-----|-------------|
| POST | `/login` | Process login |
| POST | `/register` | Process registration |
| POST | `/logout` | Logout user |

### Dashboard Redirect (1)
| Method | URI | Description |
|--------|-----|-------------|
| GET | `/dashboard` | Redirects to role-specific dashboard |

### Admin Routes (17)
| Method | URI | Description |
|--------|-----|-------------|
| GET | `admin/dashboard` | Admin dashboard with statistics |
| GET/POST | `admin/categories` | List / Create categories |
| GET/PUT/DELETE | `admin/categories/{id}` | Show / Update / Delete category |
| GET | `admin/users` | List all users |
| GET/PATCH | `admin/users/{id}` | Show / Ban / Unban user |
| GET | `admin/sellers` | List all seller applications |
| GET/PATCH | `admin/sellers/{id}` | Show / Approve / Ban / Unban seller |
| GET | `admin/orders` | List all orders |
| GET | `admin/orders/{id}` | View order details |
| GET/PUT | `admin/settings` | View / Update platform settings |
| GET | `admin/reports` | Revenue & overview report |
| GET | `admin/reports/sellers` | Seller performance report |
| GET | `admin/reports/products` | Product performance report |

### Seller Routes (20)
| Method | URI | Description |
|--------|-----|-------------|
| GET | `seller/dashboard` | Seller dashboard |
| GET/PUT | `seller/shop` | Edit shop profile |
| GET/POST | `seller/products` | List / Create products |
| GET/PUT/DELETE | `seller/products/{id}` | Show / Edit / Update / Delete product |
| GET | `seller/orders` | List seller orders |
| GET/PATCH | `seller/orders/{id}` | View / Update order status |
| GET/POST | `seller/discounts` | List / Create discount codes |
| GET/PUT/DELETE | `seller/discounts/{id}` | Edit / Update / Delete discount |
| GET | `seller/reports` | Seller sales report |
| GET | `seller/reports/products` | Product analytics |

### Customer Routes (18)
| Method | URI | Description |
|--------|-----|-------------|
| GET | `customer/dashboard` | Customer dashboard |
| GET | `customer/browse` | Browse all products |
| GET | `customer/products/{id}` | Product detail page |
| GET | `customer/shop/{seller}` | Seller shop page |
| GET/POST/PATCH/DELETE | `customer/cart` | Cart CRUD + Clear |
| GET/POST | `customer/checkout` | Checkout page + Process order |
| POST/DELETE | `customer/checkout/apply-discount` | Apply / Remove discount code |
| GET/POST/DELETE | `customer/wishlist` | Wishlist management |
| GET | `customer/orders` | Order history |
| GET/PATCH | `customer/orders/{id}` | View / Cancel order |
| GET/PUT | `customer/profile` | Edit profile + Update password |

### Logistics Routes (10)
| Method | URI | Description |
|--------|-----|-------------|
| GET | `logistics/dashboard` | Logistics dashboard |
| GET | `logistics/shipments` | List assigned shipments |
| GET | `logistics/shipments/{id}` | Shipment details |
| PATCH | `logistics/shipments/{id}/status` | Update delivery status |
| GET/POST | `logistics/shipments/{id}/tracking` | Create tracking event |
| GET/POST | `logistics/shipments/{id}/pod` | Upload proof of delivery |
| GET/PUT | `logistics/profile` | Edit courier profile |

---

## Demo Accounts

After running `php artisan migrate:fresh --seed`, the following accounts are available:

| Role | Email | Password | Details |
|------|-------|----------|---------|
| Admin | `admin@xylo.com` | `password` | Full platform access |
| Seller | `seller@xylo.com` | `password` | Shop: Urban Thread Co. |
| Seller | `maria@xylo.com` | `password` | Shop: Filipiniana Modern |
| Seller | `jake@xylo.com` | `password` | Shop: DRIP Studio |
| Customer | `customer@xylo.com` | `password` | Test customer account |
| Customer | `ana@xylo.com` | `password` | Extra customer |
| Customer | `carlos@xylo.com` | `password` | Extra customer |
| Logistics | `logistics@xylo.com` | `password` | Courier: XYLO Express |

---

## Seeders & Test Data

The database seeder creates realistic demo data for testing all features:

| Seeder | What It Creates |
|--------|-----------------|
| `DatabaseSeeder` | Orchestrates all seeders in correct order |
| `SystemSettingsSeeder` | 3 platform settings (commission 10%, shipping ₱50, currency PHP) |
| `CategorySeeder` | 27 categories — 6 parents (T-Shirts, Jackets, Pants, Sneakers, Accessories, Limited Edition) with 21 subcategories |
| `SellerProfileSeeder` | 3 seller shops + 2 extra customers + 1 logistics profile |
| `ProductSeeder` | 14 products across all sellers, 61 variants (size/color/stock/SKU), product images, 3 discount codes (WELCOME20, FLAT100, DRIP10) |
| `OrderSeeder` | 8 orders (4 completed, 2 processing, 1 pending, 1 cancelled), 12 order items, 7 shipments, 26 tracking events |

### Running Seeders

```bash
# Fresh migration + seed (drops all tables first)
php artisan migrate:fresh --seed

# Seed only (requires existing tables)
php artisan db:seed

# Run a specific seeder
php artisan db:seed --class=CategorySeeder
```

---

## Development Workflow

### Daily Development

```bash
# Start the Laravel dev server
php artisan serve

# In a second terminal, start Vite for hot reload
npm run dev
```

Or run both simultaneously:
```bash
composer dev
```

### Useful Artisan Commands

```bash
# Clear all caches
php artisan optimize:clear

# Compile and cache views (check for Blade errors)
php artisan view:cache

# List all registered routes
php artisan route:list

# Open interactive REPL
php artisan tinker

# Build frontend for production
npm run build

# Run tests
php artisan test
```

### Code Style

```bash
# Fix code style with Laravel Pint
./vendor/bin/pint
```

---

## Screenshots Roadmap

> Screenshots can be added here as the UI is finalized.

- [ ] Landing page (hero, collections, features)
- [ ] Login / Register pages
- [ ] Admin dashboard & category management
- [ ] Seller dashboard & product management
- [ ] Customer browse & checkout flow
- [ ] Logistics shipment tracking & proof of delivery

---

## Project Development Phases

This project was built in 7 structured phases:

| Phase | Focus | Deliverables |
|-------|-------|--------------|
| **Phase 1** | Foundation & Auth | Database migrations, 17 Eloquent models, role middleware, auth controllers, layouts, auth views |
| **Phase 2** | Admin Module | 7 controllers, 14 views, 23 routes — categories, users, sellers, orders, settings |
| **Phase 3** | Seller Module | 6 controllers, 13 views, 26 routes — shop, products, orders, discounts |
| **Phase 4** | Customer Module | 7 controllers, 10 views, 22 routes — browse, cart, checkout, wishlist, orders, profile |
| **Phase 5** | Logistics Module | 5 controllers, 7 views, 10 routes — shipments, tracking, proof of delivery |
| **Phase 6** | Reports & Analytics | 2 controllers, 5 views, 5 routes — admin & seller reports |
| **Phase 7** | Landing Page & Seeders | Polished storefront, 6 comprehensive seeders with realistic demo data |

---

## Built With

- [Laravel 12](https://laravel.com/) — PHP web framework
- [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first CSS framework
- [Alpine.js](https://alpinejs.dev/) — Lightweight JavaScript framework
- [Vite](https://vitejs.dev/) — Next-generation frontend build tool
- [MySQL](https://www.mysql.com/) — Relational database
- [XAMPP](https://www.apachefriends.org/) — Local development server

---

## License

This project is built for educational purposes as a school project. The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
