import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function PaymentsIndex({ payments = [] }) {
    const [search, setSearch] = useState('');

    const filteredPayments = payments.filter(
        p => p.order_number.toLowerCase().includes(search.toLowerCase()) || 
             p.buyer_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Payment Records" activeItem="payments">
            <Head title="Payments | XYLO Admin" />
            <div className="max-w-[90rem] mx-auto space-y-6">
                
                <div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">Financial Ledger</h1>
                    <p className="text-sm text-slate-400 mt-1">Granular payment transactions tied to user orders.</p>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/3 via-transparent to-cyan-500/3 pointer-events-none" />
                    
                    <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
                         <input 
                            type="text" 
                            placeholder="Search reference, order, or buyer..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-slate-800/50 border border-slate-700/50 text-sm text-white px-4 py-2.5 rounded-xl w-full sm:w-96 focus:ring-2 focus:ring-teal-500/30 outline-none"
                        />
                    </div>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="border-b border-slate-800/60 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <tr>
                                    <th className="px-5 py-4">Ref/Source</th>
                                    <th className="px-5 py-4">Order ID</th>
                                    <th className="px-5 py-4">Payer</th>
                                    <th className="px-5 py-4 text-right">Amount</th>
                                    <th className="px-5 py-4 text-center">Status</th>
                                    <th className="px-5 py-4 text-left">Recorded On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/40">
                                {filteredPayments.length > 0 ? filteredPayments.map(pay => (
                                    <tr key={pay.id} className="hover:bg-slate-800/20 transition-colors border-b border-slate-800/40">
                                        <td className="px-5 py-4">
                                            <div className="text-teal-400 uppercase font-bold text-[11px] tracking-wider bg-teal-500/10 px-2 py-0.5 rounded inline-block">{pay.method}</div>
                                            {pay.reference_number && <div className="text-slate-500 text-[10px] uppercase mt-1">Ref: {pay.reference_number}</div>}
                                        </td>
                                        <td className="px-5 py-4 text-slate-300 font-mono text-xs">{pay.order_number}</td>
                                        <td className="px-5 py-4 text-white text-sm">{pay.buyer_name}</td>
                                        <td className="px-5 py-4 text-emerald-400 font-semibold text-right">₱{Number(pay.amount).toLocaleString()}</td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`w-max mx-auto px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${pay.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                {pay.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-slate-400 text-sm">{pay.date}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" className="px-5 py-16 text-center text-slate-500">No payment records exist yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
