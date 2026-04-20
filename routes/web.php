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
use App\Http\Controllers\Storefront\NavigationController;
use App\Http\Controllers\Storefront\ProductController as StorefrontProductController;
use App\Http\Controllers\Storefront\CartController;
use App\Http\Controllers\Storefront\CheckoutController;
use App\Http\Controllers\Storefront\MemberController;
use App\Http\Controllers\Storefront\WishlistController;
use App\Http\Controllers\Storefront\ReviewController as StorefrontReviewController;
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

    // Localized Parent Navigation / Search Overlay Routes (-navi suffix)
    Route::get('/women-navi', [NavigationController::class, 'index'])->defaults('parent', 'women')->name('store.women.navi');
    Route::get('/men-navi', [NavigationController::class, 'index'])->defaults('parent', 'men')->name('store.men.navi');
    Route::get('/unisex-navi', [NavigationController::class, 'index'])->defaults('parent', 'unisex')->name('store.unisex.navi');

    // Child category routes (Navi detailed experience)
    Route::get('/women-navi/{category:slug}', [NavigationController::class, 'index'])->defaults('parent', 'women')->name('store.women.navi.category');
    Route::get('/men-navi/{category:slug}', [NavigationController::class, 'index'])->defaults('parent', 'men')->name('store.men.navi.category');
    Route::get('/unisex-navi/{category:slug}', [NavigationController::class, 'index'])->defaults('parent', 'unisex')->name('store.unisex.navi.category');

    // Product Browsing (public)
    Route::get('/products/{parentCategory}', [StorefrontProductController::class, 'index'])->name('store.products');
    Route::get('/product/{product}', [StorefrontProductController::class, 'show'])->name('store.product.show');

    // Search & Wishlist placeholders
    Route::get('/search', [HomeController::class, 'index'])->name('store.search');
    // Wishlist (public view redirects to login if not authenticated)
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('store.wishlist')->middleware('auth');
    Route::post('/wishlist/toggle', [WishlistController::class, 'toggle'])->name('store.wishlist.toggle')->middleware('auth');
    Route::delete('/wishlist/{wishlist}', [WishlistController::class, 'destroy'])->name('store.wishlist.remove')->middleware('auth');

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

    /*
    |--------------------------------------------------------------------------
    | Authenticated Buyer Routes (within /ph/en)
    |--------------------------------------------------------------------------
    */
    Route::middleware('auth')->group(function () {
        // Shopping Cart
        Route::get('/cart', [CartController::class, 'index'])->name('store.cart');
        Route::post('/cart', [CartController::class, 'store'])->name('store.cart.add');
        Route::patch('/cart/{cartItem}', [CartController::class, 'update'])->name('store.cart.update');
        Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('store.cart.remove');
        Route::post('/cart/clear', [CartController::class, 'clear'])->name('store.cart.clear');

        // Checkout
        Route::get('/checkout', [CheckoutController::class, 'index'])->name('store.checkout');
        Route::post('/checkout', [CheckoutController::class, 'store'])->name('store.checkout.process');

        // Member Profile (UNIQLO-style)
        Route::get('/profile', [MemberController::class, 'index'])->name('store.profile');
        Route::put('/profile', [MemberController::class, 'updateProfile'])->name('store.profile.update');
        Route::put('/profile/password', [MemberController::class, 'changePassword'])->name('store.profile.password');
        Route::get('/profile/orders', [MemberController::class, 'orders'])->name('store.profile.orders');
        Route::get('/profile/orders/{order}', [MemberController::class, 'orderDetail'])->name('store.profile.order');
        Route::get('/profile/orders/{order}/receipt', [MemberController::class, 'receipt'])->name('store.profile.order.receipt');
        Route::post('/profile/orders/{order}/review', [StorefrontReviewController::class, 'store'])->name('store.profile.order.review');
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

        // Orders Management (Approve / Reject)
        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        Route::post('/orders/{order}/approve', [OrderController::class, 'approveOrder'])->name('orders.approve');
        Route::post('/orders/{order}/reject', [OrderController::class, 'rejectOrder'])->name('orders.reject');

        // Shipment Tracking (Read-only monitoring)
        Route::get('/shipments', [ShipmentController::class, 'index'])->name('shipments.index');

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
        Route::post('/shipments/{order}/update-status', [LogisticsDashboardController::class, 'updateStatus'])->name('shipments.updateStatus');
    });

/*
|--------------------------------------------------------------------------
| Default Redirect Fallbacks
|--------------------------------------------------------------------------
*/
