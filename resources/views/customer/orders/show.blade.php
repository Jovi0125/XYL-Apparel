@extends('layouts.dashboard')

@section('page-title', 'Order ' . $order->order_number)

@section('sidebar')
@include('customer.partials.sidebar')
@endsection

@section('content')
{{-- Back Link --}}
<div class="mb-4">
    <a href="{{ route('customer.orders.index') }}" class="text-sm text-gray-500 hover:text-gray-900 transition inline-flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" /></svg>
        Back to Orders
    </a>
</div>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {{-- Left: Order Items & Tracking --}}
    <div class="lg:col-span-2 space-y-6">
        {{-- Order Status --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h2 class="text-lg font-semibold text-gray-900">{{ $order->order_number }}</h2>
                    <p class="text-sm text-gray-500">Placed on {{ $order->created_at->format('M d, Y h:i A') }}</p>
                </div>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    {{ $order->order_status === 'completed' ? 'bg-green-100 text-green-800' : '' }}
                    {{ $order->order_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : '' }}
                    {{ $order->order_status === 'processing' ? 'bg-blue-100 text-blue-800' : '' }}
                    {{ $order->order_status === 'cancelled' ? 'bg-red-100 text-red-800' : '' }}
                    {{ $order->order_status === 'ready_for_pickup' ? 'bg-purple-100 text-purple-800' : '' }}
                ">
                    {{ ucfirst(str_replace('_', ' ', $order->order_status)) }}
                </span>
            </div>

            {{-- Status Progress Bar --}}
            @php
                $statuses = ['pending', 'processing', 'ready_for_pickup', 'completed'];
                $currentIndex = array_search($order->order_status, $statuses);
                $isCancelled = $order->order_status === 'cancelled';
            @endphp
            @if(!$isCancelled)
            <div class="flex items-center gap-1">
                @foreach($statuses as $i => $status)
                <div class="flex-1">
                    <div class="h-1.5 rounded-full {{ $i <= $currentIndex ? 'bg-gray-900' : 'bg-gray-100' }}"></div>
                    <p class="text-xs mt-1 {{ $i <= $currentIndex ? 'text-gray-900 font-medium' : 'text-gray-400' }}">
                        {{ ucfirst(str_replace('_', ' ', $status)) }}
                    </p>
                </div>
                @endforeach
            </div>
            @endif

            {{-- Cancel Button --}}
            @if($order->order_status === 'pending')
            <div class="mt-4 pt-4 border-t border-gray-100">
                <form action="{{ route('customer.orders.cancel', $order) }}" method="POST"
                    onsubmit="return confirm('Are you sure you want to cancel this order?')">
                    @csrf
                    @method('PATCH')
                    <button type="submit" class="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition">
                        Cancel Order
                    </button>
                </form>
            </div>
            @endif
        </div>

        {{-- Order Items --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
                <h3 class="text-base font-semibold text-gray-900">Items</h3>
            </div>
            <div class="divide-y divide-gray-50">
                @foreach($order->items as $item)
                <div class="px-6 py-4 flex items-center gap-4">
                    <div class="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                        @if($item->product && $item->product->primaryImage)
                            <img src="{{ asset('storage/' . $item->product->primaryImage->path) }}" alt="" class="w-full h-full object-cover" />
                        @else
                            <div class="w-full h-full flex items-center justify-center text-gray-300 text-xs">?</div>
                        @endif
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900">{{ $item->product_name }}</p>
                        @if($item->variant_label)
                            <p class="text-xs text-gray-500">{{ $item->variant_label }}</p>
                        @endif
                        <p class="text-xs text-gray-400 mt-0.5">₱{{ number_format($item->unit_price, 2) }} × {{ $item->quantity }}</p>
                    </div>
                    <span class="font-medium text-gray-900 text-sm">₱{{ number_format($item->total_price, 2) }}</span>
                </div>
                @endforeach
            </div>
        </div>

        {{-- Shipment Tracking --}}
        @if($order->shipment)
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-base font-semibold text-gray-900 mb-4">Shipment Tracking</h3>

            <div class="flex items-center gap-4 text-sm mb-4">
                <div>
                    <p class="text-gray-500">Tracking Number</p>
                    <p class="font-medium text-gray-900">{{ $order->shipment->tracking_number ?? '—' }}</p>
                </div>
                <div>
                    <p class="text-gray-500">Status</p>
                    <p class="font-medium text-gray-900">{{ ucfirst(str_replace('_', ' ', $order->shipment->delivery_status)) }}</p>
                </div>
                @if($order->shipment->logisticsProfile)
                <div>
                    <p class="text-gray-500">Courier</p>
                    <p class="font-medium text-gray-900">{{ $order->shipment->logisticsProfile->company_name ?? '—' }}</p>
                </div>
                @endif
            </div>

            {{-- Timeline --}}
            @if($order->shipment->trackingEvents->count())
            <div class="border-t border-gray-100 pt-4">
                <div class="space-y-3">
                    @foreach($order->shipment->trackingEvents as $event)
                    <div class="flex gap-3">
                        <div class="flex flex-col items-center">
                            <div class="w-2.5 h-2.5 rounded-full {{ $loop->first ? 'bg-gray-900' : 'bg-gray-300' }}"></div>
                            @if(!$loop->last)
                                <div class="w-px h-full bg-gray-200 mt-1"></div>
                            @endif
                        </div>
                        <div class="pb-3">
                            <p class="text-sm font-medium text-gray-900">{{ $event->status }}</p>
                            @if($event->description)
                                <p class="text-xs text-gray-500">{{ $event->description }}</p>
                            @endif
                            <p class="text-xs text-gray-400 mt-0.5">{{ $event->created_at->format('M d, Y h:i A') }}</p>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
            @endif

            {{-- Proof of Delivery --}}
            @if($order->shipment->proofOfDelivery)
            <div class="border-t border-gray-100 mt-4 pt-4">
                <p class="text-sm font-medium text-gray-900 mb-2">Proof of Delivery</p>
                @if($order->shipment->proofOfDelivery->photo)
                    <img src="{{ asset('storage/' . $order->shipment->proofOfDelivery->photo) }}" alt="Proof"
                        class="rounded-lg max-w-xs" />
                @endif
                @if($order->shipment->proofOfDelivery->notes)
                    <p class="text-sm text-gray-600 mt-1">{{ $order->shipment->proofOfDelivery->notes }}</p>
                @endif
            </div>
            @endif
        </div>
        @endif
    </div>

    {{-- Right: Summary --}}
    <div class="lg:col-span-1 space-y-6">
        {{-- Payment Summary --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-base font-semibold text-gray-900 mb-4">Payment Summary</h3>

            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-500">Subtotal</span>
                    <span class="text-gray-900">₱{{ number_format($order->subtotal, 2) }}</span>
                </div>
                @if($order->discount_amount > 0)
                <div class="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₱{{ number_format($order->discount_amount, 2) }}</span>
                </div>
                @endif
                <div class="flex justify-between">
                    <span class="text-gray-500">Shipping</span>
                    <span class="text-gray-900">₱{{ number_format($order->shipping_fee, 2) }}</span>
                </div>
            </div>

            <div class="border-t border-gray-100 mt-3 pt-3 flex justify-between">
                <span class="font-semibold text-gray-900">Total</span>
                <span class="text-lg font-bold text-gray-900">₱{{ number_format($order->total, 2) }}</span>
            </div>

            <div class="mt-3 pt-3 border-t border-gray-100 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-500">Payment</span>
                    <span class="text-gray-900">{{ strtoupper($order->payment_method) }}</span>
                </div>
                <div class="flex justify-between mt-1">
                    <span class="text-gray-500">Status</span>
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                        {{ $order->payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800' }}">
                        {{ ucfirst($order->payment_status) }}
                    </span>
                </div>
            </div>
        </div>

        {{-- Shop Info --}}
        @if($order->sellerProfile)
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-base font-semibold text-gray-900 mb-3">Shop</h3>
            <a href="{{ route('customer.shop', $order->sellerProfile) }}" class="flex items-center gap-3 hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition">
                <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 font-bold text-sm">
                    {{ strtoupper(substr($order->sellerProfile->shop_name, 0, 1)) }}
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-900">{{ $order->sellerProfile->shop_name }}</p>
                    @if($order->sellerProfile->city)
                        <p class="text-xs text-gray-500">{{ $order->sellerProfile->city }}</p>
                    @endif
                </div>
            </a>
        </div>
        @endif

        {{-- Shipping Address --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-base font-semibold text-gray-900 mb-3">Shipping Address</h3>
            <div class="text-sm text-gray-600 space-y-1">
                <p class="font-medium text-gray-900">{{ $order->shipping_name }}</p>
                <p>{{ $order->shipping_phone }}</p>
                <p>{{ $order->shipping_address }}</p>
                <p>{{ $order->shipping_city }}</p>
            </div>
            @if($order->notes)
                <div class="mt-3 pt-3 border-t border-gray-100">
                    <p class="text-xs text-gray-500">Notes</p>
                    <p class="text-sm text-gray-600">{{ $order->notes }}</p>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection
