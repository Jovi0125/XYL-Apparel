@extends('layouts.dashboard')

@section('page-title', $product->name)

@section('sidebar')
@include('customer.partials.sidebar')
@endsection

@section('content')
{{-- Breadcrumb --}}
<nav class="text-sm text-gray-500 mb-6">
    <a href="{{ route('customer.browse') }}" class="hover:text-gray-900 transition">Browse</a>
    <span class="mx-1">/</span>
    @if($product->category)
        <a href="{{ route('customer.browse', ['category' => $product->category_id]) }}" class="hover:text-gray-900 transition">{{ $product->category->name }}</a>
        <span class="mx-1">/</span>
    @endif
    <span class="text-gray-900">{{ $product->name }}</span>
</nav>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
    {{-- Image Gallery --}}
    <div x-data="{ activeImage: '{{ $product->images->first() ? asset('storage/' . $product->images->first()->path) : '' }}' }">
        {{-- Main Image --}}
        <div class="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
            @if($product->images->count())
                <img :src="activeImage" alt="{{ $product->name }}" class="w-full h-full object-cover" />
            @else
                <div class="w-full h-full flex items-center justify-center text-gray-300">
                    <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            @endif
        </div>

        {{-- Thumbnails --}}
        @if($product->images->count() > 1)
        <div class="flex gap-2 overflow-x-auto">
            @foreach($product->images as $image)
            <button @click="activeImage = '{{ asset('storage/' . $image->path) }}'"
                class="w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition"
                :class="activeImage === '{{ asset('storage/' . $image->path) }}' ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'">
                <img src="{{ asset('storage/' . $image->path) }}" alt="" class="w-full h-full object-cover" />
            </button>
            @endforeach
        </div>
        @endif
    </div>

    {{-- Product Info --}}
    <div>
        {{-- Shop Name --}}
        <a href="{{ route('customer.shop', $product->sellerProfile) }}" class="text-sm text-gray-500 hover:text-gray-900 transition">
            {{ $product->sellerProfile->shop_name }}
        </a>

        <h1 class="text-2xl font-bold text-gray-900 mt-1 mb-3">{{ $product->name }}</h1>

        {{-- Price --}}
        <div class="flex items-baseline gap-3 mb-4">
            @if($product->sale_price)
                <span class="text-3xl font-bold text-gray-900">₱{{ number_format($product->sale_price, 2) }}</span>
                <span class="text-lg text-gray-400 line-through">₱{{ number_format($product->price, 2) }}</span>
                <span class="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    -{{ round((1 - $product->sale_price / $product->price) * 100) }}%
                </span>
            @else
                <span class="text-3xl font-bold text-gray-900">₱{{ number_format($product->price, 2) }}</span>
            @endif
        </div>

        {{-- Short Description --}}
        @if($product->short_description)
            <p class="text-gray-600 mb-5 leading-relaxed">{{ $product->short_description }}</p>
        @endif

        {{-- Add to Cart Form --}}
        <form action="{{ route('customer.cart.store') }}" method="POST" x-data="{ variantId: '', quantity: 1 }" class="space-y-4">
            @csrf

            <input type="hidden" name="product_id" value="{{ $product->id }}" />

            {{-- Variants --}}
            @if($product->variants->count())
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Select Variant</label>
                <div class="flex flex-wrap gap-2">
                    @foreach($product->variants as $variant)
                    <label class="cursor-pointer">
                        <input type="radio" name="product_variant_id" value="{{ $variant->id }}"
                            x-model="variantId" class="peer sr-only" {{ $variant->stock < 1 ? 'disabled' : '' }} />
                        <span class="inline-flex items-center px-3 py-2 border rounded-lg text-sm transition
                            peer-checked:border-gray-900 peer-checked:bg-gray-900 peer-checked:text-white
                            {{ $variant->stock < 1 ? 'opacity-40 cursor-not-allowed border-gray-200 text-gray-400' : 'border-gray-200 text-gray-700 hover:border-gray-400' }}">
                            {{ $variant->label }}
                            @if($variant->stock < 1)
                                <span class="ml-1 text-xs">(Out of stock)</span>
                            @elseif($variant->stock <= 5)
                                <span class="ml-1 text-xs text-orange-500">({{ $variant->stock }} left)</span>
                            @endif
                            @if($variant->price_override)
                                <span class="ml-1 text-xs font-medium">₱{{ number_format($variant->price_override, 2) }}</span>
                            @endif
                        </span>
                    </label>
                    @endforeach
                </div>
            </div>
            @endif

            {{-- Quantity --}}
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div class="flex items-center gap-2">
                    <button type="button" @click="quantity = Math.max(1, quantity - 1)"
                        class="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition">−</button>
                    <input type="number" name="quantity" x-model="quantity" min="1" max="99"
                        class="w-16 h-9 text-center text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
                    <button type="button" @click="quantity = Math.min(99, quantity + 1)"
                        class="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition">+</button>
                </div>
            </div>

            {{-- Action Buttons --}}
            <div class="flex gap-3 pt-2">
                <button type="submit"
                    class="flex-1 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition">
                    Add to Cart
                </button>

                <form action="{{ route('customer.wishlist.toggle', $product) }}" method="POST" class="inline">
                    @csrf
                    <button type="submit"
                        class="w-12 h-12 flex items-center justify-center border rounded-xl transition {{ $isWishlisted ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200' }}">
                        <svg class="w-5 h-5" fill="{{ $isWishlisted ? 'currentColor' : 'none' }}" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </form>
            </div>
        </form>

        {{-- Meta Info --}}
        <div class="mt-6 pt-6 border-t border-gray-100 space-y-2 text-sm text-gray-500">
            @if($product->category)
                <p>Category: <a href="{{ route('customer.browse', ['category' => $product->category_id]) }}" class="text-gray-900 hover:underline">{{ $product->category->name }}</a></p>
            @endif
            @if($product->cash_on_delivery)
                <p class="flex items-center gap-1">
                    <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                    Cash on Delivery available
                </p>
            @endif
            <p>{{ number_format($product->views_count) }} views</p>
        </div>
    </div>
