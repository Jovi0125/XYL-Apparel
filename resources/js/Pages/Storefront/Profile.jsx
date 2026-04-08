import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import BuyerNav from '@/Components/storefront/BuyerNav';

export default function Profile({ user, orderCount }) {
    const { flash } = usePage().props;
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        postal_code: user.postal_code || '',
        birthday: user.birthday ? user.birthday.split('T')[0] : '',
        gender: user.gender || '',
    });

    const handleSave = (e) => {
        e.preventDefault();
        put('/ph/en/profile', {
            onSuccess: () => setIsEditing(false),
        });
    };

    const sidebarLinks = [
        { label: 'Profile', href: '/ph/en/profile', active: true },
        { label: 'Order history', href: '/ph/en/profile/orders', active: false },
    ];

    const settingsLinks = [
        { label: 'Edit profile', action: () => setIsEditing(true) },
    ];

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <Head title="Membership | XYLO APPAREL" />
            <BuyerNav />

            <main className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
                {/* Page Title */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Membership</h1>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-[12px] font-medium">
                        {flash.success}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                    {/* Sidebar */}
                    <div className="md:col-span-1">
                        {/* Membership Section */}
                        <div className="mb-8">
                            <h3 className="text-[11px] font-black tracking-[0.2em] uppercase text-[#E60012] mb-4">Membership</h3>
                            <ul className="space-y-2">
                                {sidebarLinks.map((link) => (
                                    <li key={link.label}>
                                        <Link 
                                            href={link.href}
                                            className={`text-[13px] transition-colors hover:text-black
                                                ${link.active ? 'text-black font-bold' : 'text-gray-400'}`}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Profile Settings */}
                        <div>
                            <h3 className="text-[11px] font-black tracking-[0.2em] uppercase text-black mb-4">Profile settings</h3>
                            <ul className="space-y-2">
                                {settingsLinks.map((link) => (
                                    <li key={link.label}>
                                        <button
                                            onClick={link.action}
                                            className="text-[13px] text-[#E60012] hover:text-red-700 transition-colors"
                                        >
                                            {link.label}
                                        </button>
                                    </li>
                                ))}
                                <li>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="text-[13px] text-gray-400 hover:text-black transition-colors"
                                    >
                                        Sign out
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-3">
                        <div className="bg-gray-50 p-6 md:p-10">
                            <h2 className="text-xl font-black uppercase tracking-tight mb-8">Profile</h2>

                            {isEditing ? (
                                /* Edit Mode */
                                <form onSubmit={handleSave} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 block mb-2">FULL NAME</label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full border border-gray-200 bg-white px-4 py-3 text-[13px] focus:outline-none focus:border-black transition-colors"
                                                required
                                            />
                                            {errors.name && <p className="mt-1 text-[10px] font-bold text-[#E60012]">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 block mb-2">POSTAL CODE</label>
                                            <input
                                                type="text"
                                                value={data.postal_code}
                                                onChange={(e) => setData('postal_code', e.target.value)}
                                                className="w-full border border-gray-200 bg-white px-4 py-3 text-[13px] focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 block mb-2">BIRTHDAY</label>
                                            <input
                                                type="date"
                                                value={data.birthday}
                                                onChange={(e) => setData('birthday', e.target.value)}
                                                className="w-full border border-gray-200 bg-white px-4 py-3 text-[13px] focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 block mb-2">GENDER</label>
                                            <select
                                                value={data.gender}
                                                onChange={(e) => setData('gender', e.target.value)}
                                                className="w-full border border-gray-200 bg-white px-4 py-3 text-[13px] focus:outline-none focus:border-black transition-colors"
                                            >
                                                <option value="">Select gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-8 py-3 bg-black text-white text-[10px] font-black tracking-[0.3em] uppercase hover:bg-gray-800 transition-colors disabled:opacity-50"
                                        >
                                            {processing ? 'SAVING...' : 'SAVE CHANGES'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-8 py-3 border border-gray-200 text-[10px] font-black tracking-[0.3em] uppercase text-gray-500 hover:border-black hover:text-black transition-all"
                                        >
                                            CANCEL
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                /* View Mode */
                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 block mb-1">EMAIL ADDRESS</span>
                                            <p className="text-[14px] text-black">{user.email}</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 block mb-1">BIRTHDAY</span>
                                            <p className="text-[14px] text-black">
                                                {user.birthday ? new Date(user.birthday).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : '—'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 block mb-1">POSTAL CODE</span>
                                            <p className="text-[14px] text-black">{user.postal_code || '—'}</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 block mb-1">GENDER</span>
                                            <p className="text-[14px] text-black capitalize">{user.gender || '—'}</p>
                                        </div>
                                    </div>

                                    <div className="mt-10 pt-8 border-t border-gray-200">
                                        <span className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 block mb-1">MEMBER SINCE</span>
                                        <p className="text-[14px] text-black">
                                            {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="mt-8 grid grid-cols-2 gap-4">
                                        <Link href="/ph/en/profile/orders" className="p-4 border border-gray-200 hover:border-black transition-colors group">
                                            <span className="text-2xl font-black">{orderCount}</span>
                                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 block mt-1 group-hover:text-black transition-colors">
                                                TOTAL ORDERS
                                            </span>
                                        </Link>
                                        <div className="p-4 border border-gray-200">
                                            <span className="text-2xl font-black text-[#E60012]">●</span>
                                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 block mt-1">
                                                {user.status === 'active' ? 'ACTIVE MEMBER' : 'INACTIVE'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
