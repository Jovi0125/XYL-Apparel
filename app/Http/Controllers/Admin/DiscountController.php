<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Discount;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiscountController extends Controller
{
    /**
     * Display a listing of discounts.
     */
    public function index()
    {
        $discounts = Discount::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/DiscountsIndex', [
            'discounts' => $discounts,
        ]);
    }

    /**
     * Store a newly created discount.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'code' => 'required|string|max:50|unique:discounts,code',
            'description' => 'nullable|string|max:1000',
            'usage_limit' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date|after_or_equal:today',
            'status' => 'required|in:active,inactive',
        ]);

        // Additional validation for percentage type
        if ($validated['type'] === 'percentage' && $validated['value'] > 100) {
            return back()->withErrors([
                'value' => 'Percentage discount cannot exceed 100%.',
            ]);
        }

        // Convert code to uppercase
        $validated['code'] = strtoupper($validated['code']);

        Discount::create($validated);

        return redirect()->back()->with('success', 'Discount code created successfully.');
    }

    /**
     * Update the specified discount.
     */
    public function update(Request $request, Discount $discount)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'code' => 'required|string|max:50|unique:discounts,code,' . $discount->id,
            'description' => 'nullable|string|max:1000',
            'usage_limit' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date',
            'status' => 'required|in:active,inactive',
        ]);

        // Additional validation for percentage type
        if ($validated['type'] === 'percentage' && $validated['value'] > 100) {
            return back()->withErrors([
                'value' => 'Percentage discount cannot exceed 100%.',
            ]);
        }

        // Convert code to uppercase
        $validated['code'] = strtoupper($validated['code']);

        $discount->update($validated);

        return redirect()->back()->with('success', 'Discount code updated successfully.');
    }

    /**
     * Remove the specified discount.
     */
    public function destroy(Discount $discount)
    {
        $discount->delete();

        return redirect()->back()->with('success', 'Discount code deleted successfully.');
    }

    /**
     * Validate a discount code (for checkout).
     */
    public function validate(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $discount = Discount::where('code', strtoupper($request->code))
            ->valid()
            ->first();

        if (!$discount) {
            return response()->json([
                'valid' => false,
                'message' => 'Invalid or expired discount code.',
            ], 422);
        }

        $discountAmount = $discount->calculateDiscount($request->subtotal);

        return response()->json([
            'valid' => true,
            'discount' => [
                'id' => $discount->id,
                'title' => $discount->title,
                'code' => $discount->code,
                'type' => $discount->type,
                'value' => $discount->value,
                'discount_amount' => $discountAmount,
            ],
        ]);
    }
}
