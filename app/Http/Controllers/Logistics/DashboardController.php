<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $profile = Auth::user()->logisticsProfile;

        $stats = [
            'assigned' => 0,
            'in_transit' => 0,
            'delivered' => 0,
            'failed' => 0,
        ];

        $shipments = collect();

        if ($profile) {
            $stats = [
                'assigned' => Shipment::where('logistics_profile_id', $profile->id)
                    ->where('delivery_status', 'assigned')->count(),
                'in_transit' => Shipment::where('logistics_profile_id', $profile->id)
                    ->whereIn('delivery_status', ['picked_up', 'in_transit', 'out_for_delivery'])->count(),
                'delivered' => Shipment::where('logistics_profile_id', $profile->id)
                    ->where('delivery_status', 'delivered')->count(),
                'failed' => Shipment::where('logistics_profile_id', $profile->id)
                    ->where('delivery_status', 'failed')->count(),
            ];

            $shipments = Shipment::where('logistics_profile_id', $profile->id)
                ->with(['order.customer', 'order.sellerProfile'])
                ->whereNotIn('delivery_status', ['delivered', 'failed'])
                ->latest()
                ->take(10)
                ->get();
        }

        if ($request->expectsJson()) {
            return response()->json(compact('stats', 'shipments', 'profile'));
        }

        return view('welcome');
    }
}
