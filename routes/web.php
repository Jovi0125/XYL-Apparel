<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\SellerController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Admin\InventoryController as AdminInventoryController;
use App\Http\Controllers\Seller\DashboardController as SellerDashboardController;
use App\Http\Controllers\Seller\ShopController;
use App\Http\Controllers\Seller\ProductController;
use App\Http\Controllers\Seller\OrderController as SellerOrderController;
use App\Http\Controllers\Seller\DiscountCodeController;
use App\Http\Controllers\Seller\ReportController as SellerReportController;
use App\Http\Controllers\Seller\InventoryController as SellerInventoryController;
use App\Http\Controllers\Customer\DashboardController as CustomerDashboardController;
use App\Http\Controllers\Customer\BrowseController;
use App\Http\Controllers\Customer\CartController;
use App\Http\Controllers\Customer\CheckoutController;
use App\Http\Controllers\Customer\WishlistController;
use App\Http\Controllers\Customer\OrderController as CustomerOrderController;
use App\Http\Controllers\Customer\ProfileController;
use App\Http\Controllers\Logistics\DashboardController as LogisticsDashboardController;
use App\Http\Controllers\Logistics\ShipmentController;
use App\Http\Controllers\Logistics\TrackingController;
use App\Http\Controllers\Logistics\ProofOfDeliveryController;
use App\Http\Controllers\Logistics\ProfileController as LogisticsProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('welcome');
})->name('home');

