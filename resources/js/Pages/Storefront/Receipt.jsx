import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Receipt({ order }) {
    const product = order.product;
    const shipment = order.shipment;
    const imageUrl = product?.main_image?.image_url || product?.images?.[0]?.image_url;

    const orderDate = new Date(order.created_at);
    const deliveredDate = shipment?.delivered_at ? new Date(shipment.delivered_at) : null;

    return (
        <div className="min-h-screen bg-gray-50 text-black font-sans selection:bg-black selection:text-white print:bg-white">
            <Head title={`Receipt ${order.order_number} | XYLO APPAREL`} />

            {/* Print-only: hide nav buttons */}
            <div className="print:hidden max-w-2xl mx-auto px-6 pt-8 flex items-center justify-between">
                <Link
                    href={`/ph/en/profile/orders/${order.id}`}
                    className="text-sm text-gray-400 hover:text-black transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to Order
                </Link>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                    </svg>
                    Print Receipt
                </button>
            </div>

            {/* Receipt Card */}
            <div className="max-w-2xl mx-auto px-6 py-8 print:p-0 print:max-w-none">
                <div className="bg-white border border-gray-200 print:border-0 print:shadow-none overflow-hidden">
                    
                    {/* Header */}
                    <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-black tracking-[0.3em] text-black uppercase italic">
                                    XYLO<span className="text-[#E60012] not-italic">.</span>
                                </h1>
                                <p className="text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase mt-0.5">APPAREL</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-xs font-black tracking-[0.2em] uppercase text-gray-400">Order Receipt</h2>
                                <p className="text-lg font-black font-mono mt-1">{order.order_number}</p>
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="px-8 py-4 bg-gray-50 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 block">Order Date</span>
                            <span className="font-semibold">
                                {orderDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                        {deliveredDate && (
                            <div className="text-right">
                                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 block">Delivered</span>
                                <span className="font-semibold">
                                    {deliveredDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Product */}
                    <div className="px-8 py-6 border-b border-gray-100">
                        <div className="flex gap-4">
                            <div className="w-16 h-20 bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                                {imageUrl ? (
                                    <img src={imageUrl} alt={product?.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold uppercase tracking-wide">{product?.title}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {order.product_variant_label && `${order.product_variant_label} · `}Qty: {order.quantity}
                                </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-sm font-bold">₱{Number(order.unit_price).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="px-8 py-5 space-y-3 text-sm border-b border-gray-100">
                        <div className="flex justify-between text-gray-500">
                            <span>Subtotal</span>
                            <span>₱{Number(order.unit_price * order.quantity).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Shipping</span>
                            <span className="text-emerald-600 font-medium">Free</span>
                        </div>
                        {order.discount_amount > 0 && (
                            <div className="flex justify-between text-gray-500">
                                <span>Discount</span>
                                <span className="text-red-500">-₱{Number(order.discount_amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                        )}
                        <div className="flex justify-between pt-3 border-t border-gray-100">
                            <span className="text-xs font-black tracking-[0.15em] uppercase">Total Paid</span>
                            <span className="text-lg font-black">₱{Number(order.total_amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="px-8 py-5 grid grid-cols-2 gap-y-4 gap-x-8 text-sm border-b border-gray-100">
                        <div>
                            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 block mb-0.5">Payment Method</span>
                            <span className="font-semibold">{order.payment_method_label}</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 block mb-0.5">Payment Status</span>
                            <span className="font-semibold capitalize">{order.payment_status}</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 block mb-0.5">Shipping Address</span>
                            <span className="font-semibold">{order.shipping_address || '—'}</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 block mb-0.5">Contact</span>
                            <span className="font-semibold">{order.contact_number || '—'}</span>
                        </div>
                        {shipment?.carrier && (
                            <div>
                                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 block mb-0.5">Carrier</span>
                                <span className="font-semibold">{shipment.carrier}</span>
                            </div>
                        )}
                        {shipment?.tracking_number && (
                            <div>
                                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 block mb-0.5">Tracking Number</span>
                                <span className="font-semibold font-mono">{shipment.tracking_number}</span>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-5 text-center">
                        <p className="text-[10px] text-gray-400">
                            Thank you for shopping with XYLO Apparel.
                        </p>
                        <p className="text-[10px] text-gray-300 mt-1">
                            This is a digital receipt. No signature required.
                        </p>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body { background: white !important; }
                    @page { margin: 1cm; }
                }
            `}} />
        </div>
    );
}
