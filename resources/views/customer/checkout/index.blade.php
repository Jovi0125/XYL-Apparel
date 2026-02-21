@extends('layouts.dashboard')

@section('page-title', 'Checkout')

@section('sidebar')
@include('customer.partials.sidebar')
@endsection

@section('content')
<form action="{{ route('customer.checkout.store') }}" method="POST">
    @csrf

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {{-- Left: Shipping & Items --}}
        <div class="lg:col-span-2 space-y-6">
            {{-- Shipping Information --}}
            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 class="text-base font-semibold text-gray-900 mb-4">Shipping Information</h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name <span class="text-red-500">*</span></label>
                        <input type="text" name="shipping_name" value="{{ old('shipping_name', auth()->user()->name) }}"
                            class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
                        @error('shipping_name') <p class="text-xs text-red-500 mt-1">{{ $message }}</p> @enderror
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone <span class="text-red-500">*</span></label>
                        <input type="text" name="shipping_phone" value="{{ old('shipping_phone', auth()->user()->phone) }}"
                            class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
                        @error('shipping_phone') <p class="text-xs text-red-500 mt-1">{{ $message }}</p> @enderror
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address <span class="text-red-500">*</span></label>
                        <textarea name="shipping_address" rows="2"
                            class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">{{ old('shipping_address') }}</textarea>
                        @error('shipping_address') <p class="text-xs text-red-500 mt-1">{{ $message }}</p> @enderror
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">City <span class="text-red-500">*</span></label>
                        <input type="text" name="shipping_city" value="{{ old('shipping_city') }}"
                            class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
                        @error('shipping_city') <p class="text-xs text-red-500 mt-1">{{ $message }}</p> @enderror
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                        <input type="text" name="notes" value="{{ old('notes') }}" placeholder="Special instructions..."
                            class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
                    </div>
                </div>
            </div>

            {{-- Order Items by Seller --}}
            @foreach($grouped as $sellerProfileId => $items)
            @php
                $seller = $items->first()->product->sellerProfile;
                $groupSubtotal = $items->sum(function ($item) {
                    $price = $item->variant && $item->variant->price_override
                        ? $item->variant->price_override
                        : $item->product->effective_price;
                    return $price * $item->quantity;
                });
            @endphp
            <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div class="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-700">{{ $seller->shop_name ?? 'Unknown Shop' }}</span>
                    <span class="text-xs text-gray-400 ml-auto">{{ $items->count() }} item(s)</span>
                </div>
                <div class="divide-y divide-gray-50">
                    @foreach($items as $item)
                    @php
                        $unitPrice = $item->variant && $item->variant->price_override
                            ? $item->variant->price_override
                            : $item->product->effective_price;
                    @endphp
                    <div class="px-6 py-3 flex items-center gap-4">
                        <div class="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                            @if($item->product->primaryImage)
                                <img src="{{ asset('storage/' . $item->product->primaryImage->path) }}" alt="" class="w-full h-full object-cover" />
                            @endif
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 line-clamp-1">{{ $item->product->name }}</p>
                            @if($item->variant)
                                <p class="text-xs text-gray-500">{{ $item->variant->label }}</p>
                            @endif
                        </div>
                        <div class="text-right text-sm flex-shrink-0">
                            <p class="text-gray-500">x{{ $item->quantity }}</p>
                            <p class="font-medium text-gray-900">₱{{ number_format($unitPrice * $item->quantity, 2) }}</p>
                        </div>
                    </div>
                    @endforeach
                </div>
                <div class="px-6 py-3 bg-gray-50 border-t border-gray-100 text-right">
                    <span class="text-sm text-gray-500">Subtotal:</span>
                    <span class="text-sm font-semibold text-gray-900 ml-2">₱{{ number_format($groupSubtotal, 2) }}</span>
                </div>
            </div>
            @endforeach
        </div>

        {{-- Right: Summary --}}
        <div class="lg:col-span-1">
            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-6">
                <h2 class="text-base font-semibold text-gray-900 mb-4">Order Summary</h2>

                {{-- Discount Code --}}
                <div class="mb-4">
                    @if(session('discount_code'))
                        <div class="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
                            <span class="text-green-800 font-medium">{{ session('discount_code') }}</span>
                            <form action="{{ route('customer.checkout.removeDiscount') }}" method="POST" class="inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="text-green-600 hover:text-red-500 ml-2">&times;</button>
                            </form>
                        </div>
                    @else
                        <div class="flex gap-2">
                            <input type="text" form="discount-form" name="code" placeholder="Discount code"
                                class="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900" />
                            <button type="submit" form="discount-form"
                                class="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition">Apply</button>
                        </div>
                    @endif
                </div>

                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-500">Subtotal</span>
                        <span class="font-medium text-gray-900">₱{{ number_format($subtotal, 2) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">Shipping (per seller)</span>
                        <span class="text-gray-600">₱{{ number_format($shippingFee, 2) }}</span>
                    </div>
                    @if($grouped->count() > 1)
                    <div class="flex justify-between text-xs text-gray-400">
                        <span>× {{ $grouped->count() }} sellers</span>
                        <span>₱{{ number_format($shippingFee * $grouped->count(), 2) }}</span>
                    </div>
                    @endif
                </div>

                <div class="border-t border-gray-100 mt-4 pt-4 flex justify-between">
                    <span class="font-semibold text-gray-900">Total</span>
                    <span class="text-lg font-bold text-gray-900">₱{{ number_format($subtotal + ($shippingFee * $grouped->count()), 2) }}</span>
                </div>

                {{-- Payment Method --}}
                <div class="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p class="text-xs font-medium text-gray-500 mb-1">Payment Method</p>
                    <div class="flex items-center gap-2">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span class="text-sm text-gray-700">Cash on Delivery (COD)</span>
                    </div>
                </div>

                <button type="submit"
                    class="mt-4 w-full px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition">
                    Place Order
                </button>

                <a href="{{ route('customer.cart.index') }}" class="mt-2 w-full inline-flex justify-center text-sm text-gray-500 hover:text-gray-900 transition">
                    Back to Cart
                </a>
            </div>
        </div>
    </div>
</form>

{{-- Separate discount form --}}
<form id="discount-form" action="{{ route('customer.checkout.applyDiscount') }}" method="POST">
    @csrf
</form>
@endsection
