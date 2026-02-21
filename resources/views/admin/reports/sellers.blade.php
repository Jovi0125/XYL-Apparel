@extends('layouts.dashboard')

@section('page-title', 'Seller Performance')

@section('sidebar')
@include('admin.partials.sidebar')
@endsection

@section('content')
{{-- Header --}}
<div class="flex items-center justify-between mb-6">
    <div>
        <a href="{{ route('admin.reports.index') }}" class="text-sm text-gray-500 hover:text-gray-900 transition inline-flex items-center gap-1 mb-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" /></svg>
            Back to Reports
        </a>
        <h2 class="text-lg font-semibold text-gray-900">Seller Performance Report</h2>
    </div>
    <form method="GET" class="flex items-center gap-2">
        <select name="period" onchange="this.form.submit()"
            class="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900">
            <option value="7" {{ $period == '7' ? 'selected' : '' }}>Last 7 days</option>
            <option value="30" {{ $period == '30' ? 'selected' : '' }}>Last 30 days</option>
            <option value="90" {{ $period == '90' ? 'selected' : '' }}>Last 90 days</option>
            <option value="365" {{ $period == '365' ? 'selected' : '' }}>Last 12 months</option>
        </select>
    </form>
</div>

{{-- Summary Cards --}}
<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <p class="text-sm text-gray-500 mb-1">Total Platform Revenue</p>
        <p class="text-2xl font-bold text-gray-900">₱{{ number_format($totalPlatformRevenue, 2) }}</p>
    </div>
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <p class="text-sm text-gray-500 mb-1">Total Platform Fees Earned</p>
        <p class="text-2xl font-bold text-gray-900">₱{{ number_format($totalPlatformFees, 2) }}</p>
    </div>
</div>

{{-- Sellers Table --}}
<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-gray-100">
                    <th class="text-left px-6 py-3 font-medium text-gray-500">#</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Shop</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Owner</th>
                    <th class="text-right px-6 py-3 font-medium text-gray-500">Products</th>
                    <th class="text-right px-6 py-3 font-medium text-gray-500">Orders</th>
                    <th class="text-right px-6 py-3 font-medium text-gray-500">Revenue</th>
                    <th class="text-right px-6 py-3 font-medium text-gray-500">Platform Fee</th>
                    <th class="text-right px-6 py-3 font-medium text-gray-500">Commission %</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                @forelse($sellers as $i => $seller)
                <tr class="hover:bg-gray-50 transition">
                    <td class="px-6 py-3 text-gray-400 font-medium">{{ $sellers->firstItem() + $i }}</td>
                    <td class="px-6 py-3">
                        <div>
                            <p class="font-medium text-gray-900">{{ $seller->shop_name }}</p>
                            <p class="text-xs text-gray-400">{{ $seller->city }}</p>
                        </div>
                    </td>
                    <td class="px-6 py-3 text-gray-600">{{ $seller->user->name ?? '—' }}</td>
                    <td class="px-6 py-3 text-right text-gray-900">{{ $seller->products_count }}</td>
                    <td class="px-6 py-3 text-right text-gray-900">{{ $seller->total_orders ?? 0 }}</td>
                    <td class="px-6 py-3 text-right font-medium text-gray-900">₱{{ number_format($seller->total_revenue ?? 0, 2) }}</td>
                    <td class="px-6 py-3 text-right text-gray-600">₱{{ number_format($seller->platform_fees ?? 0, 2) }}</td>
                    <td class="px-6 py-3 text-right">
                        <span class="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{{ $seller->commission_rate }}%</span>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="8" class="px-6 py-12 text-center text-gray-400">
                        No sellers found for this period
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
    @if($sellers->hasPages())
    <div class="px-6 py-4 border-t border-gray-100">
        {{ $sellers->withQueryString()->links() }}
    </div>
    @endif
</div>
@endsection
