import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import AdminSidebar from '../partials/Sidebar';

export default function ReportsSellers() {
    const [sellers, setSellers] = useState([]);
    const [period, setPeriod] = useState('30');

    useEffect(() => {
        axios.get('/admin/reports/sellers', { params: { period } }).then(res => {
            const data = res.data.sellers;
            setSellers(Array.isArray(data) ? data : data.data || []);
        }).catch(() => {});
    }, [period]);

    return (
        <DashboardLayout sidebar={<AdminSidebar />} pageTitle="Seller Performance Report">
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                    <Link to="/admin/reports" className="px-3 py-1.5 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50">Overview</Link>
                    <Link to="/admin/reports/products" className="px-3 py-1.5 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50">Products</Link>
                    <Link to="/admin/reports/sellers" className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg">Sellers</Link>
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
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Shop Name</th>
                                <th className="text-right px-6 py-3 font-medium text-gray-500">Orders</th>
                                <th className="text-right px-6 py-3 font-medium text-gray-500">Revenue</th>
                                <th className="text-right px-6 py-3 font-medium text-gray-500">Commission</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {sellers.length > 0 ? sellers.map((s) => (
                                <tr key={s.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900">{s.shop_name}</td>
                                    <td className="px-6 py-4 text-right text-gray-600">{s.orders_count}</td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-900">₱{Number(s.revenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td className="px-6 py-4 text-right text-gray-600">₱{Number(s.commission).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
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
