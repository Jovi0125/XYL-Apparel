import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import BuyerNav from '@/Components/storefront/BuyerNav';

export default function ProductListing({ products, categories, parentCategory, activeCategory }) {
    const [hoveredProduct, setHoveredProduct] = useState(null);

    const handleCategoryFilter = (categoryId) => {
        const params = categoryId ? { category: categoryId } : {};
        router.get(`/ph/en/products/${parentCategory}`, params, { preserveState: true });
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <Head title={`${parentCategory.toUpperCase()} Collection | XYLO APPAREL`} />
            <BuyerNav />

            <main className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-20">
                {/* Section Header */}
                <div className="mb-10">
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-2">
                        {parentCategory.toUpperCase()} COLLECTION
                    </p>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
                        {parentCategory.toUpperCase()}
                    </h1>
                </div>

                {/* Category Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-10">
                    <button
                        onClick={() => handleCategoryFilter(null)}
                        className={`px-5 py-2 text-[10px] font-black tracking-[0.2em] uppercase border transition-all duration-300
                            ${!activeCategory 
                                ? 'bg-black text-white border-black' 
                                : 'bg-white text-black border-gray-200 hover:border-black'}`}
                    >
                        ALL
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryFilter(cat.id)}
                            className={`px-5 py-2 text-[10px] font-black tracking-[0.2em] uppercase border transition-all duration-300
                                ${String(activeCategory) === String(cat.id)
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-black border-gray-200 hover:border-black'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12">
                        {products.map((product, idx) => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                index={idx}
                                isHovered={hoveredProduct === product.id}
                                onHover={() => setHoveredProduct(product.id)}
                                onLeave={() => setHoveredProduct(null)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 mb-6 rounded-full bg-gray-50 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-400">No products found</p>
                        <p className="text-xs text-gray-300 mt-1">New items arriving soon</p>
                    </div>
                )}
            </main>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes productFadeIn {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .product-card {
                    transition: transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                                box-shadow 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                .product-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 12px 40px -8px rgba(0, 0, 0, 0.1),
                                0 4px 12px -2px rgba(0, 0, 0, 0.04);
                }
                .product-card .product-img-primary {
                    transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                                opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                .product-card:hover .product-img-primary {
                    transform: scale(1.05);
                }
                .product-card .product-img-secondary {
                    transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                                opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                .product-card:hover .product-img-secondary {
                    opacity: 1;
                    transform: scale(1.05);
                }

                .product-title-underline {
                    position: relative;
                    display: inline;
                    background-image: linear-gradient(currentColor, currentColor);
                    background-position: 0% 100%;
                    background-repeat: no-repeat;
                    background-size: 0% 1px;
                    transition: background-size 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                                color 0.3s ease;
                }
                .product-card:hover .product-title-underline {
                    background-size: 100% 1px;
                }
            `}} />
        </div>
    );
}

function ProductCard({ product, index, isHovered, onHover, onLeave }) {
    const mainImage = product.main_image?.image_url || product.images?.[0]?.image_url;
    const secondImage = product.images?.[1]?.image_url;
    const categoryName = product.category?.name;
    const colors = product.colors || [];

    return (
        <Link
            href={`/ph/en/product/${product.id}`}
            className="product-card group block"
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            style={{ animation: `productFadeIn 0.5s ease-out ${index * 0.05}s both` }}
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden mb-3">
                {mainImage ? (
                    <>
                        <img
                            src={mainImage}
                            alt={product.title}
                            className={`product-img-primary absolute inset-0 w-full h-full object-cover object-center
                                ${isHovered && secondImage ? 'opacity-0' : 'opacity-100'}`}
                            style={isHovered && secondImage ? { transform: 'scale(1)' } : {}}
                            loading="lazy"
                        />
                        {secondImage && (
                            <img
                                src={secondImage}
                                alt={`${product.title} alternate`}
                                className={`product-img-secondary absolute inset-0 w-full h-full object-cover object-center
                                    ${isHovered ? '' : 'opacity-0'}`}
                                style={!isHovered ? { transform: 'scale(1)' } : {}}
                                loading="lazy"
                            />
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25c0 .828.672 1.5 1.5 1.5z" />
                        </svg>
                    </div>
                )}



                {/* Sale Badge */}
                {product.sale_price && (
                    <div className="absolute top-3 left-3 bg-[#E60012] text-white text-[9px] font-black tracking-wider px-2 py-1">
                        SALE
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="space-y-1">
                {categoryName && (
                    <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400">
                        {categoryName}
                    </p>
                )}
                <h3 className="text-[12px] md:text-[13px] font-bold uppercase tracking-wide text-black group-hover:text-gray-600 leading-tight">
                    <span className="product-title-underline">{product.title}</span>
                </h3>
                <div className="flex items-center gap-2">
                    {product.sale_price ? (
                        <>
                            <span className="text-[13px] font-black text-[#E60012]">
                                ₱{Number(product.sale_price).toLocaleString()}
                            </span>
                            <span className="text-[11px] text-gray-400 line-through">
                                ₱{Number(product.regular_price).toLocaleString()}
                            </span>
                        </>
                    ) : (
                        <span className="text-[13px] font-black">
                            ₱{Number(product.regular_price).toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Color Dots */}
                {colors.length > 0 && (
                    <div className="flex gap-1.5 pt-1">
                        {colors.slice(0, 5).map((color, i) => (
                            <span
                                key={i}
                                className="w-3 h-3 rounded-full border border-gray-200"
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                            />
                        ))}
                        {colors.length > 5 && (
                            <span className="text-[9px] text-gray-400 self-center">+{colors.length - 5}</span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
}
