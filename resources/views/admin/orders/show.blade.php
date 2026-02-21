@extends('layouts.dashboard')

@section('page-title', 'Order #' . $order->order_number)

@section('sidebar')
@include('admin.partials.sidebar')
@endsection

@section('content')
{{-- Back --}}
<a href="{{ route('admin.orders.index') }}" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
    Back to Orders
</a>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {{-- Order Summary --}}
    <div class="lg:col-span-2 space-y-6">
        {{-- Items --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div class="px-6 py-4 border-b border-gray-100">
                <h3 class="text-sm font-semibold text-gray-900">Order Items</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-gray-50">
                            <th class="text-left px-6 py-3 font-medium text-gray-500">Product</th>
                            <th class="text-left px-6 py-3 font-medium text-gray-500">Variant</th>
                            <th class="text-left px-6 py-3 font-medium text-gray-500">Qty</th>
                            <th class="text-left px-6 py-3 font-medium text-gray-500">Price</th>
                            <th class="text-right px-6 py-3 font-medium text-gray-500">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        @foreach($order->items as $item)
                        <tr>
                            <td class="px-6 py-3">
                                <div>
                                    <p class="font-medium text-gray-900">{{ $item->product->name ?? 'Deleted Product' }}</p>
                                    <p class="text-xs text-gray-400">Seller: {{ $item->seller->shop_name ?? ($item->seller->user->name ?? '—') }}</p>
                                </div>
                            </td>
                            <td class="px-6 py-3 text-gray-600">{{ $item->variant->name ?? '—' }}</td>
                            <td class="px-6 py-3 text-gray-600">{{ $item->quantity }}</td>
                            <td class="px-6 py-3 text-gray-600">₱{{ number_format($item->price, 2) }}</td>
                            <td class="px-6 py-3 text-right text-gray-900 font-medium">₱{{ number_format($item->price * $item->quantity, 2) }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                    <tfoot class="border-t border-gray-100">
                        <tr>
                            <td colspan="4" class="px-6 py-3 text-right text-sm text-gray-500">Subtotal</td>
                            <td class="px-6 py-3 text-right text-gray-900 font-medium">₱{{ number_format($order->subtotal, 2) }}</td>
                        </tr>
                        @if($order->discount_amount > 0)
                        <tr>
                            <td colspan="4" class="px-6 py-2 text-right text-sm text-gray-500">Discount</td>
                            <td class="px-6 py-2 text-right text-red-600">-₱{{ number_format($order->discount_amount, 2) }}</td>
                        </tr>
                        @endif
                        <tr>
                            <td colspan="4" class="px-6 py-2 text-right text-sm text-gray-500">Shipping Fee</td>
                            <td class="px-6 py-2 text-right text-gray-900">₱{{ number_format($order->shipping_fee, 2) }}</td>
                        </tr>
                        <tr class="border-t border-gray-100">
                            <td colspan="4" class="px-6 py-3 text-right text-sm font-semibold text-gray-900">Total</td>
                            <td class="px-6 py-3 text-right text-lg font-bold text-gray-900">₱{{ number_format($order->total_amount, 2) }}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

        {{-- Shipment --}}
        @if($order->shipment)
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Shipment</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p class="text-gray-500 mb-1">Tracking Number</p>
                    <p class="font-medium text-gray-900">{{ $order->shipment->tracking_number ?? '—' }}</p>
                </div>
                <div>
                    <p class="text-gray-500 mb-1">Status</p>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        @switch($order->shipment->status)
                            @case('picked_up') bg-blue-100 text-blue-800 @break
                            @case('in_transit') bg-purple-100 text-purple-800 @break
                            @case('delivered') bg-green-100 text-green-800 @break
                            @default bg-gray-100 text-gray-700
                        @endswitch
                    ">{{ ucwords(str_replace('_', ' ', $order->shipment->status)) }}</span>
                </div>
                <div>
                    <p class="text-gray-500 mb-1">Handler</p>
                    <p class="font-medium text-gray-900">{{ $order->shipment->handler->user->name ?? '—' }}</p>
                </div>
                <div>
                    <p class="text-gray-500 mb-1">Estimated Delivery</p>
                    <p class="font-medium text-gray-900">{{ $order->shipment->estimated_delivery ? \Carbon\Carbon::parse($order->shipment->estimated_delivery)->format('M d, Y') : '—' }}</p>
                </div>
            </div>

            {{-- Tracking Events --}}
            @if($order->shipment->trackingEvents && $order->shipment->trackingEvents->count())
            <div class="mt-6 pt-4 border-t border-gray-100">
                <h4 class="text-sm font-medium text-gray-700 mb-3">Tracking Timeline</h4>
                <div class="space-y-3">
                    @foreach($order->shipment->trackingEvents->sortByDesc('created_at') as $event)
                    <div class="flex gap-3">
                        <div class="w-2 h-2 rounded-full bg-gray-400 mt-1.5 flex-shrink-0"></div>
                        <div>
                            <p class="text-sm text-gray-900">{{ $event->description }}</p>
                            <p class="text-xs text-gray-400">{{ $event->location ?? '' }} &middot; {{ $event->created_at->format('M d, Y h:i A') }}</p>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
            @endif
        </div>
        @endif
    </div>

    {{-- Order Info Sidebar --}}
    <div class="space-y-6">
        {{-- Status --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Order Info</h3>
            <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-500">Status</span>
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
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Payment</span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        @switch($order->payment_status)
                            @case('paid') bg-green-100 text-green-800 @break
                            @case('pending') bg-yellow-100 text-yellow-800 @break
                            @case('failed') bg-red-100 text-red-800 @break
                            @default bg-gray-100 text-gray-700
                        @endswitch
                    ">{{ ucfirst($order->payment_status) }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Method</span>
                    <span class="text-gray-900">{{ ucfirst($order->payment_method ?? '—') }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Ordered</span>
                    <span class="text-gray-900">{{ $order->created_at->format('M d, Y h:i A') }}</span>
                </div>
            </div>
        </div>

        {{-- Customer --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Customer</h3>
            <div class="text-sm">
                <p class="font-medium text-gray-900">{{ $order->customer->name ?? '—' }}</p>
                <p class="text-gray-500">{{ $order->customer->email ?? '—' }}</p>
                <p class="text-gray-500">{{ $order->customer->phone ?? '' }}</p>
            </div>
        </div>

        {{-- Shipping Address --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Shipping Address</h3>
            <p class="text-sm text-gray-700 leading-relaxed">{{ $order->shipping_address ?? 'No address provided' }}</p>
        </div>

        @if($order->discount_code)
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-2">Discount Code</h3>
            <span class="inline-flex items-center px-3 py-1 rounded-lg text-sm font-mono font-medium bg-gray-100 text-gray-800">
                {{ $order->discount_code }}
            </span>
        </div>
        @endif
    </div>
</div>
@endsection
