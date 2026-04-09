<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Store a product review (only for delivered orders).
     */
    public function store(Request $request, Order $order)
    {
        // Must be the buyer of this order
        if ($order->buyer_id !== Auth::id()) {
            abort(403);
        }

        // Must be delivered
        if (!$order->shipment || $order->shipment->status !== 'delivered') {
            return back()->with('error', 'You can only review delivered orders.');
        }

        // Check if already reviewed this product from this order
        $existing = Review::where('buyer_id', Auth::id())
            ->where('product_id', $order->product_id)
            ->first();

        if ($existing) {
            return back()->with('error', 'You have already reviewed this product.');
        }

        $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        Review::create([
            'buyer_id' => Auth::id(),
            'product_id' => $order->product_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'is_approved' => true,
        ]);

        return back()->with('success', 'Thank you for your review!');
    }
}
