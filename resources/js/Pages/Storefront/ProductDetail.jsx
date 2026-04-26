import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import BuyerNav from '@/Components/storefront/BuyerNav';

export default function ProductDetail({ product, relatedProducts, isWishlisted: initialWishlisted, reviews = [], avgRating }) {
    const { auth } = usePage().props;
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('details');
    const [addedToCart, setAddedToCart] = useState(false);
    const [wishlisted, setWishlisted] = useState(initialWishlisted || false);

    const images = product.images || [];
    const variants = product.variants || [];
    const colors = product.colors || [];
    const category = product.category;

    const currentPrice = selectedVariant
        ? (selectedVariant.sale_price || selectedVariant.regular_price)
        : product.final_price;

    const handleAddToCart = () => {
        if (!auth?.user) {
            router.get('/ph/en/login');
            return;
        }

        router.post('/ph/en/cart', {
            product_id: product.id,
            product_variant_id: selectedVariant?.id || null,
            color: selectedColor,
            quantity: quantity,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setAddedToCart(true);
                setTimeout(() => setAddedToCart(false), 2000);
            }
        });
    };

    const handleWishlist = () => {
        if (!auth?.user) {
            router.get('/ph/en/login');
            return;
        }

        router.post('/ph/en/wishlist/toggle', {
            product_id: product.id,
        }, {
            preserveScroll: true,
            onSuccess: () => setWishlisted(!wishlisted),
        });
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <Head title={`${product.title} | XYLO APPAREL`} />
            <BuyerNav />

            <main className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

                    {/* Left: Image Gallery */}
                    <div className="flex gap-4">
                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="hidden md:flex flex-col gap-2 w-20">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`aspect-square bg-gray-50 overflow-hidden border-2 transition-all duration-300
                                            ${selectedImage === idx ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
                                    >
                                        <img
                                            src={img.image_url}
                                            alt={`${product.title} ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main Image */}
                        <div className="flex-1 aspect-[3/4] bg-gray-50 overflow-hidden relative">
                            {images.length > 0 ? (
                                <img
                                    src={images[selectedImage]?.image_url}
                                    alt={product.title}
                                    className="w-full h-full object-cover object-center transition-opacity duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg className="w-16 h-16 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25c0 .828.672 1.5 1.5 1.5z" />
                                    </svg>
                                </div>
                            )}

                            {/* Sale Badge */}
                            {product.sale_price && (
                                <div className="absolute top-4 left-4 bg-[#E60012] text-white text-[10px] font-black tracking-wider px-3 py-1.5">
                                    SALE
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="space-y-6">
                        {/* Brand & Category */}
                        <div>
                            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-1">
                                XYLO OFFICIAL{category ? ` · ${category.name}` : ''}
                            </p>
                            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                                {product.title}
                            </h1>
                            {avgRating && (
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-[11px] text-gray-400">
                                        {avgRating} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            {product.sale_price ? (
                                <>
                                    <span className="text-3xl font-black text-[#E60012]">
                                        ₱{Number(currentPrice).toLocaleString()}
                                    </span>
                                    <span className="text-lg text-gray-400 line-through">
                                        ₱{Number(product.regular_price).toLocaleString()}
                                    </span>
                                </>
                            ) : (
                                <span className="text-3xl font-black">
                                    ₱{Number(currentPrice).toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Color Selector */}
                        {colors.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-500">COLOR</span>
                                    <span className="text-[11px] text-gray-400 capitalize">{selectedColor}</span>
                                </div>
                                <div className="flex gap-2">
                                    {colors.map((color, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-9 h-9 rounded-full border-2 transition-all duration-200
                                                ${selectedColor === color ? 'border-black scale-110' : 'border-gray-200 hover:border-gray-400'}`}
                                            style={{ backgroundColor: color.toLowerCase() }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selector */}
                        {variants.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-500">SIZE</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedVariant(variant)}
                                            disabled={variant.stock <= 0}
                                            className={`min-w-[48px] h-12 px-4 border text-[12px] font-bold uppercase tracking-wide transition-all duration-200
                                                ${selectedVariant?.id === variant.id
                                                    ? 'bg-black text-white border-black'
                                                    : variant.stock <= 0
                                                        ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                                        : 'bg-white text-black border-gray-200 hover:border-black'
                                                }`}
                                        >
                                            {variant.size}
                                        </button>
                                    ))}
                                </div>
                                {!selectedVariant && variants.length > 0 && (
                                    <p className="text-[10px] text-gray-400 mt-2 italic">Please select a size</p>
                                )}
                            </div>
                        )}

                        {/* Quantity */}
                        <div>
                            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-500 block mb-3">QUANTITY</span>
                            <div className="flex items-center border border-gray-200 w-fit">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                                >
                                    −
                                </button>
                                <span className="w-12 h-12 flex items-center justify-center text-[13px] font-bold border-x border-gray-200">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="space-y-3 pt-2">
                            <button
                                onClick={handleAddToCart}
                                disabled={variants.length > 0 && !selectedVariant}
                                className={`w-full py-4 text-[11px] font-black tracking-[0.3em] uppercase transition-all duration-300 flex items-center justify-center gap-2
                                    ${addedToCart
                                        ? 'bg-green-600 text-white'
                                        : variants.length > 0 && !selectedVariant
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-black text-white hover:bg-gray-800 active:scale-[0.98]'
                                    }`}
                            >
                                {addedToCart ? (
                                    <>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        ADDED TO CART
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        ADD TO CART
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleWishlist}
                                className={`w-full py-4 border text-[11px] font-black tracking-[0.3em] uppercase transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]
                                    ${wishlisted
                                        ? 'border-[#E60012] text-[#E60012] bg-red-50 hover:bg-red-100'
                                        : 'border-gray-200 text-black hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                {wishlisted ? 'IN YOUR WISHLIST' : 'ADD TO WISHLIST'}
                            </button>
                        </div>

                        {/* Info Badges */}
                        <div className="border-t border-gray-100 pt-6 space-y-3">
                            <InfoBadge icon="truck" text="Free delivery on orders over ₱3,000" />
                            <InfoBadge icon="return" text="Free 30-day returns" />
                            <InfoBadge icon="shield" text="100% authentic guarantee" />
                        </div>

                        {/* Details Tabs */}
                        <div className="border-t border-gray-100 pt-6">
                            <div className="flex gap-6 mb-4">
                                {['details', 'size guide', 'reviews'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`text-[11px] font-black tracking-[0.2em] uppercase pb-2 border-b-2 transition-all duration-300
                                            ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="text-[13px] text-gray-600 leading-relaxed">
                                {activeTab === 'details' && (
                                    <div>
                                        <p>{product.detailed_description || product.short_description || 'No description available.'}</p>
                                        {product.warranty && product.warranty !== 'No Warranty' && (
                                            <p className="mt-4 text-[11px] text-gray-400">
                                                <span className="font-bold text-black">WARRANTY:</span> {product.warranty}
                                            </p>
                                        )}
                                        <div className="mt-4 grid grid-cols-2 gap-4 text-[11px]">
                                            <div>
                                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">BRAND</span>
                                                <p className="font-bold mt-1">XYLO</p>
                                            </div>
                                            {category && (
                                                <div>
                                                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">CATEGORY</span>
                                                    <p className="font-bold mt-1 text-[#E60012]">{category.name}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'size guide' && (
                                    <p className="text-gray-400 italic">Size guide coming soon.</p>
                                )}
                                {activeTab === 'reviews' && (
                                    <div>
                                        {/* Rating Summary */}
                                        {avgRating ? (
                                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                                                <div className="text-center">
                                                    <span className="text-4xl font-black">{avgRating}</span>
                                                    <div className="flex justify-center mt-1">
                                                        {[1, 2, 3, 4, 5].map(s => (
                                                            <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 mt-1">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 italic mb-4">No reviews yet. Be the first to review this product!</p>
                                        )}

                                        {/* Individual Reviews */}
                                        <div className="space-y-5">
                                            {reviews.map((review) => (
                                                <div key={review.id} className="border-b border-gray-50 pb-5 last:border-0">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-7 h-7 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                                                {review.buyer_name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="text-[12px] font-bold">{review.buyer_name}</span>
                                                        </div>
                                                        <span className="text-[10px] text-gray-400">{review.created_at}</span>
                                                    </div>
                                                    <div className="flex mb-2">
                                                        {[1, 2, 3, 4, 5].map(s => (
                                                            <svg key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                    {review.comment && (
                                                        <p className="text-[13px] text-gray-600 leading-relaxed">{review.comment}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function InfoBadge({ icon, text }) {
    const icons = {
        truck: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
        ),
        return: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
        ),
        shield: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
    };

    return (
        <div className="flex items-center gap-3 text-[12px] text-gray-500">
            <span className="text-[#E60012]">{icons[icon]}</span>
            <span>{text}</span>
        </div>
    );
}
