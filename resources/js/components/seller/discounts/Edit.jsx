import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import SellerSidebar from '../partials/Sidebar';

export default function DiscountsEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ code: '', type: 'percentage', value: '', min_order_amount: '', max_uses: '', starts_at: '', expires_at: '' });

    useEffect(() => {
        axios.get(`/seller/discounts/${id}/edit`).then(res => {
            const d = res.data.discount;
            setForm({ code: d.code || '', type: d.type || 'percentage', value: d.value || '', min_order_amount: d.min_order_amount || '', max_uses: d.max_uses || '', starts_at: d.starts_at ? d.starts_at.substring(0, 10) : '', expires_at: d.expires_at ? d.expires_at.substring(0, 10) : '' });
        }).catch(() => {});
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/seller/discounts/${id}`, form);
            navigate('/seller/discounts');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update discount code.');
        }
    };

    return (
        <DashboardLayout sidebar={<SellerSidebar />} pageTitle="Edit Discount Code">
            <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Code</label>
                    <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm">
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Value {form.type === 'percentage' ? '(%)' : '(₱)'}</label>
                        <input type="number" step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" required />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Amount (₱)</label>
                        <input type="number" step="0.01" value={form.min_order_amount} onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
                        <input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Starts At</label>
                        <input type="date" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
                        <input type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                </div>
                <div className="flex items-center gap-3 pt-4">
                    <button type="submit" className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">Update Discount</button>
                    <button type="button" onClick={() => navigate('/seller/discounts')} className="px-6 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">Cancel</button>
                </div>
            </form>
        </DashboardLayout>
    );
}
