<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\Models\LogisticsProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    /**
     * Show the logistics profile edit form.
     */
    public function edit(Request $request)
    {
        $profile = Auth::user()->logisticsProfile;

        if ($request->expectsJson()) {
            return response()->json(compact('profile'));
        }

        return view('welcome');
    }

    /**
     * Update or create the logistics profile.
     */
    public function update(Request $request)
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

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Profile updated successfully.']);
        }

        return back()->with('success', 'Profile updated successfully.');
    }
}
