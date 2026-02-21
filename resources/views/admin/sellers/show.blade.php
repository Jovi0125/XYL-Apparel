@extends('layouts.dashboard')

@section('page-title', $seller->shop_name ?? 'Seller Details')

@section('sidebar')
@include('admin.partials.sidebar')
@endsection

@section('content')
{{-- Back --}}
<a href="{{ route('admin.sellers.index') }}" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
    Back to Sellers
</a>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {{-- Seller Profile Card --}}
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div class="text-center mb-6">
            @if($seller->shop_logo)
                <img src="{{ asset('storage/' . $seller->shop_logo) }}" alt="{{ $seller->shop_name }}" class="w-16 h-16 rounded-full object-cover mx-auto mb-3">
            @else
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                </div>
            @endif
            <h3 class="text-lg font-semibold text-gray-900">{{ $seller->shop_name ?? 'No Shop Name' }}</h3>
            <p class="text-sm text-gray-500">{{ $seller->user->name }} &middot; {{ $seller->user->email }}</p>
        </div>

        <div class="space-y-3 text-sm">
            <div class="flex justify-between">
                <span class="text-gray-500">Status</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    @switch($seller->status)
                        @case('approved') bg-green-100 text-green-800 @break
                        @case('pending') bg-yellow-100 text-yellow-800 @break
                        @case('rejected') bg-red-100 text-red-800 @break
                        @default bg-gray-100 text-gray-700
                    @endswitch
                ">{{ ucfirst($seller->status) }}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-500">Account Status</span>
                @if($seller->user->is_banned)
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Banned</span>
                @else
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                @endif
            </div>
            <div class="flex justify-between">
                <span class="text-gray-500">Commission Rate</span>
                <span class="text-gray-900 font-medium">{{ $seller->commission_rate }}%</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-500">Joined</span>
                <span class="text-gray-900">{{ $seller->created_at->format('M d, Y') }}</span>
            </div>
        </div>

        @if($seller->shop_description)
        <div class="mt-4 pt-4 border-t border-gray-100">
            <p class="text-sm text-gray-500 mb-1">Shop Description</p>
            <p class="text-sm text-gray-700">{{ $seller->shop_description }}</p>
        </div>
        @endif

        {{-- Actions --}}
        <div class="mt-6 pt-4 border-t border-gray-100 space-y-2">
            @if($seller->status === 'pending')
                <form method="POST" action="{{ route('admin.sellers.approve', $seller) }}">
                    @csrf @method('PATCH')
                    <button type="submit" class="w-full py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition">Approve Seller</button>
                </form>
            @endif

            @if(!$seller->user->is_banned)
                <form method="POST" action="{{ route('admin.sellers.ban', $seller) }}" onsubmit="return confirm('Ban this seller?')">
                    @csrf @method('PATCH')
                    <button type="submit" class="w-full py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">Ban Seller</button>
                </form>
            @else
                <form method="POST" action="{{ route('admin.sellers.unban', $seller) }}">
                    @csrf @method('PATCH')
                    <button type="submit" class="w-full py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition">Unban Seller</button>
                </form>
            @endif
        </div>
    </div>

    {{-- Stats & Products --}}
    <div class="lg:col-span-2 space-y-6">
        {{-- Stats --}}
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <p class="text-xs text-gray-500 mb-1">Products</p>
                <p class="text-xl font-bold text-gray-900">{{ $stats['products'] ?? 0 }}</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <p class="text-xs text-gray-500 mb-1">Orders</p>
                <p class="text-xl font-bold text-gray-900">{{ $stats['orders'] ?? 0 }}</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <p class="text-xs text-gray-500 mb-1">Revenue</p>
                <p class="text-xl font-bold text-gray-900">₱{{ number_format($stats['revenue'] ?? 0, 2) }}</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <p class="text-xs text-gray-500 mb-1">Total Earnings</p>
                <p class="text-xl font-bold text-gray-900">₱{{ number_format($seller->total_earnings, 2) }}</p>
            </div>
        </div>

        {{-- Recent Products --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div class="px-6 py-4 border-b border-gray-100">
                <h3 class="text-sm font-semibold text-gray-900">Recent Products</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-gray-50">
                            <th class="text-left px-6 py-3 font-medium text-gray-500">Product</th>
                            <th class="text-left px-6 py-3 font-medium text-gray-500">Price</th>
                            <th class="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                            <th class="text-left px-6 py-3 font-medium text-gray-500">Created</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        @forelse($seller->products()->latest()->take(10)->get() as $product)
                        <tr class="hover:bg-gray-50 transition">
                            <td class="px-6 py-3 font-medium text-gray-900">{{ $product->name }}</td>
                            <td class="px-6 py-3 text-gray-600">₱{{ number_format($product->base_price, 2) }}</td>
                            <td class="px-6 py-3">
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                                    {{ $product->is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600' }}
                                ">{{ $product->is_active ? 'Active' : 'Inactive' }}</span>
                            </td>
                            <td class="px-6 py-3 text-gray-500">{{ $product->created_at->format('M d, Y') }}</td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="4" class="px-6 py-8 text-center text-gray-400">No products yet.</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection
