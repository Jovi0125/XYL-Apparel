@extends('layouts.dashboard')

@section('page-title', $user->name)

@section('sidebar')
@include('admin.partials.sidebar')
@endsection

@section('content')
{{-- Back --}}
<a href="{{ route('admin.users.index') }}" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
    Back to Users
</a>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {{-- Profile Card --}}
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div class="text-center mb-6">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-2xl font-bold text-gray-400">{{ strtoupper(substr($user->name, 0, 1)) }}</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">{{ $user->name }}</h3>
            <p class="text-sm text-gray-500">{{ $user->email }}</p>
        </div>

        <div class="space-y-3 text-sm">
            <div class="flex justify-between">
                <span class="text-gray-500">Role</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    @switch($user->role)
                        @case('admin') bg-purple-100 text-purple-800 @break
                        @case('seller') bg-blue-100 text-blue-800 @break
                        @case('customer') bg-gray-100 text-gray-700 @break
                        @case('logistics') bg-yellow-100 text-yellow-800 @break
                    @endswitch
                ">{{ ucfirst($user->role) }}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-500">Phone</span>
                <span class="text-gray-900">{{ $user->phone ?? '—' }}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-500">Status</span>
                @if($user->is_banned)
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Banned</span>
                @else
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                @endif
            </div>
            <div class="flex justify-between">
                <span class="text-gray-500">Joined</span>
                <span class="text-gray-900">{{ $user->created_at->format('M d, Y') }}</span>
            </div>
        </div>

        @if($user->id !== auth()->id())
        <div class="mt-6 pt-4 border-t border-gray-100">
            @if($user->is_banned)
                <form method="POST" action="{{ route('admin.users.unban', $user) }}">
                    @csrf @method('PATCH')
                    <button type="submit" class="w-full py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition">
                        Unban User
                    </button>
                </form>
            @else
                <form method="POST" action="{{ route('admin.users.ban', $user) }}" onsubmit="return confirm('Ban this user?')">
                    @csrf @method('PATCH')
                    <button type="submit" class="w-full py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">
                        Ban User
                    </button>
                </form>
            @endif
        </div>
        @endif
    </div>

    {{-- Activity / Orders --}}
    <div class="lg:col-span-2 space-y-6">
        @if($user->role === 'customer')
        {{-- Recent Orders --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div class="px-6 py-4 border-b border-gray-100">
                <h3 class="text-sm font-semibold text-gray-900">Recent Orders</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-gray-50">
                            <th class="text-left px-6 py-3 font-medium text-gray-500">Order</th>
                            <th class="text-left px-6 py-3 font-medium text-gray-500">Total</th>
                            <th class="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                            <th class="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        @forelse($user->orders()->latest()->take(10)->get() as $order)
                        <tr class="hover:bg-gray-50 transition">
                            <td class="px-6 py-3">
                                <a href="{{ route('admin.orders.show', $order) }}" class="font-medium text-gray-900 hover:underline">#{{ $order->order_number }}</a>
                            </td>
                            <td class="px-6 py-3 text-gray-600">₱{{ number_format($order->total_amount, 2) }}</td>
                            <td class="px-6 py-3">
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                                    @switch($order->status)
                                        @case('pending') bg-yellow-100 text-yellow-800 @break
                                        @case('processing') bg-blue-100 text-blue-800 @break
                                        @case('shipped') bg-purple-100 text-purple-800 @break
                                        @case('delivered') bg-green-100 text-green-800 @break
                                        @case('cancelled') bg-red-100 text-red-800 @break
                                        @default bg-gray-100 text-gray-700
                                    @endswitch
                                ">{{ ucfirst($order->status) }}</span>
                            </td>
                            <td class="px-6 py-3 text-gray-500">{{ $order->created_at->format('M d, Y') }}</td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="4" class="px-6 py-8 text-center text-gray-400">No orders yet.</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
        @elseif($user->role === 'seller' && $user->sellerProfile)
        {{-- Seller Profile Info --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Seller Profile</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p class="text-gray-500 mb-1">Shop Name</p>
                    <p class="font-medium text-gray-900">{{ $user->sellerProfile->shop_name ?? '—' }}</p>
                </div>
                <div>
                    <p class="text-gray-500 mb-1">Status</p>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        @switch($user->sellerProfile->status)
                            @case('approved') bg-green-100 text-green-800 @break
                            @case('pending') bg-yellow-100 text-yellow-800 @break
                            @case('rejected') bg-red-100 text-red-800 @break
                            @default bg-gray-100 text-gray-700
                        @endswitch
                    ">{{ ucfirst($user->sellerProfile->status) }}</span>
                </div>
                <div>
                    <p class="text-gray-500 mb-1">Commission Rate</p>
                    <p class="font-medium text-gray-900">{{ $user->sellerProfile->commission_rate }}%</p>
                </div>
                <div>
                    <p class="text-gray-500 mb-1">Total Earnings</p>
                    <p class="font-medium text-gray-900">₱{{ number_format($user->sellerProfile->total_earnings, 2) }}</p>
                </div>
            </div>
        </div>
        @else
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <p class="text-sm text-gray-400 text-center">No additional details for this user role.</p>
        </div>
        @endif
    </div>
</div>
@endsection
