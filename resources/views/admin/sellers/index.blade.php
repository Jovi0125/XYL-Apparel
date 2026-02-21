@extends('layouts.dashboard')

@section('page-title', 'Sellers')

@section('sidebar')
@include('admin.partials.sidebar')
@endsection

@section('content')
{{-- Filters --}}
<div class="mb-6">
    <form method="GET" action="{{ route('admin.sellers.index') }}" class="flex flex-wrap gap-3">
        <input
            type="text"
            name="search"
            value="{{ request('search') }}"
            placeholder="Search by shop or seller name..."
            class="flex-1 min-w-[220px] max-w-sm px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400"
        >
        <select name="status" class="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white">
            <option value="">All Status</option>
            <option value="pending" {{ request('status') === 'pending' ? 'selected' : '' }}>Pending</option>
            <option value="approved" {{ request('status') === 'approved' ? 'selected' : '' }}>Approved</option>
            <option value="rejected" {{ request('status') === 'rejected' ? 'selected' : '' }}>Rejected</option>
        </select>
        <button type="submit" class="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
            Filter
        </button>
        @if(request('search') || request('status'))
            <a href="{{ route('admin.sellers.index') }}" class="px-4 py-2.5 text-gray-500 rounded-lg text-sm hover:text-gray-900 transition">Clear</a>
        @endif
    </form>
</div>

{{-- Sellers Table --}}
<div class="bg-white rounded-xl border border-gray-100 shadow-sm">
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-gray-100">
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Seller</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Shop Name</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Products</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Earnings</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                    <th class="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                @forelse($sellers as $seller)
                <tr class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4">
                        <div>
                            <p class="font-medium text-gray-900">{{ $seller->user->name }}</p>
                            <p class="text-xs text-gray-400">{{ $seller->user->email }}</p>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-gray-600">{{ $seller->shop_name ?? '—' }}</td>
                    <td class="px-6 py-4 text-gray-600">{{ $seller->products_count ?? $seller->products()->count() }}</td>
                    <td class="px-6 py-4 text-gray-900 font-medium">₱{{ number_format($seller->total_earnings, 2) }}</td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            @switch($seller->status)
                                @case('approved') bg-green-100 text-green-800 @break
                                @case('pending') bg-yellow-100 text-yellow-800 @break
                                @case('rejected') bg-red-100 text-red-800 @break
                                @default bg-gray-100 text-gray-700
                            @endswitch
                        ">{{ ucfirst($seller->status) }}</span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <div class="flex items-center justify-end gap-2">
                            <a href="{{ route('admin.sellers.show', $seller) }}" class="text-sm text-gray-600 hover:text-gray-900 font-medium transition">View</a>
                            @if($seller->status === 'pending')
                                <form method="POST" action="{{ route('admin.sellers.approve', $seller) }}" class="inline">
                                    @csrf @method('PATCH')
                                    <button type="submit" class="text-sm text-green-600 hover:text-green-800 font-medium transition">Approve</button>
                                </form>
                            @endif
                            @if(!$seller->user->is_banned)
                                <form method="POST" action="{{ route('admin.sellers.ban', $seller) }}" class="inline" onsubmit="return confirm('Ban this seller?')">
                                    @csrf @method('PATCH')
                                    <button type="submit" class="text-sm text-red-500 hover:text-red-700 font-medium transition">Ban</button>
                                </form>
                            @else
                                <form method="POST" action="{{ route('admin.sellers.unban', $seller) }}" class="inline">
                                    @csrf @method('PATCH')
                                    <button type="submit" class="text-sm text-green-600 hover:text-green-800 font-medium transition">Unban</button>
                                </form>
                            @endif
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="6" class="px-6 py-12 text-center text-gray-400">No sellers found.</td>
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
