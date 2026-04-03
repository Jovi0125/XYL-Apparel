import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import AdminSidebar from '../partials/Sidebar';

export default function ReportsProducts() {
    const [products, setProducts] = useState([]);
    const [period, setPeriod] = useState('30');

    useEffect(() => {
        axios.get('/admin/reports/products', { params: { period } }).then(res => {
            const data = res.data.products;
            setProducts(Array.isArray(data) ? data : data.data || []);
        }).catch(() => {});
    }, [period]);

    return (
        <DashboardLayout sidebar={<AdminSidebar />} pageTitle="Product Performance Report">
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                    <Link to="/admin/reports" className="px-3 py-1.5 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50">Overview</Link>
                    <Link to="/admin/reports/products" className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg">Products</Link>
                    <Link to="/admin/reports/sellers" className="px-3 py-1.5 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50">Sellers</Link>
                </div>
                <select value={period} onChange={(e) => setPeriod(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Product</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Seller</th>
                                <th className="text-right px-6 py-3 font-medium text-gray-500">Units Sold</th>
                                <th className="text-right px-6 py-3 font-medium text-gray-500">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.length > 0 ? products.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{p.shop_name || '—'}</td>
                                    <td className="px-6 py-4 text-right text-gray-600">{Number(p.units_sold || 0).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-900">₱{Number(p.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400">No data available.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
