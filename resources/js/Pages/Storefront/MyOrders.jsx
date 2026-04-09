import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import BuyerNav from '@/Components/storefront/BuyerNav';

export default function MyOrders({ orders }) {
    const { flash } = usePage().props;

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            preparing: 'bg-blue-100 text-blue-800 border-blue-200',
            shipped: 'bg-purple-100 text-purple-800 border-purple-200',
            in_transit: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            delivered: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
            paid: 'bg-green-100 text-green-800 border-green-200',
            unpaid: 'bg-gray-100 text-gray-800 border-gray-200',
            failed: 'bg-red-100 text-red-800 border-red-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <Head title="My Orders | XYLO APPAREL" />
            <BuyerNav />

            <main className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
                {/* Back + Title */}
                <div className="flex items-center gap-4 mb-2">
                    <Link href="/ph/en/profile" className="text-gray-400 hover:text-black transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">My Orders</h1>
                </div>
                <p className="text-[12px] text-gray-400 mb-8 ml-9">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-[12px] font-medium">
                        {flash.success}
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 mb-6 rounded-full bg-gray-50 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-400">No orders yet</p>
                        <button 
                            onClick={() => window.location.href = '/ph/en/products/women'}
                            className="mt-6 px-8 py-3 bg-black text-white text-[10px] font-black tracking-[0.3em] uppercase hover:bg-gray-800 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, idx) => (
                            <div 
                                key={order.id} 
                                className="border border-gray-100 overflow-hidden hover:border-gray-300 transition-colors"
                                style={{ animation: `orderFadeIn 0.4s ease-out ${idx * 0.05}s both` }}
                            >
                                {/* Order Header */}
                                <div className="px-6 py-4 bg-gray-50 flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex flex-wrap items-center gap-6 text-[11px]">
                                        <div>
                                            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400 block">ORDER ID</span>
                                            <span className="font-bold font-mono">{order.order_number}</span>
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400 block">DATE</span>
                                            <span className="font-bold">
                                                {new Date(order.created_at).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400 block">TOTAL</span>
                                            <span className="font-black">₱{Number(order.total_amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <span className={`px-3 py-1 text-[9px] font-black tracking-[0.2em] uppercase border ${getStatusColor(order.shipment?.status || order.payment_status)}`}>
                                        {order.shipment?.status_label || order.payment_status}
                                    </span>
                                </div>

                                {/* Order Item */}
                                <div className="px-6 py-4 flex items-center gap-4">
                                    <div className="w-16 h-18 bg-gray-50 overflow-hidden flex-shrink-0">
                                        {(order.product?.main_image?.image_url || order.product?.images?.[0]?.image_url) ? (
                                            <img 
                                                src={order.product.main_image?.image_url || order.product.images[0]?.image_url}
                                                alt={order.product?.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-[13px] font-bold uppercase tracking-wide truncate">{order.product?.title}</h3>
                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            XYLO Official{order.product_variant_label ? ` · ${order.product_variant_label}` : ''} · Qty: {order.quantity}
                                        </p>
                                    </div>
                                    <span className="text-[14px] font-black flex-shrink-0">₱{Number(order.unit_price).toLocaleString()}</span>
                                </div>

                                {/* Tracking Info (only shows when logistics fills it in) */}
                                {(order.shipment?.tracking_number || order.shipment?.carrier) && (
                                    <div className="px-6 py-3 border-t border-gray-50 flex items-center gap-4">
                                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                        </svg>
                                        <div className="flex items-center gap-4 text-[11px]">
                                            {order.shipment?.carrier && (
                                                <span className="text-gray-500">
                                                    Carrier: <span className="font-semibold text-black">{order.shipment.carrier}</span>
                                                </span>
                                            )}
                                            {order.shipment?.tracking_number && (
                                                <span className="text-gray-500">
                                                    Tracking: <span className="font-semibold text-black font-mono">{order.shipment.tracking_number}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Mini Progress Stepper */}
                                {(() => {
                                    const currentStatus = order.shipment?.status || 'pending';
                                    const isCancelled = currentStatus === 'cancelled';
                                    const statusOrder = ['pending', 'preparing', 'shipped', 'in_transit', 'delivered'];
                                    const currentIndex = statusOrder.indexOf(currentStatus);
                                    const stepLabels = ['Placed', 'Preparing', 'Shipped', 'In Transit', 'Delivered'];

                                    if (isCancelled) {
                                        return (
                                            <div className="px-6 py-3 border-t border-gray-50">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-red-500" />
                                                    <span className="text-[11px] text-red-500 font-medium">Order Cancelled</span>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="px-6 py-3 border-t border-gray-50">
                                            <div className="flex items-center gap-1">
                                                {stepLabels.map((label, idx) => {
                                                    const isCompleted = idx < currentIndex;
                                                    const isCurrent = idx === currentIndex;
                                                    const isLast = idx === stepLabels.length - 1;
                                                    return (
                                                        <React.Fragment key={label}>
                                                            <div className="flex items-center gap-1.5">
                                                                <div className={`w-2 h-2 rounded-full ${
                                                                    isCompleted ? 'bg-black' :
                                                                    isCurrent ? 'bg-black ring-2 ring-gray-200' :
                                                                    'bg-gray-200'
                                                                }`} />
                                                                <span className={`text-[10px] ${
                                                                    isCompleted || isCurrent ? 'text-black font-semibold' : 'text-gray-300'
                                                                }`}>
                                                                    {label}
                                                                </span>
                                                            </div>
                                                            {!isLast && (
                                                                <div className={`flex-1 h-px min-w-[12px] ${
                                                                    isCompleted ? 'bg-black' : 'bg-gray-200'
                                                                }`} />
                                                            )}
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes orderFadeIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </div>
    );
}
