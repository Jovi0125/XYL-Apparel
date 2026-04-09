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

            <div className="relative z-10">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-black">System Archive</h1>
                    <p className="text-gray-400 mt-1">View and restore soft-deleted items</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 p-1 bg-white/50 border border-gray-100 rounded-2xl w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                                activeTab === tab.id
                                    ? 'bg-gray-100 text-black shadow-lg border border-gray-200'
                                    : 'text-gray-400 hover:text-gray-700'
                            }`}
                        >
                            {tab.label}
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] ${
                                activeTab === tab.id ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-300'
                            }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 ">
                    <div className="absolute inset-0 pointer-events-none" />
                    
                    <div className="relative overflow-x-auto p-4">
                        {activeTab === 'products' && (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-medium">Product</th>
                                        <th className="px-6 py-4 font-medium">Deleted At</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/50">
                                    {products.length === 0 ? (
                                        <tr><td colSpan="3" className="px-6 py-10 text-center text-gray-400">No archived products</td></tr>
                                    ) : (
                                        products.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-100/30 transition-colors">
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                                                        {item.main_image?.image_url ? (
                                                            <img src={item.main_image.image_url} alt={item.title} className="w-full h-full object-cover" />
                                                        ) : <div className="w-full h-full bg-gray-200" />}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-black">{item.title}</div>
                                                        <div className="text-xs text-gray-400">{item.category?.name || 'No Category'}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-400">
                                                    {new Date(item.deleted_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => handleRestore('product', item.id)}
                                                        className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-500/20 transition-all"
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
                                    <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-medium">Category</th>
                                        <th className="px-6 py-4 font-medium">Deleted At</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/50">
                                    {categories.length === 0 ? (
                                        <tr><td colSpan="3" className="px-6 py-10 text-center text-gray-400">No archived categories</td></tr>
                                    ) : (
                                        categories.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-100/30 transition-colors">
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                                                        {item.image_url ? (
                                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                                        ) : <div className="w-full h-full bg-gray-200" />}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-black">{item.name}</div>
                                                        <div className="text-xs text-gray-400">{item.parent_category}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-400">
                                                    {new Date(item.deleted_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => handleRestore('category', item.id)}
                                                        className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-500/20 transition-all"
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
                                    <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-medium">Discount Code</th>
                                        <th className="px-6 py-4 font-medium">Deleted At</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/50">
                                    {discounts.length === 0 ? (
                                        <tr><td colSpan="3" className="px-6 py-10 text-center text-gray-400">No archived discounts</td></tr>
                                    ) : (
                                        discounts.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-100/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-black">{item.title}</div>
                                                    <div className="text-xs text-gray-400 font-mono tracking-wider">{item.code}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-400">
                                                    {new Date(item.deleted_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => handleRestore('discount', item.id)}
                                                        className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-500/20 transition-all"
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
