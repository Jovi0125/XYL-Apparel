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

    const iconButtonBase = 'inline-flex items-center justify-center p-1.5 rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-1';

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
                                    <td className="px-6 py-4 text-right">
                                        <div className="inline-flex items-center gap-1.5">
                                            <Link
                                                to={`/seller/discounts/${d.id}/edit`}
                                                className={`${iconButtonBase} text-blue-600 hover:text-blue-800 hover:bg-blue-50 focus:ring-blue-400`}
                                                title="Edit discount"
                                                aria-label="Edit discount"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.1 2.1 0 1 1 2.97 2.97L8.25 18.04 4 19l.96-4.25 11.902-11.263Z" />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(d.id)}
                                                className={`${iconButtonBase} text-red-600 hover:text-red-800 hover:bg-red-50 focus:ring-red-400`}
                                                title="Delete discount"
                                                aria-label="Delete discount"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 6V4h8v2" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 14H6L5 6" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 10v6M14 10v6" />
                                                </svg>
                                            </button>
                                        </div>
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
