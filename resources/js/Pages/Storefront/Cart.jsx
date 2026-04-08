import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import BuyerNav from '@/Components/storefront/BuyerNav';

export default function Cart({ cartItems, summary }) {
    const { flash } = usePage().props;

    const handleUpdateQuantity = (itemId, newQuantity) => {
        router.patch(`/ph/en/cart/${itemId}`, { quantity: newQuantity }, { preserveScroll: true });
    };

    const handleRemoveItem = (itemId) => {
        router.delete(`/ph/en/cart/${itemId}`, { preserveScroll: true });
    };

    const handleClearCart = () => {
        router.post('/ph/en/cart/clear', {}, { preserveScroll: true });
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <Head title="Shopping Cart | XYLO APPAREL" />
            <BuyerNav />

            <main className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Shopping Cart</h1>
                    <p className="text-[12px] text-gray-400 mt-1">
                        {summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-[12px] font-medium">
                        {flash.success}
                    </div>
                )}

                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 mb-6 rounded-full bg-gray-50 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-400">Your cart is empty</p>
                        <button 
                            onClick={() => router.get('/ph/en/products/women')}
                            className="mt-6 px-8 py-3 bg-black text-white text-[10px] font-black tracking-[0.3em] uppercase hover:bg-gray-800 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {cartItems.map((item) => (
                                <CartItemRow 
                                    key={item.id} 
                                    item={item}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
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

                                <div className="mt-8 space-y-3">
                                    <button
                                        onClick={() => router.get('/ph/en/checkout')}
                                        className="w-full py-4 bg-black text-white text-[11px] font-black tracking-[0.3em] uppercase hover:bg-gray-800 transition-colors active:scale-[0.98]"
                                    >
                                        PROCEED TO CHECKOUT
                                    </button>
                                    <button
                                        onClick={handleClearCart}
                                        className="w-full py-4 border border-gray-200 text-[11px] font-black tracking-[0.3em] uppercase text-gray-500 hover:text-black hover:border-black transition-all"
                                    >
                                        CLEAR CART
                                    </button>
                                </div>

                                {summary.subtotal < 3000 && (
                                    <p className="mt-4 text-[10px] text-gray-400 text-center">
                                        Add ₱{(3000 - summary.subtotal).toLocaleString()} more for free shipping
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

function CartItemRow({ item, onUpdateQuantity, onRemove }) {
    const product = item.product;
    const variant = item.variant;
    const imageUrl = product?.main_image?.image_url || product?.images?.[0]?.image_url;

    return (
        <div className="flex gap-4 md:gap-6 py-6 border-b border-gray-100 group">
            {/* Image */}
            <div className="w-24 h-28 md:w-28 md:h-32 bg-gray-50 overflow-hidden flex-shrink-0">
                {imageUrl ? (
                    <img src={imageUrl} alt={product?.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25c0 .828.672 1.5 1.5 1.5z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                    <h3 className="text-[13px] font-bold uppercase tracking-wide truncate">{product?.title}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                        {variant?.size && <span>{variant.size}</span>}
                        {item.color && <span>{variant?.size ? ' · ' : ''}{item.color}</span>}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">XYLO Official</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border border-gray-200">
                        <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 text-[13px] transition-colors"
                        >
                            −
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-[12px] font-bold border-x border-gray-200">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 text-[13px] transition-colors"
                        >
                            +
                        </button>
                    </div>
                    <button
                        onClick={() => onRemove(item.id)}
                        className="text-[10px] font-bold text-[#E60012] tracking-[0.15em] uppercase hover:text-red-700 transition-colors"
                    >
                        REMOVE
                    </button>
                </div>
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
                <span className="text-[14px] font-black">₱{Number(item.line_total).toLocaleString()}</span>
            </div>
        </div>
    );
}
