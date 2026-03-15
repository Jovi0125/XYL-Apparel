import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import SellerSidebar from "./partials/Sidebar";
import StatCard from "../partials/StatCard";

export default function SellerDashboard() {
    const [stats, setStats] = useState({
        total_products: 0, total_orders: 0, total_revenue: 0, pending_orders: 0,
    });
    const [shopStatus, setShopStatus] = useState("approved");

    useEffect(() => {
        axios.get("/seller/dashboard").then(res => {
            setStats(res.data.stats);
            if (res.data.seller) setShopStatus(res.data.seller.status);
        }).catch(() => {});
    }, []);

    return (
        <DashboardLayout sidebar={<SellerSidebar />} pageTitle="Seller Dashboard">
            <div className="alerts">
                {shopStatus === "pending" && (
                    <div className="alert alert-warning">
                        <p>Your shop is pending approval. You'll be able to manage products once approved.</p>
                    </div>
                )}
                {shopStatus === "banned" && (
                    <div className="alert alert-danger">
                        <p>Your shop has been suspended. Please contact support.</p>
                    </div>
                )}
            </div>

            <div className="kpi-grid">
                <StatCard title="Total Products" value={stats.total_products.toLocaleString()} />
                <StatCard title="Total Orders" value={stats.total_orders.toLocaleString()} />
                <StatCard title="Total Revenue" value={`? ${stats.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                <StatCard title="Pending Orders" value={stats.pending_orders.toLocaleString()} />
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-card">
                <h3 className="quick-actions-title">Quick Actions</h3>
                <div className="quick-actions-grid">
                    <Link to="/seller/products/create" className="btn-primary">Add Product</Link>
                    <Link to="/seller/orders" className="btn-secondary">View Orders</Link>
                    <Link to="/seller/discounts/create" className="btn-secondary">Create Discount</Link>
                    <Link to="/seller/shop/edit" className="btn-secondary">Edit Shop</Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
