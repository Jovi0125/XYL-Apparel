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
        { label: 'Preparing',  value: stats.preparing,  color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200', filter: 'preparing',
          icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg> },
        { label: 'Shipped',    value: stats.shipped,    color: 'text-orange-600',  bg: 'bg-orange-50',  border: 'border-orange-200', filter: 'shipped',
          icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg> },
        { label: 'In Transit', value: stats.in_transit, color: 'text-purple-600',  bg: 'bg-purple-50',  border: 'border-purple-200', filter: 'in_transit',
          icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg> },
        { label: 'Delivered',  value: stats.delivered,  color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', filter: 'delivered',
          icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
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
                    <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium rounded-xl flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {flash.success}
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {statCards.map((stat) => {
                        const isActive = statusFilter === stat.filter;
                        return (
                            <button
                                key={stat.label}
                                onClick={() => setStatusFilter(stat.filter)}
                                className={`relative p-5 rounded-xl bg-white border transition-all text-left group
                                    ${isActive ? `${stat.border} ring-1 ring-offset-0 ring-gray-200` : 'border-gray-100 hover:border-gray-200'}`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                        {stat.icon}
                                    </div>
                                    {isActive && <div className="w-2 h-2 rounded-full bg-black" />}
                                </div>
                                <p className="text-2xl font-black text-black">{stat.value}</p>
                                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mt-1">{stat.label}</p>
                            </button>
                        );
                    })}
                </div>

                {/* Filter Indicator */}
                {statusFilter !== 'all' && (
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                            Filtered: <span className="font-bold text-black">{statusFilter.replace('_', ' ')}</span>
                        </span>
                        <button 
                            onClick={() => setStatusFilter('all')}
                            className="text-xs text-[#E60012] font-bold hover:text-red-700 transition-colors"
                        >
                            × Clear
                        </button>
                    </div>
                )}

                {/* Shipments List */}
                <div className="space-y-3">
                    {/* List Header */}
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                            {filteredShipments.length} Shipment{filteredShipments.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {filteredShipments.length === 0 ? (
                        <div className="py-20 text-center bg-white rounded-xl border border-gray-100">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-500 font-semibold">No shipments found</p>
                            <p className="text-xs text-gray-400 mt-1">Only approved orders appear here for fulfillment.</p>
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

// Philippine courier options
const CARRIERS = [
    'J&T Express',
    'LBC Express',
    'Ninja Van',
    'Grab Express',
    'Lalamove',
    '2GO Express',
    'DHL Express',
    'FedEx',
    'PHLPost',
    'Entrego',
    'GoGo Express',
    'Borzo',
];

function ShipmentCard({ shipment, index, isExpanded, onToggle }) {
    const [newStatus, setNewStatus] = useState(shipment.shipment_status);
    const [trackingNumber, setTrackingNumber] = useState(shipment.tracking_number || '');
    const [carrier, setCarrier] = useState(shipment.carrier || '');
    const [trackingError, setTrackingError] = useState('');
    const [updating, setUpdating] = useState(false);

    // Only forward-moving statuses — logistics cannot go back or cancel
    const statusOptions = [
        { value: 'preparing',  label: 'Preparing',  color: 'bg-blue-100 text-blue-800' },
        { value: 'shipped',    label: 'Shipped',    color: 'bg-orange-100 text-orange-800' },
        { value: 'in_transit', label: 'In Transit', color: 'bg-purple-100 text-purple-800' },
        { value: 'delivered',  label: 'Delivered',  color: 'bg-emerald-100 text-emerald-800' },
    ];

    // Tracking number is required when moving to shipped or in_transit
    const trackingRequired = ['shipped', 'in_transit'].includes(newStatus);
    const isTrackingMissing = trackingRequired && !trackingNumber.trim();

    const currentStatusStyle = statusOptions.find(o => o.value === shipment.shipment_status)?.color || 'bg-gray-100 text-gray-800';

    const handleUpdateStatus = () => {
        if (isTrackingMissing) {
            setTrackingError('Tracking number is required when shipping an order.');
            return;
        }
        setTrackingError('');
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
        <div className={`bg-white rounded-xl border overflow-hidden transition-all ${isExpanded ? 'border-gray-200' : 'border-gray-100 hover:border-gray-200'}`}>
            {/* Header Row — always visible */}
            <button
                onClick={onToggle}
                className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-gray-50/50 transition-colors"
            >
                {/* Product Image */}
                <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
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
                        <span className="text-sm font-bold font-mono text-black">{shipment.order_number}</span>
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full border ${
                            shipment.shipment_status === 'preparing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            shipment.shipment_status === 'shipped' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            shipment.shipment_status === 'in_transit' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            shipment.shipment_status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
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
                <svg className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-5 space-y-4">
                    {/* Delivery Information */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-3 flex items-center gap-2">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                            Delivery Information
                        </h4>
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
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-3 flex items-center gap-2">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                            Order Details
                        </h4>
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
                                <p className={`text-xs font-bold capitalize ${shipment.payment_status === 'paid' ? 'text-emerald-600' : 'text-yellow-600'}`}>
                                    {shipment.payment_status}
                                </p>
                            </div>
                            <div>
                                <span className="text-[10px] font-medium uppercase text-gray-400 block mb-1">Total</span>
                                <p className="text-lg font-black text-black">₱{Number(shipment.total_amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                            </div>
                        </div>
                    </div>

                    {shipment.notes && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
                            <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
                            <div>
                                <span className="text-[10px] font-bold uppercase text-amber-700 block mb-0.5">Customer Note</span>
                                <p className="text-sm text-amber-800">{shipment.notes}</p>
                            </div>
                        </div>
                    )}

                    {/* Status Update Form — only if not delivered */}
                    {!isDelivered ? (
                        <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                            <h4 className="text-[10px] font-bold uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 14.652" /></svg>
                                Update Shipment
                            </h4>
                            
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
                                    <label className="text-[10px] font-medium uppercase text-gray-400 block mb-1.5">
                                        Tracking #
                                        {trackingRequired && (
                                            <span className="text-[#E60012] ml-0.5">*</span>
                                        )}
                                    </label>
                                    <input
                                        type="text"
                                        value={trackingNumber}
                                        onChange={(e) => { setTrackingNumber(e.target.value); setTrackingError(''); }}
                                        className={`w-full border bg-white px-3 py-2.5 text-sm rounded-lg focus:outline-none transition-colors
                                            ${isTrackingMissing || trackingError
                                                ? 'border-red-400 focus:border-red-500'
                                                : 'border-gray-200 focus:border-black'}`}
                                        placeholder={trackingRequired ? 'Required for this status' : 'Enter tracking number'}
                                    />
                                    {trackingError && (
                                        <p className="text-[10px] text-red-500 mt-1">{trackingError}</p>
                                    )}
                                </div>

                                {/* Carrier Dropdown */}
                                <div>
                                    <label className="text-[10px] font-medium uppercase text-gray-400 block mb-1.5">Courier</label>
                                    <select
                                        value={carrier}
                                        onChange={(e) => setCarrier(e.target.value)}
                                        className="w-full border border-gray-200 bg-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:border-black transition-colors"
                                    >
                                        <option value="">Select courier...</option>
                                        {CARRIERS.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleUpdateStatus}
                                    disabled={updating || newStatus === shipment.shipment_status || isTrackingMissing}
                                    className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                    title={isTrackingMissing ? 'Enter a tracking number to proceed' : ''}
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
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-4 flex items-center gap-3">
                            <div className="p-1.5 bg-emerald-100 rounded-lg">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-emerald-800 font-bold">Delivered Successfully</p>
                                <p className="text-xs text-emerald-600">This order has been completed and cash collected.</p>
                            </div>
                        </div>
                    )}

                    {/* Timestamps */}
                    {(shipment.shipped_at || shipment.delivered_at) && (
                        <div className="flex gap-6 text-xs text-gray-400 pt-2 border-t border-gray-100">
                            {shipment.shipped_at && (
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                                    Shipped: <span className="font-bold text-gray-600">{shipment.shipped_at}</span>
                                </span>
                            )}
                            {shipment.delivered_at && (
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Delivered: <span className="font-bold text-emerald-600">{shipment.delivered_at}</span>
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
