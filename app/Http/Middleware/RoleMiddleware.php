<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles  Allowed roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!Auth::check()) {
            return redirect('/login');
        }

        $user = Auth::user();

        // Check if user has one of the allowed roles
        if (!in_array($user->role, $roles)) {
            // Redirect to appropriate dashboard based on role
            return match ($user->role) {
                'admin' => redirect('/admin/dashboard'),
                'buyer' => redirect('/buyer/dashboard'),
                'logistics' => redirect('/logistics/dashboard'),
                default => redirect('/login'),
            };
        }

        // Check if user is active
        if (!$user->isActive()) {
            Auth::logout();
            return redirect('/login')->withErrors([
                'email' => 'Your account is not active.',
            ]);
        }

        return $next($request);
    }
}
