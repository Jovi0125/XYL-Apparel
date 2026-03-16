import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import LogisticsSidebar from './partials/Sidebar';

export default function LogisticsDashboard() {
    const [stats, setStats] = useState({});
    const [queue, setQueue] = useState([]);
    const [tracking, setTracking] = useState([]);
    const [perf, setPerf] = useState({});

    useEffect(() => {
        axios.get('/logistics/dashboard').then(res => {
            setStats(res.data.stats || {});
            setQueue(res.data.todayQueue || []);
            setTracking(res.data.recentTracking || []);
            setPerf(res.data.performance || {});
        }).catch(() => {});
    }, []);

    const kpiCards = [
        { label: 'Total Assigned', value: stats.total_assigned || 0, cls: '' },
        { label: 'Picked Up Today', value: stats.picked_up_today || 0, cls: 'accent' },
        { label: 'In Transit', value: stats.in_transit || 0, cls: 'info' },
        { label: 'Out for Delivery', value: stats.out_for_delivery || 0, cls: 'warning' },
        { label: 'Delivered Today', value: stats.delivered_today || 0, cls: 'success' },
        { label: 'Failed', value: stats.failed || 0, cls: 'danger' },
    ];

    return (
        <DashboardLayout sidebar={<LogisticsSidebar />} pageTitle="Logistics Dashboard">
            <div className="logistics-dashboard">
                <div className="kpi-grid">
                    {kpiCards.map(c => (
                        <div key={c.label} className={`kpi-card ${c.cls}`}>
                            <div className="kpi-value">{c.value}</div>
                            <div className="kpi-label">{c.label}</div>
                        </div>
                    ))}
                </div>

                <div className="dashboard-sections">
                    <div className="section-card">
                        <div className="section-header">
                            <h3>Today's Delivery Queue</h3>
                            <Link to="/logistics/shipments" className="view-all">View All →</Link>
                        </div>
                        <table className="log-table">
                            <thead>
                                <tr>
                                    <th>Tracking #</th>
                                    <th>Customer</th>
                                    <th>Address</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {queue.map(s => (
                                    <tr key={s.id}>
                                        <td className="mono">{s.tracking_number}</td>
                                        <td>{s.order?.customer?.name || '-'}</td>
                                        <td className="truncate-cell">{s.delivery_address}</td>
                                        <td><span className={`status-badge ${s.delivery_status}`}>{s.delivery_status.replace('_', ' ')}</span></td>
                                        <td><Link to={`/logistics/shipments/${s.id}`} className="action-link">View</Link></td>
                                    </tr>
                                ))}
                                {queue.length === 0 && <tr><td colSpan="5" className="empty-cell">No deliveries in queue</td></tr>}
                            </tbody>
                        </table>
                    </div>

                    <div className="bottom-grid">
                        <div className="section-card">
                            <h3>Recent Tracking Updates</h3>
                            <ul className="tracking-feed">
                                {tracking.map(t => (
                                    <li key={t.id} className="feed-item">
                                        <span className="feed-status">{t.status}</span>
                                        <span className="feed-meta">
                                            {t.shipment?.tracking_number} · {new Date(t.created_at).toLocaleTimeString()}
                                        </span>
                                        {t.remarks && <span className="feed-remark">{t.remarks}</span>}
                                    </li>
                                ))}
                                {tracking.length === 0 && <li className="empty-cell">No recent updates</li>}
                            </ul>
                        </div>
                        <div className="section-card">
                            <h3>Performance Summary</h3>
                            <div className="perf-stats">
                                <div className="perf-item">
                                    <div className="perf-num">{perf.total_completed || 0}</div>
                                    <div className="perf-label">Completed</div>
                                </div>
                                <div className="perf-item">
                                    <div className="perf-num danger-text">{perf.total_failed || 0}</div>
                                    <div className="perf-label">Failed</div>
                                </div>
                                <div className="perf-item">
                                    <div className="perf-num">{perf.avg_delivery_hours || 0}h</div>
                                    <div className="perf-label">Avg. Time</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
