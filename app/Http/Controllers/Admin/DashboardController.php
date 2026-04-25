<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the admin dashboard
     */
    public function index(): Response
    {
        $productsCount = Product::count();
        $products       = Product::all();
        $lowStockCount  = $products->filter(fn($p) => $p->is_low_stock)->count();

        // ── Real order & revenue stats ──────────────────────────
        $thisMonth  = now()->startOfMonth();
        $lastMonth  = now()->subMonth()->startOfMonth();
        $lastMonthEnd = now()->subMonth()->endOfMonth();

        $totalOrders     = Order::count();
        $lastMonthOrders = Order::whereBetween('created_at', [$lastMonth, $lastMonthEnd])->count();
        $thisMonthOrders = Order::where('created_at', '>=', $thisMonth)->count();
        $orderTrend      = $lastMonthOrders > 0
            ? round((($thisMonthOrders - $lastMonthOrders) / $lastMonthOrders) * 100, 1)
            : ($thisMonthOrders > 0 ? 100 : 0);

        // Revenue = total_amount of paid orders
        $totalRevenue     = Order::where('payment_status', 'paid')->sum('total_amount');
        $lastMonthRevenue = Order::where('payment_status', 'paid')
            ->whereBetween('created_at', [$lastMonth, $lastMonthEnd])->sum('total_amount');
        $thisMonthRevenue = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', $thisMonth)->sum('total_amount');
        $revenueTrend = $lastMonthRevenue > 0
            ? round((($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1)
            : ($thisMonthRevenue > 0 ? 100 : 0);

        // Recent orders
        $recentOrders = Order::with(['buyer', 'product'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn($o) => [
                'id'           => $o->id,
                'order_number' => $o->order_number,
                'buyer_name'   => $o->buyer?->name ?? 'Unknown',
                'product'      => $o->product?->title ?? 'Unknown',
                'total'        => $o->formatted_total,
                'status'       => $o->payment_status,
                'date'         => $o->created_at->format('M d, Y'),
            ]);

        $productTrend = 5.4;
        $alertTrend   = $lowStockCount > 0 ? 2 : 0;

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalProducts'    => $productsCount,
                'totalOrders'      => $totalOrders,
                'totalCategories'  => Category::count(),
                'lowStockCount'    => $lowStockCount,
                'revenue' => [
                    'value' => $totalRevenue,
                    'trend' => $revenueTrend,
                ],
                'orders' => [
                    'value' => $totalOrders,
                    'trend' => $orderTrend,
                ],
                'products' => [
                    'value' => $productsCount,
                    'trend' => $productTrend,
                ],
                'lowStockAlerts' => [
                    'value' => $lowStockCount,
                    'trend' => $alertTrend,
                ],
                'salesData'            => $this->getSalesData(),
                'recentOrders'         => $recentOrders,
                'customerDistribution' => $this->getTopCustomers(),
                'deviceUsage'          => $this->getOrderStatusBreakdown(),
                'activeProducts'   => Product::with(['category', 'mainImage'])->active()->latest()->limit(5)->get(),
                'lowStockProducts' => $products->filter(fn($p) => $p->is_low_stock)->values()->take(5),
            ],
            'recentProducts'   => Product::with(['category', 'mainImage'])->latest()->limit(5)->get(),
        ]);
    }

    /**
     * Get real monthly sales data for the last 7 months.
     */
    private function getSalesData(): array
    {
        $months = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date  = now()->subMonths($i);
            $total = Order::where('payment_status', 'paid')
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->sum('total_amount');
            $months->push([
                'name'  => $date->format('M'),
                'value' => (float) $total,
            ]);
        }
        return $months->toArray();
    }

    /**
     * Get order payment status breakdown for the donut chart.
     */
    private function getOrderStatusBreakdown(): array
    {
        $statuses = ['pending', 'paid', 'failed'];
        $result = [];

        foreach ($statuses as $status) {
            $count = Order::where('payment_status', $status)->count();
            $result[] = [
                'name'  => $status,
                'value' => $count,
            ];
        }

        return $result;
    }

    /**
     * Get top customers ranked by total spending.
     */
    private function getTopCustomers(): array
    {
        return Order::select('buyer_id')
            ->selectRaw('SUM(total_amount) as total_spent')
            ->selectRaw('COUNT(*) as total_orders')
            ->with('buyer:id,name,email')
            ->groupBy('buyer_id')
            ->orderByDesc('total_spent')
            ->limit(5)
            ->get()
            ->map(fn($row) => [
                'id'           => $row->buyer_id,
                'name'         => $row->buyer?->name ?? 'Unknown',
                'email'        => $row->buyer?->email ?? '',
                'total_spent'  => (float) $row->total_spent,
                'total_orders' => (int) $row->total_orders,
            ])
            ->toArray();
    }
}
