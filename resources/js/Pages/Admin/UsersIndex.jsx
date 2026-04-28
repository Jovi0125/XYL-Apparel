import React, { useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function UsersIndex({ users, filters }) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
        role: filters.role || '',
    });

    const [showCreateRider, setShowCreateRider] = useState(false);
    const riderForm = useForm({ name: '', email: '', password: '' });

    const handleCreateRider = (e) => {
        e.preventDefault();
        riderForm.post('/admin/users/create-rider', {
            preserveScroll: true,
            onSuccess: () => {
                setShowCreateRider(false);
                riderForm.reset();
            },
        });
    };

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
        <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${condition ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-200' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
            {condition ? trueText : falseText}
        </span>
    );

    const userStatusBadge = (status) => {
        const styles = {
            active: 'bg-emerald-500/10 text-emerald-500 border border-emerald-200',
            suspended: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
            inactive: 'bg-gray-100 text-gray-400 border border-gray-200',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-[10px] font-medium capitalize ${styles[status]}`}>
                {status}
            </span>
        );
    };

    const roleBadge = (role) => {
        const styles = {
            admin: 'bg-red-50 text-[#E60012] border border-gray-200',
            buyer: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
            logistics: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-[10px] font-medium capitalize ${styles[role] || 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                {role}
            </span>
        );
    };

    return (
        <AdminLayout title="User Management" activeItem="users">
            <Head title="Users - XYLO Admin" />

            {/* Create Rider Modal */}
            {showCreateRider && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-sm font-black text-black uppercase tracking-wider">Create Rider Account</h2>
                                <p className="text-xs text-gray-400 mt-0.5">A Rider ID (e.g. RDR-001) will be auto-generated.</p>
                            </div>
                            <button onClick={() => setShowCreateRider(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleCreateRider} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block mb-1.5">Full Name</label>
                                <input type="text" value={riderForm.data.name} onChange={e => riderForm.setData('name', e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                                    placeholder="e.g. Juan dela Cruz" required />
                                {riderForm.errors.name && <p className="text-xs text-red-500 mt-1">{riderForm.errors.name}</p>}
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block mb-1.5">Email Address</label>
                                <input type="email" value={riderForm.data.email} onChange={e => riderForm.setData('email', e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                                    placeholder="rider@xylo.com" required />
                                {riderForm.errors.email && <p className="text-xs text-red-500 mt-1">{riderForm.errors.email}</p>}
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block mb-1.5">Password</label>
                                <input type="password" value={riderForm.data.password} onChange={e => riderForm.setData('password', e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                                    placeholder="Min. 8 characters" required />
                                {riderForm.errors.password && <p className="text-xs text-red-500 mt-1">{riderForm.errors.password}</p>}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowCreateRider(false)}
                                    className="flex-1 py-3 border border-gray-200 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={riderForm.processing}
                                    className="flex-1 py-3 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50">
                                    {riderForm.processing ? 'Creating...' : 'Create Rider'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="relative min-h-screen">
                {/* Background effects */}
                <div className="relative z-10 space-y-6">
                    {/* Header/Filters Section */}
                    <div className="bg-white border border-gray-100 backdrop-blur-md rounded-2xl p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <button
                                onClick={() => setShowCreateRider(true)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                Create Rider
                            </button>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400 group-focus-within:text-[#E60012] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={data.search}
                                        onChange={e => setData('search', e.target.value)}
                                        className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 transition-all font-medium"
                                    />
                                </div>

                                <select
                                    value={data.role}
                                    onChange={e => handleRoleChange(e.target.value)}
                                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 transition-all font-medium"
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
                    <div className="bg-white border border-gray-100 backdrop-blur-md rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100/30 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Identity</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Level</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Attributes</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Security</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Timeline</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest text-right">Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/50">
                                    {users.data.length > 0 ? (
                                        users.data.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-100/20 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-bold text-lg">
                                                                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-black">{user.name || 'N/A'}</div>
                                                            <div className="text-xs text-gray-400 font-medium">{user.email}</div>
                                                            <div className="text-[10px] text-gray-300 font-mono mt-1 opacity-60">REF: {user.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {roleBadge(user.role)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-[11px] space-y-1 font-medium">
                                                        {user.rider_number && (
                                                            <div className="mb-1">
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest bg-[#E60012]/10 text-[#E60012] border border-[#E60012]/20 uppercase">
                                                                    {user.rider_number}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="flex gap-2">
                                                            <span className="text-gray-400">Zip:</span>
                                                            <span className="text-gray-600">{user.postal_code || '--'}</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-gray-400">BD:</span>
                                                            <span className="text-gray-600">{user.birthday ? new Date(user.birthday).toLocaleDateString() : '--'}</span>
                                                        </div>
                                                        <div className="flex gap-2 text-gray-400 capitalize">
                                                            <span>{user.gender || 'Unknown'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] text-gray-400 w-12 uppercase tracking-wide">Terms:</span>
                                                            {statusBadge(user.terms_accepted, 'Accepted', 'Pending')}
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] text-gray-400 w-12 uppercase tracking-wide">Auth:</span>
                                                            {statusBadge(!!user.email_verified_at, 'Verified', 'Unverified')}
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] text-gray-400 w-12 uppercase tracking-wide">Access:</span>
                                                            {userStatusBadge(user.status)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-xs text-gray-400 font-medium">
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
                                                            className="p-2 bg-gray-100 text-gray-400 rounded-lg hover:bg-rose-600 hover:text-white transition-colors" 
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
                                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 01-9-3.47M20 7v10m0 0l-3-3m3 3l3-3" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-lg font-medium text-gray-600">No users found</h3>
                                                    <p className="text-gray-400 max-w-xs mx-auto">We couldn't find any user matching your current search or filter criteria.</p>
                                                    <button 
                                                        onClick={() => router.get(route('admin.users.index'), {}, { replace: true })}
                                                        className="mt-2 text-blue-500 hover:text-[#E60012] font-medium transition-colors"
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
                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-100/20 flex items-center justify-between">
                                <div className="text-sm text-gray-400">
                                    Showing <span className="font-medium text-black">{users.from}</span> to <span className="font-medium text-black">{users.to}</span> of <span className="font-medium text-black">{users.total}</span> results
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
                                                    ? 'bg-gray-100 text-gray-400 hover:bg-gray-100 hover:text-black' 
                                                    : 'bg-white/50 text-gray-500 cursor-not-allowed'
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
