@extends('layouts.dashboard')

@section('page-title', 'Reports & Analytics')

@section('sidebar')
@include('seller.partials.sidebar')
@endsection

@section('content')
{{-- Period Filter --}}
<div class="flex items-center justify-between mb-6">
    <div>
        <h2 class="text-lg font-semibold text-gray-900">Shop Analytics</h2>
        <p class="text-sm text-gray-500">Track your store performance</p>
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
    {{-- Revenue --}}
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-medium text-gray-500">Revenue</p>
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
            <span class="text-xs text-gray-400">vs previous</span>
        </div>
    </div>

    {{-- Orders --}}
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-medium text-gray-500">Orders</p>
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
            <span class="text-xs text-gray-400">vs previous</span>
        </div>
    </div>

    {{-- Net Earnings --}}
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-medium text-gray-500">Net Earnings</p>
            <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
        </div>
        <p class="text-2xl font-bold text-gray-900">₱{{ number_format($netEarnings, 2) }}</p>
        <p class="text-xs text-gray-400 mt-1">After platform fees</p>
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
</div>

{{-- Product Stats Row --}}
<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
        <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
        </div>
        <div>
            <p class="text-sm font-medium text-gray-900">{{ $activeProducts }} / {{ $totalProducts }}</p>
            <p class="text-xs text-gray-500">Active Products</p>
        </div>
    </div>
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
        <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
        </div>
        <div>
            <p class="text-sm font-medium text-gray-900">₱{{ number_format($platformFees, 2) }}</p>
            <p class="text-xs text-gray-500">Platform Fees Deducted</p>
        </div>
    </div>
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
        <a href="{{ route('seller.reports.products') }}?period={{ $period }}" class="flex items-center gap-3 w-full">
            <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
                <p class="text-sm font-medium text-gray-900">Product Report →</p>
                <p class="text-xs text-gray-500">Detailed product breakdown</p>
            </div>
        </a>
    </div>
</div>

{{-- Revenue Chart --}}
<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
    <h3 class="text-sm font-semibold text-gray-900 mb-4">Revenue Trend</h3>
    <div class="overflow-x-auto">
        <div class="min-w-[600px]">
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

    {{-- Top Products --}}
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-gray-900">Top Products</h3>
            <a href="{{ route('seller.reports.products') }}?period={{ $period }}" class="text-xs text-gray-500 hover:text-gray-900 transition">View all →</a>
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
    {{-- Low Stock Alert --}}
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">Low Stock Alerts</h3>
        @if($lowStockProducts->count())
        <div class="space-y-2">
            @foreach($lowStockProducts as $item)
            <div class="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <div>
                    <p class="text-sm font-medium text-gray-900">{{ $item->product_name }}</p>
                    <p class="text-xs text-gray-500">
                        {{ $item->size ? 'Size: ' . $item->size : '' }}
                        {{ $item->color ? ($item->size ? ' · ' : '') . 'Color: ' . $item->color : '' }}
                        {{ $item->sku ? ' · SKU: ' . $item->sku : '' }}
                    </p>
                </div>
                <span class="px-2 py-0.5 text-xs font-bold rounded-full {{ $item->stock == 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700' }}">
                    {{ $item->stock }} left
                </span>
            </div>
            @endforeach
        </div>
        @else
            <div class="text-center py-4">
                <svg class="w-8 h-8 text-green-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p class="text-sm text-gray-400">All products are well stocked</p>
            </div>
        @endif
    </div>

    {{-- Recent Orders --}}
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-gray-900">Recent Orders</h3>
            <a href="{{ route('seller.orders.index') }}" class="text-xs text-gray-500 hover:text-gray-900 transition">View all →</a>
        </div>
        @if($recentOrders->count())
        <div class="space-y-3">
            @foreach($recentOrders as $order)
            <div class="flex items-center justify-between">
                <div>
                    <a href="{{ route('seller.orders.show', $order) }}" class="text-sm font-medium text-gray-900 hover:underline">{{ $order->order_number }}</a>
                    <p class="text-xs text-gray-500">{{ $order->customer->name ?? 'Customer' }} · {{ $order->created_at->diffForHumans() }}</p>
                </div>
                <div class="text-right">
                    <p class="text-sm font-medium text-gray-900">₱{{ number_format($order->total, 2) }}</p>
                    @php
                        $orderBadge = match($order->order_status) {
                            'pending' => 'bg-yellow-100 text-yellow-700',
                            'processing' => 'bg-blue-100 text-blue-700',
                            'completed' => 'bg-green-100 text-green-700',
                            'cancelled' => 'bg-red-100 text-red-700',
                            default => 'bg-gray-100 text-gray-700',
                        };
                    @endphp
                    <span class="px-2 py-0.5 text-xs font-medium rounded-full {{ $orderBadge }}">{{ ucfirst($order->order_status) }}</span>
                </div>
            </div>
            @endforeach
        </div>
        @else
            <p class="text-sm text-gray-400">No recent orders</p>
        @endif
    </div>
</div>
@endsection
