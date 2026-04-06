<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DiscountController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Buyer\BuyerDashboardController;
use App\Http\Controllers\Logistics\LogisticsDashboardController;
use App\Http\Controllers\Admin\ArchiveController;
use App\Http\Controllers\Admin\InventoryController;
use App\Http\Controllers\Admin\SearchController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\ShipmentController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Storefront\HomeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Root Redirect
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return redirect('/ph/en');
});

/*
|--------------------------------------------------------------------------
| Localized Storefront / Landing Entry
|--------------------------------------------------------------------------
*/
Route::prefix('ph/en')->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/women', [HomeController::class, 'index'])->name('store.women');
    Route::get('/men', [HomeController::class, 'index'])->name('store.men');
    Route::get('/unisex', [HomeController::class, 'index'])->name('store.unisex');

    // Navigation / Search Overlay Routes (-navi suffix)
    Route::get('/women-navi', [HomeController::class, 'index'])->name('store.women.navi');
    Route::get('/men-navi', [HomeController::class, 'index'])->name('store.men.navi');
    Route::get('/unisex-navi', [HomeController::class, 'index'])->name('store.unisex.navi');

    // Category detail routes
    Route::get('/women/{category:slug}', [HomeController::class, 'index'])->name('store.women.category');
    Route::get('/men/{category:slug}', [HomeController::class, 'index'])->name('store.men.category');
    Route::get('/unisex/{category:slug}', [HomeController::class, 'index'])->name('store.unisex.category');

    // Category detail routes within navi mode
    Route::get('/women-navi/{category:slug}', [HomeController::class, 'index'])->name('store.women.navi.category');
    Route::get('/men-navi/{category:slug}', [HomeController::class, 'index'])->name('store.men.navi.category');
    Route::get('/unisex-navi/{category:slug}', [HomeController::class, 'index'])->name('store.unisex.navi.category');

    // Placeholder routes for search, profile, wishlist, cart
    Route::get('/search', [HomeController::class, 'index'])->name('store.search');
    Route::get('/profile', [HomeController::class, 'index'])->name('store.profile');
    Route::get('/wishlist', [HomeController::class, 'index'])->name('store.wishlist');
    Route::get('/cart', [HomeController::class, 'index'])->name('store.cart');

    /*
    |--------------------------------------------------------------------------
    | Guest / Public Entry
    |--------------------------------------------------------------------------
    */
    Route::middleware('guest')->group(function () {
        // Buyer Access
        Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [AuthController::class, 'login']);
        Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
        Route::post('/register', [AuthController::class, 'register']);
    });
});

/*
|--------------------------------------------------------------------------
| Staff Access (Seeded ONLY) - Outside localization for now as per system logic
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    Route::get('/admin/login', [AuthController::class, 'showAdminLogin'])->name('admin.login');
    Route::post('/admin/login', [AuthController::class, 'login']);

    Route::get('/logistics/login', [AuthController::class, 'showLogisticsLogin'])->name('logistics.login');
    Route::post('/logistics/login', [AuthController::class, 'login']);

    // Social Authentication (Buyer ONLY)
    Route::get('/auth/google/redirect', [\App\Http\Controllers\Auth\GoogleAuthController::class, 'redirectToGoogle'])->name('google.redirect');
    Route::get('/auth/google/callback', [\App\Http\Controllers\Auth\GoogleAuthController::class, 'handleGoogleCallback'])->name('google.callback');
});

/*
|--------------------------------------------------------------------------
| Authenticated Global Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::prefix('admin')
    ->middleware(['auth', 'role:admin'])
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Categories Management
        Route::resource('categories', CategoryController::class)->except(['show', 'create', 'edit']);

        // Discounts Management
        Route::resource('discounts', DiscountController::class)->except(['show', 'create', 'edit']);
        Route::post('discounts/validate', [DiscountController::class, 'validate'])->name('discounts.validate');

        // Products Management
        Route::resource('products', ProductController::class)->except(['show']);

        // Inventory Management
        Route::get('/inventory', [InventoryController::class, 'index'])->name('inventory.index');
        Route::post('/inventory/update-thresholds', [InventoryController::class, 'updateThresholds'])->name('inventory.updateThresholds');

        // Shipments / Order Fulfillment
        Route::get('/shipments', [ShipmentController::class, 'index'])->name('shipments.index');
        Route::post('/shipments/{order}/update-status', [ShipmentController::class, 'updateStatus'])->name('shipments.updateStatus');
        Route::post('/shipments/{order}/update-payment', [ShipmentController::class, 'updatePaymentStatus'])->name('shipments.updatePayment');

        // Search
        Route::get('/search', [SearchController::class, 'globalSearch'])->name('search');

        // Notifications
        Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
        Route::post('/notifications/mark-read', [NotificationController::class, 'markAsRead'])->name('notifications.markRead');

        // Archive Management
        Route::get('/archive', [ArchiveController::class, 'index'])->name('archive.index');
        Route::post('/archive/restore/{type}/{id}', [ArchiveController::class, 'restore'])->name('archive.restore');

        // Users Management
        Route::resource('users', \App\Http\Controllers\Admin\UserController::class);
        Route::post('users/{user}/toggle-status', [\App\Http\Controllers\Admin\UserController::class, 'toggleStatus'])->name('users.toggleStatus');

        // Orders Management
        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');

        // Payments Management
        Route::get('/payments', [PaymentController::class, 'index'])->name('payments.index');

        // Reviews Management
        Route::get('/reviews', [ReviewController::class, 'index'])->name('reviews.index');
        Route::post('/reviews/{review}/toggle', [ReviewController::class, 'toggleApproval'])->name('reviews.toggle');

        // Analytics & Reports
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    });

/*
|--------------------------------------------------------------------------
| Buyer Routes (placeholder for future)
|--------------------------------------------------------------------------
*/
Route::prefix('buyer')
    ->middleware(['auth', 'role:buyer'])
    ->name('buyer.')
    ->group(function () {
        Route::get('/dashboard', [BuyerDashboardController::class, 'index'])->name('dashboard');
    });

/*
|--------------------------------------------------------------------------
| Logistics Routes (placeholder for future)
|--------------------------------------------------------------------------
*/
Route::prefix('logistics')
    ->middleware(['auth', 'role:logistics'])
    ->name('logistics.')
    ->group(function () {
        Route::get('/dashboard', [LogisticsDashboardController::class, 'index'])->name('dashboard');
    });

/*
|--------------------------------------------------------------------------
| Default Redirect Fallbacks
|--------------------------------------------------------------------------
*/
