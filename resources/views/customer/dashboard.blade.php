@extends('layouts.dashboard')

@section('page-title', 'My Account')

@section('sidebar')
@include('customer.partials.sidebar')
@endsection

@section('content')
{{-- KPI Cards --}}
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
    <x-stat-card title="Total Orders" :value="number_format($stats['total_orders'])" />
    <x-stat-card title="Pending" :value="number_format($stats['pending_orders'])" />
    <x-stat-card title="Completed" :value="number_format($stats['completed_orders'])" />
    <x-stat-card title="Wishlist Items" :value="number_format($stats['wishlist_count'])" />
</div>

{{-- Quick Actions --}}
<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <a href="{{ route('customer.browse') }}" class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
        <div class="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <div>
            <p class="font-semibold text-gray-900">Browse Products</p>
            <p class="text-xs text-gray-500">Discover new items</p>
        </div>
    </a>
    <a href="{{ route('customer.cart.index') }}" class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
        <div class="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
        </div>
        <div>
            <p class="font-semibold text-gray-900">My Cart</p>
            <p class="text-xs text-gray-500">View cart items</p>
        </div>
    </a>
    <a href="{{ route('customer.wishlist.index') }}" class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
        <div class="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </div>
        <div>
            <p class="font-semibold text-gray-900">Wishlist</p>
            <p class="text-xs text-gray-500">{{ $stats['wishlist_count'] }} saved items</p>
        </div>
    </a>
</div>

{{-- Recent Orders --}}
<div class="bg-white rounded-xl border border-gray-100 shadow-sm">
    <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 class="text-base font-semibold text-gray-900">Recent Orders</h2>
        <a href="{{ route('customer.orders.index') }}" class="text-sm text-gray-500 hover:text-gray-900 transition">View all</a>
    </div>
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-gray-100">
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Order #</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Shop</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                    <th class="text-right px-6 py-3 font-medium text-gray-500">Total</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                @forelse($recentOrders as $order)
                <tr class="hover:bg-gray-50 transition cursor-pointer" onclick="window.location='{{ route('customer.orders.show', $order) }}'">
                    <td class="px-6 py-4 font-medium text-gray-900">{{ $order->order_number }}</td>
                    <td class="px-6 py-4 text-gray-600">{{ $order->sellerProfile->shop_name ?? '—' }}</td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            {{ $order->order_status === 'completed' ? 'bg-green-100 text-green-800' : '' }}
                            {{ $order->order_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : '' }}
                            {{ $order->order_status === 'processing' ? 'bg-blue-100 text-blue-800' : '' }}
                            {{ $order->order_status === 'cancelled' ? 'bg-red-100 text-red-800' : '' }}
                            {{ $order->order_status === 'ready_for_pickup' ? 'bg-purple-100 text-purple-800' : '' }}
                        ">
                            {{ ucfirst(str_replace('_', ' ', $order->order_status)) }}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right font-medium text-gray-900">₱{{ number_format($order->total, 2) }}</td>
                    <td class="px-6 py-4 text-gray-500">{{ $order->created_at->format('M d, Y') }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="5" class="px-6 py-12 text-center text-gray-400">
                        <p>No orders yet.</p>
                        <a href="{{ route('customer.browse') }}" class="text-gray-900 font-medium hover:underline mt-1 inline-block">Start shopping</a>
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
