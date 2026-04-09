import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function ProductsIndex({ products = [] }) {
    const { flash } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [showFlash, setShowFlash] = useState(!!flash?.success);

    const filteredProducts = products.filter(product => {
        const q = searchQuery.toLowerCase();
        return (
            product.title?.toLowerCase().includes(q) ||
            product.short_description?.toLowerCase().includes(q)
        );
    });

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/admin/products/${id}`);
        }
    };

    return (
        <AdminLayout title="All Products" activeItem="catalog">
            <Head title="All Products" />

            <div>
                {/* Flash success message */}
                {showFlash && flash?.success && (
                    <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-200 rounded-2xl text-emerald-400 text-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {flash.success}
                        </div>
                        <button onClick={() => setShowFlash(false)} className="text-emerald-400 hover:text-emerald-300">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-gray-400">
                        {products.length} {products.length === 1 ? 'product' : 'products'} total
                    </p>
                    <button
                        onClick={() => router.visit('/admin/products/create')}
                        className="px-4 py-2 text-sm bg-black rounded-lg font-semibold text-white shadow-sm hover:bg-gray-800 transition-all"
                    >
                        + Create Product
                    </button>
                </div>

                <div className="mb-6">
                    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100  p-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent pointer-events-none" />
                        
                        <div className="relative">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 ">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent pointer-events-none" />
                        
                        <div className="relative px-8 py-16 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center border border-blue-500/20 mb-6">
                                <svg className="w-10 h-10 text-[#E60012]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-black mb-2">No products yet</h3>
                            <p className="text-gray-400 max-w-sm mb-6">
                                Start adding products to your catalog to see them here.
                            </p>
                            <button
                                onClick={() => router.visit('/admin/products/create')}
                                className="px-6 py-3 bg-black rounded-xl font-semibold text-white shadow-md hover:shadow-lg transition-all"
                            >
                                Create Your First Product
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 ">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent pointer-events-none" />
                        
                        <div className="relative overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Image</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/50">
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-100/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                                                    {product.main_image ? (
                                                        <img
                                                            src={product.main_image.image_url}
                                                            alt={product.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-black">{product.title}</div>
                                                <div className="text-xs text-gray-400 truncate max-w-xs">{product.short_description}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-black">₱{parseFloat(product.regular_price).toLocaleString()}</div>
                                                {product.sale_price && (
                                                    <div className="text-xs text-emerald-400">Sale: ₱{parseFloat(product.sale_price).toLocaleString()}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-black">{product.total_stock} units</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <span className="text-sm text-black">{product.category?.name || 'N/A'}</span>
                                                    {product.category?.parent_category && (
                                                        <span className="text-xs text-gray-400 block">{product.category.parent_category}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${
                                                    product.status === 'active' 
                                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                                                }`}>
                                                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => router.visit(`/admin/products/${product.id}/edit`)}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-[#E60012] hover:bg-blue-500/10 transition-all"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
