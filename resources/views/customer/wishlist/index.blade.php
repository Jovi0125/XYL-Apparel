@extends('layouts.dashboard')

@section('page-title', 'My Wishlist')

@section('sidebar')
@include('customer.partials.sidebar')
@endsection

@section('content')
@if($wishlists->count())
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-6">
    @foreach($wishlists as $wishlist)
    @php $product = $wishlist->product; @endphp
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group relative">
        {{-- Remove Button --}}
        <form action="{{ route('customer.wishlist.destroy', $wishlist) }}" method="POST"
            class="absolute top-2 right-2 z-10">
            @csrf
            @method('DELETE')
            <button type="submit"
                class="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </form>

        <a href="{{ route('customer.products.show', $product) }}">
            <div class="aspect-[4/5] bg-gray-50 overflow-hidden">
                @if($product->primaryImage)
                    <img src="{{ asset('storage/' . $product->primaryImage->path) }}" alt="{{ $product->name }}"
                        class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                @else
                    <div class="w-full h-full flex items-center justify-center text-gray-300">
                        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                @endif
            </div>
        </a>

        <div class="p-4">
            <p class="text-xs text-gray-400 mb-1">{{ $product->sellerProfile->shop_name ?? '' }}</p>
            <a href="{{ route('customer.products.show', $product) }}" class="font-medium text-gray-900 text-sm leading-snug line-clamp-2 hover:underline">
                {{ $product->name }}
            </a>

            <div class="flex items-baseline gap-2 mt-2">
                @if($product->sale_price)
                    <span class="text-base font-bold text-gray-900">₱{{ number_format($product->sale_price, 2) }}</span>
                    <span class="text-xs text-gray-400 line-through">₱{{ number_format($product->price, 2) }}</span>
                @else
                    <span class="text-base font-bold text-gray-900">₱{{ number_format($product->price, 2) }}</span>
                @endif
            </div>

            {{-- Quick Add to Cart --}}
            <form action="{{ route('customer.cart.store') }}" method="POST" class="mt-3">
                @csrf
                <input type="hidden" name="product_id" value="{{ $product->id }}" />
                <input type="hidden" name="quantity" value="1" />
                <button type="submit"
                    class="w-full px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-900 hover:text-white hover:border-gray-900 transition">
                    Add to Cart
                </button>
            </form>
        </div>
    </div>
    @endforeach
</div>

<div class="mt-6">
    {{ $wishlists->links() }}
</div>
@else
<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-16 text-center">
    <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
    <h2 class="text-lg font-semibold text-gray-900 mb-1">Your wishlist is empty</h2>
    <p class="text-gray-500 mb-4">Save products you love for later.</p>
    <a href="{{ route('customer.browse') }}"
        class="inline-flex px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition">
        Browse Products
    </a>
</div>
@endif
@endsection
