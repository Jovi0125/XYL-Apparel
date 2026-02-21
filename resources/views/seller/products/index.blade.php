@extends('layouts.dashboard')

@section('page-title', 'Products')

@section('sidebar')
@include('seller.partials.sidebar')
@endsection

@section('header-actions')
<a href="{{ route('seller.products.create') }}" class="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
    </svg>
    Add Product
</a>
@endsection

@section('content')
{{-- Filters --}}
<div class="mb-6">
    <form method="GET" action="{{ route('seller.products.index') }}" class="flex flex-wrap gap-3">
        <input type="text" name="search" value="{{ request('search') }}" placeholder="Search products..."
            class="flex-1 min-w-[220px] max-w-sm px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400">
        <select name="status" class="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white">
            <option value="">All Status</option>
            <option value="active" {{ request('status') === 'active' ? 'selected' : '' }}>Active</option>
            <option value="inactive" {{ request('status') === 'inactive' ? 'selected' : '' }}>Inactive</option>
        </select>
        <button type="submit" class="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">Filter</button>
        @if(request('search') || request('status'))
            <a href="{{ route('seller.products.index') }}" class="px-4 py-2.5 text-gray-500 rounded-lg text-sm hover:text-gray-900 transition">Clear</a>
        @endif
    </form>
</div>

{{-- Products Grid --}}
<div class="bg-white rounded-xl border border-gray-100 shadow-sm">
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-gray-100">
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Product</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Category</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Price</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Variants</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                    <th class="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                @forelse($products as $product)
                <tr class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            @if($product->primaryImage)
                                <img src="{{ asset('storage/' . $product->primaryImage->path) }}" alt="{{ $product->name }}" class="w-10 h-10 rounded-lg object-cover">
                            @else
                                <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                            @endif
                            <div>
                                <p class="font-medium text-gray-900">{{ $product->name }}</p>
                                <p class="text-xs text-gray-400">{{ Str::limit($product->short_description, 50) }}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-gray-600">{{ $product->category->name ?? '—' }}</td>
                    <td class="px-6 py-4">
                        <div>
                            @if($product->sale_price)
                                <p class="font-medium text-gray-900">₱{{ number_format($product->sale_price, 2) }}</p>
                                <p class="text-xs text-gray-400 line-through">₱{{ number_format($product->price, 2) }}</p>
                            @else
                                <p class="font-medium text-gray-900">₱{{ number_format($product->price, 2) }}</p>
                            @endif
                        </div>
                    </td>
                    <td class="px-6 py-4 text-gray-600">{{ $product->variants->count() }}</td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {{ $product->is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600' }}">
                            {{ $product->is_active ? 'Active' : 'Inactive' }}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <div class="flex items-center justify-end gap-2">
                            <a href="{{ route('seller.products.show', $product) }}" class="text-sm text-gray-600 hover:text-gray-900 font-medium transition">View</a>
                            <a href="{{ route('seller.products.edit', $product) }}" class="text-sm text-gray-600 hover:text-gray-900 font-medium transition">Edit</a>
                            <form method="POST" action="{{ route('seller.products.destroy', $product) }}" class="inline" onsubmit="return confirm('Delete this product?')">
                                @csrf @method('DELETE')
                                <button type="submit" class="text-sm text-red-500 hover:text-red-700 font-medium transition">Delete</button>
                            </form>
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="6" class="px-6 py-12 text-center text-gray-400">
                        No products yet. <a href="{{ route('seller.products.create') }}" class="text-gray-900 font-medium hover:underline">Add your first product</a>
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    @if($products->hasPages())
    <div class="px-6 py-4 border-t border-gray-100">
        {{ $products->links() }}
    </div>
    @endif
</div>
@endsection
