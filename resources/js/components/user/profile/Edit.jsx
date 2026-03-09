import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import UserSidebar from '../partials/Sidebar';

export default function ProfileEdit() {
    const [form, setForm] = useState({ name: '', email: '' });
    const [passwordForm, setPasswordForm] = useState({ current_password: '', password: '', password_confirmation: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('/customer/profile').then(res => {
            const user = res.data.user;
            setForm({ name: user.name || '', email: user.email || '' });
        }).catch(() => {});
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/customer/profile', form);
            setMessage('Profile updated successfully.');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to update profile.');
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/customer/profile/password', passwordForm);
            setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
            setMessage('Password updated successfully.');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to update password.');
        }
    };

    return (
        <DashboardLayout sidebar={<UserSidebar />} pageTitle="Profile Settings">
            <div className="max-w-2xl space-y-6">
                {message && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                        {message}
                    </div>
                )}

                {/* Profile Info */}
                <form onSubmit={handleProfileUpdate} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h3 className="text-base font-semibold text-gray-900">Profile Information</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                    </div>
                    <button type="submit" className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">Save Changes</button>
                </form>

                {/* Change Password */}
                <form onSubmit={handlePasswordUpdate} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h3 className="text-base font-semibold text-gray-900">Change Password</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input type="password" value={passwordForm.current_password} onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input type="password" value={passwordForm.password} onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input type="password" value={passwordForm.password_confirmation} onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" required />
                    </div>
                    <button type="submit" className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">Update Password</button>
                </form>
            </div>
        </DashboardLayout>
    );
}
