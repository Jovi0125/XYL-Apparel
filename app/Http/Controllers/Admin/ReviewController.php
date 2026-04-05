<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $reviews = Review::with(['buyer', 'product'])->latest()->get()->map(function($review) {
            return [
                'id' => $review->id,
                'buyer_name' => $review->buyer ? $review->buyer->name : 'N/A',
                'product_title' => $review->product ? $review->product->title : 'N/A',
                'rating' => $review->rating,
                'comment' => $review->comment,
                'is_approved' => $review->is_approved,
                'date' => $review->created_at->format('M d, Y'),
            ];
        });

        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => $reviews
        ]);
    }

    public function toggleApproval(Review $review)
    {
        $review->update(['is_approved' => !$review->is_approved]);
        return redirect()->back();
    }
}
