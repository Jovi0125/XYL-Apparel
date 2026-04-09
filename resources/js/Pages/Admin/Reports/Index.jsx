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
                    <h1 className="text-2xl font-semibold text-black tracking-tight">Business Intelligence</h1>
                    <p className="text-sm text-gray-400 mt-1">Data-driven sales, product, and inventory performance tracking.</p>
                </div>

                {/* 1. SALES ANALYTICS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col justify-center items-center">
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Total Revenue</div>
                        <div className="text-4xl font-bold text-black">₱{revenueStr}</div>
                    </div>
                    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col justify-center items-center">
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Completed Orders</div>
                        <div className="text-4xl font-bold text-black">{analytics?.orderCount || 0}</div>
                    </div>
                    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col justify-center items-center">
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Top Payment</div>
                        <div className="text-3xl font-bold text-black uppercase tracking-widest">
                            {analytics?.paymentBreakdown?.length > 0 ? analytics.paymentBreakdown.sort((a,b) => b.count - a.count)[0].payment_method : 'N/A'}
                        </div>
                    </div>
                </div>

                {/* 2. PRODUCT PERFORMANCE */}
                <div>
                    <h2 className="text-lg font-bold text-black tracking-tight mb-4 border-b border-gray-100 pb-2">Top Performer Products</h2>
                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto relative">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="border-b border-gray-200/60 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Product Outline</th>
                                        <th className="px-6 py-4 text-center">Items Sold</th>
                                        <th className="px-6 py-4 text-right">Revenue Generated</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/40">
                                    {products?.length > 0 ? products.map((prod, idx) => (
                                        <tr key={idx} className="hover:bg-gray-100/20 transition-colors">
                                            <td className="px-6 py-5 text-black font-medium text-sm">{prod.title}</td>
                                            <td className="px-6 py-5 text-center text-gray-600">
                                                <span className="px-3 py-1 bg-gray-100/80 border border-gray-200 rounded-lg">{prod.total_sold}</span>
                                            </td>
                                            <td className="px-6 py-5 text-right text-emerald-400 font-semibold">₱{Number(prod.revenue).toLocaleString()}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="3" className="px-6 py-10 text-center text-gray-400">Not enough data to calculate top products.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 3. INVENTORY HEALTH */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                    <div className="bg-white border border-gray-200 p-6 rounded-2xl flex flex-col shadow-sm">
                        <div className="text-red-500 text-xs font-bold uppercase tracking-widest mb-3">Out of Stock Warnings</div>
                        <div className="text-5xl font-bold text-red-500">{inventory?.out_of_stock || 0} <span className="text-sm font-medium text-gray-400 ml-2 uppercase">Products</span></div>
                    </div>
                    <div className="bg-white border border-gray-200 p-6 rounded-2xl flex flex-col shadow-sm">
                        <div className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-3">Low Stock Alerts</div>
                        <div className="text-5xl font-bold text-amber-500">{inventory?.low_stock || 0} <span className="text-sm font-medium text-gray-400 ml-2 uppercase">Products</span></div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
