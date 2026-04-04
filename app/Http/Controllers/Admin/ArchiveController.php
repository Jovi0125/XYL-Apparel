<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Discount;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArchiveController extends Controller
{
    /**
     * Display a listing of archived (soft deleted) items.
     */
    public function index(): Response
    {
        $archivedProducts = Product::onlyTrashed()->with(['category', 'mainImage'])->latest()->get();
        $archivedCategories = Category::onlyTrashed()->latest()->get();
        $archivedDiscounts = Discount::onlyTrashed()->latest()->get();

        return Inertia::render('Admin/Archive', [
            'products' => $archivedProducts,
            'categories' => $archivedCategories,
            'discounts' => $archivedDiscounts,
        ]);
    }

    /**
     * Restore the specified soft-deleted item.
     */
    public function restore(Request $request, string $type, int $id)
    {
        switch ($type) {
            case 'product':
                Product::onlyTrashed()->findOrFail($id)->restore();
                break;
            case 'category':
                Category::onlyTrashed()->findOrFail($id)->restore();
                break;
            case 'discount':
                Discount::onlyTrashed()->findOrFail($id)->restore();
                break;
            default:
                return redirect()->back()->with('error', 'Invalid type specified for restoration.');
        }

        return redirect()->back()->with('success', ucfirst($type) . ' restored successfully!');
    }
}
