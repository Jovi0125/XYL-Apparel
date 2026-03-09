import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import SellerSidebar from './partials/Sidebar';
import StatCard from '../partials/StatCard';

export default function SellerDashboard() {
    const [stats, setStats] = useState({
        total_products: 0, total_orders: 0, total_revenue: 0, pending_orders: 0,
    });
    const [shopStatus, setShopStatus] = useState('approved');

    useEffect(() => {
        axios.get('/seller/dashboard').then(res => {
            setStats(res.data.stats);
            if (res.data.seller) setShopStatus(res.data.seller.status);
        }).catch(() => {});
    }, []);

    return (
        <DashboardLayout sidebar={<SellerSidebar />} pageTitle="Seller Dashboard">
            {shopStatus === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-yellow-800">Your shop is pending approval. You'll be able to manage products once approved.</p>
                </div>
            )}
            {shopStatus === 'banned' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-red-800">Your shop has been suspended. Please contact support.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Products" value={stats.total_products.toLocaleString()} />
                <StatCard title="Total Orders" value={stats.total_orders.toLocaleString()} />
                <StatCard title="Total Revenue" value={`₱ ${stats.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                <StatCard title="Pending Orders" value={stats.pending_orders.toLocaleString()} />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                    <Link to="/seller/products/create" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">Add Product</Link>
                    <Link to="/seller/orders" className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">View Orders</Link>
                    <Link to="/seller/discounts/create" className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">Create Discount</Link>
                    <Link to="/seller/shop/edit" className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">Edit Shop</Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
