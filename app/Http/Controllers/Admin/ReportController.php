<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use App\Models\SellerProfile;
use App\Models\Category;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Main reports dashboard — platform-wide KPIs & charts.
     */
    public function index(Request $request)
    {
        $period = $request->get('period', '30'); // days

        $startDate = now()->subDays((int) $period)->startOfDay();

        // ── Revenue & Order KPIs ──
        $totalRevenue = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', $startDate)
            ->sum('total');

        $totalOrders = Order::where('created_at', '>=', $startDate)->count();

        $averageOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        $platformFees = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', $startDate)
            ->sum('platform_fee');

        // ── Comparison with previous period ──
        $prevStart = now()->subDays((int) $period * 2)->startOfDay();
        $prevEnd = $startDate;

        $prevRevenue = Order::where('payment_status', 'paid')
            ->whereBetween('created_at', [$prevStart, $prevEnd])
            ->sum('total');

        $prevOrders = Order::whereBetween('created_at', [$prevStart, $prevEnd])->count();

        $revenueGrowth = $prevRevenue > 0
            ? round((($totalRevenue - $prevRevenue) / $prevRevenue) * 100, 1)
            : ($totalRevenue > 0 ? 100 : 0);

        $orderGrowth = $prevOrders > 0
            ? round((($totalOrders - $prevOrders) / $prevOrders) * 100, 1)
            : ($totalOrders > 0 ? 100 : 0);

        // ── User Stats ──
        $newCustomers = User::where('role', 'customer')
            ->where('created_at', '>=', $startDate)->count();

        $totalCustomers = User::where('role', 'customer')->count();
        $totalSellers = SellerProfile::where('status', 'approved')->count();

        // ── Order Status Breakdown ──
        $ordersByStatus = Order::where('created_at', '>=', $startDate)
            ->select('order_status', DB::raw('count(*) as count'))
            ->groupBy('order_status')
            ->pluck('count', 'order_status')
            ->toArray();

        // ── Daily Revenue (for chart) ──
        $dailyRevenue = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', $startDate)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

        // ── Top Sellers ──
        $topSellers = SellerProfile::withCount(['orders as total_orders' => function ($q) use ($startDate) {
                $q->where('created_at', '>=', $startDate);
            }])
            ->withSum(['orders as total_revenue' => function ($q) use ($startDate) {
                $q->where('payment_status', 'paid')->where('created_at', '>=', $startDate);
            }], 'total')
            ->orderByDesc('total_revenue')
            ->take(5)
            ->get();

        // ── Top Products (by order items) ──
        $topProducts = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.created_at', '>=', $startDate)
            ->select(
                'order_items.product_name',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.total_price) as total_revenue')
            )
            ->groupBy('order_items.product_name')
            ->orderByDesc('total_sold')
            ->take(10)
            ->get();

        // ── Top Categories ──
        $topCategories = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->join('categories', 'categories.id', '=', 'products.category_id')
            ->where('orders.created_at', '>=', $startDate)
            ->select(
                'categories.name as category_name',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.total_price) as total_revenue')
            )
            ->groupBy('categories.name')
            ->orderByDesc('total_revenue')
            ->take(5)
            ->get();

        // ── Delivery Stats ──
        $deliveryStats = Shipment::where('created_at', '>=', $startDate)
            ->select('delivery_status', DB::raw('count(*) as count'))
            ->groupBy('delivery_status')
            ->pluck('count', 'delivery_status')
            ->toArray();

        // ── Payment Methods ──
        $paymentMethods = Order::where('created_at', '>=', $startDate)
            ->select('payment_method', DB::raw('count(*) as count'), DB::raw('SUM(total) as total'))
            ->groupBy('payment_method')
            ->get();

        return response()->json(compact(
            'period',
            'totalRevenue',
            'totalOrders',
            'averageOrderValue',
            'platformFees',
            'revenueGrowth',
            'orderGrowth',
            'newCustomers',
            'totalCustomers',
            'totalSellers',
            'ordersByStatus',
            'dailyRevenue',
            'topSellers',
            'topProducts',
            'topCategories',
            'deliveryStats',
            'paymentMethods',
        ));
    }

    /**
     * Sales breakdown by seller.
     */
    public function sellers(Request $request)
    {
        $period = $request->get('period', '30');
        $startDate = now()->subDays((int) $period)->startOfDay();

        $sellers = SellerProfile::with('user')
            ->withCount(['orders as total_orders' => function ($q) use ($startDate) {
                $q->where('created_at', '>=', $startDate);
            }])
            ->withSum(['orders as total_revenue' => function ($q) use ($startDate) {
                $q->where('payment_status', 'paid')->where('created_at', '>=', $startDate);
            }], 'total')
            ->withSum(['orders as platform_fees' => function ($q) use ($startDate) {
                $q->where('payment_status', 'paid')->where('created_at', '>=', $startDate);
            }], 'platform_fee')
            ->withCount('products')
            ->orderByDesc('total_revenue')
            ->paginate(15);

        $totalPlatformRevenue = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', $startDate)
            ->sum('total');

        $totalPlatformFees = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', $startDate)
            ->sum('platform_fee');

        return response()->json(compact(
            'sellers',
            'period',
            'totalPlatformRevenue',
            'totalPlatformFees',
        ));
    }

    /**
     * Product performance report.
     */
    public function products(Request $request)
    {
        $period = $request->get('period', '30');
        $startDate = now()->subDays((int) $period)->startOfDay();

        // Start from products so ALL products appear, even those with no orders.
        $products = DB::table('products')
            ->leftJoin('seller_profiles', 'seller_profiles.id', '=', 'products.seller_profile_id')
            ->leftJoin('order_items', 'order_items.product_id', '=', 'products.id')
            ->leftJoin('orders', function ($join) use ($startDate) {
                $join->on('orders.id', '=', 'order_items.order_id')
                     ->where('orders.created_at', '>=', $startDate);
            })
            ->select(
                'products.id',
                'products.name',
                DB::raw('COALESCE(seller_profiles.shop_name, "Unknown") as shop_name'),
                DB::raw('COALESCE(SUM(CASE WHEN orders.id IS NOT NULL THEN order_items.quantity ELSE 0 END), 0) as units_sold'),
                DB::raw('COALESCE(SUM(CASE WHEN orders.id IS NOT NULL THEN order_items.total_price ELSE 0 END), 0) as revenue')
            )
            ->groupBy('products.id', 'products.name', 'seller_profiles.shop_name')
            ->orderByDesc('revenue')
            ->paginate(20);

        return response()->json(compact('products', 'period'));
    }
}
