import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import RiderLayout from '@/Layouts/RiderLayout';

export default function Dashboard({ stats, shipments }) {
    const { flash } = usePage().props;
    const [updating, setUpdating] = useState(null);

    const handleUpdateStatus = (shipmentId, newStatus) => {
        setUpdating(shipmentId);
        router.post(`/rider/shipments/${shipmentId}/update-status`, {
            status: newStatus,
        }, {
            preserveScroll: true,
            onFinish: () => setUpdating(null),
        });
    };

    const statCards = [
        {
            label: 'Ready for Pickup',
            value: stats.packed,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
            ),
        },
        {
            label: 'Out for Delivery',
            value: stats.out_for_delivery,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
            ),
        },
        {
            label: 'Delivered Today',
            value: stats.delivered_today,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ];

    return (
        <RiderLayout>
            <Head title="My Deliveries | XYLO Rider" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-xl font-bold text-black tracking-tight">My Deliveries</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Pick up your assigned packages and update delivery status in real time.
                    </p>
                </div>

                {/* Flash Message */}
                {flash?.success && (
                    <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium rounded-xl flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {flash.success}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    {statCards.map((stat) => (
                        <div key={stat.label} className={`p-5 rounded-xl bg-white border ${stat.border}`}>
                            <div className={`inline-flex p-2 rounded-lg ${stat.bg} ${stat.color} mb-3`}>
                                {stat.icon}
                            </div>
                            <p className="text-2xl font-black text-black">{stat.value}</p>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Shipments List */}
                <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        {shipments.length} Active Delivery{shipments.length !== 1 ? 's' : ''}
                    </p>

                    {shipments.length === 0 ? (
                        <div className="py-20 text-center bg-white rounded-xl border border-gray-100">
                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-500 font-semibold">All caught up!</p>
                            <p className="text-xs text-gray-400 mt-1">No active deliveries assigned to you right now.</p>
                        </div>
                    ) : (
                        shipments.map((shipment) => (
                            <DeliveryCard
                                key={shipment.id}
                                shipment={shipment}
                                isUpdating={updating === shipment.shipment_id}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        ))
                    )}
                </div>
            </div>
        </RiderLayout>
    );
}

function DeliveryCard({ shipment, isUpdating, onUpdateStatus }) {
    const isPacked = shipment.shipment_status === 'packed';
    const isOutForDelivery = shipment.shipment_status === 'out_for_delivery';

    const statusStyles = {
        packed: 'bg-amber-50 text-amber-700 border-amber-200',
        out_for_delivery: 'bg-purple-50 text-purple-700 border-purple-200',
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Status Banner */}
            <div className={`px-5 py-2 border-b flex items-center justify-between ${
                isPacked ? 'bg-amber-50 border-amber-100' : 'bg-purple-50 border-purple-100'
            }`}>
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                    isPacked ? 'text-amber-700' : 'text-purple-700'
                }`}>
                    {isPacked ? '📦 Ready for Pickup' : '🚴 Out for Delivery'}
                </span>
                <span className="text-[10px] font-mono font-bold text-gray-500">{shipment.order_number}</span>
            </div>

            <div className="p-5 space-y-4">
                {/* Customer & Address */}
                <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                        {shipment.product_image ? (
                            <img src={shipment.product_image} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-black truncate">{shipment.product_title}</p>
                        {shipment.variant_label && (
                            <p className="text-xs text-gray-400">{shipment.variant_label} × {shipment.quantity}</p>
                        )}
                        <p className="text-xs font-bold text-black mt-0.5">
                            ₱{Number(shipment.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            <span className={`ml-2 text-[10px] font-bold ${shipment.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {shipment.payment_method} · {shipment.payment_status}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-start gap-3">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        <div>
                            <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wide">Recipient</p>
                            <p className="text-sm font-semibold text-black">{shipment.buyer_name}</p>
                        </div>
                    </div>

                    {shipment.buyer_contact && (
                        <div className="flex items-start gap-3">
                            <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                            </svg>
                            <div>
                                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wide">Contact</p>
                                <p className="text-sm font-semibold text-black">{shipment.buyer_contact}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-3">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <div>
                            <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wide">Deliver To</p>
                            <p className="text-sm font-semibold text-black leading-snug">{shipment.shipping_address || '—'}</p>
                        </div>
                    </div>

                    {shipment.notes && (
                        <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-lg p-3 -mx-1">
                            <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                            </svg>
                            <div>
                                <p className="text-[10px] font-bold uppercase text-amber-700 tracking-wide">Customer Note</p>
                                <p className="text-xs text-amber-800 mt-0.5">{shipment.notes}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    {isPacked && (
                        <button
                            onClick={() => onUpdateStatus(shipment.shipment_id, 'out_for_delivery')}
                            disabled={isUpdating}
                            className="flex-1 py-3 bg-purple-600 text-white text-xs font-black rounded-xl hover:bg-purple-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                            {isUpdating ? 'Updating...' : 'Start Delivery'}
                        </button>
                    )}

                    {isOutForDelivery && (
                        <button
                            onClick={() => onUpdateStatus(shipment.shipment_id, 'delivered')}
                            disabled={isUpdating}
                            className="flex-1 py-3 bg-emerald-600 text-white text-xs font-black rounded-xl hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {isUpdating ? 'Updating...' : 'Mark as Delivered'}
                        </button>
                    )}
                </div>

                {/* Timestamps */}
                {shipment.out_for_delivery_at && (
                    <p className="text-[10px] text-gray-400 flex items-center gap-1.5">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Picked up: <span className="font-bold text-gray-600">{shipment.out_for_delivery_at}</span>
                    </p>
                )}
            </div>
        </div>
    );
}
