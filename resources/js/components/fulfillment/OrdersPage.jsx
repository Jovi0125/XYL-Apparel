import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FulfillmentLayout from '../layouts/FulfillmentLayout';
import fulfillmentService from '../../services/fulfillmentService';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    picking: 'bg-blue-100 text-blue-700',
    packing: 'bg-indigo-100 text-indigo-700',
    shipped: 'bg-green-100 text-green-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function FulfillmentOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const params = {};
        if (statusFilter) params.status = statusFilter;
        fulfillmentService.orderList(params)
            .then(res => setOrders(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [statusFilter]);

    return (
        <FulfillmentLayout title="Fulfillment Orders">
            <div className="mb-4 flex gap-2">
                {['', 'pending', 'picking', 'packing', 'shipped', 'delivered'].map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                            statusFilter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}>
                        {s || 'All'}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">Order</th>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">Customer</th>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">Assigned To</th>
                            <th className="text-center px-6 py-3 text-gray-600 font-medium">Status</th>
                            <th className="text-right px-6 py-3 text-gray-600 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">No orders found.</td></tr>
                        ) : orders.map(f => (
                            <tr key={f.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 font-medium text-gray-800">#{f.order?.id || f.order_id}</td>
                                <td className="px-6 py-3 text-gray-600">{f.order?.user?.name || '—'}</td>
                                <td className="px-6 py-3 text-gray-600">{f.assignee?.name || 'Unassigned'}</td>
                                <td className="px-6 py-3 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[f.status] || 'bg-gray-100 text-gray-600'}`}>
                                        {f.status}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-right">
                                    <Link to={`/fulfillment/orders/${f.id}`} className="text-blue-600 hover:underline text-sm">View</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </FulfillmentLayout>
    );
}
