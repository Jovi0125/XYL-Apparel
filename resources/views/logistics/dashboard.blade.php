@extends('layouts.dashboard')

@section('page-title', 'Logistics Dashboard')

@section('sidebar')
@include('logistics.partials.sidebar')
@endsection

@section('content')
{{-- Profile Status --}}
@if (!$profile)
    <div class="mb-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm">
        <strong>Notice:</strong> Your logistics profile has not been set up yet.
        <a href="{{ route('logistics.profile.edit') }}" class="underline font-medium">Set up your profile</a> to start receiving deliveries.
    </div>
@endif

{{-- KPI Cards --}}
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
    <x-stat-card title="Assigned" :value="number_format($stats['assigned'])" />
    <x-stat-card title="In Transit" :value="number_format($stats['in_transit'])" />
    <x-stat-card title="Delivered" :value="number_format($stats['delivered'])" />
    <x-stat-card title="Failed" :value="number_format($stats['failed'])" />
</div>

{{-- Quick Actions --}}
@if($profile)
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
    <a href="{{ route('logistics.shipments.index', ['status' => 'assigned']) }}" class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
        <div class="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
        </div>
        <div>
            <p class="font-semibold text-gray-900">New Assignments</p>
            <p class="text-xs text-gray-500">{{ $stats['assigned'] }} shipment(s) waiting</p>
        </div>
    </a>
    <a href="{{ route('logistics.shipments.index') }}" class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
        <div class="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        </div>
        <div>
            <p class="font-semibold text-gray-900">All Deliveries</p>
            <p class="text-xs text-gray-500">View all shipments</p>
        </div>
    </a>
</div>
@endif

{{-- Active Shipments --}}
<div class="bg-white rounded-xl border border-gray-100 shadow-sm">
    <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 class="text-base font-semibold text-gray-900">Active Shipments</h2>
        @if($shipments->count())
            <a href="{{ route('logistics.shipments.index') }}" class="text-sm text-gray-500 hover:text-gray-900 transition">View all</a>
        @endif
    </div>
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-gray-100">
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Tracking #</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Customer</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Delivery Address</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                @forelse($shipments as $shipment)
                <tr class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4 font-medium text-gray-900">{{ $shipment->tracking_number }}</td>
                    <td class="px-6 py-4 text-gray-600">{{ $shipment->order->customer->name ?? '—' }}</td>
                    <td class="px-6 py-4 text-gray-600 max-w-xs truncate">{{ $shipment->delivery_address }}</td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            {{ $shipment->delivery_status === 'assigned' ? 'bg-blue-100 text-blue-800' : '' }}
                            {{ $shipment->delivery_status === 'picked_up' ? 'bg-indigo-100 text-indigo-800' : '' }}
                            {{ in_array($shipment->delivery_status, ['in_transit', 'out_for_delivery']) ? 'bg-yellow-100 text-yellow-800' : '' }}
                        ">
                            {{ ucfirst(str_replace('_', ' ', $shipment->delivery_status)) }}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <a href="{{ route('logistics.shipments.show', $shipment) }}" class="text-sm text-gray-900 font-medium hover:underline">View</a>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="5" class="px-6 py-12 text-center text-gray-400">No active shipments.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
