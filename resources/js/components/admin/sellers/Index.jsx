import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import AdminSidebar from '../partials/Sidebar';

export default function SellersIndex() {
    const [sellers, setSellers] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        axios.get('/admin/sellers', { params: { search, status: statusFilter } }).then(res => {
            const data = res.data.sellers;
            setSellers(Array.isArray(data) ? data : data.data || []);
        }).catch(() => {});
    }, [search, statusFilter]);

    const handleApprove = (id) => { axios.patch(`/admin/sellers/${id}/approve`).then(() => setSellers(sellers.map(s => s.id === id ? { ...s, status: 'approved' } : s))).catch(err => alert(err.response?.data?.message || 'Failed.')); };
    const handleBan = (id) => { axios.patch(`/admin/sellers/${id}/ban`).then(() => setSellers(sellers.map(s => s.id === id ? { ...s, status: 'banned' } : s))).catch(err => alert(err.response?.data?.message || 'Failed.')); };
    const handleUnban = (id) => { axios.patch(`/admin/sellers/${id}/unban`).then(() => setSellers(sellers.map(s => s.id === id ? { ...s, status: 'approved' } : s))).catch(err => alert(err.response?.data?.message || 'Failed.')); };

    return (
        <DashboardLayout sidebar={<AdminSidebar />} pageTitle="Sellers">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <input type="text" placeholder="Search sellers..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-80 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="banned">Banned</option>
                </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Shop Name</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Owner</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Products</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                                <th className="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {sellers.length > 0 ? sellers.map((seller) => (
                                <tr key={seller.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900">{seller.shop_name}</td>
                                    <td className="px-6 py-4 text-gray-600">{seller.user?.name || '—'}</td>
                                    <td className="px-6 py-4 text-gray-600">{seller.products_count || 0}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${seller.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                                            ${seller.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                            ${seller.status === 'banned' ? 'bg-red-100 text-red-800' : ''}`}>
                                            {seller.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link to={`/admin/sellers/${seller.id}`} className="text-sm text-blue-600 hover:text-blue-800">View</Link>
                                        {seller.status === 'pending' && <button onClick={() => handleApprove(seller.id)} className="text-sm text-green-600 hover:text-green-800">Approve</button>}
                                        {seller.status === 'banned' ? (
                                            <button onClick={() => handleUnban(seller.id)} className="text-sm text-green-600 hover:text-green-800">Unban</button>
                                        ) : (
                                            <button onClick={() => handleBan(seller.id)} className="text-sm text-red-600 hover:text-red-800">Ban</button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">No sellers found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
