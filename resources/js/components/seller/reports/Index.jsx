import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import SellerSidebar from '../partials/Sidebar';
import StatCard from '../../partials/StatCard';

export default function ReportsIndex() {
    const [stats, setStats] = useState({ revenue: 0, orders: 0, earnings: 0 });
    const [topProducts, setTopProducts] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [period, setPeriod] = useState('30');

    useEffect(() => {
        axios.get('/seller/reports', { params: { period } }).then(res => {
            const d = res.data;
            setStats({ revenue: d.totalRevenue || 0, orders: d.totalOrders || 0, earnings: d.netEarnings || 0 });
            setTopProducts(d.topProducts || []);
            setLowStock(d.lowStockProducts || []);
        }).catch(() => {});
    }, [period]);

    return (
        <DashboardLayout sidebar={<SellerSidebar />} pageTitle="Reports & Analytics">
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                    <Link to="/seller/reports" className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg">Overview</Link>
                    <Link to="/seller/reports/products" className="px-3 py-1.5 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50">Products</Link>
                </div>
                <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Revenue" value={`₱ ${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                <StatCard title="Orders" value={stats.orders.toLocaleString()} />
                <StatCard title="Earnings" value={`₱ ${stats.earnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                <div className="h-64 flex items-center justify-center text-gray-400 text-sm">Chart placeholder (integrate with Chart.js or Recharts)</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Top Products</h3>
                    {topProducts.length > 0 ? (
                        <div className="space-y-3">{topProducts.map((p, i) => (
                            <div key={i} className="flex items-center justify-between text-sm"><span className="text-gray-700">{p.product_name}</span><span className="font-medium text-gray-900">{p.total_sold} sold</span></div>
                        ))}</div>
                    ) : <p className="text-sm text-gray-400">No data available.</p>}
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Low Stock Alerts</h3>
                    {lowStock.length > 0 ? (
                        <div className="space-y-3">{lowStock.map((p, i) => (
                            <div key={i} className="flex items-center justify-between text-sm"><span className="text-gray-700">{p.product_name} ({p.size || ''}{p.color ? ` / ${p.color}` : ''})</span><span className="font-medium text-red-600">{p.stock} left</span></div>
                        ))}</div>
                    ) : <p className="text-sm text-gray-400">No low stock alerts.</p>}
                </div>
            </div>
        </DashboardLayout>
    );
}
