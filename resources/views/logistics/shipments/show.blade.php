@extends('layouts.dashboard')

@section('page-title', 'Shipment ' . $shipment->tracking_number)

@section('sidebar')
@include('logistics.partials.sidebar')
@endsection

@section('content')
{{-- Back --}}
<div class="mb-4">
    <a href="{{ route('logistics.shipments.index') }}" class="text-sm text-gray-500 hover:text-gray-900 transition inline-flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" /></svg>
        Back to Deliveries
    </a>
</div>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {{-- Left Column --}}
    <div class="lg:col-span-2 space-y-6">
        {{-- Shipment Header --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div class="flex items-start justify-between mb-4">
                <div>
                    <h2 class="text-lg font-semibold text-gray-900">{{ $shipment->tracking_number }}</h2>
                    <p class="text-sm text-gray-500">Order: {{ $shipment->order->order_number }}</p>
                </div>
                @php
                    $statusColors = [
                        'unassigned' => 'bg-gray-100 text-gray-800',
                        'assigned' => 'bg-blue-100 text-blue-800',
                        'picked_up' => 'bg-indigo-100 text-indigo-800',
                        'in_transit' => 'bg-yellow-100 text-yellow-800',
                        'out_for_delivery' => 'bg-orange-100 text-orange-800',
                        'delivered' => 'bg-green-100 text-green-800',
                        'failed' => 'bg-red-100 text-red-800',
                    ];
                @endphp
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {{ $statusColors[$shipment->delivery_status] ?? 'bg-gray-100 text-gray-800' }}">
                    {{ ucfirst(str_replace('_', ' ', $shipment->delivery_status)) }}
                </span>
            </div>

            {{-- Status Progress --}}
            @php
                $statuses = ['assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];
                $currentIndex = array_search($shipment->delivery_status, $statuses);
                $isFailed = $shipment->delivery_status === 'failed';
            @endphp
            @if(!$isFailed)
            <div class="flex items-center gap-1 mb-4">
                @foreach($statuses as $i => $s)
                <div class="flex-1">
                    <div class="h-1.5 rounded-full {{ $i <= $currentIndex ? 'bg-gray-900' : 'bg-gray-100' }}"></div>
                    <p class="text-[10px] mt-1 {{ $i <= $currentIndex ? 'text-gray-900 font-medium' : 'text-gray-400' }}">
                        {{ ucfirst(str_replace('_', ' ', $s)) }}
                    </p>
                </div>
                @endforeach
            </div>
            @endif

            {{-- Quick Status Update --}}
            @if(!in_array($shipment->delivery_status, ['delivered', 'failed']))
            <div class="border-t border-gray-100 pt-4">
                <p class="text-sm font-medium text-gray-700 mb-2">Update Status</p>
                <form action="{{ route('logistics.shipments.status', $shipment) }}" method="POST" class="flex flex-wrap gap-2">
                    @csrf
                    @method('PATCH')
                    @php
                        $nextStatuses = match($shipment->delivery_status) {
                            'assigned' => ['picked_up'],
                            'picked_up' => ['in_transit'],
                            'in_transit' => ['out_for_delivery'],
                            'out_for_delivery' => ['delivered', 'failed'],
                            default => [],
                        };
                    @endphp
                    @foreach($nextStatuses as $next)
                    <button type="submit" name="delivery_status" value="{{ $next }}"
                        class="px-4 py-2 text-sm font-medium rounded-lg transition
                        {{ $next === 'failed' ? 'border border-red-200 text-red-600 hover:bg-red-50' : 'bg-gray-900 text-white hover:bg-gray-800' }}">
                        {{ ucfirst(str_replace('_', ' ', $next)) }}
                    </button>
                    @endforeach
                </form>
            </div>
            @endif
        </div>

        {{-- Order Items --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
                <h3 class="text-base font-semibold text-gray-900">Package Contents</h3>
            </div>
            <div class="divide-y divide-gray-50">
                @foreach($shipment->order->items as $item)
                <div class="px-6 py-3 flex items-center gap-4">
                    <div class="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
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
                    </div>
                    <span class="text-sm text-gray-600">×{{ $item->quantity }}</span>
                </div>
                @endforeach
            </div>
        </div>

        {{-- Tracking Timeline --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-semibold text-gray-900">Tracking History</h3>
                @if(!in_array($shipment->delivery_status, ['delivered', 'failed']))
                <a href="{{ route('logistics.tracking.create', $shipment) }}"
                    class="text-sm text-gray-900 font-medium hover:underline">+ Add Event</a>
                @endif
            </div>

            @if($shipment->trackingEvents->count())
            <div class="space-y-0">
                @foreach($shipment->trackingEvents as $event)
                <div class="flex gap-3">
                    <div class="flex flex-col items-center">
                        <div class="w-3 h-3 rounded-full {{ $loop->first ? 'bg-gray-900' : 'bg-gray-300' }} mt-1"></div>
                        @if(!$loop->last)
                            <div class="w-px flex-1 bg-gray-200 my-1"></div>
                        @endif
                    </div>
                    <div class="pb-4 flex-1">
                        <div class="flex items-start justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-900">{{ $event->status }}</p>
                                @if($event->location_text)
                                    <p class="text-xs text-gray-500 mt-0.5">
                                        <svg class="w-3 h-3 inline-block mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {{ $event->location_text }}
                                    </p>
                                @endif
                                @if($event->remarks)
                                    <p class="text-xs text-gray-500 mt-0.5">{{ $event->remarks }}</p>
                                @endif
                            </div>
                            <div class="text-right flex-shrink-0">
                                <p class="text-xs text-gray-400">{{ $event->created_at->format('M d, Y') }}</p>
                                <p class="text-xs text-gray-400">{{ $event->created_at->format('h:i A') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
            @else
            <p class="text-sm text-gray-400 text-center py-4">No tracking events yet.</p>
            @endif
        </div>

        {{-- Proof of Delivery --}}
        @if($shipment->proofOfDelivery)
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-base font-semibold text-gray-900 mb-4">Proof of Delivery</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @if($shipment->proofOfDelivery->photo_path)
                <div>
                    <p class="text-xs text-gray-500 mb-1">Photo</p>
                    <img src="{{ asset('storage/' . $shipment->proofOfDelivery->photo_path) }}" alt="Delivery photo"
                        class="rounded-lg max-h-48 object-cover" />
                </div>
                @endif
                @if($shipment->proofOfDelivery->signature_path)
                <div>
                    <p class="text-xs text-gray-500 mb-1">Signature</p>
                    <img src="{{ asset('storage/' . $shipment->proofOfDelivery->signature_path) }}" alt="Signature"
                        class="rounded-lg max-h-48 object-contain bg-gray-50 p-2" />
                </div>
                @endif
            </div>
            <div class="mt-3 text-sm">
                <p class="text-gray-500">Received by: <span class="text-gray-900 font-medium">{{ $shipment->proofOfDelivery->receiver_name }}</span></p>
                @if($shipment->proofOfDelivery->received_at)
                    <p class="text-gray-500">At: {{ $shipment->proofOfDelivery->received_at->format('M d, Y h:i A') }}</p>
                @endif
            </div>
        </div>
        @elseif($shipment->delivery_status === 'out_for_delivery' || $shipment->delivery_status === 'delivered')
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
            <p class="text-sm text-gray-500 mb-2">No proof of delivery submitted yet.</p>
            @if(!$shipment->proofOfDelivery)
            <a href="{{ route('logistics.pod.create', $shipment) }}"
                class="inline-flex px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">
                Upload Proof of Delivery
            </a>
            @endif
        </div>
        @endif
    </div>

    {{-- Right Column --}}
    <div class="lg:col-span-1 space-y-6">
        {{-- Addresses --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-base font-semibold text-gray-900 mb-4">Addresses</h3>

            <div class="space-y-4">
                <div>
                    <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Pickup From</p>
                    <p class="text-sm text-gray-900">{{ $shipment->order->sellerProfile->shop_name ?? '—' }}</p>
                    <p class="text-sm text-gray-600">{{ $shipment->pickup_address }}</p>
                </div>
                <div class="border-t border-gray-100 pt-4">
                    <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Deliver To</p>
                    <p class="text-sm text-gray-900">{{ $shipment->order->customer->name ?? '—' }}</p>
                    <p class="text-sm text-gray-600">{{ $shipment->delivery_address }}</p>
                    @if($shipment->order->shipping_phone)
                        <p class="text-sm text-gray-600 mt-1">
                            <svg class="w-3.5 h-3.5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            {{ $shipment->order->shipping_phone }}
                        </p>
                    @endif
                </div>
            </div>
        </div>

        {{-- Timestamps --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-base font-semibold text-gray-900 mb-3">Timeline</h3>
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-500">Assigned</span>
                    <span class="text-gray-900">{{ $shipment->assigned_at ? $shipment->assigned_at->format('M d, h:i A') : '—' }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Picked Up</span>
                    <span class="text-gray-900">{{ $shipment->picked_up_at ? $shipment->picked_up_at->format('M d, h:i A') : '—' }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Delivered</span>
                    <span class="text-gray-900">{{ $shipment->delivered_at ? $shipment->delivered_at->format('M d, h:i A') : '—' }}</span>
                </div>
            </div>
        </div>

        {{-- Notes --}}
        @if($shipment->notes)
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-base font-semibold text-gray-900 mb-2">Notes</h3>
            <p class="text-sm text-gray-600">{{ $shipment->notes }}</p>
        </div>
        @endif

        {{-- Order Summary --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-base font-semibold text-gray-900 mb-3">Order Summary</h3>
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-500">Items</span>
                    <span class="text-gray-900">{{ $shipment->order->items->sum('quantity') }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Total</span>
                    <span class="font-medium text-gray-900">₱{{ number_format($shipment->order->total, 2) }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Payment</span>
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                        {{ $shipment->order->payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800' }}">
                        {{ strtoupper($shipment->order->payment_method) }} — {{ ucfirst($shipment->order->payment_status) }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
