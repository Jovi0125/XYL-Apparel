@extends('layouts.dashboard')

@section('page-title', 'My Shop')

@section('sidebar')
@include('seller.partials.sidebar')
@endsection

@section('content')
<div class="max-w-3xl">
    @if(!$seller)
        <div class="mb-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm">
            <strong>Setup Your Shop</strong> — Fill in the details below to create your seller profile.
        </div>
    @elseif($seller->status === 'pending')
        <div class="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm">
            <strong>Under Review</strong> — Your shop is awaiting admin approval.
        </div>
    @elseif($seller->status === 'approved')
        <div class="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
            <strong>Approved</strong> — Your shop is live.
        </div>
    @endif

    <form method="POST" action="{{ route('seller.shop.update') }}" enctype="multipart/form-data" class="space-y-6">
        @csrf
        @method('PUT')

        {{-- Basic Info --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-5">Shop Information</h2>

            <div class="space-y-5">
                <div>
                    <label for="shop_name" class="block text-sm font-medium text-gray-700 mb-1">Shop Name *</label>
                    <input type="text" name="shop_name" id="shop_name" value="{{ old('shop_name', $seller->shop_name ?? '') }}" required
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400"
                        placeholder="Your shop name">
                    @error('shop_name') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>

                <div>
                    <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">Bio / Description</label>
                    <textarea name="bio" id="bio" rows="4"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400 resize-none"
                        placeholder="Tell customers about your shop">{{ old('bio', $seller->bio ?? '') }}</textarea>
                    @error('bio') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input type="text" name="phone" id="phone" value="{{ old('phone', $seller->phone ?? '') }}"
                            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400"
                            placeholder="09XX XXX XXXX">
                        @error('phone') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                    </div>
                    <div>
                        <label for="website" class="block text-sm font-medium text-gray-700 mb-1">Website</label>
                        <input type="url" name="website" id="website" value="{{ old('website', $seller->website ?? '') }}"
                            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400"
                            placeholder="https://...">
                        @error('website') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                    </div>
                </div>
            </div>
        </div>

        {{-- Location --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-5">Location</h2>

            <div class="space-y-5">
                <div>
                    <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input type="text" name="address" id="address" value="{{ old('address', $seller->address ?? '') }}"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400"
                        placeholder="Street address">
                    @error('address') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>
                <div>
                    <label for="city" class="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" name="city" id="city" value="{{ old('city', $seller->city ?? '') }}"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400"
                        placeholder="City">
                    @error('city') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>
            </div>
        </div>

        {{-- Branding --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-5">Branding</h2>

            <div class="space-y-5">
                @if($seller && $seller->logo)
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Current Logo</label>
                    <img src="{{ asset('storage/' . $seller->logo) }}" alt="Logo" class="w-16 h-16 rounded-lg object-cover">
                </div>
                @endif
                <div>
                    <label for="logo" class="block text-sm font-medium text-gray-700 mb-1">{{ $seller && $seller->logo ? 'Replace Logo' : 'Shop Logo' }}</label>
                    <input type="file" name="logo" id="logo" accept="image/*"
                        class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition">
                    @error('logo') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>

                @if($seller && $seller->banner)
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Current Banner</label>
                    <img src="{{ asset('storage/' . $seller->banner) }}" alt="Banner" class="w-full max-w-md h-24 rounded-lg object-cover">
                </div>
                @endif
                <div>
                    <label for="banner" class="block text-sm font-medium text-gray-700 mb-1">{{ $seller && $seller->banner ? 'Replace Banner' : 'Shop Banner' }}</label>
                    <input type="file" name="banner" id="banner" accept="image/*"
                        class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition">
                    @error('banner') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>
            </div>
        </div>

        <div class="flex items-center gap-3">
            <button type="submit" class="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition">
                {{ $seller ? 'Update Shop' : 'Create Shop' }}
            </button>
        </div>
    </form>
</div>
@endsection
