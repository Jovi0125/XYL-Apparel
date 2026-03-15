<?php

namespace App\Http\Controllers\Fulfillment;

use App\Http\Controllers\Controller;
use App\Models\Fulfillment;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $pending   = Fulfillment::where('status', 'pending')->count();
        $picking   = Fulfillment::where('status', 'picking')->count();
        $packing   = Fulfillment::where('status', 'packing')->count();
        $shipped   = Fulfillment::where('status', 'shipped')->count();
        $delivered = Fulfillment::where('status', 'delivered')->count();
        $myActive  = Fulfillment::where('assigned_to', auth()->id())
            ->whereNotIn('status', ['delivered', 'cancelled'])
            ->count();

        return response()->json([
            'stats' => [
                'pending'   => $pending,
                'picking'   => $picking,
                'packing'   => $packing,
                'shipped'   => $shipped,
                'delivered' => $delivered,
                'my_active' => $myActive,
            ],
        ]);
    }
}
