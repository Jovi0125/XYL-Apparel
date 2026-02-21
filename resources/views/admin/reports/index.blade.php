@extends('layouts.dashboard')

@section('page-title', 'Reports & Analytics')

@section('sidebar')
@include('admin.partials.sidebar')
@endsection

@section('content')
{{-- Period Filter --}}
<div class="flex items-center justify-between mb-6">
    <div>
        <h2 class="text-lg font-semibold text-gray-900">Platform Analytics</h2>
        <p class="text-sm text-gray-500">Overview of your marketplace performance</p>
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

{{-- KPI Cards --}}
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    {{-- Total Revenue --}}
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-medium text-gray-500">Total Revenue</p>
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
        </div>
        <p class="text-2xl font-bold text-gray-900">₱{{ number_format($totalRevenue, 2) }}</p>
        <div class="flex items-center gap-1 mt-1">
            @if($revenueGrowth >= 0)
                <svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                <span class="text-xs font-medium text-green-600">+{{ $revenueGrowth }}%</span>
            @else
                <svg class="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
                <span class="text-xs font-medium text-red-600">{{ $revenueGrowth }}%</span>
            @endif
            <span class="text-xs text-gray-400">vs previous period</span>
        </div>
    </div>

    {{-- Total Orders --}}
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-medium text-gray-500">Total Orders</p>
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ number_format($totalOrders) }}</p>
        <div class="flex items-center gap-1 mt-1">
            @if($orderGrowth >= 0)
                <svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                <span class="text-xs font-medium text-green-600">+{{ $orderGrowth }}%</span>
            @else
                <svg class="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
                <span class="text-xs font-medium text-red-600">{{ $orderGrowth }}%</span>
            @endif
            <span class="text-xs text-gray-400">vs previous period</span>
        </div>
    </div>

    {{-- Avg Order Value --}}
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-medium text-gray-500">Avg Order Value</p>
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
        </div>
        <p class="text-2xl font-bold text-gray-900">₱{{ number_format($averageOrderValue, 2) }}</p>
        <p class="text-xs text-gray-400 mt-1">Per transaction</p>
    </div>

    {{-- Platform Fees --}}
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-medium text-gray-500">Platform Fees</p>
            <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
        </div>
        <p class="text-2xl font-bold text-gray-900">₱{{ number_format($platformFees, 2) }}</p>
        <p class="text-xs text-gray-400 mt-1">Commission earned</p>
    </div>
</div>

{{-- Quick Stats Row --}}
<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
        <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </div>
        <div>
            <p class="text-sm font-medium text-gray-900">{{ number_format($totalCustomers) }}</p>
            <p class="text-xs text-gray-500">Total Customers <span class="text-green-600">(+{{ $newCustomers }} new)</span></p>
        </div>
    </div>
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
        <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        </div>
        <div>
            <p class="text-sm font-medium text-gray-900">{{ number_format($totalSellers) }}</p>
            <p class="text-xs text-gray-500">Active Sellers</p>
        </div>
    </div>
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
        <a href="{{ route('admin.reports.sellers') }}?period={{ $period }}" class="flex items-center gap-3 w-full">
            <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
                <p class="text-sm font-medium text-gray-900">View All Reports →</p>
                <p class="text-xs text-gray-500">Seller & Product breakdowns</p>
            </div>
        </a>
    </div>
</div>

{{-- Revenue Chart --}}
<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
    <h3 class="text-sm font-semibold text-gray-900 mb-4">Revenue Trend</h3>
    <div class="overflow-x-auto" x-data="revenueChart()" x-init="init()">
        <div class="min-w-[600px]">
            {{-- Y-axis labels + bars --}}
            <div class="flex items-end gap-1" style="height: 200px;">
                @if($dailyRevenue->count())
                    @php $maxRevenue = $dailyRevenue->max('revenue') ?: 1; @endphp
                    @foreach($dailyRevenue as $day)
                        <div class="flex-1 flex flex-col items-center justify-end h-full group relative">
                            <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-10">
                                ₱{{ number_format($day->revenue, 2) }} · {{ $day->orders }} orders
                            </div>
                            <div class="w-full max-w-[40px] bg-gray-900 rounded-t transition-all hover:bg-gray-700"
                                style="height: {{ ($day->revenue / $maxRevenue) * 100 }}%;min-height: 4px;"></div>
                        </div>
                    @endforeach
                @else
                    <div class="w-full flex items-center justify-center text-sm text-gray-400">
                        No revenue data for this period
                    </div>
                @endif
            </div>
            {{-- X-axis labels --}}
            @if($dailyRevenue->count())
            <div class="flex gap-1 mt-2">
                @foreach($dailyRevenue as $day)
                    <div class="flex-1 text-center text-[10px] text-gray-400 truncate">
                        {{ \Carbon\Carbon::parse($day->date)->format('M d') }}
                    </div>
                @endforeach
            </div>
            @endif
        </div>
    </div>
