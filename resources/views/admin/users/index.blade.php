@extends('layouts.dashboard')

@section('page-title', 'Users')

@section('sidebar')
@include('admin.partials.sidebar')
@endsection

@section('content')
{{-- Filters --}}
<div class="mb-6">
    <form method="GET" action="{{ route('admin.users.index') }}" class="flex flex-wrap gap-3">
        <input
            type="text"
            name="search"
            value="{{ request('search') }}"
            placeholder="Search by name or email..."
            class="flex-1 min-w-[220px] max-w-sm px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400"
        >
        <select name="role" class="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white">
            <option value="">All Roles</option>
            <option value="admin" {{ request('role') === 'admin' ? 'selected' : '' }}>Admin</option>
            <option value="seller" {{ request('role') === 'seller' ? 'selected' : '' }}>Seller</option>
            <option value="customer" {{ request('role') === 'customer' ? 'selected' : '' }}>Customer</option>
            <option value="logistics" {{ request('role') === 'logistics' ? 'selected' : '' }}>Logistics</option>
        </select>
        <button type="submit" class="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
            Filter
        </button>
        @if(request('search') || request('role'))
            <a href="{{ route('admin.users.index') }}" class="px-4 py-2.5 text-gray-500 rounded-lg text-sm hover:text-gray-900 transition">Clear</a>
        @endif
    </form>
</div>

{{-- Users Table --}}
<div class="bg-white rounded-xl border border-gray-100 shadow-sm">
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-gray-100">
                    <th class="text-left px-6 py-3 font-medium text-gray-500">User</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Role</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Phone</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                    <th class="text-left px-6 py-3 font-medium text-gray-500">Joined</th>
                    <th class="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                @forelse($users as $user)
                <tr class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4">
                        <div>
                            <p class="font-medium text-gray-900">{{ $user->name }}</p>
                            <p class="text-xs text-gray-400">{{ $user->email }}</p>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            @switch($user->role)
                                @case('admin') bg-purple-100 text-purple-800 @break
                                @case('seller') bg-blue-100 text-blue-800 @break
                                @case('customer') bg-gray-100 text-gray-700 @break
                                @case('logistics') bg-yellow-100 text-yellow-800 @break
                            @endswitch
                        ">
                            {{ ucfirst($user->role) }}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-gray-600">{{ $user->phone ?? '—' }}</td>
                    <td class="px-6 py-4">
                        @if($user->is_banned)
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Banned</span>
                        @else
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                        @endif
                    </td>
                    <td class="px-6 py-4 text-gray-500">{{ $user->created_at->format('M d, Y') }}</td>
                    <td class="px-6 py-4 text-right">
                        <div class="flex items-center justify-end gap-2">
                            <a href="{{ route('admin.users.show', $user) }}" class="text-sm text-gray-600 hover:text-gray-900 font-medium transition">View</a>
                            @if($user->id !== auth()->id())
                                @if($user->is_banned)
                                    <form method="POST" action="{{ route('admin.users.unban', $user) }}" class="inline">
                                        @csrf @method('PATCH')
                                        <button type="submit" class="text-sm text-green-600 hover:text-green-800 font-medium transition">Unban</button>
                                    </form>
                                @else
                                    <form method="POST" action="{{ route('admin.users.ban', $user) }}" class="inline" onsubmit="return confirm('Ban this user?')">
                                        @csrf @method('PATCH')
                                        <button type="submit" class="text-sm text-red-500 hover:text-red-700 font-medium transition">Ban</button>
                                    </form>
                                @endif
                            @endif
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="6" class="px-6 py-12 text-center text-gray-400">No users found.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    @if($users->hasPages())
    <div class="px-6 py-4 border-t border-gray-100">
        {{ $users->withQueryString()->links() }}
    </div>
    @endif
</div>
@endsection
