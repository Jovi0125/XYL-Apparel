import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import UserSidebar from '../partials/Sidebar';

export default function OrdersIndex() {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const params = {};
        if (search) params.search = search;
        if (statusFilter) params.status = statusFilter;
        axios.get('/customer/orders', { params }).then(res => {
            const data = res.data.orders;
            setOrders(Array.isArray(data) ? data : data.data || []);
        }).catch(() => {});
    }, [search, statusFilter]);

    const statusColor = (status) => {
        const map = { completed: 'bg-green-100 text-green-800', pending: 'bg-yellow-100 text-yellow-800', processing: 'bg-blue-100 text-blue-800', cancelled: 'bg-red-100 text-red-800' };
        return map[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <DashboardLayout sidebar={<UserSidebar />} pageTitle="My Orders">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <input type="text" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-80 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="space-y-4">
                {orders.length > 0 ? orders.map((order) => (
                    <Link key={order.id} to={`/orders/${order.id}`} className="block bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-900">#{order.order_number}</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor(order.order_status)}`}>{order.order_status?.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {(order.items || []).slice(0, 3).map((item) => (
                                <div key={item.id} className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                    {item.product?.images?.[0] && <img src={`/storage/${item.product.images[0].path}`} alt="" className="w-full h-full object-cover" />}
                                </div>
                            ))}
                            {(order.items?.length || 0) > 3 && <span className="text-xs text-gray-400">+{order.items.length - 3} more</span>}
                        </div>
                        <div className="flex items-center justify-between mt-3 text-sm">
                            <span className="text-gray-500">{order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}</span>
                            <div className="text-right">
                                {Number(order.discount_amount) > 0 && (
                                    <div className="flex items-center gap-2 justify-end">
                                        <span className="text-xs text-gray-400 line-through">₱{Number(order.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        <span className="text-xs text-green-600 font-medium">-₱{Number(order.discount_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                )}
                                <span className="font-semibold text-gray-900">₱{Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </Link>
                )) : (
                    <div className="text-center py-16 text-gray-400">No orders yet. <Link to="/browse" className="text-blue-600">Start shopping</Link></div>
                )}
            </div>
        </DashboardLayout>
    );
}
