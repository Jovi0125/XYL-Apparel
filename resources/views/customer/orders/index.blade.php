@extends('layouts.dashboard')

@section('page-title', 'My Orders')

@section('sidebar')
@include('customer.partials.sidebar')
@endsection

@section('header-actions')
<form action="{{ route('customer.orders.index') }}" method="GET" class="flex items-center gap-2">
    <input type="text" name="search" value="{{ request('search') }}" placeholder="Search order #..."
        class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-44" />
    <select name="status" class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900">
        <option value="">All Status</option>
        <option value="pending" {{ request('status') === 'pending' ? 'selected' : '' }}>Pending</option>
        <option value="processing" {{ request('status') === 'processing' ? 'selected' : '' }}>Processing</option>
        <option value="ready_for_pickup" {{ request('status') === 'ready_for_pickup' ? 'selected' : '' }}>Ready for Pickup</option>
        <option value="completed" {{ request('status') === 'completed' ? 'selected' : '' }}>Completed</option>
        <option value="cancelled" {{ request('status') === 'cancelled' ? 'selected' : '' }}>Cancelled</option>
    </select>
    <button type="submit" class="px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition">Filter</button>
</form>
@endsection

@section('content')
@if($orders->count())
<div class="space-y-4">
    @foreach($orders as $order)
    <a href="{{ route('customer.orders.show', $order) }}" class="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-5">
        <div class="flex items-start justify-between mb-3">
            <div>
                <span class="text-sm font-semibold text-gray-900">{{ $order->order_number }}</span>
                <span class="text-xs text-gray-400 ml-2">{{ $order->created_at->format('M d, Y h:i A') }}</span>
            </div>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                {{ $order->order_status === 'completed' ? 'bg-green-100 text-green-800' : '' }}
                {{ $order->order_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : '' }}
                {{ $order->order_status === 'processing' ? 'bg-blue-100 text-blue-800' : '' }}
                {{ $order->order_status === 'cancelled' ? 'bg-red-100 text-red-800' : '' }}
                {{ $order->order_status === 'ready_for_pickup' ? 'bg-purple-100 text-purple-800' : '' }}
            ">
                {{ ucfirst(str_replace('_', ' ', $order->order_status)) }}
            </span>
        </div>

        <div class="flex items-center gap-4 text-sm text-gray-500">
            <span>{{ $order->sellerProfile->shop_name ?? '—' }}</span>
            <span>&middot;</span>
            <span>{{ $order->items->count() }} item(s)</span>
            <span>&middot;</span>
            <span class="font-medium text-gray-900">₱{{ number_format($order->total, 2) }}</span>
        </div>

        {{-- Item Preview --}}
        <div class="flex gap-2 mt-3">
            @foreach($order->items->take(4) as $item)
            <div class="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                @if($item->product && $item->product->primaryImage)
                    <img src="{{ asset('storage/' . $item->product->primaryImage->path) }}" alt="" class="w-full h-full object-cover" />
                @else
                    <div class="w-full h-full flex items-center justify-center text-gray-300 text-xs">?</div>
                @endif
            </div>
            @endforeach
            @if($order->items->count() > 4)
                <div class="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                    +{{ $order->items->count() - 4 }}
                </div>
            @endif
        </div>
    </a>
    @endforeach
</div>

<div class="mt-6">
    {{ $orders->links() }}
</div>
@else
<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-16 text-center">
    <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
    <h2 class="text-lg font-semibold text-gray-900 mb-1">No orders yet</h2>
    <p class="text-gray-500 mb-4">Start shopping to see your orders here.</p>
    <a href="{{ route('customer.browse') }}"
        class="inline-flex px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition">
        Browse Products
    </a>
</div>
@endif
@endsection
