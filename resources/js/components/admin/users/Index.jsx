import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import AdminSidebar from '../partials/Sidebar';

export default function UsersIndex() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    useEffect(() => {
        axios.get('/admin/users', { params: { search, role: roleFilter } }).then(res => {
            const data = res.data.users;
            setUsers(Array.isArray(data) ? data : data.data || []);
        }).catch(() => {});
    }, [search, roleFilter]);

    const handleBan = (id) => { axios.patch(`/admin/users/${id}/ban`).then(() => setUsers(users.map(u => u.id === id ? { ...u, is_banned: true } : u))).catch(err => alert(err.response?.data?.message || 'Failed.')); };
    const handleUnban = (id) => { axios.patch(`/admin/users/${id}/unban`).then(() => setUsers(users.map(u => u.id === id ? { ...u, is_banned: false } : u))).catch(err => alert(err.response?.data?.message || 'Failed.')); };

    return (
        <DashboardLayout sidebar={<AdminSidebar />} pageTitle="Users">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-80 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
                    <option value="">All Roles</option>
                    <option value="customer">Customer</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                    <option value="logistics">Logistics</option>
                </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Name</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Email</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Role</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Joined</th>
                                <th className="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.length > 0 ? users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">{user.role}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_banned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {user.is_banned ? 'Banned' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{user.created_at ? new Date(user.created_at).toLocaleDateString() : ''}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link to={`/admin/users/${user.id}`} className="text-sm text-blue-600 hover:text-blue-800">View</Link>
                                        {user.is_banned ? (
                                            <button onClick={() => handleUnban(user.id)} className="text-sm text-green-600 hover:text-green-800">Unban</button>
                                        ) : (
                                            <button onClick={() => handleBan(user.id)} className="text-sm text-red-600 hover:text-red-800">Ban</button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400">No users found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
