@extends('layouts.dashboard')

@section('page-title', 'Admin Dashboard')

@section('sidebar')
@include('admin.partials.sidebar')
@endsection

@section('content')
{{-- KPI Cards --}}
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
    <x-stat-card title="Total Customers" :value="number_format($stats['total_users'])" />
    <x-stat-card title="Total Sellers" :value="number_format($stats['total_sellers'])" />
    <x-stat-card title="Total Products" :value="number_format($stats['total_products'])" />
    <x-stat-card title="Total Orders" :value="number_format($stats['total_orders'])" />
</div>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <x-stat-card title="Pending Seller Approvals" :value="number_format($stats['pending_sellers'])" />
    <x-stat-card title="Total Revenue" :value="'₱ ' . number_format($stats['total_revenue'], 2)" />
    <x-stat-card title="Platform Fees Earned" :value="'₱ ' . number_format($stats['platform_fees'], 2)" />
</div>

{{-- Recent Orders --}}
<div class="bg-white rounded-xl border border-gray-100 shadow-sm">
    <div class="px-6 py-4 border-b border-gray-100">
        <h2 class="text-base font-semibold text-gray-900">Recent Orders</h2>
    </div>
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-gray-100">
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Order #</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Customer</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Seller</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                    <th class="text-right px-6 py-3 font-medium text-gray-500">Total</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                @forelse($recentOrders as $order)
                <tr class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4 font-medium text-gray-900">{{ $order->order_number }}</td>
                    <td class="px-6 py-4 text-gray-600">{{ $order->customer->name ?? '—' }}</td>
                    <td class="px-6 py-4 text-gray-600">{{ $order->sellerProfile->shop_name ?? '—' }}</td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            {{ $order->order_status === 'completed' ? 'bg-green-100 text-green-800' : '' }}
                            {{ $order->order_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : '' }}
                            {{ $order->order_status === 'processing' ? 'bg-blue-100 text-blue-800' : '' }}
                            {{ $order->order_status === 'cancelled' ? 'bg-red-100 text-red-800' : '' }}
                        ">
                            {{ ucfirst(str_replace('_', ' ', $order->order_status)) }}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right font-medium text-gray-900">₱{{ number_format($order->total, 2) }}</td>
                    <td class="px-6 py-4 text-gray-500">{{ $order->created_at->format('M d, Y') }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="6" class="px-6 py-12 text-center text-gray-400">No orders yet.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
