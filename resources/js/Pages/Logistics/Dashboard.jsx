import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import LogisticsLayout from '@/Layouts/LogisticsLayout';

export default function Dashboard({ stats, shipments }) {
    const { flash } = usePage().props;
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedOrder, setExpandedOrder] = useState(null);

    const filteredShipments = shipments.filter(s => {
        const matchesStatus = statusFilter === 'all' || s.shipment_status === statusFilter;
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q || 
            s.order_number?.toLowerCase().includes(q) ||
            s.product_title?.toLowerCase().includes(q) ||
            s.buyer_name?.toLowerCase().includes(q) ||
            s.buyer_email?.toLowerCase().includes(q);
        return matchesStatus && matchesSearch;
    });

    const statCards = [
        { label: 'Preparing', value: stats.preparing, accent: 'border-l-blue-400', filter: 'preparing' },
        { label: 'In Transit', value: stats.in_transit, accent: 'border-l-purple-400', filter: 'in_transit' },
        { label: 'Delivered', value: stats.delivered, accent: 'border-l-emerald-400', filter: 'delivered' },
        { label: 'Total', value: stats.total, accent: 'border-l-black', filter: 'all' },
    ];

    return (
        <LogisticsLayout>
            <Head title="Fulfillment Center | XYLO" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-black tracking-tight">
                            Fulfillment Center
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">
                            Manage shipments for approved orders. Update tracking and delivery status.
                        </p>
                    </div>
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 w-56 border border-gray-200 rounded-lg bg-gray-50 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black/10 focus:border-gray-300 transition-all"
                        />
                    </div>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium rounded-lg">
                        ✓ {flash.success}
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {statCards.map((stat) => (
                        <button
                            key={stat.label}
                            onClick={() => setStatusFilter(stat.filter)}
                            className={`p-4 rounded-lg bg-white border border-gray-100 border-l-4 ${stat.accent} transition-all hover:shadow-sm text-left
                                ${statusFilter === stat.filter ? 'ring-1 ring-black/10 shadow-sm' : ''}`}
                        >
                            <p className="text-2xl font-bold text-black">{stat.value}</p>
                            <p className="text-[10px] font-medium tracking-wide uppercase text-gray-400 mt-1">{stat.label}</p>
                        </button>
                    ))}
                </div>

                {/* Filter Indicator */}
                {statusFilter !== 'all' && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                            Filtered by: <span className="font-semibold text-black">{statusFilter.toUpperCase().replace('_', ' ')}</span>
                        </span>
                        <button 
                            onClick={() => setStatusFilter('all')}
                            className="text-xs text-[#E60012] font-semibold hover:text-red-700"
                        >
                            Clear
                        </button>
                    </div>
                )}

                {/* Shipments List */}
                <div className="space-y-2">
                    {filteredShipments.length === 0 ? (
                        <div className="py-16 text-center bg-white rounded-lg border border-gray-100">
                            <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                            <p className="text-sm text-gray-400 font-medium">No shipments found</p>
                            <p className="text-xs text-gray-300 mt-1">Only approved orders appear here for fulfillment.</p>
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
        </LogisticsLayout>
    );
}

