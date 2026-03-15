<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function showLoginForm()
    {
        return view('welcome');
    }

    public function login(LoginRequest $request): JsonResponse|RedirectResponse
    {
        $credentials = $request->only('email', 'password');

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            if ($request->expectsJson()) {
                return response()->json(['errors' => ['email' => ['The provided credentials do not match our records.']]], 422);
            }
            return back()->withErrors(['email' => 'The provided credentials do not match our records.'])->onlyInput('email');
        }

        $user = Auth::user();

        if ($user->is_banned) {
            Auth::logout();
            if ($request->expectsJson()) {
                return response()->json(['errors' => ['email' => ['Your account has been suspended.']]], 403);
            }
            return redirect()->route('login')->with('error', 'Your account has been suspended.');
        }

        $request->session()->regenerate();

        $redirect = match ($user->role) {
            'admin'            => '/admin/dashboard',
            'inventory_staff'  => '/inventory/dashboard',
            'fulfillment_staff' => '/fulfillment/dashboard',
            'support_staff'    => '/support/dashboard',
            default            => '/customer/dashboard',
        };

        if ($request->expectsJson()) {
            return response()->json(['redirect' => $redirect, 'user' => $user]);
        }

        return redirect($redirect);
    }
}
