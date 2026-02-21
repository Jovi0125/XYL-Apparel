@extends('layouts.dashboard')

@section('page-title', 'Add Product')

@section('sidebar')
@include('seller.partials.sidebar')
@endsection

@section('content')
<div class="max-w-3xl">
    <a href="{{ route('seller.products.index') }}" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        Back to Products
    </a>

    <form method="POST" action="{{ route('seller.products.store') }}" enctype="multipart/form-data" class="space-y-6">
        @csrf

        {{-- Basic Info --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-5">Product Information</h2>
            <div class="space-y-5">
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input type="text" name="name" id="name" value="{{ old('name') }}" required
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400"
                        placeholder="e.g. Classic Cotton T-Shirt">
                    @error('name') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>

                <div>
                    <label for="category_id" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select name="category_id" id="category_id"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white">
                        <option value="">Select Category</option>
                        @foreach($categories as $category)
                            <option value="{{ $category->id }}" {{ old('category_id') == $category->id ? 'selected' : '' }}>{{ $category->name }}</option>
                        @endforeach
                    </select>
                    @error('category_id') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>

                <div>
                    <label for="short_description" class="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                    <input type="text" name="short_description" id="short_description" value="{{ old('short_description') }}"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400"
                        placeholder="Brief tagline (max 500 chars)">
                    @error('short_description') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>

                <div>
                    <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                    <textarea name="description" id="description" rows="5"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400 resize-none"
                        placeholder="Detailed product description">{{ old('description') }}</textarea>
                    @error('description') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>
            </div>
        </div>

        {{-- Pricing --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-5">Pricing</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label for="price" class="block text-sm font-medium text-gray-700 mb-1">Price (₱) *</label>
                    <input type="number" name="price" id="price" value="{{ old('price') }}" required step="0.01" min="0"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        placeholder="0.00">
                    @error('price') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>
                <div>
                    <label for="sale_price" class="block text-sm font-medium text-gray-700 mb-1">Sale Price (₱) <span class="text-gray-400">(optional)</span></label>
                    <input type="number" name="sale_price" id="sale_price" value="{{ old('sale_price') }}" step="0.01" min="0"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        placeholder="0.00">
                    @error('sale_price') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>
            </div>
        </div>

        {{-- Images --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-1">Images</h2>
            <p class="text-sm text-gray-400 mb-4">First image will be the primary/thumbnail. Max 8 images.</p>
            <input type="file" name="images[]" multiple accept="image/*"
                class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition">
            @error('images') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
            @error('images.*') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
        </div>

        {{-- Variants --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6" x-data="variantManager()">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h2 class="text-base font-semibold text-gray-900">Variants</h2>
                    <p class="text-sm text-gray-400">Add size/color variants with optional stock and price overrides.</p>
                </div>
                <button type="button" @click="addVariant()" class="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                    Add Variant
                </button>
            </div>

            <template x-for="(variant, index) in variants" :key="index">
                <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-3 p-3 bg-gray-50 rounded-lg items-end">
                    <div>
                        <label class="block text-xs text-gray-500 mb-1">Size</label>
                        <input type="text" :name="'variants['+index+'][size]'" x-model="variant.size"
                            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="S, M, L...">
                    </div>
                    <div>
                        <label class="block text-xs text-gray-500 mb-1">Color</label>
                        <input type="text" :name="'variants['+index+'][color]'" x-model="variant.color"
                            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="Black, White...">
                    </div>
                    <div>
                        <label class="block text-xs text-gray-500 mb-1">Stock</label>
                        <input type="number" :name="'variants['+index+'][stock]'" x-model="variant.stock" min="0"
                            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="0">
                    </div>
                    <div>
                        <label class="block text-xs text-gray-500 mb-1">Price Override (₱)</label>
                        <input type="number" :name="'variants['+index+'][price_override]'" x-model="variant.price_override" step="0.01" min="0"
                            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="Optional">
                    </div>
                    <div class="flex items-center">
                        <input type="text" :name="'variants['+index+'][sku]'" x-model="variant.sku"
                            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="SKU">
                        <button type="button" @click="removeVariant(index)" class="ml-2 text-red-400 hover:text-red-600 transition">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                </div>
            </template>

            <div x-show="variants.length === 0" class="text-sm text-gray-400 text-center py-4">
                No variants added. Click "Add Variant" to create size/color options.
            </div>
        </div>

        {{-- Options --}}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-5">Options</h2>
            <div class="space-y-4">
                <div class="flex items-center gap-2">
                    <input type="hidden" name="is_active" value="0">
                    <input type="checkbox" name="is_active" id="is_active" value="1" {{ old('is_active', true) ? 'checked' : '' }}
                        class="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900">
                    <label for="is_active" class="text-sm text-gray-700">Active (visible to customers)</label>
                </div>
                <div class="flex items-center gap-2">
                    <input type="hidden" name="cash_on_delivery" value="0">
                    <input type="checkbox" name="cash_on_delivery" id="cash_on_delivery" value="1" {{ old('cash_on_delivery') ? 'checked' : '' }}
                        class="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900">
                    <label for="cash_on_delivery" class="text-sm text-gray-700">Cash on Delivery allowed</label>
                </div>
                <div>
                    <label for="video_url" class="block text-sm font-medium text-gray-700 mb-1">Video URL <span class="text-gray-400">(optional)</span></label>
                    <input type="url" name="video_url" id="video_url" value="{{ old('video_url') }}"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400"
                        placeholder="https://youtube.com/...">
                    @error('video_url') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>
            </div>
        </div>

        {{-- Submit --}}
        <div class="flex items-center gap-3">
            <button type="submit" class="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition">Create Product</button>
            <a href="{{ route('seller.products.index') }}" class="px-6 py-2.5 text-gray-600 rounded-lg text-sm font-medium hover:text-gray-900 transition">Cancel</a>
        </div>
    </form>
</div>

<script>
function variantManager() {
    return {
        variants: [],
        addVariant() {
            this.variants.push({ size: '', color: '', stock: 0, price_override: '', sku: '' });
        },
        removeVariant(index) {
            this.variants.splice(index, 1);
        }
    };
}
</script>
@endsection
