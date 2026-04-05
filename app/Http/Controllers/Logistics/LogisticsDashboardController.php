<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\Models\Shipment; // Assuming shipments are modeled out and managed
use Inertia\Inertia;
use Illuminate\Http\Request;

class LogisticsDashboardController extends Controller
{
    /**
     * Displays the Logistics interface homepage
     */
    public function index(Request $request)
    {
        // Safe dynamic querying to aggregate shipment logic natively
        $assigned = Shipment::where('status', 'preparing')->count();
        $inTransit = Shipment::where('status', 'in_transit')->count();
        $delivered = Shipment::where('status', 'delivered')->count();

        return Inertia::render('Logistics/Dashboard', [
            'stats' => [
                'assigned' => $assigned,
                'inTransit' => $inTransit,
                'delivered' => $delivered,
            ],
            'recentShipments' => Shipment::with('order')->latest()->take(5)->get()
        ]);
    }
}
