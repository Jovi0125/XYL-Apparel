import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Archive({ products = [], categories = [], discounts = [] }) {
    const [activeTab, setActiveTab] = useState('products');

    const handleRestore = (type, id) => {
        if (confirm(`Are you sure you want to restore this ${type}?`)) {
            router.post(`/admin/archive/restore/${type}/${id}`);
        }
    };

    const tabs = [
        { id: 'products', label: 'Products', count: products.length },
        { id: 'categories', label: 'Categories', count: categories.length },
        { id: 'discounts', label: 'Discounts', count: discounts.length },
    ];

    return (
        <AdminLayout title="Archive" activeItem="system">
            <Head title="System Archive" />

            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">System Archive</h1>
                    <p className="text-slate-400 mt-1">View and restore soft-deleted items</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 p-1 bg-slate-900/50 border border-slate-800/50 rounded-2xl w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                                activeTab === tab.id
                                    ? 'bg-slate-800 text-white shadow-lg border border-slate-700/50'
                                    : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            {tab.label}
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] ${
                                activeTab === tab.id ? 'bg-slate-700 text-slate-300' : 'bg-slate-800 text-slate-600'
                            }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-slate-500/5 pointer-events-none" />
                    
                    <div className="relative overflow-x-auto p-4">
                        {activeTab === 'products' && (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-medium">Product</th>
                                        <th className="px-6 py-4 font-medium">Deleted At</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {products.length === 0 ? (
                                        <tr><td colSpan="3" className="px-6 py-10 text-center text-slate-500">No archived products</td></tr>
                                    ) : (
                                        products.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden">
                                                        {item.main_image?.image_url ? (
                                                            <img src={item.main_image.image_url} alt={item.title} className="w-full h-full object-cover" />
                                                        ) : <div className="w-full h-full bg-slate-700" />}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-white">{item.title}</div>
                                                        <div className="text-xs text-slate-500">{item.category?.name || 'No Category'}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-400">
                                                    {new Date(item.deleted_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => handleRestore('product', item.id)}
                                                        className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-semibold hover:bg-emerald-500/20 transition-all"
                                                    >
                                                        Restore
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}

                        {activeTab === 'categories' && (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-medium">Category</th>
                                        <th className="px-6 py-4 font-medium">Deleted At</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {categories.length === 0 ? (
                                        <tr><td colSpan="3" className="px-6 py-10 text-center text-slate-500">No archived categories</td></tr>
                                    ) : (
                                        categories.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden">
                                                        {item.image_url ? (
                                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                                        ) : <div className="w-full h-full bg-slate-700" />}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-white">{item.name}</div>
                                                        <div className="text-xs text-slate-500">{item.parent_category}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-400">
                                                    {new Date(item.deleted_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => handleRestore('category', item.id)}
                                                        className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-semibold hover:bg-emerald-500/20 transition-all"
                                                    >
                                                        Restore
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}

                        {activeTab === 'discounts' && (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-medium">Discount Code</th>
                                        <th className="px-6 py-4 font-medium">Deleted At</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {discounts.length === 0 ? (
                                        <tr><td colSpan="3" className="px-6 py-10 text-center text-slate-500">No archived discounts</td></tr>
                                    ) : (
                                        discounts.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-white">{item.title}</div>
                                                    <div className="text-xs text-slate-500 font-mono tracking-wider">{item.code}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-400">
                                                    {new Date(item.deleted_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => handleRestore('discount', item.id)}
                                                        className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-semibold hover:bg-emerald-500/20 transition-all"
                                                    >
                                                        Restore
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
