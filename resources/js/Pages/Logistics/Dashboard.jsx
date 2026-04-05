import React from 'react';
import { Head, Link } from '@inertiajs/react';
import LogisticsLayout from '@/Layouts/LogisticsLayout';

export default function LogisticsDashboard({ stats, recentShipments = [] }) {
    return (
        <LogisticsLayout title="Shipment Overview">
            <Head title="Logistics Terminal | XYLO" />
            
            <div className="max-w-[70rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                
                {/* Greeting Area */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-white tracking-tight">Welcome to Dispatch</h1>
                    <p className="text-sm text-slate-400 mt-2">
                        Manage ongoing shipments, verify transit locations, and finalize customer orders.
                    </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900/80 border border-slate-800/50 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none" />
                        <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2 relative z-10">Assigned / Preparing</div>
                        <div className="text-4xl font-bold text-white relative z-10">{stats?.assigned || 0}</div>
                        <div className="mt-4 relative z-10">
                            <span className="text-[10px] uppercase text-slate-500 font-bold">Awaiting pickup</span>
                        </div>
                    </div>
                    
                    <div className="bg-slate-900/80 border border-slate-800/50 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none" />
                        <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2 relative z-10">In Transit</div>
                        <div className="text-4xl font-bold text-white relative z-10">{stats?.inTransit || 0}</div>
                        <div className="mt-4 relative z-10">
                            <span className="text-[10px] uppercase text-slate-500 font-bold">Currently delivering</span>
                        </div>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800/50 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
                        <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2 relative z-10">Delivered Today</div>
                        <div className="text-4xl font-bold text-white relative z-10">{stats?.delivered || 0}</div>
                        <div className="mt-4 relative z-10">
                            <span className="text-[10px] uppercase text-slate-500 font-bold">Completed cycles</span>
                        </div>
                    </div>
                </div>

                {/* Tracking Module Layout */}
                <div className="mt-10 bg-slate-900/80 border border-slate-800/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-white tracking-tight">Active Shipments Console</h2>
                        <button className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20">
                            Scan Barcode
                        </button>
                    </div>

                    <div className="relative overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="border-b border-slate-800/60 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <tr>
                                    <th className="px-5 py-4">Tracking Number</th>
                                    <th className="px-5 py-4">Order Ref</th>
                                    <th className="px-5 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/40">
                                {recentShipments.length > 0 ? recentShipments.map(ship => (
                                    <tr key={ship.id} className="hover:bg-slate-800/20 transition-colors">
                                        <td className="px-5 py-4 font-mono text-blue-400">{ship.tracking_number}</td>
                                        <td className="px-5 py-4 text-slate-300">{ship.order?.order_number || 'N/A'}</td>
                                        <td className="px-5 py-4">
                                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800/80 border border-slate-700/50 text-slate-300">
                                                {ship.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="px-5 py-12 text-center text-slate-500 text-sm">
                                            No active shipments queued for your terminal yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </LogisticsLayout>
    );
}
