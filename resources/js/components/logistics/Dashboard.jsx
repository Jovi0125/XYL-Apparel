import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import LogisticsSidebar from './partials/Sidebar';
import StatCard from '../partials/StatCard';

export default function LogisticsDashboard() {
    const [stats, setStats] = useState({ pending: 0, in_transit: 0, delivered: 0, total: 0 });

    useEffect(() => {
        axios.get('/logistics/dashboard').then(res => {
            setStats({
                pending: res.data.stats?.assigned || 0,
                in_transit: res.data.stats?.in_transit || 0,
                delivered: res.data.stats?.delivered || 0,
                total: (res.data.stats?.assigned || 0) + (res.data.stats?.in_transit || 0) + (res.data.stats?.delivered || 0) + (res.data.stats?.failed || 0),
            });
        }).catch(() => {});
    }, []);

    return (
        <DashboardLayout sidebar={<LogisticsSidebar />} pageTitle="Logistics Dashboard">
            <div className="dashboard-stats-grid">
                <StatCard title="Pending Pickup" value={stats.pending.toLocaleString()} />
                <StatCard title="In Transit" value={stats.in_transit.toLocaleString()} />
                <StatCard title="Delivered" value={stats.delivered.toLocaleString()} />
                <StatCard title="Total Shipments" value={stats.total.toLocaleString()} />
            </div>
        </DashboardLayout>
    );
}
