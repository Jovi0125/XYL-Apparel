import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import LogisticsSidebar from './partials/Sidebar';

const STATUSES = ['', 'assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed'];

export default function Deliveries() {
    const [shipments, setShipments] = useState([]);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');

    const fetchData = () => {
        const params = {};
        if (filter) params.status = filter;
        if (search) params.search = search;
        axios.get('/logistics/shipments', { params }).then(res => {
            setShipments(res.data.shipments?.data || []);
        }).catch(() => {});
    };

    useEffect(() => { fetchData(); }, [filter]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchData();
    };

    return (
        <DashboardLayout sidebar={<LogisticsSidebar />} pageTitle="Assigned Deliveries">
            <div className="logistics-deliveries">
                <div className="controls-bar">
                    <div className="filter-tabs">
                        {STATUSES.map(s => (
                            <button key={s} className={`filter-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
                                {s ? s.replace('_', ' ') : 'All'}
                            </button>
                        ))}
                    </div>
                    <form onSubmit={handleSearch} className="search-box">
                        <input type="text" placeholder="Search tracking # or address..." value={search} onChange={e => setSearch(e.target.value)} />
                        <button type="submit">Search</button>
                    </form>
                </div>
                <table className="log-table">
                    <thead>
                        <tr>
                            <th>Tracking #</th>
                            <th>Order</th>
                            <th>Customer</th>
                            <th>Seller</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Assigned</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shipments.map(s => (
                            <tr key={s.id}>
                                <td className="mono">{s.tracking_number}</td>
                                <td>#{s.order_id}</td>
                                <td>{s.order?.customer?.name || '-'}</td>
                                <td>{s.order?.seller_profile?.shop_name || '-'}</td>
                                <td className="truncate-cell">{s.delivery_address}</td>
                                <td><span className={`status-badge ${s.delivery_status}`}>{s.delivery_status.replace('_', ' ')}</span></td>
                                <td>{s.assigned_at ? new Date(s.assigned_at).toLocaleDateString() : '-'}</td>
                                <td>
                                    <Link to={`/logistics/shipments/${s.id}`} className="action-link">View</Link>
                                </td>
                            </tr>
                        ))}
                        {shipments.length === 0 && <tr><td colSpan="8" className="empty-cell">No shipments found</td></tr>}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
