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
            // Path-aware redirection for unauthenticated guests
            if ($request->is('admin/*')) {
                return redirect('/admin/login');
            }
            if ($request->is('logistics/*')) {
                return redirect('/logistics/login');
            }
            if ($request->is('rider/*')) {
                return redirect('/rider/login');
            }
            return redirect('/login');
        }

        $user = Auth::user();

        // Check if user has one of the allowed roles
        if (!in_array($user->role, $roles)) {
            // Redirect to appropriate dashboard based on their current role
            return match ($user->role) {
                'admin'     => redirect('/admin/dashboard'),
                'buyer'     => redirect('/buyer/dashboard'),
                'logistics' => redirect('/logistics/dashboard'),
                'rider'     => redirect('/rider/dashboard'),
                default     => redirect('/login'),
            };
        }

        // Check if user is active
        if (!$user->isActive()) {
            Auth::logout();
            
            // Re-detect redirection after logout
            if ($request->is('admin/*')) {
                return redirect('/admin/login')->withErrors(['email' => 'Account inactive.']);
            }
            if ($request->is('logistics/*')) {
                return redirect('/logistics/login')->withErrors(['email' => 'Account inactive.']);
            }
            if ($request->is('rider/*')) {
                return redirect('/rider/login')->withErrors(['email' => 'Account inactive.']);
            }
            return redirect('/login')->withErrors(['email' => 'Your account is not active.']);
        }

        return $next($request);
    }
}
