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
        const map = { pending_pickup: 'badge-warning', in_transit: 'badge-info', delivered: 'badge-success', returned: 'badge-danger' };
        return map[status] || 'badge-secondary';
    };

    return (
        <DashboardLayout sidebar={<LogisticsSidebar />} pageTitle="Shipments">
            <div className="table-actions">
                <input type="text" placeholder="Search shipments..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="form-input search-input" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="form-input">
                    <option value="">All Status</option>
                    <option value="pending_pickup">Pending Pickup</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="returned">Returned</option>
                </select>
            </div>

            <div className="data-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Tracking #</th>
                            <th>Order</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shipments.length > 0 ? shipments.map((s) => (
                            <tr key={s.id}>
                                <td className="font-medium text-black">{s.tracking_number}</td>
                                <td>#{s.order?.order_number}</td>
                                <td><span className={"status-badge-pill " + statusColor(s.status)}>{s.status?.replace('_', ' ')}</span></td>
                                <td>{s.created_at ? new Date(s.created_at).toLocaleDateString() : ''}</td>
                                <td className="text-right">
                                    <Link to={'/logistics/shipments/' + s.id} className="btn-link">View</Link>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="empty-state">No shipments found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
