import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import SellerSidebar from '../partials/Sidebar';

export default function ShopEdit() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        shop_name: '', bio: '', phone: '', website: '', address: '', city: '',
    });
    const [logo, setLogo] = useState(null);
    const [banner, setBanner] = useState(null);

    useEffect(() => {
        axios.get('/seller/shop').then(res => {
            const s = res.data.seller;
            if (s) setForm({ shop_name: s.shop_name || '', bio: s.bio || '', phone: s.phone || '', website: s.website || '', address: s.address || '', city: s.city || '' });
        }).catch(() => {});
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'PUT');
        Object.entries(form).forEach(([k, v]) => formData.append(k, v));
        if (logo) formData.append('logo', logo);
        if (banner) formData.append('banner', banner);
        try {
            const res = await axios.post('/seller/shop', formData);
            alert(res.data.message || 'Shop updated successfully.');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update shop.');
        }
    };

    return (
        <DashboardLayout sidebar={<SellerSidebar />} pageTitle="Edit Shop Profile">
            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h3 className="text-base font-semibold text-gray-900">Shop Information</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                        <input type="text" value={form.shop_name} onChange={(e) => setForm({ ...form, shop_name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                            rows="3" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                            <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h3 className="text-base font-semibold text-gray-900">Branding</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                        <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} className="text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Banner</label>
                        <input type="file" accept="image/*" onChange={(e) => setBanner(e.target.files[0])} className="text-sm" />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button type="submit" className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">Save Changes</button>
                </div>
            </form>
        </DashboardLayout>
    );
}
