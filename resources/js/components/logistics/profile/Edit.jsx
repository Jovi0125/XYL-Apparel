import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import LogisticsSidebar from '../partials/Sidebar';

export default function LogisticsProfileEdit() {
    const [form, setForm] = useState({ company_name: '', contact_person: '', phone: '', email: '', service_areas: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('/logistics/profile').then(res => {
            const p = res.data.profile;
            if (p) {
                setForm({
                    company_name: p.name || '',
                    contact_person: p.name || '',
                    phone: p.phone || '',
                    email: '',
                    service_areas: p.service_area || '',
                });
            }
        }).catch(() => {});
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/logistics/profile', {
                name: form.company_name,
                phone: form.phone,
                service_area: form.service_areas,
            });
            setMessage('Profile updated successfully.');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to update profile.');
        }
    };

    return (
        <DashboardLayout sidebar={<LogisticsSidebar />} pageTitle="Logistics Profile">
            <div className="max-w-2xl">
                {message && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800 mb-6">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h3 className="text-base font-semibold text-gray-900">Company Information</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input type="text" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                            <input type="text" value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Areas</label>
                        <textarea value={form.service_areas} onChange={(e) => setForm({ ...form, service_areas: e.target.value })}
                            rows="3" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Enter areas served, separated by commas" />
                    </div>
                    <button type="submit" className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">Save Changes</button>
                </form>
            </div>
        </DashboardLayout>
    );
}
