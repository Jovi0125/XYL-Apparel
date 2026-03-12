<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\SellerProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ShopController extends Controller
{
    public function edit(Request $request)
    {
        $seller = Auth::user()->sellerProfile;

        if ($request->expectsJson()) {
            return response()->json(compact('seller'));
        }

        return view('welcome');
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'shop_name' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'address' => ['nullable', 'string', 'max:500'],
            'city' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'website' => ['nullable', 'url', 'max:255'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'banner' => ['nullable', 'image', 'max:4096'],
        ]);

        $seller = Auth::user()->sellerProfile;

        // Create profile if it doesn't exist
        if (!$seller) {
            $data['user_id'] = Auth::id();
            $data['slug'] = Str::slug($data['shop_name']);
            $data['status'] = 'pending';

            if ($request->hasFile('logo')) {
                $data['logo'] = $request->file('logo')->store('sellers/logos', 'public');
            }
            if ($request->hasFile('banner')) {
                $data['banner'] = $request->file('banner')->store('sellers/banners', 'public');
            }

            SellerProfile::create($data);

            if ($request->expectsJson()) {
                return response()->json(['success' => true, 'message' => 'Shop profile created! Waiting for admin approval.']);
            }

            return redirect()->route('seller.shop.edit')
                ->with('success', 'Shop profile created! Waiting for admin approval.');
        }

        // Update existing profile
        $data['slug'] = Str::slug($data['shop_name']);

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('sellers/logos', 'public');
        } else {
            unset($data['logo']);
        }

        if ($request->hasFile('banner')) {
            $data['banner'] = $request->file('banner')->store('sellers/banners', 'public');
        } else {
            unset($data['banner']);
        }

        $seller->update($data);

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Shop profile updated successfully.']);
        }

        return redirect()->route('seller.shop.edit')
            ->with('success', 'Shop profile updated successfully.');
    }
}
