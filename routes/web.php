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
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Guest Routes
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
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
| Default Redirect
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return redirect('/login');
});
