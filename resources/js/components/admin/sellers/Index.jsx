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
    const iconButtonBase = 'inline-flex items-center justify-center p-1.5 rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-1';

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
                                    <td className="px-6 py-4 text-right">
                                        <div className="inline-flex items-center gap-1.5">
                                        <Link
                                            to={`/admin/sellers/${seller.id}`}
                                            className={`${iconButtonBase} text-blue-600 hover:text-blue-800 hover:bg-blue-50 focus:ring-blue-400`}
                                            title="View seller"
                                            aria-label="View seller"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        </Link>
                                        {seller.status === 'pending' && (
                                            <button
                                                onClick={() => handleApprove(seller.id)}
                                                className={`${iconButtonBase} text-green-600 hover:text-green-800 hover:bg-green-50 focus:ring-green-400`}
                                                title="Approve seller"
                                                aria-label="Approve seller"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m7 12 3 3 7-7" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-3.4-7" />
                                                </svg>
                                            </button>
                                        )}
                                        {seller.status === 'banned' ? (
                                            <button
                                                onClick={() => handleUnban(seller.id)}
                                                className={`${iconButtonBase} text-green-600 hover:text-green-800 hover:bg-green-50 focus:ring-green-400`}
                                                title="Unban seller"
                                                aria-label="Unban seller"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m7 12 3 3 7-7" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-3.4-7" />
                                                </svg>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleBan(seller.id)}
                                                className={`${iconButtonBase} text-red-600 hover:text-red-800 hover:bg-red-50 focus:ring-red-400`}
                                                title="Ban seller"
                                                aria-label="Ban seller"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                                    <circle cx="12" cy="12" r="9" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12" />
                                                </svg>
                                            </button>
                                        )}
                                        </div>
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
