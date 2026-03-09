import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import AdminSidebar from '../partials/Sidebar';
import StatCard from '../../partials/StatCard';

export default function ReportsIndex() {
    const [stats, setStats] = useState({
        total_revenue: 0, total_orders: 0, total_customers: 0, avg_order_value: 0,
    });
    const [topSellers, setTopSellers] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [period, setPeriod] = useState('30');

    useEffect(() => {
        axios.get('/admin/reports', { params: { period } }).then(res => {
            const d = res.data;
            setStats({
                total_revenue: d.totalRevenue || 0,
                total_orders: d.totalOrders || 0,
                total_customers: d.totalCustomers || 0,
                avg_order_value: d.averageOrderValue || 0,
            });
            setTopSellers(d.topSellers || []);
            setTopProducts(d.topProducts || []);
        }).catch(() => {});
    }, [period]);

    return (
        <DashboardLayout sidebar={<AdminSidebar />} pageTitle="Reports & Analytics">
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                    <Link to="/admin/reports" className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg">Overview</Link>
                    <Link to="/admin/reports/products" className="px-3 py-1.5 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50">Products</Link>
                    <Link to="/admin/reports/sellers" className="px-3 py-1.5 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50">Sellers</Link>
                </div>
                <select value={period} onChange={(e) => setPeriod(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                </select>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Revenue" value={`₱ ${stats.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                <StatCard title="Total Orders" value={stats.total_orders.toLocaleString()} />
                <StatCard title="Total Customers" value={stats.total_customers.toLocaleString()} />
                <StatCard title="Avg Order Value" value={`₱ ${stats.avg_order_value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
            </div>

            {/* Revenue Chart Placeholder */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                    Chart will be rendered here (integrate with Chart.js or Recharts)
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Sellers */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Top Sellers</h3>
                    {topSellers.length > 0 ? (
                        <div className="space-y-3">{topSellers.map((s, i) => (
                            <div key={i} className="flex items-center justify-between text-sm"><span className="text-gray-700">{s.shop_name}</span><span className="font-medium text-gray-900">₱{Number(s.total_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                        ))}</div>
                    ) : <p className="text-sm text-gray-400">No data available.</p>}
                </div>
                {/* Top Products */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Top Products</h3>
                    {topProducts.length > 0 ? (
                        <div className="space-y-3">{topProducts.map((p, i) => (
                            <div key={i} className="flex items-center justify-between text-sm"><span className="text-gray-700">{p.product_name}</span><span className="font-medium text-gray-900">{p.total_sold} sold</span></div>
                        ))}</div>
                    ) : <p className="text-sm text-gray-400">No data available.</p>}
                </div>
            </div>
        </DashboardLayout>
    );
}
