import React, { useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function UsersIndex({ users, filters }) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
        role: filters.role || '',
    });

    // Handle search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (data.search !== filters.search || data.role !== filters.role) {
                router.get(route('admin.users.index'), {
                    search: data.search,
                    role: data.role
                }, {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true
                });
            }
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [data.search, data.role]);

    const handleRoleChange = (role) => {
        setData('role', role);
    };

    const toggleStatus = (id, currentStatus) => {
        const action = currentStatus === 'active' ? 'Ban/Suspend' : 'Reactivate';
        if (confirm(`Are you sure you want to ${action} this user?`)) {
            router.post(route('admin.users.toggleStatus', id), {}, {
                preserveScroll: true,
            });
        }
    };

    const deleteUser = (id) => {
        if (confirm('Are you sure you want to PERMANENTLY delete this user? This action cannot be undone.')) {
            router.delete(route('admin.users.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const statusBadge = (condition, trueText, falseText) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${condition ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
            {condition ? trueText : falseText}
        </span>
    );

    const userStatusBadge = (status) => {
        const styles = {
            active: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
            suspended: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
            inactive: 'bg-slate-500/10 text-slate-500 border border-slate-500/20',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-[10px] font-medium capitalize ${styles[status]}`}>
                {status}
            </span>
        );
    };

    const roleBadge = (role) => {
        const styles = {
            admin: 'bg-teal-500/10 text-teal-500 border border-teal-500/20',
            buyer: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
            logistics: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-[10px] font-medium capitalize ${styles[role] || 'bg-slate-500/10 text-slate-500 border border-slate-500/20'}`}>
                {role}
            </span>
        );
    };

    return (
        <AdminLayout title="User Management" activeItem="users">
            <Head title="Users - XYLO Admin" />

            <div className="relative min-h-screen">
                {/* Background effects */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 space-y-6">
                    {/* Header/Filters Section */}
                    <div className="bg-slate-900/80 border border-slate-800/50 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
                        <div className="flex flex-col md:flex-row md:items-center justify-end gap-3">
                            
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-slate-500 group-focus-within:text-teal-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={data.search}
                                        onChange={e => setData('search', e.target.value)}
                                        className="w-full sm:w-64 pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all font-medium"
                                    />
                                </div>

                                <select
                                    value={data.role}
                                    onChange={e => handleRoleChange(e.target.value)}
                                    className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all font-medium"
                                >
                                    <option value="">All Roles</option>
                                    <option value="admin">Admin</option>
                                    <option value="buyer">Buyer</option>
                                    <option value="logistics">Logistics</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-slate-900/80 border border-slate-800/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-800/30 border-b border-slate-800/50">
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Identity</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Level</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Attributes</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Security</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Timeline</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest text-right">Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {users.data.length > 0 ? (
                                        users.data.map((user) => (
                                            <tr key={user.id} className="hover:bg-slate-800/20 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-slate-500/10">
                                                                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-white">{user.name || 'N/A'}</div>
                                                            <div className="text-xs text-slate-400 font-medium">{user.email}</div>
                                                            <div className="text-[10px] text-slate-600 font-mono mt-1 opacity-60">REF: {user.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {roleBadge(user.role)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-[11px] space-y-1 font-medium">
                                                        <div className="flex gap-2">
                                                            <span className="text-slate-500">Zip:</span>
                                                            <span className="text-slate-300">{user.postal_code || '--'}</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-slate-500">BD:</span>
                                                            <span className="text-slate-300">{user.birthday ? new Date(user.birthday).toLocaleDateString() : '--'}</span>
                                                        </div>
                                                        <div className="flex gap-2 text-slate-400 capitalize">
                                                            <span>{user.gender || 'Unknown'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] text-slate-500 w-12 uppercase tracking-wide">Terms:</span>
                                                            {statusBadge(user.terms_accepted, 'Accepted', 'Pending')}
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] text-slate-500 w-12 uppercase tracking-wide">Auth:</span>
                                                            {statusBadge(!!user.email_verified_at, 'Verified', 'Unverified')}
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] text-slate-500 w-12 uppercase tracking-wide">Access:</span>
                                                            {userStatusBadge(user.status)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-xs text-slate-400 font-medium">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                        <button 
                                                            onClick={() => toggleStatus(user.id, user.status)}
                                                            className={`p-2 rounded-lg transition-colors ${
                                                                user.status === 'active' 
                                                                ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white' 
                                                                : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                                                            }`} 
                                                            title={user.status === 'active' ? "Ban User" : "Reactivate User"}
                                                        >
                                                            {user.status === 'active' ? (
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                        <button 
                                                            onClick={() => deleteUser(user.id)}
                                                            className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-rose-600 hover:text-white transition-colors" 
                                                            title="Purge Account"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-600">
                                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 01-9-3.47M20 7v10m0 0l-3-3m3 3l3-3" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-lg font-medium text-slate-300">No users found</h3>
                                                    <p className="text-slate-500 max-w-xs mx-auto">We couldn't find any user matching your current search or filter criteria.</p>
                                                    <button 
                                                        onClick={() => router.get(route('admin.users.index'), {}, { replace: true })}
                                                        className="mt-2 text-blue-500 hover:text-blue-400 font-medium transition-colors"
                                                    >
                                                        Clear all filters
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {users.links && users.data.length > 0 && (
                            <div className="px-6 py-4 border-t border-slate-800/50 bg-slate-800/20 flex items-center justify-between">
                                <div className="text-sm text-slate-500">
                                    Showing <span className="font-medium text-white">{users.from}</span> to <span className="font-medium text-white">{users.to}</span> of <span className="font-medium text-white">{users.total}</span> results
                                </div>
                                <div className="flex gap-2">
                                    {users.links.map((link, i) => (
                                        <button
                                            key={i}
                                            onClick={() => link.url && router.get(link.url, data, { preserveState: true })}
                                            disabled={!link.url || link.active}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3 py-1 rounded-lg text-sm transition-all ${
                                                link.active 
                                                ? 'bg-blue-500 text-white font-bold' 
                                                : link.url 
                                                    ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' 
                                                    : 'bg-slate-900/50 text-slate-700 cursor-not-allowed'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
