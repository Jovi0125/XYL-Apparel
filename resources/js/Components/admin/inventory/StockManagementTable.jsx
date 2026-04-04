import React from 'react';
import { router } from '@inertiajs/react';

export default function StockManagementTable({ products = [] }) {
    return (
        <div className="bg-slate-900/80 border border-slate-800/50 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="p-6 border-b border-slate-800/50 flex items-center justify-between">
                <h3 className="text-white font-semibold">Stock Management</h3>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                    {products.length} Items Below 50%
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800/50">
                            <th className="px-6 py-4 font-semibold">Product Name</th>
                            <th className="px-6 py-4 font-semibold">Category</th>
                            <th className="px-6 py-4 font-semibold">Stock Level</th>
                            <th className="px-6 py-4 font-semibold">Capacity</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">All products are healthy</td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-800 overflow-hidden border border-slate-700/50">
                                                {product.main_image ? (
                                                    <img src={product.main_image.image_url} className="w-full h-full object-cover" />
                                                ) : <div className="w-full h-full bg-slate-800" />}
                                            </div>
                                            <span className="text-sm font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">{product.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-slate-400">{product.category?.name || 'Uncategorized'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5 min-w-[100px]">
                                            <div className="flex justify-between text-[10px] text-slate-500">
                                                <span>{product.total_stock} Units</span>
                                                <span>{Math.round(product.stock_percentage)}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${product.stock_percentage <= 20 ? 'bg-rose-500' : 'bg-amber-500'}`}
                                                    style={{ width: `${product.stock_percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400">
                                        {product.reference_stock} Target
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${
                                            product.stock_percentage <= 20 ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                        }`}>
                                            {product.stock_percentage <= 20 ? 'Critical' : 'Alert'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => router.get(`/admin/products/${product.id}/edit`)}
                                            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-500 transition-all hover:text-white"
                                        >
                                            Edit Stock
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
