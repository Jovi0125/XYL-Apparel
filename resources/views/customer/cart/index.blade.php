@extends('layouts.dashboard')

@section('page-title', 'Shopping Cart')

@section('sidebar')
@include('customer.partials.sidebar')
@endsection

@section('content')
@if($cartItems->count())
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {{-- Cart Items --}}
    <div class="lg:col-span-2 space-y-3">
        @foreach($cartItems as $item)
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-4">
            {{-- Image --}}
            <div class="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                @if($item->product->primaryImage)
                    <img src="{{ asset('storage/' . $item->product->primaryImage->path) }}" alt="{{ $item->product->name }}"
                        class="w-full h-full object-cover" />
                @else
                    <div class="w-full h-full flex items-center justify-center text-gray-300">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                @endif
            </div>

            {{-- Details --}}
            <div class="flex-1 min-w-0">
                <a href="{{ route('customer.products.show', $item->product) }}" class="font-medium text-gray-900 text-sm hover:underline line-clamp-1">
                    {{ $item->product->name }}
                </a>
                <p class="text-xs text-gray-500 mt-0.5">{{ $item->product->sellerProfile->shop_name ?? '' }}</p>

                @if($item->variant)
                    <span class="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{{ $item->variant->label }}</span>
                @endif

                @php
                    $unitPrice = $item->variant && $item->variant->price_override
                        ? $item->variant->price_override
                        : $item->product->effective_price;
                @endphp

                <div class="flex items-center justify-between mt-3">
                    {{-- Quantity --}}
                    <form action="{{ route('customer.cart.update', $item) }}" method="POST" class="flex items-center gap-1">
                        @csrf
                        @method('PATCH')
                        <button type="submit" name="quantity" value="{{ max(1, $item->quantity - 1) }}"
                            class="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-gray-500 hover:bg-gray-50 text-xs">−</button>
                        <span class="w-8 text-center text-sm font-medium">{{ $item->quantity }}</span>
                        <button type="submit" name="quantity" value="{{ min(99, $item->quantity + 1) }}"
                            class="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-gray-500 hover:bg-gray-50 text-xs">+</button>
                    </form>

                    {{-- Price --}}
                    <span class="font-bold text-gray-900 text-sm">₱{{ number_format($unitPrice * $item->quantity, 2) }}</span>
                </div>
            </div>

            {{-- Remove --}}
            <form action="{{ route('customer.cart.destroy', $item) }}" method="POST" class="flex-shrink-0">
                @csrf
                @method('DELETE')
                <button type="submit" class="text-gray-300 hover:text-red-500 transition" title="Remove">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </form>
        </div>
        @endforeach

        {{-- Clear Cart --}}
        <div class="flex justify-end">
            <form action="{{ route('customer.cart.clear') }}" method="POST">
                @csrf
                @method('DELETE')
                <button type="submit" class="text-sm text-gray-500 hover:text-red-600 transition">Clear cart</button>
            </form>
        </div>
    </div>

    {{-- Order Summary --}}
    <div class="lg:col-span-1">
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-6">
            <h2 class="text-base font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-500">Subtotal ({{ $cartItems->sum('quantity') }} items)</span>
                    <span class="font-medium text-gray-900">₱{{ number_format($subtotal, 2) }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Shipping</span>
                    <span class="text-gray-500">Calculated at checkout</span>
                </div>
            </div>

            <div class="border-t border-gray-100 mt-4 pt-4 flex justify-between">
                <span class="font-semibold text-gray-900">Estimated Total</span>
                <span class="text-lg font-bold text-gray-900">₱{{ number_format($subtotal, 2) }}</span>
            </div>

            <a href="{{ route('customer.checkout.index') }}"
                class="mt-4 w-full inline-flex justify-center px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition">
                Proceed to Checkout
            </a>

            <a href="{{ route('customer.browse') }}" class="mt-2 w-full inline-flex justify-center px-6 py-2 text-sm text-gray-500 hover:text-gray-900 transition">
                Continue Shopping
            </a>
        </div>
    </div>
</div>
@else
{{-- Empty Cart --}}
<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-16 text-center">
    <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
    <h2 class="text-lg font-semibold text-gray-900 mb-1">Your cart is empty</h2>
    <p class="text-gray-500 mb-4">Browse our products and add items to your cart.</p>
    <a href="{{ route('customer.browse') }}"
        class="inline-flex px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition">
        Browse Products
    </a>
</div>
@endif
@endsection
