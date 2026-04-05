<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Obtain the user information from Google.
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            // Strictly enforce role = buyer for any user coming through Google
            $user = User::updateOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName(),
                    'password' => Str::random(24), // Random password for social logins
                    'role' => User::ROLE_BUYER,
                    'status' => 'active',
                    'email_verified_at' => now(), // Google emails are already verified
                ]
            );

            // Safety Check: Never allow admins or logistics to be hi-jacked by Google OAuth 
            // if their email happens to match but they aren't buyers
            if ($user->role !== User::ROLE_BUYER) {
                return redirect('/login')->withErrors([
                    'email' => 'Staff accounts cannot use Google authentication.',
                ]);
            }

            Auth::login($user);

            return redirect('/buyer/dashboard');

        } catch (\Exception $e) {
            return redirect('/login')->withErrors([
                'email' => 'Google authentication failed. Please try again.',
            ]);
        }
    }
}
