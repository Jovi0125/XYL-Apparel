<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MemberController extends Controller
{
    /**
     * UNIQLO-style member profile page.
     */
    public function index()
    {
        $user = Auth::user();

        $orderCount = Order::where('buyer_id', $user->id)->count();

        return Inertia::render('Storefront/Profile', [
            'user' => $user,
            'orderCount' => $orderCount,
        ]);
    }

    /**
     * My Orders page.
     */
    public function orders()
    {
        $orders = Order::with(['product.mainImage', 'product.images', 'shipment.rider'])
            ->where('buyer_id', Auth::id())
            ->latest()
            ->get();

        // Get product IDs the buyer has reviewed
        $reviewedProductIds = Review::where('buyer_id', Auth::id())
            ->pluck('product_id')
            ->toArray();

        // Attach has_reviewed flag to each order
        $orders->each(function ($order) use ($reviewedProductIds) {
            $order->has_reviewed = in_array($order->product_id, $reviewedProductIds);
        });

        return Inertia::render('Storefront/MyOrders', [
            'orders' => $orders,
        ]);
    }

    /**
     * Single order detail.
     */
    public function orderDetail(Order $order)
    {
        if ($order->buyer_id !== Auth::id()) {
            abort(403);
        }

        $order->load(['product.mainImage', 'product.images', 'shipment.rider']);

        $hasReviewed = Review::where('buyer_id', Auth::id())
            ->where('product_id', $order->product_id)
            ->exists();

        return Inertia::render('Storefront/OrderDetail', [
            'order' => $order,
            'hasReviewed' => $hasReviewed,
        ]);
    }

    /**
     * Order receipt (only for delivered orders).
     */
    public function receipt(Order $order)
    {
        if ($order->buyer_id !== Auth::id()) {
            abort(403);
        }

        $order->load(['product.mainImage', 'product.images', 'shipment.rider']);

        // Only show receipt for delivered orders
        if (!$order->shipment || $order->shipment->status !== 'delivered') {
            return redirect()->route('store.profile.order', $order->id)
                ->with('error', 'Receipt is only available for delivered orders.');
        }

        return Inertia::render('Storefront/Receipt', [
            'order' => $order,
        ]);
    }

    /**
     * Update profile information.
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'contact_number' => ['nullable', 'string', 'max:20'],
            'birthday' => ['nullable', 'date'],
            'gender' => ['nullable', 'in:male,female,other'],
        ]);

        Auth::user()->update($request->only(['name', 'postal_code', 'address', 'contact_number', 'birthday', 'gender']));

        return back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Change password.
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'string', 'min:8', 'max:16', 'confirmed', 'regex:/[A-Z]/', 'regex:/[0-9]/'],
        ], [
            'current_password.current_password' => 'The current password is incorrect.',
            'password.regex' => 'Password must contain at least one uppercase letter and one number.',
        ]);

        Auth::user()->update([
            'password' => $request->password,
        ]);

        return back()->with('success', 'Password changed successfully.');
    }
}
