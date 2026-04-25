import React, { useState } from 'react';
import axios from 'axios';
import { Head, useForm, usePage } from '@inertiajs/react';
import BuyerNav from '@/Components/storefront/BuyerNav';

export default function Checkout({ cartItems, summary, user }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        shipping_address: user?.address || '',
        contact_number: user?.contact_number || '',
        payment_method: 'cod',
        notes: '',
        discount_code: '',
    });

    const [discountInput, setDiscountInput] = useState('');
    const [discountState, setDiscountState] = useState(null);
    const [discountError, setDiscountError] = useState('');
    const [applyingDiscount, setApplyingDiscount] = useState(false);

    const applyDiscount = async () => {
        if (!discountInput.trim()) return;
        setApplyingDiscount(true);
        setDiscountError('');
        setDiscountState(null);
        try {
            const { data: json } = await axios.post('/ph/en/checkout/validate-discount', {
                code: discountInput.trim(),
                subtotal: summary.subtotal,
            });
            if (json.valid) {
                setDiscountState(json);
                setData('discount_code', json.code);
            } else {
                setDiscountError(json.message || 'Invalid discount code.');
                setData('discount_code', '');
            }
        } catch (err) {
            const msg = err?.response?.data?.message
                || err?.response?.data?.errors?.code?.[0]
                || 'Invalid or expired discount code.';
            setDiscountError(msg);
            setData('discount_code', '');
        } finally {
            setApplyingDiscount(false);
        }
    };

    const removeDiscount = () => {
        setDiscountState(null);
        setDiscountInput('');
        setDiscountError('');
        setData('discount_code', '');
    };

    const discountedTotal = discountState
        ? Math.max(0, summary.total - discountState.discount_amount)
        : summary.total;

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/ph/en/checkout');
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <Head title="Checkout | XYLO APPAREL" />
            <BuyerNav />

            <main className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-8">Checkout</h1>

                {flash?.error && (
                    <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-[12px] font-medium">
                        {flash.error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Shipping Information */}
                            <div>
                                <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-gray-400 mb-4">SHIPPING INFORMATION</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 block mb-2">SHIPPING ADDRESS</label>
                                        <textarea
                                            value={data.shipping_address}
                                            onChange={(e) => setData('shipping_address', e.target.value)}
                                            rows="3"
                                            className="w-full border border-gray-200 px-4 py-3 text-[13px] focus:outline-none focus:border-black transition-colors resize-none"
                                            placeholder="Enter your full shipping address"
                                            required
                                        />
                                        {errors.shipping_address && (
                                            <p className="mt-1 text-[10px] font-bold text-[#E60012]">{errors.shipping_address}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 block mb-2">CONTACT NUMBER</label>
                                        <input
                                            type="text"
                                            value={data.contact_number}
                                            onChange={(e) => setData('contact_number', e.target.value)}
                                            className="w-full border border-gray-200 px-4 py-3 text-[13px] focus:outline-none focus:border-black transition-colors"
                                            placeholder="e.g. 09171234567"
                                            required
                                        />
                                        {errors.contact_number && (
                                            <p className="mt-1 text-[10px] font-bold text-[#E60012]">{errors.contact_number}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-gray-400 mb-4">PAYMENT METHOD</h2>
                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setData('payment_method', 'cod')}
                                        className="p-4 border text-left border-black bg-black text-white"
                                    >
                                        <span className="text-[11px] font-black tracking-[0.2em] uppercase block">COD</span>
                                        <span className="text-[10px] mt-1 block text-white/60">
                                            Cash on Delivery
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Order Notes */}
                            <div>
                                <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-gray-400 mb-4">ORDER NOTES (OPTIONAL)</h2>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows="2"
                                    className="w-full border border-gray-200 px-4 py-3 text-[13px] focus:outline-none focus:border-black transition-colors resize-none"
                                    placeholder="Any special instructions for your order..."
                                />
                            </div>

                            {/* Order Items Preview */}
                            <div>
                                <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-gray-400 mb-4">ORDER ITEMS</h2>
                                <div className="space-y-3">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-50">
                                            <div className="w-14 h-16 bg-gray-50 overflow-hidden flex-shrink-0">
                                                {item.product?.main_image?.image_url && (
                                                    <img src={item.product.main_image.image_url} alt="" className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[12px] font-bold uppercase truncate">{item.product?.title}</p>
                                                <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                                            </div>
                                            <span className="text-[13px] font-bold">₱{Number(item.line_total).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 bg-gray-50 p-6 md:p-8">
                                <h2 className="text-[12px] font-black tracking-[0.3em] uppercase mb-6">ORDER SUMMARY</h2>

                                <div className="space-y-4 text-[13px]">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="font-bold">₱{Number(summary.subtotal).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Tax (12% VAT)</span>
                                        <span className="font-bold">₱{Number(summary.tax).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Shipping</span>
                                        <span className="font-bold">{summary.shipping === 0 ? 'Free' : `₱${summary.shipping}`}</span>
                                    </div>

                                    {/* Discount Code */}
                                    <div className="pt-1">
                                        {!discountState ? (
                                            <div>
                                                <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 block mb-2">Discount Code</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={discountInput}
                                                        onChange={(e) => { setDiscountInput(e.target.value.toUpperCase()); setDiscountError(''); }}
                                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyDiscount())}
                                                        placeholder="Enter code"
                                                        className={`flex-1 border px-3 py-2 text-[12px] font-mono uppercase focus:outline-none transition-colors ${
                                                            discountError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-black'
                                                        }`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={applyDiscount}
                                                        disabled={applyingDiscount || !discountInput.trim()}
                                                        className="px-3 py-2 bg-black text-white text-[10px] font-black tracking-[0.15em] uppercase hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                                                    >
                                                        {applyingDiscount ? '...' : 'Apply'}
                                                    </button>
                                                </div>
                                                {discountError && (
                                                    <p className="mt-1.5 text-[10px] font-semibold text-[#E60012]">{discountError}</p>
                                                )}
                                                {errors.discount_code && (
                                                    <p className="mt-1.5 text-[10px] font-semibold text-[#E60012]">{errors.discount_code}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2">
                                                <div>
                                                    <p className="text-[10px] font-black tracking-[0.15em] uppercase text-emerald-700">
                                                        {discountState.code}
                                                    </p>
                                                    <p className="text-[10px] text-emerald-600 mt-0.5">{discountState.title}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[13px] font-black text-emerald-700">
                                                        −₱{Number(discountState.discount_amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                                    </span>
                                                    <button type="button" onClick={removeDiscount} className="text-gray-400 hover:text-red-500 transition-colors" title="Remove discount">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 flex justify-between">
                                        <span className="font-black text-[11px] tracking-[0.2em] uppercase">TOTAL</span>
                                        <div className="text-right">
                                            {discountState && (
                                                <p className="text-[11px] text-gray-400 line-through">
                                                    ₱{Number(summary.total).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                                </p>
                                            )}
                                            <span className={`text-xl font-black ${discountState ? 'text-emerald-600' : ''}`}>
                                                ₱{Number(discountedTotal).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full mt-8 py-4 bg-black text-white text-[11px] font-black tracking-[0.3em] uppercase hover:bg-gray-800 transition-colors active:scale-[0.98] disabled:opacity-50"
                                >
                                    {processing ? 'PLACING ORDER...' : 'PLACE ORDER'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
