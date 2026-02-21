@extends('layouts.dashboard')

@section('page-title', 'My Profile')

@section('sidebar')
@include('logistics.partials.sidebar')
@endsection

@section('content')
<div class="max-w-2xl">
    {{-- Success --}}
    @if(session('success'))
    <div class="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700">
        {{ session('success') }}
    </div>
    @endif

    {{-- Profile Card --}}
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {{ strtoupper(substr(auth()->user()->name, 0, 1)) }}
            </div>
            <div>
                <h2 class="text-lg font-semibold text-gray-900">{{ auth()->user()->name }}</h2>
                <p class="text-sm text-gray-500">{{ auth()->user()->email }}</p>
            </div>
        </div>

        <form action="{{ route('logistics.profile.update') }}" method="POST">
            @csrf
            @method('PUT')

            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Display Name <span class="text-red-500">*</span></label>
                    <input type="text" name="name" value="{{ old('name', $profile->name ?? auth()->user()->name) }}"
                        class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
                    @error('name') <p class="text-xs text-red-500 mt-1">{{ $message }}</p> @enderror
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number <span class="text-red-500">*</span></label>
                    <input type="tel" name="phone" value="{{ old('phone', $profile->phone ?? '') }}" placeholder="09XX-XXX-XXXX"
                        class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
                    @error('phone') <p class="text-xs text-red-500 mt-1">{{ $message }}</p> @enderror
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Service Area <span class="text-red-500">*</span></label>
                    <textarea name="service_area" rows="3" placeholder="Describe the areas you cover for deliveries (e.g. Metro Manila, Cebu City)"
                        class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">{{ old('service_area', $profile->service_area ?? '') }}</textarea>
                    @error('service_area') <p class="text-xs text-red-500 mt-1">{{ $message }}</p> @enderror
                </div>
            </div>

            <div class="mt-6">
                <button type="submit"
                    class="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">
                    Save Profile
                </button>
            </div>
        </form>
    </div>

    {{-- Account Info --}}
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">Account Information</h3>
        <dl class="space-y-3 text-sm">
            <div class="flex justify-between">
                <dt class="text-gray-500">Account Email</dt>
                <dd class="text-gray-900">{{ auth()->user()->email }}</dd>
            </div>
            <div class="flex justify-between">
                <dt class="text-gray-500">Role</dt>
                <dd><span class="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{{ ucfirst(auth()->user()->role) }}</span></dd>
            </div>
            <div class="flex justify-between">
                <dt class="text-gray-500">Member Since</dt>
                <dd class="text-gray-900">{{ auth()->user()->created_at->format('M d, Y') }}</dd>
            </div>
            @if($profile)
            <div class="flex justify-between">
                <dt class="text-gray-500">Profile Status</dt>
                <dd>
                    <span class="px-2 py-0.5 text-xs font-medium rounded-full {{ $profile->status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700' }}">
                        {{ ucfirst($profile->status) }}
                    </span>
                </dd>
            </div>
            @endif
        </dl>
    </div>
</div>
@endsection
