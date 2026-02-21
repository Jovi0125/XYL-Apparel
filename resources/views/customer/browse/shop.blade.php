@extends('layouts.dashboard')

@section('page-title', $sellerProfile->shop_name)

@section('sidebar')
@include('customer.partials.sidebar')
@endsection

@section('content')
{{-- Shop Header --}}
<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
    {{-- Banner --}}
    <div class="h-40 bg-gray-100">
        @if($sellerProfile->banner)
            <img src="{{ asset('storage/' . $sellerProfile->banner) }}" alt="Banner" class="w-full h-full object-cover" />
        @endif
    </div>

    {{-- Shop Info --}}
    <div class="px-6 py-5 flex items-start gap-5">
        <div class="w-16 h-16 -mt-12 rounded-xl bg-white border-4 border-white shadow-sm overflow-hidden flex-shrink-0">
            @if($sellerProfile->logo)
                <img src="{{ asset('storage/' . $sellerProfile->logo) }}" alt="{{ $sellerProfile->shop_name }}" class="w-full h-full object-cover" />
            @else
                <div class="w-full h-full bg-gray-900 flex items-center justify-center text-white text-xl font-bold">
                    {{ strtoupper(substr($sellerProfile->shop_name, 0, 1)) }}
                </div>
            @endif
        </div>
        <div class="flex-1">
            <h1 class="text-xl font-bold text-gray-900">{{ $sellerProfile->shop_name }}</h1>
            @if($sellerProfile->city)
                <p class="text-sm text-gray-500 mt-0.5">{{ $sellerProfile->city }}</p>
            @endif
            @if($sellerProfile->bio)
                <p class="text-sm text-gray-600 mt-2">{{ $sellerProfile->bio }}</p>
            @endif
        </div>
        <div class="text-right text-sm text-gray-500">
            <p>{{ $products->total() }} products</p>
        </div>
    </div>
</div>

{{-- Products Grid --}}
@if($products->count())
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-6">
    @foreach($products as $product)
    <a href="{{ route('customer.products.show', $product) }}" class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition group">
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
        <div class="p-4">
            <h3 class="font-medium text-gray-900 text-sm leading-snug line-clamp-2 mb-2">{{ $product->name }}</h3>
            <div class="flex items-baseline gap-2">
                @if($product->sale_price)
                    <span class="text-base font-bold text-gray-900">₱{{ number_format($product->sale_price, 2) }}</span>
                    <span class="text-xs text-gray-400 line-through">₱{{ number_format($product->price, 2) }}</span>
                @else
                    <span class="text-base font-bold text-gray-900">₱{{ number_format($product->price, 2) }}</span>
                @endif
            </div>
        </div>
    </a>
    @endforeach
</div>

<div class="mt-6">
    {{ $products->links() }}
</div>
@else
<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-16 text-center">
    <p class="text-gray-500">This shop has no products yet.</p>
</div>
@endif
@endsection
