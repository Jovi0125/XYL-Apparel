import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import BuyerNav from '@/Components/storefront/BuyerNav';

export default function OrderDetail({ order, hasReviewed }) {
    const { flash } = usePage().props;
    const product = order.product;
    const shipment = order.shipment;
    const imageUrl = product?.main_image?.image_url || product?.images?.[0]?.image_url;
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const reviewForm = useForm({
        rating: 0,
        comment: '',
    });

    const handleSubmitReview = (e) => {
        e.preventDefault();
        reviewForm.post(`/ph/en/profile/orders/${order.id}/review`, {
            onSuccess: () => {
                setShowReviewForm(false);
            },
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending:          'bg-yellow-100 text-yellow-800 border-yellow-200',
            preparing:        'bg-blue-100 text-blue-800 border-blue-200',
            packed:           'bg-orange-100 text-orange-800 border-orange-200',
            out_for_delivery: 'bg-purple-100 text-purple-800 border-purple-200',
            delivered:        'bg-green-100 text-green-800 border-green-200',
            cancelled:        'bg-red-100 text-red-800 border-red-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <Head title={`Order ${order.order_number} | XYLO APPAREL`} />
            <BuyerNav />

            <main className="max-w-4xl mx-auto px-6 md:px-12 py-8 md:py-12">
                {/* Flash */}
                {flash?.success && (
                    <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-[12px] font-medium">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-[12px] font-medium">
                        {flash.error}
                    </div>
                )}

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
                    <div className="flex items-center gap-2">
                        {shipment?.status === 'delivered' && !hasReviewed && (
                            <button
                                onClick={() => setShowReviewForm(!showReviewForm)}
                                className="flex items-center gap-2 px-4 py-2 border border-yellow-400 text-yellow-700 text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-yellow-50 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                </svg>
                                Write Review
                            </button>
                        )}
                        {shipment?.status === 'delivered' && hasReviewed && (
                            <span className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold tracking-[0.15em] uppercase">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                Reviewed
                            </span>
                        )}
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
                </div>

                {/* Review Form (Inline) */}
                {showReviewForm && (
                    <div className="mb-8 border border-gray-100 p-6">
                        <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-gray-400 mb-5">WRITE A REVIEW</h2>

                        <form onSubmit={handleSubmitReview} className="space-y-5">
                            {/* Star Rating */}
                            <div>
                                <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 block mb-3">RATING</label>
                                <div className="flex gap-1">
                                    {[1,2,3,4,5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => reviewForm.setData('rating', star)}
                                            className="p-0.5 transition-transform hover:scale-110"
                                        >
                                            <svg
                                                className={`w-7 h-7 transition-colors ${
                                                    star <= (hoverRating || reviewForm.data.rating)
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-200'
                                                }`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </button>
                                    ))}
                                    {reviewForm.data.rating > 0 && (
                                        <span className="ml-2 text-[11px] text-gray-400 self-center">
                                            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewForm.data.rating]}
                                        </span>
                                    )}
                                </div>
                                {reviewForm.errors.rating && (
                                    <p className="mt-1 text-[10px] text-[#E60012] font-bold">{reviewForm.errors.rating}</p>
                                )}
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 block mb-2">COMMENT (OPTIONAL)</label>
                                <textarea
                                    value={reviewForm.data.comment}
                                    onChange={(e) => reviewForm.setData('comment', e.target.value)}
                                    rows="3"
                                    className="w-full border border-gray-200 bg-white px-4 py-3 text-[13px] focus:outline-none focus:border-black transition-colors resize-none"
                                    placeholder="Share your thoughts about this product..."
                                    maxLength={1000}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={reviewForm.processing || reviewForm.data.rating === 0}
                                    className="px-8 py-3 bg-black text-white text-[10px] font-black tracking-[0.3em] uppercase hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {reviewForm.processing ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowReviewForm(false)}
                                    className="px-8 py-3 border border-gray-200 text-[10px] font-black tracking-[0.3em] uppercase text-gray-500 hover:border-black hover:text-black transition-all"
                                >
                                    CANCEL
                                </button>
                            </div>
                        </form>
                    </div>
                )}

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
                            { key: 'packed', label: 'Ready for Pickup', icon: (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                            )},
                            { key: 'out_for_delivery', label: 'Out for Delivery', icon: (
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

                        const statusOrder = ['pending', 'preparing', 'packed', 'out_for_delivery', 'delivered'];
                        const currentIndex = statusOrder.indexOf(currentStatus);

                        const getTimestamp = (stepKey) => {
                            if (stepKey === 'pending') return order.created_at;
                            if (stepKey === 'out_for_delivery' && shipment?.out_for_delivery_at) return shipment.out_for_delivery_at;
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
                            {shipment?.rider && (
                                <div>
                                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 block mb-1">DELIVERY RIDER</span>
                                    <p className="font-semibold">{shipment.rider.name}</p>
                                    {shipment.rider.rider_number && (
                                        <span className="text-[9px] font-black tracking-widest text-[#E60012] uppercase">{shipment.rider.rider_number}</span>
                                    )}
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
