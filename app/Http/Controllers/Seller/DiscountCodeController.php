<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\DiscountCodeRequest;
use App\Models\DiscountCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DiscountCodeController extends Controller
{
    private function seller()
    {
        return Auth::user()->sellerProfile;
    }

    public function index(Request $request)
    {
        $seller = $this->seller();

        $discounts = DiscountCode::where('seller_profile_id', $seller->id)
            ->when($request->search, fn ($q, $s) => $q->where('code', 'like', "%{$s}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        if ($request->expectsJson()) {
            return response()->json(compact('discounts'));
        }

        return view('welcome');
    }

    public function create(Request $request)
    {
        if ($request->expectsJson()) {
            return response()->json([]);
        }

        return view('welcome');
    }

    public function store(DiscountCodeRequest $request)
    {
        $seller = $this->seller();

        DiscountCode::create([
            'seller_profile_id' => $seller->id,
            'code' => strtoupper($request->code),
            'type' => $request->type,
            'value' => $request->value,
            'min_order_amount' => $request->min_order_amount,
            'max_uses' => $request->max_uses,
            'starts_at' => $request->starts_at,
            'expires_at' => $request->expires_at,
            'is_active' => $request->boolean('is_active', true),
        ]);

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Discount code created successfully.']);
        }

        return redirect()->route('seller.discounts.index')
            ->with('success', 'Discount code created successfully.');
    }

    public function edit(Request $request, DiscountCode $discount)
    {
        $seller = $this->seller();
        abort_if($discount->seller_profile_id !== $seller->id, 403);

        if ($request->expectsJson()) {
            return response()->json(compact('discount'));
        }

        return view('welcome');
    }

    public function update(DiscountCodeRequest $request, DiscountCode $discount)
    {
        $seller = $this->seller();
        abort_if($discount->seller_profile_id !== $seller->id, 403);

        $discount->update([
            'code' => strtoupper($request->code),
            'type' => $request->type,
            'value' => $request->value,
            'min_order_amount' => $request->min_order_amount,
            'max_uses' => $request->max_uses,
            'starts_at' => $request->starts_at,
            'expires_at' => $request->expires_at,
            'is_active' => $request->boolean('is_active', true),
        ]);

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Discount code updated successfully.']);
        }

        return redirect()->route('seller.discounts.index')
            ->with('success', 'Discount code updated successfully.');
    }

    public function destroy(Request $request, DiscountCode $discount)
    {
        $seller = $this->seller();
        abort_if($discount->seller_profile_id !== $seller->id, 403);

        $discount->delete();

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Discount code deleted successfully.']);
        }

        return redirect()->route('seller.discounts.index')
            ->with('success', 'Discount code deleted successfully.');
    }
}
