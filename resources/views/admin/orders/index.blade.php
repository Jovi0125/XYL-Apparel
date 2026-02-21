@extends('layouts.dashboard')

@section('page-title', 'Orders')

@section('sidebar')
@include('admin.partials.sidebar')
@endsection

@section('content')
{{-- Filters --}}
<div class="mb-6">
    <form method="GET" action="{{ route('admin.orders.index') }}" class="flex flex-wrap gap-3">
        <input
            type="text"
            name="search"
            value="{{ request('search') }}"
            placeholder="Search by order number..."
            class="flex-1 min-w-[220px] max-w-sm px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400"
        >
        <select name="status" class="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white">
            <option value="">All Status</option>
            <option value="pending" {{ request('status') === 'pending' ? 'selected' : '' }}>Pending</option>
            <option value="processing" {{ request('status') === 'processing' ? 'selected' : '' }}>Processing</option>
            <option value="shipped" {{ request('status') === 'shipped' ? 'selected' : '' }}>Shipped</option>
            <option value="delivered" {{ request('status') === 'delivered' ? 'selected' : '' }}>Delivered</option>
            <option value="cancelled" {{ request('status') === 'cancelled' ? 'selected' : '' }}>Cancelled</option>
        </select>
        <button type="submit" class="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
            Filter
        </button>
        @if(request('search') || request('status'))
            <a href="{{ route('admin.orders.index') }}" class="px-4 py-2.5 text-gray-500 rounded-lg text-sm hover:text-gray-900 transition">Clear</a>
        @endif
    </form>
</div>

{{-- Orders Table --}}
<div class="bg-white rounded-xl border border-gray-100 shadow-sm">
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-gray-100">
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Order</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Customer</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Items</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Total</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Payment</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                    <th class="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                @forelse($orders as $order)
                <tr class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4">
                        <a href="{{ route('admin.orders.show', $order) }}" class="font-medium text-gray-900 hover:underline">#{{ $order->order_number }}</a>
                    </td>
                    <td class="px-6 py-4">
                        <div>
                            <p class="text-gray-900">{{ $order->customer->name ?? '—' }}</p>
                            <p class="text-xs text-gray-400">{{ $order->customer->email ?? '' }}</p>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-gray-600">{{ $order->items_count ?? $order->items()->count() }}</td>
                    <td class="px-6 py-4 text-gray-900 font-medium">₱{{ number_format($order->total_amount, 2) }}</td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                            @switch($order->payment_status)
                                @case('paid') bg-green-100 text-green-800 @break
                                @case('pending') bg-yellow-100 text-yellow-800 @break
                                @case('failed') bg-red-100 text-red-800 @break
                                @default bg-gray-100 text-gray-700
                            @endswitch
                        ">{{ ucfirst($order->payment_status) }}</span>
                    </td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            @switch($order->status)
                                @case('pending') bg-yellow-100 text-yellow-800 @break
                                @case('processing') bg-blue-100 text-blue-800 @break
                                @case('shipped') bg-purple-100 text-purple-800 @break
                                @case('delivered') bg-green-100 text-green-800 @break
                                @case('cancelled') bg-red-100 text-red-800 @break
                                @default bg-gray-100 text-gray-700
                            @endswitch
                        ">{{ ucfirst($order->status) }}</span>
                    </td>
                    <td class="px-6 py-4 text-gray-500">{{ $order->created_at->format('M d, Y') }}</td>
                    <td class="px-6 py-4 text-right">
                        <a href="{{ route('admin.orders.show', $order) }}" class="text-sm text-gray-600 hover:text-gray-900 font-medium transition">View</a>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="8" class="px-6 py-12 text-center text-gray-400">No orders found.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    @if($orders->hasPages())
    <div class="px-6 py-4 border-t border-gray-100">
        {{ $orders->withQueryString()->links() }}
    </div>
    @endif
</div>
@endsection
