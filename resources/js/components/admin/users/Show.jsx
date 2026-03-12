import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import AdminSidebar from '../partials/Sidebar';

export default function UsersShow() {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get(`/admin/users/${id}`).then(res => setUser(res.data.user)).catch(() => {});
    }, [id]);

    if (!user) return <DashboardLayout sidebar={<AdminSidebar />} pageTitle="User Details"><p className="text-gray-400">Loading...</p></DashboardLayout>;

    return (
        <DashboardLayout sidebar={<AdminSidebar />} pageTitle="User Details">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-gray-400">
                            {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">{user.role}</span>
                    </div>
                </div>

                {/* Orders / Details */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Orders</h3>
                    <p className="text-sm text-gray-400">Order history will appear here when data is loaded via API.</p>
                </div>
            </div>

            <div className="mt-4">
                <Link to="/admin/users" className="text-sm text-gray-600 hover:text-gray-900">&larr; Back to Users</Link>
            </div>
        </DashboardLayout>
    );
}
