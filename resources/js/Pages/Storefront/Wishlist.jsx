import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import BuyerNav from '@/Components/storefront/BuyerNav';

export default function Wishlist({ wishlistItems }) {
    const handleRemove = (wishlistId) => {
        router.delete(`/ph/en/wishlist/${wishlistId}`, {
            preserveScroll: true,
        });
    };

    const handleAddToCart = (item) => {
        router.post('/ph/en/cart', {
            product_id: item.product_id,
            quantity: 1,
        }, {
            preserveScroll: true,
        });
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <Head title="Wishlist | XYLO APPAREL" />
            <BuyerNav />

            <main className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                        Wishlist
                    </h1>
                    <p className="text-[12px] text-gray-400 mt-2">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>

                {wishlistItems.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-20">
                        <svg className="w-16 h-16 text-gray-200 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <h2 className="text-xl font-black uppercase tracking-tight mb-2">Your wishlist is empty</h2>
                        <p className="text-[13px] text-gray-400 mb-8">
                            Browse our collection and save your favorites.
                        </p>
                        <Link
                            href="/ph/en/products/women"
                            className="inline-block px-10 py-4 bg-black text-white text-[10px] font-black tracking-[0.3em] uppercase hover:bg-gray-800 transition-colors"
                        >
                            START SHOPPING
                        </Link>
                    </div>
                ) : (
                    /* Wishlist Grid */
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="group relative">
                                {/* Remove Button */}
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-full border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50 hover:border-red-200 hover:text-[#E60012]"
                                    title="Remove from wishlist"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {/* Product Image */}
                                <Link href={`/ph/en/product/${item.product_id}`} className="block">
                                    <div className="aspect-[3/4] bg-gray-50 overflow-hidden mb-3">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25c0 .828.672 1.5 1.5 1.5z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                {/* Product Info */}
                                <div className="space-y-1">
                                    {item.category && (
                                        <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400">
                                            {item.category}
                                        </p>
                                    )}
                                    <Link href={`/ph/en/product/${item.product_id}`}>
                                        <h3 className="text-[12px] font-bold uppercase tracking-wide truncate hover:text-gray-600 transition-colors">
                                            {item.title}
                                        </h3>
                                    </Link>
                                    <div className="flex items-baseline gap-2">
                                        {item.sale_price ? (
                                            <>
                                                <span className="text-[13px] font-black text-[#E60012]">
                                                    ₱{Number(item.final_price).toLocaleString()}
                                                </span>
                                                <span className="text-[11px] text-gray-400 line-through">
                                                    ₱{Number(item.regular_price).toLocaleString()}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-[13px] font-black">
                                                ₱{Number(item.regular_price).toLocaleString()}
                                            </span>
                                        )}
                                    </div>

                                    {/* Add to Cart / Out of Stock */}
                                    <div className="pt-2">
                                        {item.stock > 0 ? (
                                            <button
                                                onClick={() => handleAddToCart(item)}
                                                className="w-full py-2.5 bg-black text-white text-[9px] font-black tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors active:scale-[0.98]"
                                            >
                                                ADD TO CART
                                            </button>
                                        ) : (
                                            <div className="w-full py-2.5 bg-gray-100 text-gray-400 text-[9px] font-black tracking-[0.2em] uppercase text-center">
                                                OUT OF STOCK
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-[9px] text-gray-300">Added {item.added_at}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
