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
        const map = {
            pending_pickup: 'bg-gray-100 text-gray-700',
            picked_up: 'bg-sky-100 text-sky-700',
            in_transit: 'bg-amber-100 text-amber-700',
            out_for_delivery: 'bg-indigo-100 text-indigo-700',
            delivered: 'bg-emerald-100 text-emerald-700',
            failed: 'bg-rose-100 text-rose-700',
            returned: 'bg-rose-100 text-rose-700',
        };

        return map[status] || 'bg-gray-100 text-gray-700';
    };

    const formatStatus = (status) => {
        if (!status) return 'Pending';
        return status.replace(/_/g, ' ');
    };

    const formatMoney = (value) => {
        const amount = Number(value || 0);
        return `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (value) => {
        if (!value) return '—';
        return new Date(value).toLocaleDateString();
    };

    return (
        <DashboardLayout sidebar={<LogisticsSidebar />} pageTitle="Shipments">
            <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <input
                    type="text"
                    placeholder="Search shipments..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:w-80"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                    <option value="">All Status</option>
                    <option value="pending_pickup">Pending Pickup</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="in_transit">In Transit</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="failed">Failed</option>
                </select>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Shipments</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50/70">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Tracking#</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Order#</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {shipments.length > 0 ? shipments.map((s) => (
                            <tr key={s.id} className="transition hover:bg-gray-50/70">
                                <td className="px-6 py-3">
                                    <Link
                                        to={'/logistics/shipments/' + s.id}
                                        className="text-sm font-semibold hover:underline"
                                        style={{ color: '#2563eb' }}
                                    >
                                        {s.tracking_number}
                                    </Link>
                                </td>
                                <td className="px-6 py-3 text-xs font-medium text-gray-700">{s.order?.order_number || '—'}</td>
                                <td className="px-6 py-3">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColor(s.delivery_status || s.status)}`}>
                                        {formatStatus(s.delivery_status || s.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-right text-sm font-semibold text-gray-800">
                                    {formatMoney(s.order?.total)}
                                </td>
                                <td className="px-6 py-3 text-xs font-medium text-gray-700">
                                    {formatDate(s.created_at)}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">
                                    No shipments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
