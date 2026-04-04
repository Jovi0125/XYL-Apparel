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

        // Dashboard stats structure with empty state support
        // Set values to null for empty states, or provide data when available
        // This can be replaced with real database queries later
        
        $stats = [
            // Top metric cards - set to null for empty state, or provide value/trend
            'revenue' => null,        // Example with data: ['value' => 45230.50, 'trend' => 12.5]
            'orders' => null,         // Example with data: ['value' => 89, 'trend' => 8.2]
            'products' => null,       // Example with data: ['value' => 156, 'trend' => 3.1]
            'lowStockAlerts' => null, // Example with data: ['value' => 12, 'trend' => -2]
            
            // Sales chart data - null for empty state, or array of monthly data
            'salesData' => null,
            /* Example with data:
            'salesData' => [
                ['month' => 'Nov', 'sales' => 12000],
                ['month' => 'Dec', 'sales' => 19000],
                ['month' => 'Jan', 'sales' => 15000],
                ['month' => 'Feb', 'sales' => 22000],
                ['month' => 'Mar', 'sales' => 28000],
                ['month' => 'Apr', 'sales' => 35000],
            ],
            */
            
            // Customer distribution by country - null for empty, or country code => count
            'customerDistribution' => null,
            /* Example with data:
            'customerDistribution' => [
                'US' => 1250,
                'GB' => 820,
                'DE' => 450,
                'CA' => 380,
                'AU' => 290,
                'FR' => 180,
            ],
            */
            
            // Device usage - null for empty, or array with name/value
            'deviceUsage' => null,
            /* Example with data:
            'deviceUsage' => [
                ['name' => 'Phone', 'value' => 58],
                ['name' => 'Desktop', 'value' => 32],
                ['name' => 'Tablet', 'value' => 10],
            ],
            */
            
            // Recent orders - empty array for empty state
            'recentOrders' => [],
            /* Example with data:
            'recentOrders' => [
                ['id' => '2024001', 'customer' => 'John Doe', 'email' => 'john@example.com', 'amount' => 150.00, 'status' => 'Processing'],
                ['id' => '2024002', 'customer' => 'Jane Smith', 'email' => 'jane@example.com', 'amount' => 89.99, 'status' => 'Shipped'],
                ['id' => '2024003', 'customer' => 'Bob Wilson', 'email' => 'bob@example.com', 'amount' => 220.00, 'status' => 'Pending'],
            ],
            */
        ];

        return Inertia::render('Admin/Dashboard', [
            'user' => $user,
            'stats' => $stats,
        ]);
    }

    /**
     * Get dashboard stats with real data
     * Call this method when you have actual data sources
     */
    protected function getStatsWithData(): array
    {
        // Example of how to populate with real data
        return [
            'revenue' => [
                'value' => 45230.50,
                'trend' => 12.5
            ],
            'orders' => [
                'value' => 89,
                'trend' => 8.2
            ],
            'products' => [
                'value' => 156,
                'trend' => 3.1
            ],
            'lowStockAlerts' => [
                'value' => 12,
                'trend' => -2
            ],
            'salesData' => [
                ['month' => 'Nov', 'sales' => 12000],
                ['month' => 'Dec', 'sales' => 19000],
                ['month' => 'Jan', 'sales' => 15000],
                ['month' => 'Feb', 'sales' => 22000],
                ['month' => 'Mar', 'sales' => 28000],
                ['month' => 'Apr', 'sales' => 35000],
            ],
            'customerDistribution' => [
                'US' => 1250,
                'GB' => 820,
                'DE' => 450,
                'CA' => 380,
                'AU' => 290,
                'FR' => 180,
            ],
            'deviceUsage' => [
                ['name' => 'Phone', 'value' => 58],
                ['name' => 'Desktop', 'value' => 32],
                ['name' => 'Tablet', 'value' => 10],
            ],
            'recentOrders' => [
                ['id' => '2024001', 'customer' => 'John Doe', 'email' => 'john@example.com', 'amount' => 150.00, 'status' => 'Processing'],
                ['id' => '2024002', 'customer' => 'Jane Smith', 'email' => 'jane@example.com', 'amount' => 89.99, 'status' => 'Shipped'],
                ['id' => '2024003', 'customer' => 'Bob Wilson', 'email' => 'bob@example.com', 'amount' => 220.00, 'status' => 'Pending'],
                ['id' => '2024004', 'customer' => 'Alice Brown', 'email' => 'alice@example.com', 'amount' => 175.50, 'status' => 'Completed'],
                ['id' => '2024005', 'customer' => 'Charlie Davis', 'email' => 'charlie@example.com', 'amount' => 320.00, 'status' => 'Processing'],
            ],
        ];
    }
}
