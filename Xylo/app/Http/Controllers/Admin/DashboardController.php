<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the admin dashboard
     */
    public function index(): Response
    {
        $user = Auth::user();

        // Placeholder stats - replace with real data later
        $stats = [
            'totalProducts' => 156,
            'totalOrders' => 89,
            'pendingShipments' => 12,
            'totalRevenue' => 45230.50,
            'recentOrders' => [
                ['id' => 'ORD-001', 'customer' => 'John Doe', 'amount' => 150.00, 'status' => 'Processing'],
                ['id' => 'ORD-002', 'customer' => 'Jane Smith', 'amount' => 89.99, 'status' => 'Shipped'],
                ['id' => 'ORD-003', 'customer' => 'Bob Wilson', 'amount' => 220.00, 'status' => 'Pending'],
            ],
        ];

        return Inertia::render('Admin/Dashboard', [
            'user' => $user,
            'stats' => $stats,
        ]);
    }
}
