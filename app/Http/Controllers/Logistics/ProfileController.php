<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\Models\LogisticsProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class ProfileController extends Controller
{
    /**
     * Show the logistics profile edit form.
     */
    public function edit(): View
    {
        $profile = Auth::user()->logisticsProfile;

        return view('logistics.profile.edit', compact('profile'));
    }

    /**
     * Update or create the logistics profile.
     */
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'service_area' => 'nullable|string|max:500',
        ]);

        LogisticsProfile::updateOrCreate(
            ['user_id' => Auth::id()],
            [
                'name' => $request->name,
                'phone' => $request->phone,
                'service_area' => $request->service_area,
                'status' => 'active',
            ]
        );

        return back()->with('success', 'Profile updated successfully.');
    }
}
