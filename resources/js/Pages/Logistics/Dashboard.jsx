import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import LogisticsLayout from '@/Layouts/LogisticsLayout';

export default function Dashboard({ stats, shipments }) {
    const { flash } = usePage().props;
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);

    const filteredShipments = statusFilter === 'all'
        ? shipments
        : shipments.filter(s => s.shipment_status === statusFilter);

    const statCards = [
        { label: 'PENDING', value: stats.pending, color: 'border-yellow-400', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', filter: 'pending' },
        { label: 'PREPARING', value: stats.preparing, color: 'border-blue-400', bgColor: 'bg-blue-50', textColor: 'text-blue-700', filter: 'preparing' },
        { label: 'IN TRANSIT', value: stats.in_transit, color: 'border-purple-400', bgColor: 'bg-purple-50', textColor: 'text-purple-700', filter: 'shipped' },
        { label: 'DELIVERED', value: stats.delivered, color: 'border-green-400', bgColor: 'bg-green-50', textColor: 'text-green-700', filter: 'delivered' },
        { label: 'CANCELLED', value: stats.cancelled, color: 'border-red-400', bgColor: 'bg-red-50', textColor: 'text-red-700', filter: 'cancelled' },
        { label: 'TOTAL ORDERS', value: stats.total, color: 'border-gray-400', bgColor: 'bg-gray-50', textColor: 'text-gray-700', filter: 'all' },
    ];

    return (
        <LogisticsLayout>
            <Head title="Logistics Dashboard | XYLO" />

            <div className="space-y-8">
                {/* Page Header */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                        Shipment Management
                    </h1>
                    <p className="text-[12px] text-gray-400 mt-1">
                        Track and update delivery statuses for all orders.
                    </p>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-[12px] font-medium rounded-lg animate-in fade-in duration-300">
                        ✓ {flash.success}
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {statCards.map((stat) => (
                        <button
                            key={stat.label}
                            onClick={() => setStatusFilter(stat.filter)}
                            className={`p-4 rounded-lg border-l-4 ${stat.color} ${stat.bgColor} transition-all hover:shadow-md text-left
                                ${statusFilter === stat.filter ? 'ring-2 ring-black/10 shadow-md' : ''}`}
                        >
                            <p className={`text-2xl md:text-3xl font-black ${stat.textColor}`}>{stat.value}</p>
                            <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-500 mt-1">{stat.label}</p>
                        </button>
                    ))}
                </div>

                {/* Filter Indicator */}
                {statusFilter !== 'all' && (
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">
                            FILTERED BY: <span className="text-black">{statusFilter.toUpperCase()}</span>
                        </span>
                        <button 
                            onClick={() => setStatusFilter('all')}
                            className="text-[10px] text-[#E60012] font-bold hover:text-red-700"
                        >
                            CLEAR
                        </button>
                    </div>
                )}

                {/* Shipments List */}
                <div className="space-y-3">
                    {filteredShipments.length === 0 ? (
                        <div className="py-16 text-center bg-white rounded-lg border border-gray-100">
                            <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                            <p className="text-sm text-gray-400 font-medium">No shipments found</p>
                        </div>
                    ) : (
                        filteredShipments.map((shipment, idx) => (
                            <ShipmentCard
                                key={shipment.id}
                                shipment={shipment}
                                index={idx}
                                isExpanded={expandedOrder === shipment.id}
                                onToggle={() => setExpandedOrder(expandedOrder === shipment.id ? null : shipment.id)}
                            />
                        ))
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes shipmentIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </LogisticsLayout>
    );
}

function ShipmentCard({ shipment, index, isExpanded, onToggle }) {
    const [newStatus, setNewStatus] = useState(shipment.shipment_status);
    const [trackingNumber, setTrackingNumber] = useState(shipment.tracking_number || '');
    const [carrier, setCarrier] = useState(shipment.carrier || '');
    const [updating, setUpdating] = useState(false);

    const statusOptions = [
        { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'preparing', label: 'Preparing', color: 'bg-blue-100 text-blue-800' },
        { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
        { value: 'in_transit', label: 'In Transit', color: 'bg-indigo-100 text-indigo-800' },
        { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
        { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    ];

    const currentStatusStyle = statusOptions.find(o => o.value === shipment.shipment_status)?.color || 'bg-gray-100 text-gray-800';

    const handleUpdateStatus = () => {
        setUpdating(true);
        router.post(`/logistics/shipments/${shipment.id}/update-status`, {
            status: newStatus,
            tracking_number: trackingNumber || null,
            carrier: carrier || null,
        }, {
            preserveScroll: true,
            onFinish: () => setUpdating(false),
        });
    };

    return (
        <div 
            className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:border-gray-200 transition-all"
            style={{ animation: `shipmentIn 0.3s ease-out ${index * 0.03}s both` }}
        >
            {/* Header Row — always visible */}
            <button
                onClick={onToggle}
                className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-gray-50/50 transition-colors"
            >
                {/* Product Image */}
                <div className="w-12 h-12 bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                    {shipment.product_image ? (
                        <img src={shipment.product_image} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Order Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-[12px] font-bold font-mono">{shipment.order_number}</span>
                        <span className={`px-2 py-0.5 text-[8px] font-black tracking-wider uppercase rounded-full ${currentStatusStyle}`}>
                            {shipment.shipment_status_label}
                        </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {shipment.product_title}{shipment.variant_label ? ` · ${shipment.variant_label}` : ''} × {shipment.quantity}
                    </p>
                </div>

                {/* Buyer */}
                <div className="hidden md:block text-right flex-shrink-0">
                    <p className="text-[11px] font-bold truncate max-w-[120px]">{shipment.buyer_name}</p>
                    <p className="text-[10px] text-gray-400">{shipment.created_at}</p>
                </div>

                {/* Total */}
                <div className="text-right flex-shrink-0">
                    <p className="text-[13px] font-black">₱{Number(shipment.total_amount).toLocaleString()}</p>
                </div>

                {/* Expand Arrow */}
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-50 pt-4 space-y-5 animate-in fade-in duration-200">
                    {/* Order Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px]">
                        <div>
                            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400 block mb-1">BUYER</span>
                            <p className="font-bold">{shipment.buyer_name}</p>
                            <p className="text-gray-400 text-[10px]">{shipment.buyer_email}</p>
                        </div>
                        <div>
                            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400 block mb-1">PAYMENT</span>
                            <p className="font-bold">{shipment.payment_method}</p>
                            <p className={`text-[10px] capitalize ${shipment.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                                {shipment.payment_status}
                            </p>
                        </div>
                        <div>
                            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400 block mb-1">ADDRESS</span>
                            <p className="font-bold leading-tight">{shipment.shipping_address || '—'}</p>
                        </div>
                        <div>
                            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400 block mb-1">CONTACT</span>
                            <p className="font-bold">{shipment.contact_number || '—'}</p>
                        </div>
                    </div>

                    {shipment.notes && (
                        <div className="bg-yellow-50 border border-yellow-100 rounded-md px-3 py-2">
                            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-yellow-700 block mb-0.5">CUSTOMER NOTE</span>
                            <p className="text-[11px] text-yellow-800">{shipment.notes}</p>
                        </div>
                    )}

                    {/* Status Update Form */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                        <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-500">UPDATE SHIPMENT</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* Status Selector */}
                            <div>
                                <label className="text-[9px] font-bold tracking-[0.15em] uppercase text-gray-400 block mb-1.5">STATUS</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full border border-gray-200 bg-white px-3 py-2.5 text-[12px] font-bold rounded-md focus:outline-none focus:border-black transition-colors"
                                >
                                    {statusOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Tracking Number */}
                            <div>
                                <label className="text-[9px] font-bold tracking-[0.15em] uppercase text-gray-400 block mb-1.5">TRACKING #</label>
                                <input
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    className="w-full border border-gray-200 bg-white px-3 py-2.5 text-[12px] rounded-md focus:outline-none focus:border-black transition-colors"
                                    placeholder="Enter tracking number"
                                />
                            </div>

                            {/* Carrier */}
                            <div>
                                <label className="text-[9px] font-bold tracking-[0.15em] uppercase text-gray-400 block mb-1.5">CARRIER</label>
                                <input
                                    type="text"
                                    value={carrier}
                                    onChange={(e) => setCarrier(e.target.value)}
                                    className="w-full border border-gray-200 bg-white px-3 py-2.5 text-[12px] rounded-md focus:outline-none focus:border-black transition-colors"
                                    placeholder="e.g. J&T, LBC, Grab"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleUpdateStatus}
                                disabled={updating || newStatus === shipment.shipment_status}
                                className="px-6 py-2.5 bg-black text-white text-[10px] font-black tracking-[0.2em] uppercase rounded-md hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                            >
                                {updating ? 'UPDATING...' : 'UPDATE STATUS'}
                            </button>
                            {newStatus !== shipment.shipment_status && (
                                <span className="text-[10px] text-gray-400 italic">
                                    {shipment.shipment_status_label} → {statusOptions.find(o => o.value === newStatus)?.label}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Timestamps */}
                    {(shipment.shipped_at || shipment.delivered_at) && (
                        <div className="flex gap-6 text-[10px] text-gray-400">
                            {shipment.shipped_at && (
                                <span>Shipped: <span className="font-bold text-gray-600">{shipment.shipped_at}</span></span>
                            )}
                            {shipment.delivered_at && (
                                <span>Delivered: <span className="font-bold text-green-600">{shipment.delivered_at}</span></span>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