</div>

{{-- Full Description --}}
@if($product->description)
<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
    <h2 class="text-base font-semibold text-gray-900 mb-3">Description</h2>
    <div class="prose prose-sm max-w-none text-gray-600">
        {!! nl2br(e($product->description)) !!}
    </div>
</div>
@endif

{{-- Specifications --}}
@if($product->specifications && count($product->specifications))
<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
    <h2 class="text-base font-semibold text-gray-900 mb-3">Specifications</h2>
    <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        @foreach($product->specifications as $key => $value)
        <div class="flex justify-between py-2 border-b border-gray-50">
            <dt class="text-gray-500">{{ $key }}</dt>
            <dd class="text-gray-900 font-medium">{{ $value }}</dd>
        </div>
        @endforeach
    </dl>
</div>
@endif

{{-- Related Products --}}
@if($relatedProducts->count())
<div class="mb-6">
    <h2 class="text-base font-semibold text-gray-900 mb-4">You may also like</h2>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        @foreach($relatedProducts as $related)
        <a href="{{ route('customer.products.show', $related) }}" class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition group">
            <div class="aspect-[4/5] bg-gray-50 overflow-hidden">
                @if($related->primaryImage)
                    <img src="{{ asset('storage/' . $related->primaryImage->path) }}" alt="{{ $related->name }}"
                        class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                @else
                    <div class="w-full h-full flex items-center justify-center text-gray-300">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                @endif
            </div>
            <div class="p-3">
                <h3 class="text-sm font-medium text-gray-900 line-clamp-1">{{ $related->name }}</h3>
                <p class="text-sm font-bold text-gray-900 mt-1">₱{{ number_format($related->effective_price, 2) }}</p>
            </div>
        </a>
        @endforeach
    </div>
</div>
@endif
@endsection
