import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminSidebar from "./partials/Sidebar";
import StatCard from "../partials/StatCard";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        total_users: 0, total_sellers: 0, total_products: 0, total_orders: 0,
        pending_sellers: 0, total_revenue: 0, platform_fees: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        axios.get("/admin/dashboard").then(res => {
            setStats(res.data.stats);
            setRecentOrders(res.data.recentOrders);
        }).catch(() => {});
    }, []);

    const statusColor = (status) => {
        const colors = {
            completed: "status-completed",
            pending: "status-pending",
            processing: "status-processing",
            cancelled: "status-cancelled",
        };
        return colors[status] || "status-default";
    };

    const formatCurrency = (value) => (
        new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            currencyDisplay: "narrowSymbol",
        }).format(Number(value || 0))
    );

    return (
        <DashboardLayout sidebar={<AdminSidebar />} pageTitle="Admin Dashboard">
            {/* KPI Cards */}
            <div className="kpi-grid">
                <StatCard title="Total Customers" value={stats.total_users.toLocaleString()} />
                <StatCard title="Total Sellers" value={stats.total_sellers.toLocaleString()} />
                <StatCard title="Total Products" value={stats.total_products.toLocaleString()} />
                <StatCard title="Total Orders" value={stats.total_orders.toLocaleString()} />
            </div>

            <div className="kpi-grid kpi-grid-3">
                <StatCard title="Pending Seller Approvals" value={stats.pending_sellers.toLocaleString()} />
                <StatCard title="Total Revenue" value={formatCurrency(stats.total_revenue)} />
                <StatCard title="Platform Fees Earned" value={formatCurrency(stats.platform_fees)} />
            </div>

            {/* Recent Orders */}
            <div className="table-container">
                <div className="table-header">
                    <h2 className="table-title">Recent Orders</h2>
                </div>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="text-left">Order #</th>
                                <th className="text-left">Customer</th>
                                <th className="text-left">Seller</th>
                                <th className="text-left">Status</th>
                                <th className="text-right">Total</th>
                                <th className="text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length > 0 ? recentOrders.map((order) => (
                                <tr key={order.id}>
                                    <td className="text-left"><strong>{order.order_number}</strong></td>
                                    <td className="text-left">{order.customer?.name || "�"}</td>
                                    <td className="text-left">{order.seller_profile?.shop_name || "�"}</td>
                                    <td className="text-left">
                                        <span className={`badge ${statusColor(order.order_status)}`}>
                                            {order.order_status?.replace("_", " ").replace(/^\w/, c => c.toUpperCase())}
                                        </span>
                                    </td>
                                    <td className="text-right font-medium">{formatCurrency(order.total)}</td>
                                    <td className="text-left">{order.created_at ? new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="text-center" style={{ padding: "3rem" }}>No orders yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
