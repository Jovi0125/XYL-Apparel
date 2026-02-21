@extends('layouts.dashboard')

@section('page-title', 'Browse Products')

@section('sidebar')
@include('customer.partials.sidebar')
@endsection

@section('header-actions')
<form action="{{ route('customer.browse') }}" method="GET" class="flex items-center gap-2">
    <input type="text" name="search" value="{{ request('search') }}" placeholder="Search products..."
        class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-56" />
    <button type="submit" class="px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition">Search</button>
</form>
@endsection

@section('content')
{{-- Filters --}}
<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
    <form action="{{ route('customer.browse') }}" method="GET" class="flex flex-wrap items-end gap-4">
        @if(request('search'))
            <input type="hidden" name="search" value="{{ request('search') }}" />
        @endif

        <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Category</label>
            <select name="category" class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900">
                <option value="">All Categories</option>
                @foreach($categories as $category)
                    <option value="{{ $category->id }}" {{ request('category') == $category->id ? 'selected' : '' }}>
                        {{ $category->name }}
                    </option>
                @endforeach
            </select>
        </div>

        <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Min Price</label>
            <input type="number" name="min_price" value="{{ request('min_price') }}" placeholder="₱0"
                class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 w-28 focus:outline-none focus:ring-2 focus:ring-gray-900" />
        </div>

        <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Max Price</label>
            <input type="number" name="max_price" value="{{ request('max_price') }}" placeholder="₱9999"
                class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 w-28 focus:outline-none focus:ring-2 focus:ring-gray-900" />
        </div>

        <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Sort By</label>
            <select name="sort" class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900">
                <option value="latest" {{ request('sort') === 'latest' ? 'selected' : '' }}>Latest</option>
                <option value="price_low" {{ request('sort') === 'price_low' ? 'selected' : '' }}>Price: Low → High</option>
                <option value="price_high" {{ request('sort') === 'price_high' ? 'selected' : '' }}>Price: High → Low</option>
                <option value="popular" {{ request('sort') === 'popular' ? 'selected' : '' }}>Most Popular</option>
            </select>
        </div>

        <button type="submit" class="px-4 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition">Filter</button>
        <a href="{{ route('customer.browse') }}" class="px-4 py-1.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition">Clear</a>
    </form>
</div>

{{-- Product Grid --}}
@if($products->count())
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-6">
    @foreach($products as $product)
    <a href="{{ route('customer.products.show', $product) }}" class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition group">
        {{-- Image --}}
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

        {{-- Details --}}
        <div class="p-4">
            <p class="text-xs text-gray-400 mb-1">{{ $product->sellerProfile->shop_name ?? 'Unknown Shop' }}</p>
            <h3 class="font-medium text-gray-900 text-sm leading-snug line-clamp-2 mb-2">{{ $product->name }}</h3>

            <div class="flex items-baseline gap-2">
                @if($product->sale_price)
                    <span class="text-base font-bold text-gray-900">₱{{ number_format($product->sale_price, 2) }}</span>
                    <span class="text-xs text-gray-400 line-through">₱{{ number_format($product->price, 2) }}</span>
                @else
                    <span class="text-base font-bold text-gray-900">₱{{ number_format($product->price, 2) }}</span>
                @endif
            </div>

            @if($product->category)
                <span class="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">{{ $product->category->name }}</span>
            @endif
        </div>
    </a>
    @endforeach
</div>

{{-- Pagination --}}
<div class="mt-6">
    {{ $products->links() }}
</div>
@else
<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-16 text-center">
    <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <p class="text-gray-500 mb-1">No products found</p>
    <p class="text-sm text-gray-400">Try adjusting your filters or search terms.</p>
</div>
@endif
@endsection
