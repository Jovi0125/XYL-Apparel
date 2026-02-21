<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\DiscountCodeRequest;
use App\Models\DiscountCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class DiscountCodeController extends Controller
{
    private function seller()
    {
        return Auth::user()->sellerProfile;
    }

    public function index(Request $request): View
    {
        $seller = $this->seller();

        $discounts = DiscountCode::where('seller_profile_id', $seller->id)
            ->when($request->search, fn ($q, $s) => $q->where('code', 'like', "%{$s}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return view('seller.discounts.index', compact('discounts'));
    }

    public function create(): View
    {
        return view('seller.discounts.create');
    }

    public function store(DiscountCodeRequest $request): RedirectResponse
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

        return redirect()->route('seller.discounts.index')
            ->with('success', 'Discount code created successfully.');
    }

    public function edit(DiscountCode $discount): View
    {
        $seller = $this->seller();
        abort_if($discount->seller_profile_id !== $seller->id, 403);

        return view('seller.discounts.edit', compact('discount'));
    }

    public function update(DiscountCodeRequest $request, DiscountCode $discount): RedirectResponse
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

        return redirect()->route('seller.discounts.index')
            ->with('success', 'Discount code updated successfully.');
    }

    public function destroy(DiscountCode $discount): RedirectResponse
    {
        $seller = $this->seller();
        abort_if($discount->seller_profile_id !== $seller->id, 403);

        $discount->delete();

        return redirect()->route('seller.discounts.index')
            ->with('success', 'Discount code deleted successfully.');
    }
}
