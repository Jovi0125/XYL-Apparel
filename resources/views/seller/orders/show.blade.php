@extends('layouts.dashboard')

@section('page-title', 'Order #' . $order->order_number)

@section('sidebar')
@include('seller.partials.sidebar')
@endsection

@section('content')
<a href="{{ route('seller.orders.index') }}" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
    Back to Orders
</a>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {{-- Items & Timeline --}}
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
                            <th class="text-left px-6 py-3 font-medium text-gray-500">Unit Price</th>
                            <th class="text-right px-6 py-3 font-medium text-gray-500">Total</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        @foreach($order->items as $item)
                        <tr>
                            <td class="px-6 py-3 font-medium text-gray-900">{{ $item->product_name }}</td>
                            <td class="px-6 py-3 text-gray-600">{{ $item->variant_label ?? '—' }}</td>
                            <td class="px-6 py-3 text-gray-600">{{ $item->quantity }}</td>
                            <td class="px-6 py-3 text-gray-600">₱{{ number_format($item->unit_price, 2) }}</td>
                            <td class="px-6 py-3 text-right text-gray-900 font-medium">₱{{ number_format($item->total_price, 2) }}</td>
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
                            <td colspan="4" class="px-6 py-2 text-right text-sm text-gray-500">Shipping</td>
                            <td class="px-6 py-2 text-right text-gray-900">₱{{ number_format($order->shipping_fee, 2) }}</td>
                        </tr>
                        <tr>
                            <td colspan="4" class="px-6 py-2 text-right text-sm text-gray-500">Platform Fee</td>
                            <td class="px-6 py-2 text-right text-gray-500">-₱{{ number_format($order->platform_fee, 2) }}</td>
                        </tr>
                        <tr class="border-t border-gray-100">
                            <td colspan="4" class="px-6 py-3 text-right text-sm font-semibold text-gray-900">Total</td>
                            <td class="px-6 py-3 text-right text-lg font-bold text-gray-900">₱{{ number_format($order->total, 2) }}</td>
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
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{{ ucwords(str_replace('_', ' ', $order->shipment->status)) }}</span>
                </div>
            </div>

            @if($order->shipment->trackingEvents && $order->shipment->trackingEvents->count())
            <div class="mt-4 pt-4 border-t border-gray-100 space-y-3">
                @foreach($order->shipment->trackingEvents->sortByDesc('created_at') as $event)
                <div class="flex gap-3">
                    <div class="w-2 h-2 rounded-full bg-gray-400 mt-1.5 flex-shrink-0"></div>
                    <div>
                        <p class="text-sm text-gray-900">{{ $event->description }}</p>
                        <p class="text-xs text-gray-400">{{ $event->created_at->format('M d, Y h:i A') }}</p>
                    </div>
                </div>
                @endforeach
            </div>
            @endif
        </div>
        @endif
    </div>

    {{-- Sidebar Info --}}
    <div class="space-y-6">
        {{-- Status & Actions --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Order Status</h3>
            <div class="space-y-3 text-sm mb-5">
                <div class="flex justify-between">
                    <span class="text-gray-500">Status</span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        @switch($order->order_status)
                            @case('pending') bg-yellow-100 text-yellow-800 @break
                            @case('processing') bg-blue-100 text-blue-800 @break
                            @case('ready_for_pickup') bg-purple-100 text-purple-800 @break
                            @case('completed') bg-green-100 text-green-800 @break
                            @case('cancelled') bg-red-100 text-red-800 @break
                            @default bg-gray-100 text-gray-700
                        @endswitch
                    ">{{ ucwords(str_replace('_', ' ', $order->order_status)) }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Payment</span>
                    <span class="text-gray-900">{{ ucfirst($order->payment_status) }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Method</span>
                    <span class="text-gray-900">{{ strtoupper($order->payment_method) }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Ordered</span>
                    <span class="text-gray-900">{{ $order->created_at->format('M d, Y') }}</span>
                </div>
            </div>

            @if(!in_array($order->order_status, ['completed', 'cancelled']))
            <div class="border-t border-gray-100 pt-4 space-y-2">
                <p class="text-xs text-gray-500 mb-2">Update Status</p>
                @if($order->order_status === 'pending')
                    <form method="POST" action="{{ route('seller.orders.status', $order) }}">
                        @csrf @method('PATCH')
                        <input type="hidden" name="order_status" value="processing">
                        <button type="submit" class="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">Mark Processing</button>
                    </form>
                @endif
                @if(in_array($order->order_status, ['pending', 'processing']))
                    <form method="POST" action="{{ route('seller.orders.status', $order) }}">
                        @csrf @method('PATCH')
                        <input type="hidden" name="order_status" value="ready_for_pickup">
                        <button type="submit" class="w-full py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition">Ready for Pickup</button>
                    </form>
                @endif
                @if($order->order_status !== 'cancelled')
                    <form method="POST" action="{{ route('seller.orders.status', $order) }}" onsubmit="return confirm('Cancel this order?')">
                        @csrf @method('PATCH')
                        <input type="hidden" name="order_status" value="cancelled">
                        <button type="submit" class="w-full py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">Cancel Order</button>
                    </form>
                @endif
            </div>
            @endif
        </div>

        {{-- Customer --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Customer</h3>
            <div class="text-sm">
                <p class="font-medium text-gray-900">{{ $order->customer->name ?? '—' }}</p>
                <p class="text-gray-500">{{ $order->customer->email ?? '—' }}</p>
            </div>
        </div>

        {{-- Shipping --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Shipping Address</h3>
            <div class="text-sm text-gray-700 space-y-1">
                <p class="font-medium">{{ $order->shipping_name }}</p>
                <p>{{ $order->shipping_phone }}</p>
                <p>{{ $order->shipping_address }}</p>
                <p>{{ $order->shipping_city }}</p>
            </div>
        </div>

        @if($order->notes)
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-2">Notes</h3>
            <p class="text-sm text-gray-600">{{ $order->notes }}</p>
        </div>
        @endif
    </div>
</div>
@endsection
