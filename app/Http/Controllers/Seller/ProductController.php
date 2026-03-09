<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\ProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    private function seller()
    {
        return Auth::user()->sellerProfile;
    }

    public function index(Request $request)
    {
        $seller = $this->seller();

        $products = Product::with('category', 'primaryImage', 'variants')
            ->where('seller_profile_id', $seller->id)
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->when($request->status !== null && $request->status !== '', function ($q) use ($request) {
                $q->where('is_active', $request->status === 'active');
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        if ($request->expectsJson()) {
            return response()->json(compact('products'));
        }

        return view('welcome');
    }

    public function create(Request $request)
    {
        $categories = Category::where('is_active', true)->orderBy('name')->get();

        if ($request->expectsJson()) {
            return response()->json(compact('categories'));
        }

        return view('welcome');
    }

    public function store(ProductRequest $request)
    {
        $seller = $this->seller();

        DB::transaction(function () use ($request, $seller) {
            // Create product
            $product = Product::create([
                'seller_profile_id' => $seller->id,
                'category_id' => $request->category_id,
                'name' => $request->name,
                'slug' => Str::slug($request->name) . '-' . Str::random(5),
                'short_description' => $request->short_description,
                'description' => $request->description,
                'price' => $request->price,
                'sale_price' => $request->sale_price,
                'is_active' => $request->boolean('is_active', true),
                'cash_on_delivery' => $request->boolean('cash_on_delivery', false),
                'video_url' => $request->video_url,
            ]);

            // Upload images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'path' => $image->store('products', 'public'),
                        'is_primary' => $index === 0,
                        'sort_order' => $index,
                    ]);
                }
            }

            // Create variants
            if ($request->has('variants')) {
                foreach ($request->variants as $variant) {
                    if (empty($variant['size']) && empty($variant['color'])) continue;

                    ProductVariant::create([
                        'product_id' => $product->id,
                        'size' => $variant['size'] ?? null,
                        'color' => $variant['color'] ?? null,
                        'price_override' => $variant['price_override'] ?? null,
                        'stock' => $variant['stock'] ?? 0,
                        'sku' => $variant['sku'] ?? null,
                        'is_active' => true,
                    ]);
                }
            }
        });

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Product created successfully.']);
        }

        return redirect()->route('seller.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function show(Request $request, Product $product)
    {
        $seller = $this->seller();
        abort_if($product->seller_profile_id !== $seller->id, 403);

        $product->load('category', 'images', 'variants');

        if ($request->expectsJson()) {
            return response()->json(compact('product'));
        }

        return view('welcome');
    }

    public function edit(Request $request, Product $product)
    {
        $seller = $this->seller();
        abort_if($product->seller_profile_id !== $seller->id, 403);

        $product->load('images', 'variants');
        $categories = Category::where('is_active', true)->orderBy('name')->get();

        if ($request->expectsJson()) {
            return response()->json(compact('product', 'categories'));
        }

        return view('welcome');
    }

    public function update(ProductRequest $request, Product $product)
    {
        $seller = $this->seller();
        abort_if($product->seller_profile_id !== $seller->id, 403);

        DB::transaction(function () use ($request, $product) {
            $product->update([
                'category_id' => $request->category_id,
                'name' => $request->name,
                'slug' => Str::slug($request->name) . '-' . Str::random(5),
                'short_description' => $request->short_description,
                'description' => $request->description,
                'price' => $request->price,
                'sale_price' => $request->sale_price,
                'is_active' => $request->boolean('is_active', true),
                'cash_on_delivery' => $request->boolean('cash_on_delivery', false),
                'video_url' => $request->video_url,
            ]);

            // Upload new images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $isPrimary = $product->images()->count() === 0 && $index === 0;
                    ProductImage::create([
                        'product_id' => $product->id,
                        'path' => $image->store('products', 'public'),
                        'is_primary' => $isPrimary,
                        'sort_order' => $product->images()->count() + $index,
                    ]);
                }
            }

            // Remove images
            if ($request->has('remove_images')) {
                ProductImage::whereIn('id', $request->remove_images)
                    ->where('product_id', $product->id)
                    ->delete();
            }

            // Sync variants
            if ($request->has('variants')) {
                $keepIds = [];
                foreach ($request->variants as $variant) {
                    if (empty($variant['size']) && empty($variant['color'])) continue;

                    if (!empty($variant['id'])) {
                        // Update existing
                        ProductVariant::where('id', $variant['id'])
                            ->where('product_id', $product->id)
                            ->update([
                                'size' => $variant['size'] ?? null,
                                'color' => $variant['color'] ?? null,
                                'price_override' => $variant['price_override'] ?? null,
                                'stock' => $variant['stock'] ?? 0,
                                'sku' => $variant['sku'] ?? null,
                            ]);
                        $keepIds[] = $variant['id'];
                    } else {
                        // Create new
                        $v = ProductVariant::create([
                            'product_id' => $product->id,
                            'size' => $variant['size'] ?? null,
                            'color' => $variant['color'] ?? null,
                            'price_override' => $variant['price_override'] ?? null,
                            'stock' => $variant['stock'] ?? 0,
                            'sku' => $variant['sku'] ?? null,
                            'is_active' => true,
                        ]);
                        $keepIds[] = $v->id;
                    }
                }
                // Remove variants not in the list
                ProductVariant::where('product_id', $product->id)
                    ->whereNotIn('id', $keepIds)
                    ->delete();
            }
        });

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Product updated successfully.']);
        }

        return redirect()->route('seller.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Request $request, Product $product)
    {
        $seller = $this->seller();
        abort_if($product->seller_profile_id !== $seller->id, 403);

        $product->delete();

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Product deleted successfully.']);
        }

        return redirect()->route('seller.products.index')
            ->with('success', 'Product deleted successfully.');
    }
}
