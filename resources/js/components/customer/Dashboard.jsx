import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import UserSidebar from "./partials/Sidebar";
import StatCard from "../partials/StatCard";

export default function UserDashboard() {
    const [stats, setStats] = useState({ total_orders: 0, pending: 0, completed: 0, wishlist: 0 });
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        axios.get("/customer/dashboard").then(res => {
            setStats({
                total_orders: res.data.stats.total_orders || 0,
                pending: res.data.stats.pending_orders || 0,
                completed: res.data.stats.completed_orders || 0,
                wishlist: res.data.stats.wishlist_count || 0,
            });
            setRecentOrders(res.data.recentOrders || []);
        }).catch(() => {});
    }, []);

    return (
        <DashboardLayout sidebar={<UserSidebar />} pageTitle="My Dashboard">
            <div className="kpi-grid">
                <StatCard title="Total Orders" value={stats.total_orders.toLocaleString()} />
                <StatCard title="Pending" value={stats.pending.toLocaleString()} />
                <StatCard title="Completed" value={stats.completed.toLocaleString()} />
                <StatCard title="Wishlist Items" value={stats.wishlist.toLocaleString()} />
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-card" style={{ marginBottom: "2rem" }}>
                <h3 className="quick-actions-title">Quick Actions</h3>
                <div className="quick-actions-grid">
                    <Link to="/browse" className="btn-primary">Browse Products</Link>
                    <Link to="/orders" className="btn-secondary">My Orders</Link>
                    <Link to="/wishlist" className="btn-secondary">Wishlist</Link>
                    <Link to="/cart" className="btn-secondary">Cart</Link>
                </div>
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
                                <th className="text-left">Status</th>
                                <th className="text-right">Total</th>
                                <th className="text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length > 0 ? recentOrders.map((order) => (
                                <tr key={order.id}>
                                    <td className="text-left">
                                        <Link to={`/orders/${order.id}`} className="link-primary font-medium">
                                            {order.order_number}
                                        </Link>
                                    </td>
                                    <td className="text-left">
                                        <span className="badge status-default">
                                            {order.order_status?.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="text-right font-medium">?{Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td className="text-left">{order.created_at ? new Date(order.created_at).toLocaleDateString() : ""}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="text-center" style={{ padding: "3rem" }}>
                                        No orders yet. <Link to="/browse" className="link-primary">Start shopping</Link>
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
