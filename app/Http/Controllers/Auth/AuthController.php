<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    /**
     * Show the buyer/public login page
     */
    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Show the admin-specific login page
     */
    public function showAdminLogin(): Response
    {
        return Inertia::render('Auth/AdminLogin');
    }

    /**
     * Show the logistics-specific login page
     */
    public function showLogisticsLogin(): Response
    {
        return Inertia::render('Auth/LogisticsLogin');
    }

    /**
     * Show the buyer registration page
     */
    public function showRegister(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle login request with role enforcement
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $remember = $request->boolean('remember');

        if (Auth::attempt($credentials, $remember)) {
            $user = Auth::user();

            // Check Path-Role Consistency
            // Admin only at /admin/login
            if ($request->is('admin/*') && !$user->isAdmin()) {
                Auth::logout();
                return back()->withErrors(['email' => 'Access denied. Use the buyer login page.']);
            }
            
            // Logistics only at /logistics/login
            if ($request->is('logistics/*') && !$user->isLogistics()) {
                Auth::logout();
                return back()->withErrors(['email' => 'Access denied. Use the buyer login page.']);
            }

            // Buyer only at /login (strict if needed, but usually buyers can login anywhere)
            if ($request->is('login') && ($user->isAdmin() || $user->isLogistics())) {
                Auth::logout();
                return back()->withErrors(['email' => 'Staff accounts must use their dedicated portals.']);
            }

            if (!$user->isActive()) {
                Auth::logout();
                return back()->withErrors(['email' => 'Your account is not active. Please contact support.']);
            }

            $request->session()->regenerate();
            return $this->redirectBasedOnRole($user);
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    /**
     * Handle public buyer registration
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'birthday' => ['nullable', 'date'],
            'gender' => ['nullable', 'in:male,female,other'],
            'terms' => ['accepted'],
        ]);

        $user = \App\Models\User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password, // Hashed via cast
            'role' => \App\Models\User::ROLE_BUYER, // FORCE role = buyer
            'postal_code' => $request->postal_code,
            'birthday' => $request->birthday,
            'gender' => $request->gender,
            'terms_accepted' => true,
            'terms_accepted_at' => now(),
            'status' => 'active', // Set to active until Brevo flow is connected
        ]);

        // Brevo Placeholder: Send Verification/Welcome email
        // event(new \Illuminate\Auth\Events\Registered($user));

        Auth::login($user);

        return redirect('/buyer/dashboard');
    }

    /**
     * Handle logout request
     */
    public function logout(Request $request)
    {
        $role = Auth::user()?->role;
        
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Redirect based on the logged-out user's role
        return match ($role) {
            'admin' => redirect('/admin/login'),
            'logistics' => redirect('/logistics/login'),
            default => redirect('/ph/en/login'),
        };
    }

    /**
     * Redirect user based on their role
     */
    protected function redirectBasedOnRole($user)
    {
        return match ($user->role) {
            'admin' => redirect()->intended('/admin/dashboard'),
            'buyer' => redirect()->intended('/ph/en'),
            'logistics' => redirect()->intended('/logistics/dashboard'),
            default => redirect('/ph/en/login'),
        };
    }
}
