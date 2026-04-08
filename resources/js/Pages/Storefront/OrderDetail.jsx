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
                <div className="flex items-center gap-4 mb-8">
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

                <div className="space-y-8">
                    {/* Order Status */}
                    <div className="bg-gray-50 p-6 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 block mb-1">CURRENT STATUS</span>
                            <span className={`inline-block px-3 py-1 text-[10px] font-black tracking-[0.2em] uppercase border ${getStatusColor(shipment?.status || 'pending')}`}>
                                {shipment?.status_label || 'Pending'}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 block mb-1">ORDER DATE</span>
                            <span className="text-[13px] font-bold">
                                {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                    </div>

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