function ShipmentCard({ shipment, index, isExpanded, onToggle }) {
    const [newStatus, setNewStatus] = useState(shipment.shipment_status);
    const [trackingNumber, setTrackingNumber] = useState(shipment.tracking_number || '');
    const [carrier, setCarrier] = useState(shipment.carrier || '');
    const [updating, setUpdating] = useState(false);

    // Only forward-moving statuses — logistics cannot go back or cancel
    const statusOptions = [
        { value: 'preparing',  label: 'Preparing',  color: 'bg-blue-100 text-blue-800' },
        { value: 'in_transit', label: 'In Transit',  color: 'bg-purple-100 text-purple-800' },
        { value: 'delivered',  label: 'Delivered',   color: 'bg-emerald-100 text-emerald-800' },
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

    // Determine if the order has been delivered (no more updates allowed)
    const isDelivered = shipment.shipment_status === 'delivered';

    return (
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:border-gray-200 transition-all">
            {/* Header Row — always visible */}
            <button
                onClick={onToggle}
                className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-gray-50/50 transition-colors"
            >
                {/* Product Image */}
                <div className="w-11 h-11 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
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
                        <span className="text-sm font-semibold font-mono text-black">{shipment.order_number}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full ${currentStatusStyle}`}>
                            {shipment.shipment_status_label}
                        </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                        {shipment.product_title}{shipment.variant_label ? ` · ${shipment.variant_label}` : ''} × {shipment.quantity}
                    </p>
                </div>

                {/* Buyer */}
                <div className="hidden md:block text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-black truncate max-w-[120px]">{shipment.buyer_name}</p>
                    <p className="text-[11px] text-gray-400">{shipment.created_at}</p>
                </div>

                {/* Total */}
                <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-black">₱{Number(shipment.total_amount).toLocaleString()}</p>
                </div>

                {/* Expand Arrow */}
                <svg className={`w-4 h-4 text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-5">
                    {/* Buyer Information */}
                    <div>
                        <h4 className="text-[10px] font-semibold uppercase text-gray-400 tracking-wider mb-3">Delivery Information</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <span className="text-[10px] font-medium uppercase text-gray-400 block mb-1">Recipient</span>
                                <p className="text-sm font-semibold text-black">{shipment.buyer_name}</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-medium uppercase text-gray-400 block mb-1">Contact</span>
                                <p className="text-sm font-semibold text-black">{shipment.contact_number || '—'}</p>
                            </div>
                            <div className="col-span-2">
                                <span className="text-[10px] font-medium uppercase text-gray-400 block mb-1">Shipping Address</span>
                                <p className="text-sm font-semibold text-black leading-tight">{shipment.shipping_address || '—'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div>
                        <h4 className="text-[10px] font-semibold uppercase text-gray-400 tracking-wider mb-3">Order Details</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <span className="text-[10px] font-medium uppercase text-gray-400 block mb-1">Order Date</span>
                                <p className="text-sm font-semibold text-black">{shipment.order_date}</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-medium uppercase text-gray-400 block mb-1">Item</span>
                                <p className="text-sm font-semibold text-black">
                                    {shipment.product_title}
                                    {shipment.variant_label ? ` (${shipment.variant_label})` : ''}
                                </p>
                                <p className="text-xs text-gray-400">Qty: {shipment.quantity} × ₱{Number(shipment.unit_price).toLocaleString()}</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-medium uppercase text-gray-400 block mb-1">Payment</span>
                                <p className="text-sm font-semibold text-black">{shipment.payment_method}</p>
                                <p className={`text-xs font-semibold capitalize ${shipment.payment_status === 'paid' ? 'text-emerald-600' : 'text-yellow-600'}`}>
                                    {shipment.payment_status}
                                </p>
                            </div>
                            <div>
                                <span className="text-[10px] font-medium uppercase text-gray-400 block mb-1">Total</span>
                                <p className="text-lg font-bold text-black">₱{Number(shipment.total_amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                            </div>
                        </div>
                    </div>

                    {shipment.notes && (
                        <div className="bg-yellow-50 border border-yellow-100 rounded-lg px-4 py-3">
                            <span className="text-[10px] font-medium uppercase text-yellow-700 block mb-0.5">Customer Note</span>
                            <p className="text-sm text-yellow-800">{shipment.notes}</p>
                        </div>
                    )}

                    {/* Status Update Form — only if not delivered */}
                    {!isDelivered ? (
                        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                            <h4 className="text-xs font-semibold uppercase text-gray-500">Update Shipment</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {/* Status Selector */}
                                <div>
                                    <label className="text-[10px] font-medium uppercase text-gray-400 block mb-1.5">Status</label>
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="w-full border border-gray-200 bg-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:border-black transition-colors"
                                    >
                                        {statusOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tracking Number */}
                                <div>
                                    <label className="text-[10px] font-medium uppercase text-gray-400 block mb-1.5">Tracking #</label>
                                    <input
                                        type="text"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        className="w-full border border-gray-200 bg-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:border-black transition-colors"
                                        placeholder="Enter tracking number"
                                    />
                                </div>

                                {/* Carrier */}
                                <div>
                                    <label className="text-[10px] font-medium uppercase text-gray-400 block mb-1.5">Carrier</label>
                                    <input
                                        type="text"
                                        value={carrier}
                                        onChange={(e) => setCarrier(e.target.value)}
                                        className="w-full border border-gray-200 bg-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:border-black transition-colors"
                                        placeholder="e.g. J&T, LBC, Grab"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleUpdateStatus}
                                    disabled={updating || newStatus === shipment.shipment_status}
                                    className="px-5 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {updating ? 'Updating...' : 'Update Status'}
                                </button>
                                {newStatus !== shipment.shipment_status && (
                                    <span className="text-xs text-gray-400">
                                        {shipment.shipment_status_label} → {statusOptions.find(o => o.value === newStatus)?.label}
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-emerald-700 font-medium">This order has been delivered successfully.</span>
                        </div>
                    )}

                    {/* Timestamps */}
                    {(shipment.shipped_at || shipment.delivered_at) && (
                        <div className="flex gap-6 text-xs text-gray-400">
                            {shipment.shipped_at && (
                                <span>Shipped: <span className="font-semibold text-gray-600">{shipment.shipped_at}</span></span>
                            )}
                            {shipment.delivered_at && (
                                <span>Delivered: <span className="font-semibold text-emerald-600">{shipment.delivered_at}</span></span>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
