import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import SellerSidebar from '../partials/Sidebar';

export default function DiscountsIndex() {
    const [discounts, setDiscounts] = useState([]);

    useEffect(() => {
        axios.get('/seller/discounts').then(res => {
            const data = res.data.discounts;
            setDiscounts(Array.isArray(data) ? data : data.data || []);
        }).catch(() => {});
    }, []);

    const handleDelete = (id) => {
        if (!confirm('Delete this discount code?')) return;
        axios.delete(`/seller/discounts/${id}`).then(() => {
            setDiscounts(discounts.filter(d => d.id !== id));
        }).catch(err => alert(err.response?.data?.message || 'Failed to delete.'));
    };

    return (
        <DashboardLayout sidebar={<SellerSidebar />} pageTitle="Discount Codes">
            <div className="flex justify-end mb-6">
                <Link to="/seller/discounts/create" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">Create Discount</Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Code</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Type</th>
                                <th className="text-right px-6 py-3 font-medium text-gray-500">Value</th>
                                <th className="text-right px-6 py-3 font-medium text-gray-500">Used / Max</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Period</th>
                                <th className="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {discounts.length > 0 ? discounts.map((d) => (
                                <tr key={d.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-mono font-medium text-gray-900">{d.code}</td>
                                    <td className="px-6 py-4 text-gray-600 capitalize">{d.type}</td>
                                    <td className="px-6 py-4 text-right text-gray-900">{d.type === 'percentage' ? `${d.value}%` : `₱${Number(d.value).toLocaleString()}`}</td>
                                    <td className="px-6 py-4 text-right text-gray-600">{d.times_used || 0} / {d.max_uses || '∞'}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{d.starts_at ? new Date(d.starts_at).toLocaleDateString() : '—'} — {d.expires_at ? new Date(d.expires_at).toLocaleDateString() : '—'}</td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <Link to={`/seller/discounts/${d.id}/edit`} className="inline-flex items-center text-blue-600 hover:text-blue-800" title="Edit">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Link>
                                        <button onClick={() => handleDelete(d.id)} className="inline-flex items-center text-red-600 hover:text-red-800" title="Delete">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400">No discount codes yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