</div>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    {{-- Order Status Breakdown --}}
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">Orders by Status</h3>
        @php
            $statusColors = [
                'pending' => 'bg-yellow-400',
                'processing' => 'bg-blue-400',
                'ready_for_pickup' => 'bg-purple-400',
                'completed' => 'bg-green-400',
                'cancelled' => 'bg-red-400',
            ];
            $totalStatusOrders = array_sum($ordersByStatus);
        @endphp
        @if($totalStatusOrders > 0)
            {{-- Stacked bar --}}
            <div class="flex h-4 rounded-full overflow-hidden mb-4">
                @foreach($ordersByStatus as $status => $count)
                    <div class="{{ $statusColors[$status] ?? 'bg-gray-400' }}" style="width: {{ ($count / $totalStatusOrders) * 100 }}%"></div>
                @endforeach
            </div>
            <div class="space-y-2">
                @foreach($ordersByStatus as $status => $count)
                <div class="flex items-center justify-between text-sm">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full {{ $statusColors[$status] ?? 'bg-gray-400' }}"></div>
                        <span class="text-gray-600">{{ ucfirst(str_replace('_', ' ', $status)) }}</span>
                    </div>
                    <span class="font-medium text-gray-900">{{ $count }}</span>
                </div>
                @endforeach
            </div>
        @else
            <p class="text-sm text-gray-400">No orders in this period</p>
        @endif
    </div>

    {{-- Delivery Stats --}}
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">Delivery Status</h3>
        @php
            $deliveryColors = [
                'unassigned' => 'bg-gray-400',
                'assigned' => 'bg-blue-400',
                'picked_up' => 'bg-indigo-400',
                'in_transit' => 'bg-purple-400',
                'out_for_delivery' => 'bg-amber-400',
                'delivered' => 'bg-green-400',
                'failed' => 'bg-red-400',
            ];
            $totalDeliveries = array_sum($deliveryStats);
        @endphp
        @if($totalDeliveries > 0)
            <div class="space-y-2">
                @foreach($deliveryStats as $status => $count)
                <div class="flex items-center justify-between text-sm">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full {{ $deliveryColors[$status] ?? 'bg-gray-400' }}"></div>
                        <span class="text-gray-600">{{ ucfirst(str_replace('_', ' ', $status)) }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-24 bg-gray-100 rounded-full h-1.5">
                            <div class="{{ $deliveryColors[$status] ?? 'bg-gray-400' }} h-1.5 rounded-full" style="width: {{ ($count / $totalDeliveries) * 100 }}%"></div>
                        </div>
                        <span class="font-medium text-gray-900 w-8 text-right">{{ $count }}</span>
                    </div>
                </div>
                @endforeach
            </div>
        @else
            <p class="text-sm text-gray-400">No shipments in this period</p>
        @endif
    </div>
</div>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    {{-- Top Sellers --}}
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-gray-900">Top Sellers</h3>
            <a href="{{ route('admin.reports.sellers') }}?period={{ $period }}" class="text-xs text-gray-500 hover:text-gray-900 transition">View all →</a>
        </div>
        @if($topSellers->count())
        <div class="space-y-3">
            @foreach($topSellers as $i => $seller)
            <div class="flex items-center gap-3">
                <span class="text-xs font-bold text-gray-300 w-5">{{ $i + 1 }}</span>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ $seller->shop_name }}</p>
                    <p class="text-xs text-gray-500">{{ $seller->total_orders ?? 0 }} orders</p>
                </div>
                <p class="text-sm font-semibold text-gray-900">₱{{ number_format($seller->total_revenue ?? 0, 2) }}</p>
            </div>
            @endforeach
        </div>
        @else
            <p class="text-sm text-gray-400">No seller data</p>
        @endif
    </div>

    {{-- Top Products --}}
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-gray-900">Top Products</h3>
            <a href="{{ route('admin.reports.products') }}?period={{ $period }}" class="text-xs text-gray-500 hover:text-gray-900 transition">View all →</a>
        </div>
        @if($topProducts->count())
        <div class="space-y-3">
            @foreach($topProducts->take(5) as $i => $product)
            <div class="flex items-center gap-3">
                <span class="text-xs font-bold text-gray-300 w-5">{{ $i + 1 }}</span>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ $product->product_name }}</p>
                    <p class="text-xs text-gray-500">{{ $product->total_sold }} units sold</p>
                </div>
                <p class="text-sm font-semibold text-gray-900">₱{{ number_format($product->total_revenue, 2) }}</p>
            </div>
            @endforeach
        </div>
        @else
            <p class="text-sm text-gray-400">No product data</p>
        @endif
    </div>
</div>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {{-- Top Categories --}}
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">Top Categories</h3>
        @if($topCategories->count())
        @php $maxCatRevenue = $topCategories->max('total_revenue') ?: 1; @endphp
        <div class="space-y-3">
            @foreach($topCategories as $cat)
            <div>
                <div class="flex items-center justify-between text-sm mb-1">
                    <span class="text-gray-700">{{ $cat->category_name }}</span>
                    <span class="font-medium text-gray-900">₱{{ number_format($cat->total_revenue, 2) }}</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-gray-900 h-2 rounded-full" style="width: {{ ($cat->total_revenue / $maxCatRevenue) * 100 }}%"></div>
                </div>
                <p class="text-xs text-gray-400 mt-0.5">{{ $cat->total_sold }} units sold</p>
            </div>
            @endforeach
        </div>
        @else
            <p class="text-sm text-gray-400">No category data</p>
        @endif
    </div>

    {{-- Payment Methods --}}
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">Payment Methods</h3>
        @if($paymentMethods->count())
        <div class="space-y-3">
            @foreach($paymentMethods as $method)
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                    <p class="text-sm font-medium text-gray-900">{{ ucfirst(str_replace('_', ' ', $method->payment_method ?? 'N/A')) }}</p>
                    <p class="text-xs text-gray-500">{{ $method->count }} transactions</p>
                </div>
                <p class="text-sm font-semibold text-gray-900">₱{{ number_format($method->total, 2) }}</p>
            </div>
            @endforeach
        </div>
        @else
            <p class="text-sm text-gray-400">No payment data</p>
        @endif
    </div>
</div>

<script>
function revenueChart() {
    return {
        init() {
            // Chart animations could be added here with Alpine.js
        }
    }
}
</script>
@endsection
