<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::with('parent', 'children')
            ->withCount('products')
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        if ($request->expectsJson()) {
            return response()->json(compact('categories'));
        }

        return view('welcome');
    }

    public function create(Request $request)
    {
        $parentCategories = Category::whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        if ($request->expectsJson()) {
            return response()->json(compact('parentCategories'));
        }

        return view('welcome');
    }

    public function store(CategoryRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['name']);

        // Handle image upload
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('categories', 'public');
        }

        Category::create($data);

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Category created successfully.']);
        }

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function edit(Request $request, Category $category)
    {
        $parentCategories = Category::whereNull('parent_id')
            ->where('is_active', true)
            ->where('id', '!=', $category->id)
            ->orderBy('name')
            ->get();

        if ($request->expectsJson()) {
            return response()->json(compact('category', 'parentCategories'));
        }

        return view('welcome');
    }

    public function update(CategoryRequest $request, Category $category)
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['name']);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('categories', 'public');
        }

        $category->update($data);

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Category updated successfully.']);
        }

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(Request $request, Category $category)
    {
        if ($category->children()->count() > 0) {
            if ($request->expectsJson()) {
                return response()->json(['success' => false, 'message' => 'Cannot delete category with subcategories.'], 422);
            }
            return back()->with('error', 'Cannot delete category with subcategories.');
        }

        if ($category->products()->count() > 0) {
            if ($request->expectsJson()) {
                return response()->json(['success' => false, 'message' => 'Cannot delete category with products.'], 422);
            }
            return back()->with('error', 'Cannot delete category with products.');
        }

        $category->delete();

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Category deleted successfully.']);
        }

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
