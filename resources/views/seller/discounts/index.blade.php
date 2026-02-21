@extends('layouts.dashboard')

@section('page-title', 'Discount Codes')

@section('sidebar')
@include('seller.partials.sidebar')
@endsection

@section('header-actions')
<a href="{{ route('seller.discounts.create') }}" class="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
    Create Code
</a>
@endsection

@section('content')
{{-- Search --}}
<div class="mb-6">
    <form method="GET" action="{{ route('seller.discounts.index') }}" class="flex gap-3">
        <input type="text" name="search" value="{{ request('search') }}" placeholder="Search by code..."
            class="flex-1 max-w-sm px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400">
        <button type="submit" class="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">Search</button>
        @if(request('search'))
            <a href="{{ route('seller.discounts.index') }}" class="px-4 py-2.5 text-gray-500 rounded-lg text-sm hover:text-gray-900 transition">Clear</a>
        @endif
    </form>
</div>

{{-- Table --}}
<div class="bg-white rounded-xl border border-gray-100 shadow-sm">
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-gray-100">
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Code</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Type</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Value</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Min Order</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Usage</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Period</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                    <th class="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                @forelse($discounts as $discount)
                <tr class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4">
                        <span class="font-mono font-medium text-gray-900">{{ $discount->code }}</span>
                    </td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {{ $discount->type === 'percentage' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800' }}">
                            {{ ucfirst($discount->type) }}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-gray-900 font-medium">
                        {{ $discount->type === 'percentage' ? $discount->value . '%' : '₱' . number_format($discount->value, 2) }}
                    </td>
                    <td class="px-6 py-4 text-gray-600">{{ $discount->min_order_amount ? '₱' . number_format($discount->min_order_amount, 2) : '—' }}</td>
                    <td class="px-6 py-4 text-gray-600">{{ $discount->used_count }} / {{ $discount->max_uses ?? '∞' }}</td>
                    <td class="px-6 py-4 text-gray-500 text-xs">
                        @if($discount->starts_at || $discount->expires_at)
                            {{ $discount->starts_at?->format('M d') ?? '—' }} → {{ $discount->expires_at?->format('M d, Y') ?? '∞' }}
                        @else
                            No limit
                        @endif
                    </td>
                    <td class="px-6 py-4">
                        @if($discount->isValid())
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                        @else
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Inactive</span>
                        @endif
                    </td>
                    <td class="px-6 py-4 text-right">
                        <div class="flex items-center justify-end gap-2">
                            <a href="{{ route('seller.discounts.edit', $discount) }}" class="text-sm text-gray-600 hover:text-gray-900 font-medium transition">Edit</a>
                            <form method="POST" action="{{ route('seller.discounts.destroy', $discount) }}" class="inline" onsubmit="return confirm('Delete this discount code?')">
                                @csrf @method('DELETE')
                                <button type="submit" class="text-sm text-red-500 hover:text-red-700 font-medium transition">Delete</button>
                            </form>
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="8" class="px-6 py-12 text-center text-gray-400">
                        No discount codes yet. <a href="{{ route('seller.discounts.create') }}" class="text-gray-900 font-medium hover:underline">Create one</a>
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    @if($discounts->hasPages())
    <div class="px-6 py-4 border-t border-gray-100">
        {{ $discounts->links() }}
    </div>
    @endif
</div>
@endsection
