@extends('layouts.dashboard')

@section('page-title', 'Edit Discount Code')

@section('sidebar')
@include('seller.partials.sidebar')
@endsection

@section('content')
<div class="max-w-2xl">
    <a href="{{ route('seller.discounts.index') }}" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        Back to Discounts
    </a>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-2">Edit: {{ $discount->code }}</h2>
        <p class="text-sm text-gray-400 mb-6">Used {{ $discount->used_count }} time{{ $discount->used_count !== 1 ? 's' : '' }}</p>

        <form method="POST" action="{{ route('seller.discounts.update', $discount) }}" class="space-y-5">
            @csrf
            @method('PUT')

            <div>
                <label for="code" class="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                <input type="text" name="code" id="code" value="{{ old('code', $discount->code) }}" required
                    class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">
                @error('code') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label for="type" class="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select name="type" id="type"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white">
                        <option value="percentage" {{ old('type', $discount->type) === 'percentage' ? 'selected' : '' }}>Percentage (%)</option>
                        <option value="fixed" {{ old('type', $discount->type) === 'fixed' ? 'selected' : '' }}>Fixed Amount (₱)</option>
                    </select>
                    @error('type') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>
                <div>
                    <label for="value" class="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                    <input type="number" name="value" id="value" value="{{ old('value', $discount->value) }}" required step="0.01" min="0.01"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">
                    @error('value') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label for="min_order_amount" class="block text-sm font-medium text-gray-700 mb-1">Min Order Amount (₱)</label>
                    <input type="number" name="min_order_amount" id="min_order_amount" value="{{ old('min_order_amount', $discount->min_order_amount) }}" step="0.01" min="0"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        placeholder="Optional">
                    @error('min_order_amount') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>
                <div>
                    <label for="max_uses" class="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
                    <input type="number" name="max_uses" id="max_uses" value="{{ old('max_uses', $discount->max_uses) }}" min="1"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        placeholder="Unlimited">
                    @error('max_uses') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label for="starts_at" class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input type="date" name="starts_at" id="starts_at" value="{{ old('starts_at', $discount->starts_at?->format('Y-m-d')) }}"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">
                    @error('starts_at') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>
                <div>
                    <label for="expires_at" class="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input type="date" name="expires_at" id="expires_at" value="{{ old('expires_at', $discount->expires_at?->format('Y-m-d')) }}"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">
                    @error('expires_at') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>
            </div>

            <div class="flex items-center gap-2">
                <input type="hidden" name="is_active" value="0">
                <input type="checkbox" name="is_active" id="is_active" value="1" {{ old('is_active', $discount->is_active) ? 'checked' : '' }}
                    class="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900">
                <label for="is_active" class="text-sm text-gray-700">Active</label>
            </div>

            <div class="flex items-center gap-3 pt-2">
                <button type="submit" class="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition">Update Code</button>
                <a href="{{ route('seller.discounts.index') }}" class="px-6 py-2.5 text-gray-600 rounded-lg text-sm font-medium hover:text-gray-900 transition">Cancel</a>
            </div>
        </form>
    </div>
</div>
@endsection
