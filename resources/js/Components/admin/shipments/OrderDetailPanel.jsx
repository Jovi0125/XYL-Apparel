import React from 'react';
import ShipmentStatusBadge from './ShipmentStatusBadge';
import PaymentStatusBadge from './PaymentStatusBadge';
import PaymentMethodBadge from './PaymentMethodBadge';

export default function OrderDetailPanel({ order, onClose }) {
    if (!order) return null;

    const details = [
        { label: 'Order Number',   value: order.order_number },
        { label: 'Product',        value: order.product_title },
        { label: 'Variant',        value: order.product_variant_label || '—' },
        { label: 'Buyer',          value: order.buyer_name },
        { label: 'Email',          value: order.buyer_email || '—' },
        { label: 'Quantity',       value: order.quantity },
        { label: 'Unit Price',     value: `₱${parseFloat(order.unit_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
        { label: 'Total',          value: order.formatted_total },
        { label: 'Earnings',       value: order.formatted_earnings },
        { label: 'Address',        value: order.shipping_address || '—' },
        { label: 'Contact',        value: order.contact_number || '—' },
        { label: 'Date',           value: order.date_time },
    ];

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Panel */}
            <div className="relative w-full max-w-lg bg-slate-900 border-l border-slate-800/50 overflow-y-auto animate-slide-in-right">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800/50">
                    <div>
                        <h3 className="text-lg font-bold text-white">Order Details</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{order.order_number}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Status Overview */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 text-center">
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Payment</p>
                            <PaymentStatusBadge status={order.payment_status} />
                        </div>
                        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 text-center">
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Method</p>
                            <PaymentMethodBadge method={order.payment_method} />
                        </div>
                        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 text-center">
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Shipment</p>
                            <ShipmentStatusBadge status={order.shipment?.status || 'pending'} />
                        </div>
                    </div>

                    {/* Detail Rows */}
                    <div className="rounded-xl bg-slate-800/30 border border-slate-700/30 divide-y divide-slate-700/30">
                        {details.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between px-4 py-3">
                                <span className="text-xs text-slate-500 uppercase tracking-wider">{item.label}</span>
                                <span className="text-sm text-white font-medium text-right max-w-[60%] truncate">{item.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Shipment Info */}
                    {order.shipment && (
                        <div className="rounded-xl bg-slate-800/30 border border-slate-700/30 p-4 space-y-3">
                            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                                <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                </svg>
                                Shipment Details
                            </h4>
                            {order.shipment.tracking_number && (
                                <div className="flex justify-between">
                                    <span className="text-xs text-slate-500">Tracking</span>
                                    <span className="text-sm text-cyan-400 font-mono">{order.shipment.tracking_number}</span>
                                </div>
                            )}
                            {order.shipment.carrier && (
                                <div className="flex justify-between">
                                    <span className="text-xs text-slate-500">Carrier</span>
                                    <span className="text-sm text-white">{order.shipment.carrier}</span>
                                </div>
                            )}
                            {order.shipment.shipped_at && (
                                <div className="flex justify-between">
                                    <span className="text-xs text-slate-500">Shipped</span>
                                    <span className="text-sm text-white">{order.shipment.shipped_at}</span>
                                </div>
                            )}
                            {order.shipment.delivered_at && (
                                <div className="flex justify-between">
                                    <span className="text-xs text-slate-500">Delivered</span>
                                    <span className="text-sm text-emerald-400">{order.shipment.delivered_at}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Notes */}
                    {order.notes && (
                        <div className="rounded-xl bg-slate-800/30 border border-slate-700/30 p-4">
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Notes</h4>
                            <p className="text-sm text-slate-300">{order.notes}</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to   { transform: translateX(0);    opacity: 1; }
                }
                .animate-slide-in-right {
                    animation: slideInRight 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
