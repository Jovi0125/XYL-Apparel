import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const orderStatusStyles = {
    pending:  { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' },
    approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-400' },
    rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-400' },
};

const paymentStatusStyles = {
    pending: 'bg-amber-50 text-amber-600 border-amber-200',
    paid:    'bg-emerald-50 text-emerald-600 border-emerald-200',
    unpaid:  'bg-red-50 text-red-600 border-red-200',
    failed:  'bg-gray-50 text-gray-600 border-gray-200',
};

export default function OrdersIndex({ orders = [] }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewingOrder, setViewingOrder] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [showFlash, setShowFlash] = useState(!!flash?.success);

    // Dynamic filtering
    const filteredOrders = orders.filter(o => {
        const matchesSearch =
            o.order_number.toLowerCase().includes(search.toLowerCase()) ||
            o.buyer_name.toLowerCase().includes(search.toLowerCase()) ||
            o.product_title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || o.order_status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const counts = {
        all: orders.length,
        pending: orders.filter(o => o.order_status === 'pending').length,
        approved: orders.filter(o => o.order_status === 'approved').length,
        rejected: orders.filter(o => o.order_status === 'rejected').length,
    };

    const handleApprove = (orderId) => {
        if (processing) return;
        setProcessing(true);
        router.post(`/admin/orders/${orderId}/approve`, {}, {
            preserveScroll: true,
            onSuccess: () => { setProcessing(false); setViewingOrder(null); setShowFlash(true); },
            onError: () => setProcessing(false),
        });
    };

    const handleReject = (orderId) => {
        if (processing) return;
        if (!confirm('Are you sure you want to reject this order? Stock will be restored.')) return;
        setProcessing(true);
        router.post(`/admin/orders/${orderId}/reject`, {}, {
            preserveScroll: true,
            onSuccess: () => { setProcessing(false); setViewingOrder(null); setShowFlash(true); },
            onError: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout title="Order Management" activeItem="commerce">
            <Head title="Orders | XYLO Admin" />

            <div className="relative z-10 space-y-6">
                {/* Flash Messages */}
                {showFlash && flash?.success && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-200 rounded-2xl text-emerald-600 text-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {flash.success}
                        </div>
                        <button onClick={() => setShowFlash(false)} className="text-emerald-400 hover:text-emerald-300">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                )}

                {/* Header & Summary */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-black tracking-tight">Order Management</h2>
                        <p className="text-sm text-gray-400 mt-1">Review, approve, or reject incoming customer orders.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-2xl">
                        <div className="text-center px-4 border-r border-gray-200">
                            <div className="text-2xl font-bold text-black">{counts.all}</div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-400">Total</div>
                        </div>
                        <div className="text-center px-4 border-r border-gray-200">
                            <div className="text-2xl font-bold text-amber-500">{counts.pending}</div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-400">Pending</div>
                        </div>
                        <div className="text-center px-4 border-r border-gray-200">
                            <div className="text-2xl font-bold text-emerald-500">{counts.approved}</div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-400">Approved</div>
                        </div>
                        <div className="text-center px-4">
                            <div className="text-2xl font-bold text-red-500">{counts.rejected}</div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-400">Rejected</div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl">
                    <div className="relative w-full sm:w-96">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by Order ID, Buyer, or Product..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        {['all', 'pending', 'approved', 'rejected'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all ${
                                    statusFilter === status
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                {status} ({counts[status]})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders Table */}
                {filteredOrders.length === 0 ? (
                    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100">
                        <div className="px-8 py-20 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border border-gray-200 mb-6 shadow-inner">
                                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-black mb-2">No orders found</h3>
                            <p className="text-sm text-gray-400 max-w-sm">
                                {search || statusFilter !== 'all'
                                    ? 'No orders match your current filters.'
                                    : 'When customers place orders, they will appear here for your review.'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100">
                        <div className="relative overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200/60">
                                        <th className="px-5 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                                        <th className="px-5 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
                                        <th className="px-5 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Buyer</th>
                                        <th className="px-5 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment</th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Status</th>
                                        <th className="px-5 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                        <th className="px-5 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/40">
                                    {filteredOrders.map(order => {
                                        const statusStyle = orderStatusStyles[order.order_status] || orderStatusStyles.pending;
                                        const payStyle = paymentStatusStyles[order.payment_status] || paymentStatusStyles.pending;
                                        return (
                                            <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors duration-150">
                                                <td className="px-5 py-4">
                                                    <span className="text-xs font-mono text-[#E60012] bg-red-50 px-2 py-1 rounded-md">{order.order_number}</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {order.product_image ? (
                                                            <img src={order.product_image} alt="" className="w-9 h-9 rounded-lg object-cover border border-gray-100" />
                                                        ) : (
                                                            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                                                                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                                            </div>
                                                        )}
                                                        <div className="max-w-[140px]">
                                                            <p className="text-sm font-medium text-black truncate">{order.product_title}</p>
                                                            {order.product_variant_label && <p className="text-[11px] text-gray-400">{order.product_variant_label}</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <p className="text-sm text-black">{order.buyer_name}</p>
                                                    <p className="text-[11px] text-gray-400">{order.buyer_email}</p>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <span className="text-sm font-semibold text-black">{order.formatted_total}</span>
                                                    <p className="text-[11px] text-gray-400 mt-0.5">Qty: {order.quantity}</p>
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${payStyle}`}>
                                                        {order.payment_status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                                                        {order.order_status_label}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="text-sm text-gray-400">{order.date}</span>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => setViewingOrder(order)} className="p-2 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-all" title="View Details">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                        </button>
                                                        {order.order_status === 'pending' && (
                                                            <>
                                                                <button onClick={() => handleApprove(order.id)} disabled={processing} className="p-2 rounded-lg text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 transition-all disabled:opacity-40" title="Approve Order">
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                                </button>
                                                                <button onClick={() => handleReject(order.id)} disabled={processing} className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-40" title="Reject Order">
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {viewingOrder && (
                <OrderDetailModal
                    order={viewingOrder}
                    onClose={() => setViewingOrder(null)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    processing={processing}
                />
            )}
        </AdminLayout>
    );
}

function OrderDetailModal({ order, onClose, onApprove, onReject, processing }) {
    const statusStyle = orderStatusStyles[order.order_status] || orderStatusStyles.pending;

    const details = [
        { label: 'Order Number',   value: order.order_number },
        { label: 'Product',        value: order.product_title },
        { label: 'Variant',        value: order.product_variant_label || '—' },
        { label: 'Buyer',          value: order.buyer_name },
        { label: 'Email',          value: order.buyer_email || '—' },
        { label: 'Quantity',       value: order.quantity },
        { label: 'Unit Price',     value: `₱${parseFloat(order.unit_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
        { label: 'Total',          value: order.formatted_total },
        { label: 'Payment Method', value: order.payment_method_label },
        { label: 'Payment Status', value: order.payment_status?.toUpperCase() },
        { label: 'Address',        value: order.shipping_address || '—' },
        { label: 'Contact',        value: order.contact_number || '—' },
        { label: 'Date',           value: order.date_time },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h3 className="text-base font-bold text-black">Order Review</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{order.order_number} — {order.buyer_name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-all">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Current Status */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Current Status</span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                            <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
                            {order.order_status_label}
                        </span>
                    </div>

                    {/* Shipment progress if approved */}
                    {order.shipment && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                            <span className="text-xs text-blue-700 font-medium">Shipment: <span className="font-bold">{order.shipment.status_label}</span></span>
                        </div>
                    )}

                    {/* Detail Rows */}
                    <div className="rounded-xl bg-gray-50 border border-gray-100 divide-y divide-gray-100">
                        {details.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between px-4 py-3">
                                <span className="text-xs text-gray-400 uppercase tracking-wider">{item.label}</span>
                                <span className="text-sm text-black font-medium text-right max-w-[60%] truncate">{item.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Notes */}
                    {order.notes && (
                        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                            <h4 className="text-xs font-semibold text-yellow-700 uppercase mb-1">Customer Notes</h4>
                            <p className="text-sm text-yellow-800">{order.notes}</p>
                        </div>
                    )}

                    {/* Action Buttons — only for pending orders */}
                    {order.order_status === 'pending' && (
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => onApprove(order.id)}
                                disabled={processing}
                                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                {processing ? 'Processing...' : 'Approve Order'}
                            </button>
                            <button
                                onClick={() => onReject(order.id)}
                                disabled={processing}
                                className="flex-1 py-3 bg-white border-2 border-red-200 hover:bg-red-50 text-red-600 font-semibold text-sm rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                {processing ? 'Processing...' : 'Reject Order'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to   { transform: scale(1);    opacity: 1; }
                }
                .animate-scale-in {
                    animation: scaleIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
}
