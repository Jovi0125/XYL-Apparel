@extends('layouts.dashboard')

@section('page-title', 'My Deliveries')

@section('sidebar')
@include('logistics.partials.sidebar')
@endsection

@section('header-actions')
<form action="{{ route('logistics.shipments.index') }}" method="GET" class="flex items-center gap-2">
    <input type="text" name="search" value="{{ request('search') }}" placeholder="Search tracking #..."
        class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-44" />
    <select name="status" class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900">
        <option value="">All Status</option>
        <option value="assigned" {{ request('status') === 'assigned' ? 'selected' : '' }}>Assigned</option>
        <option value="picked_up" {{ request('status') === 'picked_up' ? 'selected' : '' }}>Picked Up</option>
        <option value="in_transit" {{ request('status') === 'in_transit' ? 'selected' : '' }}>In Transit</option>
        <option value="out_for_delivery" {{ request('status') === 'out_for_delivery' ? 'selected' : '' }}>Out for Delivery</option>
        <option value="delivered" {{ request('status') === 'delivered' ? 'selected' : '' }}>Delivered</option>
        <option value="failed" {{ request('status') === 'failed' ? 'selected' : '' }}>Failed</option>
    </select>
    <button type="submit" class="px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition">Filter</button>
</form>
@endsection

@section('content')
<div class="bg-white rounded-xl border border-gray-100 shadow-sm">
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-gray-100">
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Tracking #</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Order #</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Customer</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Delivery Address</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Assigned</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                @forelse($shipments as $shipment)
                <tr class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4">
                        <a href="{{ route('logistics.shipments.show', $shipment) }}" class="font-medium text-gray-900 hover:underline">
                            {{ $shipment->tracking_number }}
                        </a>
                    </td>
                    <td class="px-6 py-4 text-gray-600">{{ $shipment->order->order_number ?? '—' }}</td>
                    <td class="px-6 py-4">
                        <div>
                            <p class="text-gray-900">{{ $shipment->order->customer->name ?? '—' }}</p>
                            <p class="text-xs text-gray-500">{{ $shipment->order->customer->phone ?? '' }}</p>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-gray-600 max-w-xs">
                        <p class="truncate">{{ $shipment->delivery_address }}</p>
                    </td>
                    <td class="px-6 py-4">
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
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {{ $statusColors[$shipment->delivery_status] ?? 'bg-gray-100 text-gray-800' }}">
                            {{ ucfirst(str_replace('_', ' ', $shipment->delivery_status)) }}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-gray-500 text-xs">
                        {{ $shipment->assigned_at ? $shipment->assigned_at->format('M d, Y') : '—' }}
                    </td>
                    <td class="px-6 py-4">
                        <a href="{{ route('logistics.shipments.show', $shipment) }}"
                            class="text-sm text-gray-900 font-medium hover:underline">Manage</a>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="7" class="px-6 py-12 text-center text-gray-400">
                        <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <p>No shipments found.</p>
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

@if($shipments->hasPages())
<div class="mt-6">
    {{ $shipments->links() }}
</div>
@endif
@endsection
