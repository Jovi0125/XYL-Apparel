<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use App\Models\ShipmentTrackingEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $profile = Auth::user()->logisticsProfile;

        $stats = [
            'total_assigned' => 0, 'picked_up_today' => 0, 'in_transit' => 0,
            'out_for_delivery' => 0, 'delivered_today' => 0, 'failed' => 0,
        ];
        $todayQueue = collect();
        $recentTracking = collect();
        $performance = ['total_completed' => 0, 'total_failed' => 0, 'avg_delivery_hours' => 0];

        if ($profile) {
            $baseQuery = Shipment::where('logistics_profile_id', $profile->id);
            $today = Carbon::today();

            $stats = [
                'total_assigned' => (clone $baseQuery)->count(),
                'picked_up_today' => (clone $baseQuery)->whereDate('picked_up_at', $today)->count(),
                'in_transit' => (clone $baseQuery)->where('delivery_status', 'in_transit')->count(),
                'out_for_delivery' => (clone $baseQuery)->where('delivery_status', 'out_for_delivery')->count(),
                'delivered_today' => (clone $baseQuery)->where('delivery_status', 'delivered')->whereDate('delivered_at', $today)->count(),
                'failed' => (clone $baseQuery)->where('delivery_status', 'failed')->count(),
            ];

            $todayQueue = (clone $baseQuery)
                ->with(['order.customer', 'order.sellerProfile'])
                ->whereNotIn('delivery_status', ['delivered', 'failed'])
                ->latest()
                ->take(15)
                ->get();

            $recentTracking = ShipmentTrackingEvent::whereHas('shipment', fn($q) => $q->where('logistics_profile_id', $profile->id))
                ->with('shipment')
                ->latest()
                ->take(10)
                ->get();

            $delivered = (clone $baseQuery)->where('delivery_status', 'delivered');
            $performance = [
                'total_completed' => $delivered->count(),
                'total_failed' => (clone $baseQuery)->where('delivery_status', 'failed')->count(),
                'avg_delivery_hours' => round($delivered->get()->avg(fn($s) =>
                    $s->picked_up_at && $s->delivered_at
                        ? $s->picked_up_at->diffInHours($s->delivered_at)
                        : 0
                ), 1),
            ];
        }

        if ($request->expectsJson()) {
            return response()->json(compact('stats', 'todayQueue', 'recentTracking', 'performance', 'profile'));
        }

        return view('welcome');
    }
}
