import React, { useState } from 'react';
import { router } from '@inertiajs/react';

const shipmentStatuses = [
    { value: 'pending',    label: 'Pending',    color: 'text-amber-400'   },
    { value: 'preparing',  label: 'Preparing',  color: 'text-[#E60012]'    },
    { value: 'shipped',    label: 'Shipped',    color: 'text-indigo-400'  },
    { value: 'in_transit', label: 'In Transit', color: 'text-[#E60012]'    },
    { value: 'delivered',  label: 'Delivered',  color: 'text-emerald-400' },
    { value: 'cancelled',  label: 'Cancelled',  color: 'text-rose-400'    },
];

const paymentStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid',    label: 'Paid'    },
    { value: 'unpaid',  label: 'Unpaid'  },
    { value: 'failed',  label: 'Failed'  },
];

export default function UpdateStatusModal({ order, onClose }) {
    const [shipmentStatus, setShipmentStatus] = useState(order?.shipment?.status || 'pending');
    const [trackingNumber, setTrackingNumber] = useState(order?.shipment?.tracking_number || '');
    const [carrier, setCarrier] = useState(order?.shipment?.carrier || '');
    const [paymentStatus, setPaymentStatus] = useState(order?.payment_status || 'pending');
    const [processing, setProcessing] = useState(false);

    if (!order) return null;

    const handleShipmentUpdate = (e) => {
        e.preventDefault();
        setProcessing(true);
        router.post(`/admin/shipments/${order.id}/update-status`, {
            shipment_status: shipmentStatus,
            tracking_number: trackingNumber || null,
            carrier: carrier || null,
        }, {
            preserveScroll: true,
            onSuccess: () => { setProcessing(false); onClose(); },
            onError: () => setProcessing(false),
        });
    };

    const handlePaymentUpdate = () => {
        setProcessing(true);
        router.post(`/admin/shipments/${order.id}/update-payment`, {
            payment_status: paymentStatus,
        }, {
            preserveScroll: true,
            onSuccess: () => { setProcessing(false); onClose(); },
            onError: () => setProcessing(false),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 " onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-100/20">
                    <div>
                        <h3 className="text-base font-bold text-black">Update Order Status</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{order.order_number} — {order.buyer_name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-black hover:bg-gray-50 transition-all">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Shipment Status Section */}
                    <form onSubmit={handleShipmentUpdate} className="space-y-4">
                        <h4 className="text-sm font-semibold text-black flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#E60012]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                            </svg>
                            Shipment Status
                        </h4>

                        <div className="grid grid-cols-3 gap-2">
                            {shipmentStatuses.map(s => (
                                <button
                                    key={s.value}
                                    type="button"
                                    onClick={() => setShipmentStatus(s.value)}
                                    className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                                        shipmentStatus === s.value
                                            ? 'bg-gray-100 border-gray-300 text-black ring-1 ring-black/10'
                                            : 'bg-gray-100/30 border-gray-100 text-gray-400 hover:border-gray-200/50 hover:text-gray-700'
                                    }`}
                                >
                                    <span className={shipmentStatus === s.value ? s.color : ''}>{s.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Tracking Number</label>
                                <input
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    placeholder="e.g. TRK-123456"
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Carrier</label>
                                <input
                                    type="text"
                                    value={carrier}
                                    onChange={(e) => setCarrier(e.target.value)}
                                    placeholder="e.g. J&T Express"
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2.5 bg-black rounded-xl text-sm font-semibold text-white shadow-sm hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {processing ? 'Updating...' : 'Update Shipment'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-50" />
                        <span className="text-[10px] uppercase tracking-widest text-gray-300">Payment</span>
                        <div className="flex-1 h-px bg-gray-50" />
                    </div>

                    {/* Payment Status Section */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-black flex items-center gap-2">
                            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Payment Status
                        </h4>

                        <div className="grid grid-cols-4 gap-2">
                            {paymentStatuses.map(s => (
                                <button
                                    key={s.value}
                                    type="button"
                                    onClick={() => setPaymentStatus(s.value)}
                                    className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                                        paymentStatus === s.value
                                            ? 'bg-gray-100 border-emerald-500/50 text-black ring-1 ring-emerald-500/30'
                                            : 'bg-gray-100/30 border-gray-100 text-gray-400 hover:border-gray-200/50 hover:text-gray-700'
                                    }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={handlePaymentUpdate}
                            disabled={processing}
                            className="w-full py-2.5 bg-black rounded-xl text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {processing ? 'Updating...' : 'Update Payment'}
                        </button>
                    </div>
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
