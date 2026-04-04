<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Discount;
use App\Models\ProductVariant;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

use App\Traits\NotifyAdmins;

class ProductController extends Controller
{
    use NotifyAdmins;

    public function index()
    {
        $products = Product::with(['category', 'mainImage', 'variants'])->latest()->get();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
        ]);
    }

    public function create()
    {
        $categories = Category::active()->get();
        $discounts = Discount::active()->get();

        return Inertia::render('Admin/Products/Create', [
            'categories' => $categories,
            'discounts' => $discounts,
        ]);
    }

    public function edit(Product $product)
    {
        $product->load(['variants', 'images', 'category']);
        $categories = Category::all();
        $discounts = Discount::all();

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $categories,
            'discounts' => $discounts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'required|string|max:500',
            'detailed_description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'parent_category' => 'required|in:Men,Women,Unisex',
            'warranty' => 'required|string',
            'colors' => 'nullable|array',
            'tags' => 'nullable|array',
            'payment_methods' => 'nullable|array',
            'discount_code_id' => 'nullable|exists:discounts,id',
            'stock' => 'nullable|integer|min:0',
            'variants' => 'required|array|min:1',
            'variants.*.size' => 'required|string',
            'variants.*.stock' => 'required|integer|min:0',
            'variants.*.regular_price' => 'required|numeric|min:0',
            'variants.*.sale_price' => 'nullable|numeric|min:0',
            'images' => 'nullable|array',
            'images.*' => 'nullable|file|image',
        ]);

        // Defensive assignments
        $validated['colors'] = $validated['colors'] ?? [];
        $validated['tags'] = $validated['tags'] ?? [];
        $validated['payment_methods'] = $validated['payment_methods'] ?? [];
        $validated['stock'] = $validated['stock'] ?? 0;

        try {
            DB::beginTransaction();

            $product = Product::create($validated);

            // Safely iterate variants
            $variants = $validated['variants'] ?? [];
            foreach ($variants as $variant) {
                $product->variants()->create([
                    'size'          => $variant['size'] ?? '',
                    'stock'         => $variant['stock'] ?? 0,
                    'regular_price' => $variant['regular_price'] ?? 0,
                    'sale_price'    => $variant['sale_price'] ?? null,
                ]);
            }

            // Safely process images
            if ($request->hasFile('images')) {
                $images = $request->file('images');
                if (!is_array($images)) {
                    $images = [$images];
                }

                $validIndex = 0;
                foreach ($images as $file) {
                    if ($file && $file->isValid()) {
                        $imageData = cloudinary_upload($file, [
                            'folder' => 'xylo-apparel/products',
                        ]);

                        // Ensurecloudinary returned expected structure
                        if (is_array($imageData) && isset($imageData['public_id'], $imageData['url'])) {
                            $product->images()->create([
                                'image_public_id' => $imageData['public_id'],
                                'image_url'       => $imageData['url'],
                                'is_main'         => $validIndex === 0,
                                'order'           => $validIndex,
                            ]);
                            $validIndex++;
                        }
                    }
                }
            }

            DB::commit();

            return redirect()->route('admin.products.index')
                ->with('success', 'Product created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Product creation failed: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'required|string|max:500',
            'detailed_description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'parent_category' => 'required|in:Men,Women,Unisex',
            'warranty' => 'required|string',
            'colors' => 'nullable|array',
            'tags' => 'nullable|array',
            'payment_methods' => 'nullable|array',
            'discount_code_id' => 'nullable|exists:discounts,id',
            'stock' => 'nullable|integer|min:0',
            'variants' => 'required|array|min:1',
            'variants.*.size' => 'required|string',
            'variants.*.stock' => 'required|integer|min:0',
            'variants.*.regular_price' => 'required|numeric|min:0',
            'variants.*.sale_price' => 'nullable|numeric|min:0',
            'images' => 'nullable|array',
            'images.*' => 'nullable|file|image',
            'existing_images' => 'nullable|array',
            'existing_images.*.id' => 'nullable|integer|exists:product_images,id',
        ]);

        try {
            DB::beginTransaction();

            // Update product basic info
            $product->update([
                'title' => $validated['title'],
                'short_description' => $validated['short_description'],
                'detailed_description' => $validated['detailed_description'],
                'category_id' => $validated['category_id'],
                'parent_category' => $validated['parent_category'],
                'warranty' => $validated['warranty'],
                'colors' => $validated['colors'] ?? [],
                'tags' => $validated['tags'] ?? [],
                'payment_methods' => $validated['payment_methods'] ?? [],
                'discount_code_id' => $validated['discount_code_id'] ?? null,
                'stock' => $validated['stock'] ?? 0,
            ]);

            // Sync variants (wipe and replace)
            $product->variants()->delete();
            foreach ($validated['variants'] as $variant) {
                $product->variants()->create([
                    'size'          => $variant['size'],
                    'stock'         => $variant['stock'],
                    'regular_price' => $variant['regular_price'],
                    'sale_price'    => $variant['sale_price'] ?? null,
                ]);
            }

            // Handle images
            // 1. Identify images to remove
            $existingImageIds = collect($validated['existing_images'] ?? [])->pluck('id')->filter()->toArray();
            $imagesToRemove = $product->images()->whereNotIn('id', $existingImageIds)->get();

            foreach ($imagesToRemove as $image) {
                cloudinary_delete($image->image_public_id);
                $image->delete();
            }

            // 2. Upload new images
            if ($request->hasFile('images')) {
                $newImages = $request->file('images');
                if (!is_array($newImages)) {
                    $newImages = [$newImages];
                }

                // Get current max order to append new images
                $currentMaxOrder = $product->images()->max('order') ?? -1;
                $validIndex = $currentMaxOrder + 1;

                foreach ($newImages as $file) {
                    if ($file && $file->isValid()) {
                        $imageData = cloudinary_upload($file, [
                            'folder' => 'xylo-apparel/products',
                        ]);

                        if (is_array($imageData) && isset($imageData['public_id'], $imageData['url'])) {
                            $product->images()->create([
                                'image_public_id' => $imageData['public_id'],
                                'image_url'       => $imageData['url'],
                                'is_main'         => $product->images()->where('is_main', true)->count() === 0 && $validIndex === 0,
                                'order'           => $validIndex,
                            ]);
                            $validIndex++;
                        }
                    }
                }
            }

            // Re-ensure exactly one main image if needed
            if ($product->images()->where('is_main', true)->count() === 0 && $product->images()->count() > 0) {
                $product->images()->orderBy('order')->first()->update(['is_main' => true]);
            }

            DB::commit();

            self::notifyAdmins("Product '{$product->title}' has been updated.", 'info');

            return redirect()->route('admin.products.index')
                ->with('success', 'Product updated successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Product update failed: ' . $e->getMessage()]);
        }
    }

    public function destroy(Product $product)
    {
        $title = $product->title;
        $product->delete();

        self::notifyAdmins("Product '{$title}' moved to archive.", 'danger');

        return redirect()->back()->with('success', 'Product deleted successfully.');
    }
}
