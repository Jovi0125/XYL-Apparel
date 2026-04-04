<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\DashboardController;
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
        
        // Future admin routes will go here:
        // Route::resource('products', ProductController::class);
        // Route::resource('categories', CategoryController::class);
        // Route::resource('orders', OrderController::class);
        // Route::resource('shipments', ShipmentController::class);
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
        // Route::get('/dashboard', [BuyerDashboardController::class, 'index'])->name('dashboard');
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
        // Route::get('/dashboard', [LogisticsDashboardController::class, 'index'])->name('dashboard');
    });

/*
|--------------------------------------------------------------------------
| Default Redirect
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return redirect('/login');
});