/*
|--------------------------------------------------------------------------
| Guest Routes (Login & Register)
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [LoginController::class, 'login']);
    Route::get('/register', [RegisterController::class, 'showRegistrationForm'])->name('register');
    Route::post('/register', [RegisterController::class, 'register']);
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::post('/logout', [LogoutController::class, 'logout'])->name('logout');

    // /dashboard — React renders the correct dashboard based on role from __INITIAL_DATA__
    Route::get('/dashboard', function () {
        return view('welcome');
    })->name('dashboard');
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Categories
        Route::resource('categories', CategoryController::class)->except(['show']);

        // Users
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
        Route::patch('/users/{user}/ban', [UserController::class, 'ban'])->name('users.ban');
        Route::patch('/users/{user}/unban', [UserController::class, 'unban'])->name('users.unban');

        // Sellers
        Route::get('/sellers', [SellerController::class, 'index'])->name('sellers.index');
        Route::get('/sellers/{seller}', [SellerController::class, 'show'])->name('sellers.show');
        Route::patch('/sellers/{seller}/approve', [SellerController::class, 'approve'])->name('sellers.approve');
        Route::patch('/sellers/{seller}/ban', [SellerController::class, 'ban'])->name('sellers.ban');
        Route::patch('/sellers/{seller}/unban', [SellerController::class, 'unban'])->name('sellers.unban');

        // Orders
        Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');

        // Settings
        Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
        Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');

        // Reports & Analytics
        Route::get('/reports', [AdminReportController::class, 'index'])->name('reports.index');
        Route::get('/reports/sellers', [AdminReportController::class, 'sellers'])->name('reports.sellers');
        Route::get('/reports/products', [AdminReportController::class, 'products'])->name('reports.products');

        // Inventory
        Route::get('/inventory', [AdminInventoryController::class, 'index'])->name('inventory.index');
        Route::get('/inventory/logs', [AdminInventoryController::class, 'logs'])->name('inventory.logs');
        Route::put('/inventory/{variant}', [AdminInventoryController::class, 'update'])->name('inventory.update');
    });

/*
|--------------------------------------------------------------------------
| Seller Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:seller'])
    ->prefix('seller')
    ->name('seller.')
    ->group(function () {
        Route::get('/dashboard', [SellerDashboardController::class, 'index'])->name('dashboard');

        // Shop Profile
        Route::get('/shop', [ShopController::class, 'edit'])->name('shop.edit');
        Route::put('/shop', [ShopController::class, 'update'])->name('shop.update');

        // Products
        Route::resource('products', ProductController::class);

        // Orders
        Route::get('/orders', [SellerOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [SellerOrderController::class, 'show'])->name('orders.show');
        Route::patch('/orders/{order}/status', [SellerOrderController::class, 'updateStatus'])->name('orders.status');

        // Discount Codes
        Route::resource('discounts', DiscountCodeController::class)->except(['show']);

        // Reports & Analytics
        Route::get('/reports', [SellerReportController::class, 'index'])->name('reports.index');
        Route::get('/reports/products', [SellerReportController::class, 'products'])->name('reports.products');

        // Inventory
        Route::get('/inventory', [SellerInventoryController::class, 'index'])->name('inventory.index');
        Route::get('/inventory/logs', [SellerInventoryController::class, 'logs'])->name('inventory.logs');
        Route::put('/inventory/{variant}', [SellerInventoryController::class, 'update'])->name('inventory.update');
        Route::patch('/inventory/{variant}/toggle-status', [SellerInventoryController::class, 'toggleStatus'])->name('inventory.toggle');
    });

/*
|--------------------------------------------------------------------------
| Customer Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:customer'])
    ->prefix('customer')
    ->name('customer.')
    ->group(function () {
        Route::get('/dashboard', [CustomerDashboardController::class, 'index'])->name('dashboard');

        // Browse & Shop
        Route::get('/browse', [BrowseController::class, 'index'])->name('browse');
        Route::get('/products/{product}', [BrowseController::class, 'show'])->name('products.show');
        Route::get('/shop/{sellerProfile}', [BrowseController::class, 'shop'])->name('shop');

        // Cart
        Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
        Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
        Route::patch('/cart/{cart}', [CartController::class, 'update'])->name('cart.update');
        Route::delete('/cart/{cart}', [CartController::class, 'destroy'])->name('cart.destroy');
        Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');

        // Checkout
        Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
        Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
        Route::post('/checkout/apply-discount', [CheckoutController::class, 'applyDiscount'])->name('checkout.applyDiscount');
        Route::delete('/checkout/remove-discount', [CheckoutController::class, 'removeDiscount'])->name('checkout.removeDiscount');

        // Wishlist
        Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
        Route::post('/wishlist/{product}', [WishlistController::class, 'toggle'])->name('wishlist.toggle');
        Route::delete('/wishlist/{wishlist}', [WishlistController::class, 'destroy'])->name('wishlist.destroy');

        // Orders
        Route::get('/orders', [CustomerOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [CustomerOrderController::class, 'show'])->name('orders.show');
        Route::patch('/orders/{order}/cancel', [CustomerOrderController::class, 'cancel'])->name('orders.cancel');

        // Profile
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
    });

/*
|--------------------------------------------------------------------------
| Logistics Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:logistics'])
    ->prefix('logistics')
    ->name('logistics.')
    ->group(function () {
        Route::get('/dashboard', [LogisticsDashboardController::class, 'index'])->name('dashboard');

        // Shipments
        Route::get('/shipments', [ShipmentController::class, 'index'])->name('shipments.index');
        Route::get('/shipments/{shipment}', [ShipmentController::class, 'show'])->name('shipments.show');
        Route::patch('/shipments/{shipment}/status', [ShipmentController::class, 'updateStatus'])->name('shipments.status');

        // Tracking Events
        Route::get('/shipments/{shipment}/tracking/create', [TrackingController::class, 'create'])->name('tracking.create');
        Route::post('/shipments/{shipment}/tracking', [TrackingController::class, 'store'])->name('tracking.store');

        // Proof of Delivery
        Route::get('/shipments/{shipment}/pod/create', [ProofOfDeliveryController::class, 'create'])->name('pod.create');
        Route::post('/shipments/{shipment}/pod', [ProofOfDeliveryController::class, 'store'])->name('pod.store');

        // Profile
        Route::get('/profile', [LogisticsProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/profile', [LogisticsProfileController::class, 'update'])->name('profile.update');

        // Delivery History
        Route::get('/history', [ShipmentController::class, 'history'])->name('history');
    });

/*
|--------------------------------------------------------------------------
| SPA Catch-All — Let React Router handle all remaining GET requests
|--------------------------------------------------------------------------
*/

Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*')->name('spa');
