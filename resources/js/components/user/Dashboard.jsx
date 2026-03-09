import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import UserSidebar from './partials/Sidebar';
import StatCard from '../partials/StatCard';

export default function UserDashboard() {
    const [stats, setStats] = useState({ total_orders: 0, pending: 0, completed: 0, wishlist: 0 });
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        axios.get('/customer/dashboard').then(res => {
            setStats({
                total_orders: res.data.stats.total_orders || 0,
                pending: res.data.stats.pending_orders || 0,
                completed: res.data.stats.completed_orders || 0,
                wishlist: res.data.stats.wishlist_count || 0,
            });
            setRecentOrders(res.data.recentOrders || []);
        }).catch(() => {});
    }, []);

    return (
        <DashboardLayout sidebar={<UserSidebar />} pageTitle="My Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Orders" value={stats.total_orders.toLocaleString()} />
                <StatCard title="Pending" value={stats.pending.toLocaleString()} />
                <StatCard title="Completed" value={stats.completed.toLocaleString()} />
                <StatCard title="Wishlist Items" value={stats.wishlist.toLocaleString()} />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                    <Link to="/browse" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">Browse Products</Link>
                    <Link to="/orders" className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">My Orders</Link>
                    <Link to="/wishlist" className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">Wishlist</Link>
                    <Link to="/cart" className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">Cart</Link>
                </div>
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
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                                <th className="text-right px-6 py-3 font-medium text-gray-500">Total</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentOrders.length > 0 ? recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4"><Link to={`/orders/${order.id}`} className="font-medium text-blue-600 hover:text-blue-800">{order.order_number}</Link></td>
                                    <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">{order.order_status?.replace('_', ' ')}</span></td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-900">₱{Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td className="px-6 py-4 text-gray-500">{order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400">No orders yet. <Link to="/browse" className="text-blue-600">Start shopping</Link></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
