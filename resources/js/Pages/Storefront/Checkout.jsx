import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import BuyerNav from '@/Components/storefront/BuyerNav';

export default function Checkout({ cartItems, summary, user }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        shipping_address: user?.address || '',
        contact_number: user?.contact_number || '',
        payment_method: 'cod',
        notes: '',
    });

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
                                    <div className="border-t border-gray-200 pt-4 flex justify-between">
                                        <span className="font-black text-[11px] tracking-[0.2em] uppercase">TOTAL</span>
                                        <span className="text-xl font-black">₱{Number(summary.total).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
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
