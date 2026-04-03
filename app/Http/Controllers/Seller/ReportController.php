<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Seller analytics dashboard — own shop KPIs & charts.
     */
    public function index(Request $request)
    {
        $seller = auth()->user()->sellerProfile;

        if (! $seller) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Please set up your shop first.'], 422);
            }
            return redirect()->route('seller.shop.edit')
                ->with('error', 'Please set up your shop first.');
        }

        $period = $request->get('period', '30');
        $startDate = now()->subDays((int) $period)->startOfDay();

        // ── Revenue & Order KPIs ──
        $totalRevenue = Order::where('seller_profile_id', $seller->id)
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', $startDate)
            ->sum('total');

        $totalOrders = Order::where('seller_profile_id', $seller->id)
            ->where('created_at', '>=', $startDate)
            ->count();

        $averageOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        $platformFees = Order::where('seller_profile_id', $seller->id)
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', $startDate)
            ->sum('platform_fee');

        $netEarnings = $totalRevenue - $platformFees;

        // ── Previous period comparison ──
        $prevStart = now()->subDays((int) $period * 2)->startOfDay();
        $prevEnd = $startDate;

        $prevRevenue = Order::where('seller_profile_id', $seller->id)
            ->where('payment_status', 'paid')
            ->whereBetween('created_at', [$prevStart, $prevEnd])
            ->sum('total');

        $prevOrders = Order::where('seller_profile_id', $seller->id)
            ->whereBetween('created_at', [$prevStart, $prevEnd])
            ->count();

        $revenueGrowth = $prevRevenue > 0
            ? round((($totalRevenue - $prevRevenue) / $prevRevenue) * 100, 1)
            : ($totalRevenue > 0 ? 100 : 0);

        $orderGrowth = $prevOrders > 0
            ? round((($totalOrders - $prevOrders) / $prevOrders) * 100, 1)
            : ($totalOrders > 0 ? 100 : 0);

        // ── Order Status Breakdown ──
        $ordersByStatus = Order::where('seller_profile_id', $seller->id)
            ->where('created_at', '>=', $startDate)
            ->select('order_status', DB::raw('count(*) as count'))
            ->groupBy('order_status')
            ->pluck('count', 'order_status')
            ->toArray();

        // ── Daily Revenue (for chart) ──
        $dailyRevenue = Order::where('seller_profile_id', $seller->id)
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', $startDate)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

        // ── Top Products ──
        $topProducts = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.seller_profile_id', $seller->id)
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

        // ── Product Stats ──
        $activeProducts = Product::where('seller_profile_id', $seller->id)
            ->where('is_active', true)
            ->count();

        $totalProducts = Product::where('seller_profile_id', $seller->id)->count();

        // ── Low Stock Products ──
        $lowStockProducts = DB::table('product_variants')
            ->join('products', 'products.id', '=', 'product_variants.product_id')
            ->where('products.seller_profile_id', $seller->id)
            ->where('product_variants.stock', '<=', 5)
            ->where('product_variants.is_active', true)
            ->select(
                'products.name as product_name',
                'product_variants.size',
                'product_variants.color',
                'product_variants.stock',
                'product_variants.sku'
            )
            ->orderBy('product_variants.stock')
            ->take(10)
            ->get();

        // ── Recent Orders ──
        $recentOrders = Order::where('seller_profile_id', $seller->id)
            ->with('customer')
            ->latest()
            ->take(5)
            ->get();

        return response()->json(compact(
            'period',
            'totalRevenue',
            'totalOrders',
            'averageOrderValue',
            'platformFees',
            'netEarnings',
            'revenueGrowth',
            'orderGrowth',
            'ordersByStatus',
            'dailyRevenue',
            'topProducts',
            'activeProducts',
            'totalProducts',
            'lowStockProducts',
            'recentOrders',
        ));
    }

    /**
     * Detailed product performance report.
     */
    public function products(Request $request)
    {
        $seller = auth()->user()->sellerProfile;

        if (! $seller) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Shop not set up.'], 422);
            }
            return redirect()->route('seller.shop.edit');
        }

        $period = $request->get('period', '30');
        $startDate = now()->subDays((int) $period)->startOfDay();

        // Start from products so ALL seller products appear, even those with no orders.
        $products = DB::table('products')
            ->leftJoin('order_items', 'order_items.product_id', '=', 'products.id')
            ->leftJoin('orders', function ($join) use ($startDate) {
                $join->on('orders.id', '=', 'order_items.order_id')
                     ->where('orders.created_at', '>=', $startDate);
            })
            ->leftJoin(DB::raw('(SELECT product_id, COALESCE(SUM(stock), 0) as total_stock FROM product_variants GROUP BY product_id) as pv'), 'pv.product_id', '=', 'products.id')
            ->where('products.seller_profile_id', $seller->id)
            ->select(
                'products.id',
                'products.name',
                DB::raw('COALESCE(SUM(CASE WHEN orders.id IS NOT NULL THEN order_items.quantity ELSE 0 END), 0) as units_sold'),
                DB::raw('COALESCE(SUM(CASE WHEN orders.id IS NOT NULL THEN order_items.total_price ELSE 0 END), 0) as revenue'),
                DB::raw('COALESCE(pv.total_stock, 0) as stock')
            )
            ->groupBy('products.id', 'products.name', 'pv.total_stock')
            ->orderByDesc('revenue')
            ->paginate(20);

        return response()->json(compact('products', 'period'));
    }
}
