import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import AdminSidebar from '../partials/Sidebar';

export default function OrdersIndex() {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        axios.get('/admin/orders', { params: { search, status: statusFilter } }).then(res => {
            const data = res.data.orders;
            setOrders(Array.isArray(data) ? data : data.data || []);
        }).catch(() => {});
    }, [search, statusFilter]);

    const statusColor = (status) => {
        const colors = { completed: 'bg-green-100 text-green-800', pending: 'bg-yellow-100 text-yellow-800', processing: 'bg-blue-100 text-blue-800', cancelled: 'bg-red-100 text-red-800' };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const paymentColor = (status) => {
        const colors = { paid: 'bg-green-100 text-green-800', pending: 'bg-yellow-100 text-yellow-800', failed: 'bg-red-100 text-red-800' };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <DashboardLayout sidebar={<AdminSidebar />} pageTitle="Orders">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <input type="text" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-80 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Order #</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Customer</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Seller</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Order Status</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Payment</th>
                                <th className="text-right px-6 py-3 font-medium text-gray-500">Total</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.length > 0 ? orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4"><Link to={`/admin/orders/${order.id}`} className="font-medium text-blue-600 hover:text-blue-800">{order.order_number}</Link></td>
                                    <td className="px-6 py-4 text-gray-600">{order.customer?.name || '—'}</td>
                                    <td className="px-6 py-4 text-gray-600">{order.seller_profile?.shop_name || '—'}</td>
                                    <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor(order.order_status)}`}>{order.order_status?.replace('_', ' ')}</span></td>
                                    <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${paymentColor(order.payment_status)}`}>{order.payment_status}</span></td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-900">₱{Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td className="px-6 py-4 text-gray-500">{order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-400">No orders found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
