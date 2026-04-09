<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Order;
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
        $orders = Order::with(['product.mainImage', 'product.images', 'shipment'])
            ->where('buyer_id', Auth::id())
            ->latest()
            ->get();

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

        $order->load(['product.mainImage', 'product.images', 'shipment']);

        return Inertia::render('Storefront/OrderDetail', [
            'order' => $order,
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

        $order->load(['product.mainImage', 'product.images', 'shipment']);

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
            'birthday' => ['nullable', 'date'],
            'gender' => ['nullable', 'in:male,female,other'],
        ]);

        Auth::user()->update($request->only(['name', 'postal_code', 'birthday', 'gender']));

        return back()->with('success', 'Profile updated successfully.');
    }
}
