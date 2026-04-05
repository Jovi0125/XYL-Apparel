import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function ReportsIndex({ analytics, products, inventory }) {
    
    // Safety processing
    const revenueStr = Number(analytics?.revenue || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });
    
    return (
        <AdminLayout title="Analytics & Reports" activeItem="reports">
            <Head title="System Analytics | XYLO Admin" />
            <div className="max-w-[90rem] mx-auto space-y-8">
                
                <div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">Business Intelligence</h1>
                    <p className="text-sm text-slate-400 mt-1">Data-driven sales, product, and inventory performance tracking.</p>
                </div>

                {/* 1. SALES ANALYTICS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl flex flex-col justify-center items-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 relative z-10">Total Revenue</div>
                        <div className="text-4xl font-bold text-emerald-400 relative z-10">₱{revenueStr}</div>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl flex flex-col justify-center items-center relative overflow-hidden">
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 relative z-10">Completed Orders</div>
                        <div className="text-4xl font-bold text-white relative z-10">{analytics?.orderCount || 0}</div>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl flex flex-col justify-center items-center relative overflow-hidden">
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 relative z-10">Top Payment</div>
                        <div className="text-3xl font-bold text-teal-400 uppercase tracking-widest relative z-10">
                            {analytics?.paymentBreakdown?.length > 0 ? analytics.paymentBreakdown.sort((a,b) => b.count - a.count)[0].payment_method : 'N/A'}
                        </div>
                    </div>
                </div>

                {/* 2. PRODUCT PERFORMANCE */}
                <div>
                    <h2 className="text-lg font-bold text-white tracking-tight mb-4 border-b border-slate-800/50 pb-2">Top Performer Products</h2>
                    <div className="bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto relative">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="border-b border-slate-800/60 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Product Outline</th>
                                        <th className="px-6 py-4 text-center">Items Sold</th>
                                        <th className="px-6 py-4 text-right">Revenue Generated</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/40">
                                    {products?.length > 0 ? products.map((prod, idx) => (
                                        <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                                            <td className="px-6 py-5 text-white font-medium text-sm">{prod.title}</td>
                                            <td className="px-6 py-5 text-center text-slate-300">
                                                <span className="px-3 py-1 bg-slate-800/80 border border-slate-700/50 rounded-lg">{prod.total_sold}</span>
                                            </td>
                                            <td className="px-6 py-5 text-right text-emerald-400 font-semibold">₱{Number(prod.revenue).toLocaleString()}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="3" className="px-6 py-10 text-center text-slate-500">Not enough data to calculate top products.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 3. INVENTORY HEALTH */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                    <div className="bg-slate-900/80 border border-red-900/50 p-6 rounded-2xl flex flex-col shadow-xl">
                        <div className="text-red-500/80 text-xs font-bold uppercase tracking-widest mb-3">Out of Stock Warnings</div>
                        <div className="text-5xl font-bold text-red-500">{inventory?.out_of_stock || 0} <span className="text-sm font-medium text-red-500/50 ml-2 uppercase">Products</span></div>
                    </div>
                    <div className="bg-slate-900/80 border border-amber-900/50 p-6 rounded-2xl flex flex-col shadow-xl">
                        <div className="text-amber-500/80 text-xs font-bold uppercase tracking-widest mb-3">Low Stock Alerts</div>
                        <div className="text-5xl font-bold text-amber-500">{inventory?.low_stock || 0} <span className="text-sm font-medium text-amber-500/50 ml-2 uppercase">Products</span></div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
