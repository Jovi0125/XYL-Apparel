import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function StorefrontCategoryOverlay({ isOpen, onClose, categoryGroups = {} }) {
    const { url } = usePage();
    const parentTabs = ['women', 'men', 'unisex'];
    
    const getInitialTab = () => {
        const path = url.split('/')[3]; 
        const baseSlug = (path || '').replace('-navi', '');
        return parentTabs.includes(baseSlug) ? baseSlug : 'women';
    };

    const [activeTab, setActiveTab] = useState(getInitialTab);
    const [searchQuery, setSearchQuery] = useState('');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        if (!isOpen) setActiveTab(getInitialTab());
    }, [url, isOpen]);

    // Lock body scroll when overlay is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const children = (categoryGroups[activeTab] || []).filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[250] bg-white flex flex-col" style={{ animation: 'overlayFadeIn 0.4s ease-out' }}>
            {/* Top Bar with Logo + Close */}
            <div className="h-16 md:h-20 border-b border-gray-100 flex items-center justify-between px-6 md:px-16 bg-white">
                <div className="flex items-center gap-3">
                    <img 
                        src="/images/xylo-logo.png" 
                        alt="XYLO" 
                        className="h-8 md:h-10 w-auto invert"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>
                <button 
                    onClick={onClose} 
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
                    aria-label="Close"
                >
                    <svg className="w-6 h-6 text-gray-800 stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Parent Category Tabs */}
            <div className="flex justify-center items-center gap-8 md:gap-16 py-4 md:py-5 bg-white border-b border-gray-50">
                {parentTabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`text-[11px] md:text-[13px] font-bold tracking-[0.25em] uppercase pb-2 relative transition-all duration-400
                            ${activeTab === tab 
                                ? 'text-gray-900' 
                                : 'text-gray-300 hover:text-gray-500'
                            }`}
                    >
                        {tab}
                        <span 
                            className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900 transition-all duration-400 ease-out
                                ${activeTab === tab ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} 
                        />
                    </button>
                ))}
            </div>

            {/* Scrollable Category Grid */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="max-w-5xl mx-auto px-6 md:px-12 py-8 md:py-12">
                    {children.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 md:gap-x-10 gap-y-6 md:gap-y-8">
                            {children.map((cat, idx) => (
                                <CategoryCell 
                                    key={cat.id} 
                                    category={cat} 
                                    activeTab={activeTab}
                                    index={idx} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-16 h-16 mb-6 rounded-full bg-gray-50 flex items-center justify-center">
                                <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-400 mb-1">No categories yet</span>
                            <span className="text-xs text-gray-300">New collections arriving soon</span>
                        </div>
                    )}
                </div>

                {/* Bottom spacer for floating nav */}
                <div className="h-32" />
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes overlayFadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes cellFadeIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </div>
    );
}

function CategoryCell({ category, activeTab, index }) {
    const imageUrl = category.product_image || category.image_url;
    const hasImage = !!imageUrl;
    
    return (
        <Link
            href={`/ph/en/products/${activeTab}?category=${category.id}`}
            className="group flex items-center gap-3 md:gap-4 py-3 px-1 rounded-lg hover:bg-gray-50/80 transition-all duration-300 cursor-pointer"
            style={{ 
                animation: `cellFadeIn 0.4s ease-out ${index * 0.04}s both` 
            }}
        >
            {/* Category Thumbnail */}
            <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                {hasImage ? (
                    <img 
                        src={imageUrl} 
                        alt={category.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                ) : (
                    <CategoryPlaceholderIcon name={category.name} />
                )}
            </div>

            {/* Category Name */}
            <div className="flex flex-col min-w-0">
                <span className="text-[12px] md:text-[13px] font-medium text-gray-800 group-hover:text-black transition-colors leading-tight">
                    {category.name}
                </span>
                {category.product_count > 0 && (
                    <span className="text-[10px] text-gray-400 mt-0.5">
                        {category.product_count} {category.product_count === 1 ? 'item' : 'items'}
                    </span>
                )}
            </div>
        </Link>
    );
}

function CategoryPlaceholderIcon({ name }) {
    // Generate a subtle placeholder based on category name
    const iconMap = {
        'new arrivals': (
            <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
        ),
        't-shirts': (
            <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
        ),
        'default': (
            <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
    };

    const key = name.toLowerCase();
    return iconMap[key] || iconMap['default'];
}
