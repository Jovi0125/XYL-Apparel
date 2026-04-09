import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout'; // Ensure to use absolute alias or relative path matched to your build

export default function OrdersIndex({ orders = [] }) {
    const [search, setSearch] = useState('');
    
    // Client-side filtering logic
    const filteredOrders = orders.filter(
        o => o.order_number.toLowerCase().includes(search.toLowerCase()) ||
             o.buyer_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Order Management" activeItem="orders">
            <Head title="Orders | XYLO Admin" />
            
            <div className="max-w-[90rem] mx-auto space-y-6">
                
                {/* Header Section */}
                <div>
                    <h1 className="text-2xl font-semibold text-black tracking-tight">Order Entries</h1>
                    <p className="text-sm text-gray-400 mt-1">Master list of customer order creations across all channels.</p>
                </div>

                {/* Toolbar */}
                <div className="bg-white p-4 border border-gray-100  rounded-xl flex justify-between items-center shadow-xl">
                    <input 
                        type="text" 
                        placeholder="Search order ID or buyer..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-sm text-black px-4 py-2.5 rounded-xl w-full sm:w-96 focus:ring-2 focus:ring-black/10 outline-none"
                    />
                </div>

                {/* Data Table */}
                <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 ">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent pointer-events-none" />

                    <div className="relative overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="border-b border-gray-200/60 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-5 py-4">Order ID</th>
                                    <th className="px-5 py-4">Buyer</th>
                                    <th className="px-5 py-4">Product</th>
                                    <th className="px-5 py-4 text-right">Amount</th>
                                    <th className="px-5 py-4 text-center">Payment</th>
                                    <th className="px-5 py-4 text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100/40">
                                {filteredOrders.length > 0 ? filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-100/20 transition-colors">
                                        <td className="px-5 py-4 font-mono text-xs text-[#E60012] bg-red-50 rounded-md inline-block mt-2 ml-4 mb-2">{order.order_number}</td>
                                        <td className="px-5 py-4">
                                            <div className="text-black text-sm">{order.buyer_name}</div>
                                            <div className="text-gray-400 text-[11px]">{order.buyer_email}</div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {order.product_title} 
                                            <span className="text-gray-400 ml-1">(x{order.quantity})</span>
                                        </td>
                                        <td className="px-5 py-4 text-emerald-400 font-medium text-right">₱{Number(order.total_amount).toLocaleString()}</td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`px-2 py-1 flex justify-center items-center gap-1 rounded text-[10px] uppercase font-bold w-max mx-auto ${order.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-200' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                                {order.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-400 text-sm">{order.date}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-5 py-16 text-center text-gray-400 text-sm">
                                            No active orders found in the system.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
