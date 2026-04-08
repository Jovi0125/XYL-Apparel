import React from 'react';
import { Link } from '@inertiajs/react';

export default function CategoryGrid({ categories, activeSection }) {
    if (!categories || categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 mb-6 rounded-full bg-gray-50 flex items-center justify-center">
                    <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <span className="text-sm font-medium text-gray-400 mb-1">Collection empty</span>
                <p className="text-xs text-gray-300">New items arriving soon.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 md:px-14">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 md:gap-x-10 gap-y-4 md:gap-y-6">
                {categories.map((cat, idx) => {
                    const imageUrl = cat.product_image || cat.image_url;
                    const hasImage = !!imageUrl;

                    return (
                        <Link 
                            key={cat.id} 
                            href="#"
                            className="group flex items-center gap-3 md:gap-4 py-3 px-2 rounded-lg hover:bg-gray-50/80 transition-all duration-300"
                            style={{ 
                                animation: `catGridIn 0.4s ease-out ${idx * 0.04}s both` 
                            }}
                        >
                            {/* Thumbnail */}
                            <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                                {hasImage ? (
                                    <img 
                                        src={imageUrl} 
                                        alt={cat.name}
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                ) : (
                                    <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                )}
                            </div>

                            {/* Name */}
                            <div className="flex flex-col min-w-0">
                                <span className="text-[12px] md:text-[13px] font-medium text-gray-800 group-hover:text-black transition-colors leading-tight">
                                    {cat.name}
                                </span>
                                {cat.product_count > 0 && (
                                    <span className="text-[10px] text-gray-400 mt-0.5">
                                        {cat.product_count} {cat.product_count === 1 ? 'item' : 'items'}
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes catGridIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </div>
    );
}
