import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../layouts/AdminLayout";
import StatCard from "../partials/StatCard";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        total_users: 0, total_sellers: 0, total_products: 0, total_orders: 0,
        total_revenue: 0, platform_fees: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        axios.get("/admin/dashboard").then(res => {
            if (res.data.stats) setStats(res.data.stats);
            if (res.data.recentOrders) setRecentOrders(res.data.recentOrders);
        }).catch(err => console.error(err));
    }, []);

    const statusColor = (status) => {
        const colors = {
            completed: "status-completed",
            pending: "status-pending",
            processing: "status-processing",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <AdminLayout title="Admin Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Customers" value={stats.total_users} icon="users" color="primary" />
                <StatCard title="Total Staff" value={stats.total_sellers} icon="user-check" color="success" />
                <StatCard title="Products" value={stats.total_products} icon="package" color="warning" />
                <StatCard title="Total Orders" value={stats.total_orders} icon="shopping-cart" color="info" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                    <div className="card h-full bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="card-header p-6 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-800">Recent Orders</h2>
                        </div>
                        <div className="table-responsive">
                            <table className="table w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-gray-600 font-medium">Order ID</th>
                                        <th className="text-left px-6 py-3 text-gray-600 font-medium">Customer</th>
                                        <th className="text-left px-6 py-3 text-gray-600 font-medium">Date</th>
                                        <th className="text-center px-6 py-3 text-gray-600 font-medium">Status</th>
                                        <th className="text-right px-6 py-3 text-gray-600 font-medium">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentOrders.length > 0 ? recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 text-left font-medium">#{order.id}</td>
                                            <td className="px-6 py-3 text-left">{order.customer?.name || 'Unknown'}</td>
                                            <td className="px-6 py-3 text-left">{order.created_at ? new Date(order.created_at).toLocaleDateString() : ""}</td>
                                            <td className="px-6 py-3 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    order.order_status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {order.order_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-right font-medium">₱{Number(order.total).toLocaleString()}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="text-center px-6 py-8 text-gray-400">No orders yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="card-header border-b border-gray-100 pb-4 mb-4">
                            <h3 className="font-semibold text-gray-800">Financial Overview</h3>
                        </div>
                        <div className="card-body">
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">₱{Number(stats.total_revenue).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Platform Fees</p>
                                <p className="text-xl font-bold text-green-600">₱{Number(stats.platform_fees).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
