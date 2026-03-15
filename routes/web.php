<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Customer\DashboardController as CustomerDashboardController;
use App\Http\Controllers\Customer\BrowseController;
use App\Http\Controllers\Customer\CartController;
use App\Http\Controllers\Customer\CheckoutController;
use App\Http\Controllers\Customer\WishlistController;
use App\Http\Controllers\Customer\OrderController as CustomerOrderController;
use App\Http\Controllers\Customer\ProfileController;
use App\Http\Controllers\Inventory\DashboardController as InventoryDashboardController;
use App\Http\Controllers\Inventory\InventoryController;
use App\Http\Controllers\Inventory\ProductController as InventoryProductController;
use App\Http\Controllers\Inventory\StockAdjustmentController;
use App\Http\Controllers\Inventory\StockReceivingController;
use App\Http\Controllers\Inventory\WarehouseController;
use App\Http\Controllers\Fulfillment\DashboardController as FulfillmentDashboardController;
use App\Http\Controllers\Fulfillment\FulfillmentController;
use App\Http\Controllers\Fulfillment\ShipmentController;
use App\Http\Controllers\Fulfillment\TrackingController;
use App\Http\Controllers\Fulfillment\ProofOfDeliveryController;
use App\Http\Controllers\Support\DashboardController as SupportDashboardController;
use App\Http\Controllers\Support\SupportTicketController;
use App\Http\Controllers\Support\SupportMessageController;
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

        // Orders
        Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');

        // Settings
        Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
        Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');

        // Reports & Analytics
        Route::get('/reports', [AdminReportController::class, 'index'])->name('reports.index');
        Route::get('/reports/products', [AdminReportController::class, 'products'])->name('reports.products');
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
| Inventory Staff Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:inventory_staff'])
    ->prefix('inventory')
    ->name('inventory.')
    ->group(function () {
        Route::get('/dashboard', [InventoryDashboardController::class, 'index'])->name('dashboard');

        // Products (catalog management)
        Route::resource('products', InventoryProductController::class);

        // Inventory (stock levels)
        Route::get('/stock', [InventoryController::class, 'index'])->name('stock.index');
        Route::get('/stock/{inventoryItem}', [InventoryController::class, 'show'])->name('stock.show');
        Route::patch('/stock/{inventoryItem}', [InventoryController::class, 'update'])->name('stock.update');

        // Stock Adjustment
        Route::post('/stock-adjustment', [StockAdjustmentController::class, 'store'])->name('stock-adjustment.store');

        // Stock Receiving
        Route::get('/receiving', [StockReceivingController::class, 'index'])->name('receiving.index');
        Route::post('/receiving', [StockReceivingController::class, 'store'])->name('receiving.store');

        // Warehouses
        Route::resource('warehouses', WarehouseController::class);
    });

/*
|--------------------------------------------------------------------------
| Fulfillment Staff Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:fulfillment_staff'])
    ->prefix('fulfillment')
    ->name('fulfillment.')
    ->group(function () {
        Route::get('/dashboard', [FulfillmentDashboardController::class, 'index'])->name('dashboard');

        // Fulfillment Workflow
        Route::get('/orders', [FulfillmentController::class, 'index'])->name('orders.index');
        Route::get('/orders/{fulfillment}', [FulfillmentController::class, 'show'])->name('orders.show');
        Route::patch('/orders/{fulfillment}/status', [FulfillmentController::class, 'updateStatus'])->name('orders.status');
        Route::patch('/orders/{fulfillment}/assign', [FulfillmentController::class, 'assign'])->name('orders.assign');

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
    });

/*
|--------------------------------------------------------------------------
| Support Staff Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:support_staff'])
    ->prefix('support')
    ->name('support.')
    ->group(function () {
        Route::get('/dashboard', [SupportDashboardController::class, 'index'])->name('dashboard');

        // Tickets
        Route::get('/tickets', [SupportTicketController::class, 'index'])->name('tickets.index');
        Route::get('/tickets/{ticket}', [SupportTicketController::class, 'show'])->name('tickets.show');
        Route::post('/tickets', [SupportTicketController::class, 'store'])->name('tickets.store');
        Route::patch('/tickets/{ticket}', [SupportTicketController::class, 'update'])->name('tickets.update');

        // Messages
        Route::post('/tickets/{ticket}/messages', [SupportMessageController::class, 'store'])->name('messages.store');
    });

/*
|--------------------------------------------------------------------------
| SPA Catch-All — Let React Router handle all remaining GET requests
|--------------------------------------------------------------------------
*/

Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*')->name('spa');
