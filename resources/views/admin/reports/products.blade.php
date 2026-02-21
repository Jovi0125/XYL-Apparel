@extends('layouts.dashboard')

@section('page-title', 'Product Performance')

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
        <h2 class="text-lg font-semibold text-gray-900">Product Performance Report</h2>
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

{{-- Products Table --}}
<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-gray-100">
                    <th class="text-left px-6 py-3 font-medium text-gray-500">#</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Product</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Shop</th>
                    <th class="text-right px-6 py-3 font-medium text-gray-500">Units Sold</th>
                    <th class="text-right px-6 py-3 font-medium text-gray-500">Orders</th>
                    <th class="text-right px-6 py-3 font-medium text-gray-500">Revenue</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                @forelse($products as $i => $product)
                <tr class="hover:bg-gray-50 transition">
                    <td class="px-6 py-3 text-gray-400 font-medium">{{ $products->firstItem() + $i }}</td>
                    <td class="px-6 py-3">
                        <p class="font-medium text-gray-900">{{ $product->product_name }}</p>
                    </td>
                    <td class="px-6 py-3 text-gray-600">{{ $product->shop_name }}</td>
                    <td class="px-6 py-3 text-right text-gray-900 font-medium">{{ number_format($product->total_sold) }}</td>
                    <td class="px-6 py-3 text-right text-gray-600">{{ $product->order_count }}</td>
                    <td class="px-6 py-3 text-right font-semibold text-gray-900">₱{{ number_format($product->total_revenue, 2) }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="6" class="px-6 py-12 text-center text-gray-400">
                        No product sales data for this period
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
    @if($products->hasPages())
    <div class="px-6 py-4 border-t border-gray-100">
        {{ $products->withQueryString()->links() }}
    </div>
    @endif
</div>
@endsection
