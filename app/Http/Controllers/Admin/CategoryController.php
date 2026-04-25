<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Traits\NotifyAdmins;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    use NotifyAdmins;

    /**
     * Display a listing of categories.
     */
    public function index(): Response
    {
        $categories = Category::withCount('products')
            ->latest()
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'parent_category' => $category->parent_category,
                    'description' => $category->description,
                    'image_url' => $category->image_url,
                    'image_public_id' => $category->image_public_id,
                    'status' => $category->status,
                    'products_count' => $category->products_count,
                    'created_at' => $category->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('Admin/CategoriesIndex', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created category.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'parent_category' => 'required|in:Men,Women,Unisex',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'status' => 'required|in:active,inactive',
        ]);

        // Handle image upload to Cloudinary if provided
        if ($request->hasFile('image')) {
            $imageResult = cloudinary_upload($request->file('image'), [
                'folder' => 'xylo-apparel/categories',
            ]);

            if ($imageResult) {
                $validated['image_public_id'] = $imageResult['public_id'];
                $validated['image_url'] = $imageResult['url'];
            }
        }

        Category::create($validated);

        self::notifyAdmins("New category '{$validated['name']}' created.", 'info');

        return redirect()->back()->with('success', 'Category created successfully!');
    }

    /**
     * Update the specified category.
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'parent_category' => 'required|in:Men,Women,Unisex',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'status' => 'required|in:active,inactive',
        ]);

        // Handle new image upload
        if ($request->hasFile('image')) {
            // Delete old image from Cloudinary if exists
            if ($category->image_public_id) {
                cloudinary_delete($category->image_public_id);
            }

            // Upload new image
            $imageResult = cloudinary_upload($request->file('image'), [
                'folder' => 'xylo-apparel/categories',
            ]);

            if ($imageResult) {
                $validated['image_public_id'] = $imageResult['public_id'];
                $validated['image_url'] = $imageResult['url'];
            }
        }

        $category->update($validated);

        self::notifyAdmins("Category '{$category->name}' has been updated.", 'info');

        return redirect()->back()->with('success', 'Category updated successfully!');
    }

    /**
     * Remove the specified category.
     */
    public function destroy(Category $category)
    {
        $name = $category->name;
        $category->delete();

        self::notifyAdmins("Category '{$name}' has been archived.", 'info');

        return redirect()->back()->with('success', 'Category moved to archive!');
    }
}
