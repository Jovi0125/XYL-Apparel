import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import AdminSidebar from '../partials/Sidebar';
import StatCard from '../../partials/StatCard';

export default function SellersShow() {
    const { id } = useParams();
    const [seller, setSeller] = useState(null);

    useEffect(() => {
        axios.get(`/admin/sellers/${id}`).then(res => {
            const s = res.data.seller;
            s.products_count = res.data.stats?.total_products || 0;
            s.orders_count = res.data.stats?.total_orders || 0;
            s.revenue = res.data.stats?.total_revenue || 0;
            setSeller(s);
        }).catch(() => {});
    }, [id]);

    if (!seller) return <DashboardLayout sidebar={<AdminSidebar />} pageTitle="Seller Details"><p className="text-gray-400">Loading...</p></DashboardLayout>;

    return (
        <DashboardLayout sidebar={<AdminSidebar />} pageTitle="Seller Details">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
                    {seller.logo && <img src={`/storage/${seller.logo}`} alt={seller.shop_name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" />}
                    <h2 className="text-lg font-semibold text-gray-900">{seller.shop_name}</h2>
                    <p className="text-sm text-gray-500">{seller.user?.name}</p>
                    <span className={`inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${seller.status === 'approved' ? 'bg-green-100 text-green-800' : seller.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {seller.status}
                    </span>
                </div>
                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                    <StatCard title="Products" value={seller.products_count || 0} />
                    <StatCard title="Total Orders" value={seller.orders_count || 0} />
                    <StatCard title="Revenue" value={`₱ ${(seller.revenue || 0).toLocaleString()}`} />
                    <StatCard title="Rating" value={seller.rating || 'N/A'} />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Products</h3>
                <p className="text-sm text-gray-400">Product list will appear here when data is loaded via API.</p>
            </div>

            <div className="mt-4">
                <Link to="/admin/sellers" className="text-sm text-gray-600 hover:text-gray-900">&larr; Back to Sellers</Link>
            </div>
        </DashboardLayout>
    );
}
