import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import LogisticsSidebar from '../partials/Sidebar';

export default function ShipmentsIndex() {
    const [shipments, setShipments] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const params = {};
        if (search) params.search = search;
        if (statusFilter) params.status = statusFilter;
        axios.get('/logistics/shipments', { params }).then(res => {
            const data = res.data.shipments;
            setShipments(Array.isArray(data) ? data : data.data || []);
        }).catch(() => {});
    }, [search, statusFilter]);

    const statusColor = (status) => {
        const map = { pending_pickup: 'bg-yellow-100 text-yellow-800', in_transit: 'bg-blue-100 text-blue-800', delivered: 'bg-green-100 text-green-800', returned: 'bg-red-100 text-red-800' };
        return map[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <DashboardLayout sidebar={<LogisticsSidebar />} pageTitle="Shipments">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <input type="text" placeholder="Search shipments..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-80 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="">All Status</option>
                    <option value="pending_pickup">Pending Pickup</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="returned">Returned</option>
                </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="text-left px-6 py-3 font-medium text-gray-500">Tracking #</th>
                            <th className="text-left px-6 py-3 font-medium text-gray-500">Order</th>
                            <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                            <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                            <th className="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {shipments.length > 0 ? shipments.map((s) => (
                            <tr key={s.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 font-medium text-gray-900">{s.tracking_number}</td>
                                <td className="px-6 py-4 text-gray-500">#{s.order?.order_number}</td>
                                <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor(s.status)}`}>{s.status?.replace('_', ' ')}</span></td>
                                <td className="px-6 py-4 text-gray-500">{s.created_at ? new Date(s.created_at).toLocaleDateString() : ''}</td>
                                <td className="px-6 py-4 text-right">
                                    <Link to={`/logistics/shipments/${s.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</Link>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">No shipments found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
