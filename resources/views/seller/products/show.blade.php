@extends('layouts.dashboard')

@section('page-title', $product->name)

@section('sidebar')
@include('seller.partials.sidebar')
@endsection

@section('header-actions')
<a href="{{ route('seller.products.edit', $product) }}" class="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition">
    Edit Product
</a>
@endsection

@section('content')
<a href="{{ route('seller.products.index') }}" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
    Back to Products
</a>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {{-- Images --}}
    <div class="lg:col-span-2">
        @if($product->images->count())
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
                @foreach($product->images->sortBy('sort_order') as $image)
                    <div class="relative">
                        <img src="{{ asset('storage/' . $image->path) }}" alt="{{ $product->name }}" class="w-full aspect-square rounded-lg object-cover">
                        @if($image->is_primary)
                            <span class="absolute top-1 left-1 px-1.5 py-0.5 bg-gray-900 text-white text-[10px] rounded font-medium">Primary</span>
                        @endif
                    </div>
                @endforeach
            </div>
        </div>
        @endif

        {{-- Description --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mt-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Description</h3>
            <div class="prose prose-sm text-gray-700 max-w-none">
                {!! nl2br(e($product->description ?? 'No description provided.')) !!}
            </div>
        </div>

        {{-- Variants --}}
        @if($product->variants->count())
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm mt-6">
            <div class="px-6 py-4 border-b border-gray-100">
                <h3 class="text-sm font-semibold text-gray-900">Variants ({{ $product->variants->count() }})</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-gray-50">
                            <th class="text-left px-6 py-3 font-medium text-gray-500">Size</th>
                            <th class="text-left px-6 py-3 font-medium text-gray-500">Color</th>
                            <th class="text-left px-6 py-3 font-medium text-gray-500">Stock</th>
                            <th class="text-left px-6 py-3 font-medium text-gray-500">Price Override</th>
                            <th class="text-left px-6 py-3 font-medium text-gray-500">SKU</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        @foreach($product->variants as $variant)
                        <tr class="hover:bg-gray-50 transition">
                            <td class="px-6 py-3 text-gray-900">{{ $variant->size ?? '—' }}</td>
                            <td class="px-6 py-3 text-gray-600">{{ $variant->color ?? '—' }}</td>
                            <td class="px-6 py-3">
                                <span class="{{ $variant->stock > 0 ? 'text-green-700' : 'text-red-600' }} font-medium">{{ $variant->stock }}</span>
                            </td>
                            <td class="px-6 py-3 text-gray-600">{{ $variant->price_override ? '₱' . number_format($variant->price_override, 2) : '—' }}</td>
                            <td class="px-6 py-3 text-gray-400 font-mono text-xs">{{ $variant->sku ?? '—' }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
        @endif
    </div>

    {{-- Sidebar Info --}}
    <div class="space-y-6">
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Product Info</h3>
            <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-500">Status</span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {{ $product->is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600' }}">
                        {{ $product->is_active ? 'Active' : 'Inactive' }}
                    </span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Category</span>
                    <span class="text-gray-900">{{ $product->category->name ?? '—' }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Price</span>
                    <span class="text-gray-900 font-medium">₱{{ number_format($product->price, 2) }}</span>
                </div>
                @if($product->sale_price)
                <div class="flex justify-between">
                    <span class="text-gray-500">Sale Price</span>
                    <span class="text-red-600 font-medium">₱{{ number_format($product->sale_price, 2) }}</span>
                </div>
                @endif
                <div class="flex justify-between">
                    <span class="text-gray-500">COD</span>
                    <span class="text-gray-900">{{ $product->cash_on_delivery ? 'Yes' : 'No' }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Views</span>
                    <span class="text-gray-900">{{ number_format($product->views_count) }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Created</span>
                    <span class="text-gray-900">{{ $product->created_at->format('M d, Y') }}</span>
                </div>
            </div>
        </div>

        @if($product->short_description)
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-2">Short Description</h3>
            <p class="text-sm text-gray-600">{{ $product->short_description }}</p>
        </div>
        @endif

        @if($product->video_url)
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-2">Video</h3>
            <a href="{{ $product->video_url }}" target="_blank" class="text-sm text-blue-600 hover:underline break-all">{{ $product->video_url }}</a>
        </div>
        @endif
    </div>
</div>
@endsection
