<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class RegisterController extends Controller
{
    public function showRegistrationForm()
    {
        return view('welcome');
    }

    public function register(RegisterRequest $request): JsonResponse|RedirectResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => $request->password,
            'role' => $request->role,
        ]);

        Auth::login($user);

        $redirect = match ($user->role) {
            'seller' => '/seller/dashboard',
            default => '/dashboard',
        };

        if ($request->expectsJson()) {
            return response()->json(['redirect' => $redirect, 'user' => $user]);
        }

        return redirect($redirect);
    }
}
