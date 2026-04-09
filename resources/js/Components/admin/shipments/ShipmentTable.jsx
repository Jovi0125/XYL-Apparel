import React from 'react';
import ShipmentStatusBadge from './ShipmentStatusBadge';
import PaymentStatusBadge from './PaymentStatusBadge';
import PaymentMethodBadge from './PaymentMethodBadge';

export default function ShipmentTable({ orders, onView, onUpdate }) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 ">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent pointer-events-none" />

            <div className="relative overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200/60">
                            <th className="px-5 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                            <th className="px-5 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
                            <th className="px-5 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Buyer</th>
                            <th className="px-5 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Earnings</th>
                            <th className="px-5 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment</th>
                            <th className="px-5 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pay Status</th>
                            <th className="px-5 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shipment</th>
                            <th className="px-5 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                            <th className="px-5 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/40">
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="group hover:bg-gray-100/20 transition-colors duration-150"
                            >
                                {/* Order ID */}
                                <td className="px-5 py-4">
                                    <span className="text-xs font-mono text-[#E60012] bg-red-50 px-2 py-1 rounded-md">
                                        {order.order_number}
                                    </span>
                                </td>

                                {/* Product */}
                                <td className="px-5 py-4">
                                    <div className="max-w-[160px]">
                                        <p className="text-sm font-medium text-black truncate">{order.product_title}</p>
                                        <p className="text-[11px] text-gray-400 mt-0.5">
                                            ID: {order.product_id}
                                            {order.product_variant_label && ` · ${order.product_variant_label}`}
                                        </p>
                                    </div>
                                </td>

                                {/* Buyer */}
                                <td className="px-5 py-4">
                                    <div>
                                        <p className="text-sm text-black">{order.buyer_name}</p>
                                        <p className="text-[11px] text-gray-400">{order.buyer_email}</p>
                                    </div>
                                </td>

                                {/* Earnings */}
                                <td className="px-5 py-4 text-right">
                                    <span className="text-sm font-semibold text-emerald-400">{order.formatted_earnings}</span>
                                    <p className="text-[11px] text-gray-400 mt-0.5">Qty: {order.quantity}</p>
                                </td>

                                {/* Payment Method */}
                                <td className="px-5 py-4 text-center">
                                    <PaymentMethodBadge method={order.payment_method} />
                                </td>

                                {/* Payment Status */}
                                <td className="px-5 py-4 text-center">
                                    <PaymentStatusBadge status={order.payment_status} />
                                </td>

                                {/* Shipment Status */}
                                <td className="px-5 py-4 text-center">
                                    <ShipmentStatusBadge status={order.shipment?.status || 'pending'} />
                                </td>

                                {/* Date */}
                                <td className="px-5 py-4">
                                    <span className="text-sm text-gray-400">{order.date}</span>
                                </td>

                                {/* Actions */}
                                <td className="px-5 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onView(order)}
                                            className="p-2 rounded-lg text-gray-400 hover:text-[#E60012] hover:bg-red-50 transition-all"
                                            title="View Details"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => onUpdate(order)}
                                            className="p-2 rounded-lg text-gray-400 hover:text-[#E60012] hover:bg-blue-500/10 transition-all"
                                            title="Update Status"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
    );
}
