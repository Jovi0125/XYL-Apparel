<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Middleware\HandleInertiaRequests;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);

        $middleware->alias([
            'role' => RoleMiddleware::class,
        ]);

        // Redirect authenticated users away from guest routes (like login)
        $middleware->redirectGuestsTo('/login');
        $middleware->redirectUsersTo(function (Request $request) {
            $user = $request->user();
            if ($user) {
                return match ($user->role) {
                    'admin' => '/admin/dashboard',
                    'buyer' => '/buyer/dashboard',
                    'logistics' => '/logistics/dashboard',
                    default => '/login',
                };
            }
            return '/login';
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
