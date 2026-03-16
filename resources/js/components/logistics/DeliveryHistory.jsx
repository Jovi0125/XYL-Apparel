import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import LogisticsSidebar from './partials/Sidebar';

export default function DeliveryHistory() {
    const [shipments, setShipments] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const params = {};
        if (filter) params.status = filter;
        axios.get('/logistics/history', { params }).then(res => {
            setShipments(res.data.shipments?.data || []);
        }).catch(() => {});
    }, [filter]);

    return (
        <DashboardLayout sidebar={<LogisticsSidebar />} pageTitle="Delivery History">
            <div className="logistics-deliveries">
                <div className="controls-bar">
                    <div className="filter-tabs">
                        <button className={`filter-btn ${!filter ? 'active' : ''}`} onClick={() => setFilter('')}>All</button>
                        <button className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`} onClick={() => setFilter('delivered')}>Delivered</button>
                        <button className={`filter-btn ${filter === 'failed' ? 'active' : ''}`} onClick={() => setFilter('failed')}>Failed</button>
                    </div>
                </div>
                <table className="log-table">
                    <thead>
                        <tr>
                            <th>Tracking #</th>
                            <th>Customer</th>
                            <th>Status</th>
                            <th>Completed</th>
                            <th>POD</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shipments.map(s => (
                            <tr key={s.id}>
                                <td className="mono">{s.tracking_number}</td>
                                <td>{s.order?.customer?.name || '-'}</td>
                                <td><span className={`status-badge ${s.delivery_status}`}>{s.delivery_status}</span></td>
                                <td>{s.delivered_at ? new Date(s.delivered_at).toLocaleDateString() : '-'}</td>
                                <td>{s.proof_of_delivery ? <span className="status-badge success">Submitted</span> : <span className="status-badge">Pending</span>}</td>
                                <td><Link to={`/logistics/shipments/${s.id}`} className="action-link">View</Link></td>
                            </tr>
                        ))}
                        {shipments.length === 0 && <tr><td colSpan="6" className="empty-cell">No delivery history</td></tr>}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
