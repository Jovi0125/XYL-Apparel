@extends('layouts.dashboard')

@section('page-title', 'Seller Dashboard')

@section('sidebar')
@include('seller.partials.sidebar')
@endsection

@section('content')
{{-- Shop Status Banner --}}
@if (!$seller)
    <div class="mb-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm">
        <strong>Welcome!</strong> You haven't set up your shop yet. Complete your shop profile to start selling.
    </div>
@elseif ($seller->status === 'pending')
    <div class="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm">
        <strong>Under Review:</strong> Your shop is pending approval by the admin team. You'll be notified once approved.
    </div>
@elseif ($seller->status === 'banned')
    <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
        <strong>Suspended:</strong> Your shop has been suspended. Please contact support for details.
    </div>
@endif

{{-- KPI Cards --}}
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
    <x-stat-card title="Total Products" :value="number_format($stats['total_products'])" />
    <x-stat-card title="Total Orders" :value="number_format($stats['total_orders'])" />
    <x-stat-card title="Pending Orders" :value="number_format($stats['pending_orders'])" />
    <x-stat-card title="Total Revenue" :value="'₱ ' . number_format($stats['total_revenue'], 2)" />
</div>

{{-- Quick Actions --}}
<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
    <h2 class="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
    <div class="flex flex-wrap gap-3">
        <a href="{{ route('seller.products.create') }}" class="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
        </a>
        <a href="{{ route('seller.orders.index') }}" class="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
            View Orders
        </a>
        <a href="{{ route('seller.discounts.create') }}" class="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
            Create Discount
        </a>
    </div>
</div>
@endsection
