import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminSidebar from './partials/Sidebar';
import StatCard from '../partials/StatCard';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        total_users: 0, total_sellers: 0, total_products: 0, total_orders: 0,
        pending_sellers: 0, total_revenue: 0, platform_fees: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        axios.get('/admin/dashboard').then(res => {
            setStats(res.data.stats);
            setRecentOrders(res.data.recentOrders);
        }).catch(() => {});
    }, []);

    const statusColor = (status) => {
        const colors = {
            completed: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <DashboardLayout sidebar={<AdminSidebar />} pageTitle="Admin Dashboard">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Customers" value={stats.total_users.toLocaleString()} />
                <StatCard title="Total Sellers" value={stats.total_sellers.toLocaleString()} />
                <StatCard title="Total Products" value={stats.total_products.toLocaleString()} />
                <StatCard title="Total Orders" value={stats.total_orders.toLocaleString()} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Pending Seller Approvals" value={stats.pending_sellers.toLocaleString()} />
                <StatCard title="Total Revenue" value={`₱ ${stats.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                <StatCard title="Platform Fees Earned" value={`₱ ${stats.platform_fees.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Order #</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Customer</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Seller</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                                <th className="text-right px-6 py-3 font-medium text-gray-500">Total</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentOrders.length > 0 ? recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900">{order.order_number}</td>
                                    <td className="px-6 py-4 text-gray-600">{order.customer?.name || '—'}</td>
                                    <td className="px-6 py-4 text-gray-600">{order.seller_profile?.shop_name || '—'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(order.order_status)}`}>
                                            {order.order_status?.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-900">₱{Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td className="px-6 py-4 text-gray-500">{order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">No orders yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
