<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Discount;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'mainImage'])->latest()->get();

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
            'sizes' => 'nullable|array',
            'tags' => 'nullable|array',
            'payment_methods' => 'nullable|array',
            'regular_price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'discount_code_id' => 'nullable|exists:discounts,id',
            'stock' => 'required_without:variants|integer|min:0',
            'variants' => 'nullable|array',
            'images' => 'nullable|array',
        ]);

        $product = Product::create($validated);

        if (!empty($validated['variants'])) {
            foreach ($validated['variants'] as $variant) {
                $product->variants()->create($variant);
            }
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $file) {
                $imageData = cloudinary_upload($file, [
                    'folder' => 'xylo-apparel/products',
                ]);

                $product->images()->create([
                    'image_public_id' => $imageData['public_id'],
                    'image_url' => $imageData['url'],
                    'is_main' => $index === 0,
                    'order' => $index,
                ]);
            }
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function destroy(Product $product)
    {
        foreach ($product->images as $image) {
            cloudinary_delete($image->image_public_id);
        }

        $product->delete();

        return redirect()->back()->with('success', 'Product deleted successfully.');
    }
}
