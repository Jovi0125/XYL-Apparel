import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import AdminSidebar from "../partials/Sidebar";

export default function AdminInventoryLogs() {
    const [logs, setLogs] = useState([]);
    const [changeFilter, setChangeFilter] = useState('');

    const fetchLogs = () => {
        const params = {};
        if (changeFilter) params.change_type = changeFilter;
        axios.get("/admin/inventory/logs", { params }).then(res => setLogs(res.data.data || [])).catch(() => {});
    };

    useEffect(() => { fetchLogs(); }, [changeFilter]);

    return (
        <DashboardLayout sidebar={<AdminSidebar />}>
            <div className="admin-inventory-module">
                <div className="section-title">Stock Audit Logs</div>
                <div style={{marginBottom:'1.5rem'}}>
                    <select value={changeFilter} onChange={e => setChangeFilter(e.target.value)} style={{border:'1px solid #ccc',padding:'0.5rem',fontSize:'0.85rem'}}>
                        <option value="">All Changes</option>
                        <option value="restock">Restock</option>
                        <option value="sale">Sale</option>
                        <option value="manual_adjustment">Manual Adjustment</option>
                        <option value="return">Return</option>
                        <option value="cancellation">Cancellation</option>
                        <option value="delivery_failed">Delivery Failed</option>
                    </select>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>User</th>
                            <th>Product Variant</th>
                            <th>Change Type</th>
                            <th>Qty Change</th>
                            <th>Before → After</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id}>
                                <td>{new Date(log.created_at).toLocaleString()}</td>
                                <td>{log.user?.name || log.user_id || 'System'}</td>
                                <td>{log.product_variant?.product?.name} ({log.product_variant?.size}/{log.product_variant?.color})</td>
                                <td><span className={`log-badge ${log.change_type}`}>{log.change_type.replace('_', ' ')}</span></td>
                                <td style={{ fontWeight: 700, color: log.quantity_changed > 0 ? '#15803d' : '#dc2626' }}>
                                    {log.quantity_changed > 0 ? `+${log.quantity_changed}` : log.quantity_changed}
                                </td>
                                <td style={{ color: '#666' }}>
                                    {log.quantity_before} → <span style={{color:'#111',fontWeight:600}}>{log.quantity_after}</span>
                                </td>
                                <td>{log.notes || '-'}</td>
                            </tr>
                        ))}
                        {logs.length === 0 && <tr><td colSpan="7" style={{textAlign:'center',padding:'2rem',color:'#999'}}>No logs found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
