import React from 'react';
import { Head, Link } from '@inertiajs/react';
import BuyerNav from '@/Components/storefront/BuyerNav';

export default function OrderDetail({ order }) {
    const product = order.product;
    const shipment = order.shipment;
    const imageUrl = product?.main_image?.image_url || product?.images?.[0]?.image_url;

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            preparing: 'bg-blue-100 text-blue-800 border-blue-200',
            shipped: 'bg-purple-100 text-purple-800 border-purple-200',
            in_transit: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            delivered: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <Head title={`Order ${order.order_number} | XYLO APPAREL`} />
            <BuyerNav />

            <main className="max-w-4xl mx-auto px-6 md:px-12 py-8 md:py-12">
                {/* Back + Title */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/ph/en/profile/orders" className="text-gray-400 hover:text-black transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight">Order Details</h1>
                            <p className="text-[11px] text-gray-400 font-mono">{order.order_number}</p>
                        </div>
                    </div>
                    {shipment?.status === 'delivered' && (
                        <Link
                            href={`/ph/en/profile/orders/${order.id}/receipt`}
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-gray-800 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            View Receipt
                        </Link>
                    )}
                </div>

                <div className="space-y-8">
                    {/* Vertical Order Progress */}
                    {(() => {
                        const currentStatus = shipment?.status || 'pending';
                        const isCancelled = currentStatus === 'cancelled';
                        
                        const steps = [
                            { key: 'pending', label: 'Order Placed', icon: (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            )},
                            { key: 'preparing', label: 'Preparing', icon: (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            )},
                            { key: 'shipped', label: 'Shipped', icon: (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                </svg>
                            )},
                            { key: 'in_transit', label: 'In Transit', icon: (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                            )},
                            { key: 'delivered', label: 'Delivered', icon: (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )},
                        ];

                        const statusOrder = ['pending', 'preparing', 'shipped', 'in_transit', 'delivered'];
                        const currentIndex = statusOrder.indexOf(currentStatus);

                        const getTimestamp = (stepKey) => {
                            if (stepKey === 'pending') return order.created_at;
                            if (stepKey === 'shipped' && shipment?.shipped_at) return shipment.shipped_at;
                            if (stepKey === 'delivered' && shipment?.delivered_at) return shipment.delivered_at;
                            return null;
                        };

                        return (
                            <div className="border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-gray-400">ORDER PROGRESS</h2>
                                    <span className="text-[11px] text-gray-400">
                                        {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>

                                {isCancelled ? (
                                    <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                                        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-red-700">Order Cancelled</p>
                                            <p className="text-xs text-red-500">This order has been cancelled.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        {steps.map((step, idx) => {
                                            const isCompleted = idx < currentIndex;
                                            const isCurrent = idx === currentIndex;
                                            const isFuture = idx > currentIndex;
                                            const timestamp = getTimestamp(step.key);
                                            const isLast = idx === steps.length - 1;

                                            return (
                                                <div key={step.key} className="flex gap-4">
                                                    {/* Timeline column */}
                                                    <div className="flex flex-col items-center">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                                                            isCompleted ? 'bg-black text-white' :
                                                            isCurrent ? 'bg-black text-white ring-4 ring-gray-100' :
                                                            'bg-gray-100 text-gray-300'
                                                        }`}>
                                                            {isCompleted ? (
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                                </svg>
                                                            ) : step.icon}
                                                        </div>
                                                        {!isLast && (
                                                            <div className={`w-0.5 h-10 ${
                                                                isCompleted ? 'bg-black' : 'bg-gray-100'
                                                            }`} />
                                                        )}
                                                    </div>

                                                    {/* Label column */}
                                                    <div className={`pt-1 pb-6 ${isLast ? 'pb-0' : ''}`}>
                                                        <p className={`text-sm font-semibold ${
                                                            isFuture ? 'text-gray-300' : 'text-black'
                                                        }`}>
                                                            {step.label}
                                                        </p>
                                                        {timestamp && (isCompleted || isCurrent) && (
                                                            <p className="text-[11px] text-gray-400 mt-0.5">
                                                                {new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                {' · '}
                                                                {new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                    {/* Product */}
                    <div className="border border-gray-100 p-6">
                        <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-gray-400 mb-4">ITEM</h2>
                        <div className="flex gap-4">
                            <div className="w-24 h-28 bg-gray-50 overflow-hidden flex-shrink-0">
                                {imageUrl ? (
                                    <img src={imageUrl} alt={product?.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159" /></svg>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-[14px] font-bold uppercase tracking-wide">{product?.title}</h3>
                                <p className="text-[11px] text-gray-400 mt-1">
                                    XYLO Official
                                    {order.product_variant_label && ` · ${order.product_variant_label}`}
                                </p>
                                <p className="text-[11px] text-gray-400 mt-0.5">Quantity: {order.quantity}</p>
                                <p className="text-[16px] font-black mt-2">₱{Number(order.unit_price).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border border-gray-100 p-6">
                        <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-gray-400 mb-4">PAYMENT DETAILS</h2>
                        <div className="space-y-3 text-[13px]">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Payment Method</span>
                                <span className="font-bold">{order.payment_method_label}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Payment Status</span>
                                <span className="font-bold capitalize">{order.payment_status}</span>
                            </div>
                            <div className="border-t border-gray-100 pt-3 flex justify-between">
                                <span className="font-black text-[11px] tracking-[0.2em] uppercase">TOTAL</span>
                                <span className="text-xl font-black">₱{Number(order.total_amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="border border-gray-100 p-6">
                        <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-gray-400 mb-4">SHIPPING INFORMATION</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
                            <div>
                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 block mb-1">ADDRESS</span>
                                <p>{order.shipping_address || '—'}</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 block mb-1">CONTACT</span>
                                <p>{order.contact_number || '—'}</p>
                            </div>
                            {shipment?.tracking_number && (
                                <div>
                                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 block mb-1">TRACKING NUMBER</span>
                                    <p className="font-mono">{shipment.tracking_number}</p>
                                </div>
                            )}
                            {shipment?.carrier && (
                                <div>
                                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 block mb-1">CARRIER</span>
                                    <p>{shipment.carrier}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {order.notes && (
                        <div className="border border-gray-100 p-6">
                            <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-gray-400 mb-4">ORDER NOTES</h2>
                            <p className="text-[13px] text-gray-600">{order.notes}</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
