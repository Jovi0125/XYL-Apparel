import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function StorefrontHeader({ categories = [] }) {
    const { url } = usePage();

    const isActive = (slug) => {
        const path = url.split('/')[3] || 'women';
        const baseSlug = path.replace('-navi', '') || 'women';
        return baseSlug === slug;
    };

    return (
        <header className="fixed top-0 inset-x-0 h-14 z-[400] bg-white border-b border-gray-100/10 backdrop-blur-sm transition-all duration-700">
            <div className="max-w-[120rem] mx-auto px-6 md:px-12 h-full flex items-center justify-between">
                
                {/* Left: Logo */}
                <div className="w-1/4 flex justify-start shrink-0">
                    <Link href="/ph/en" className="group flex items-center">
                        <img 
                            src="/images/xylo-logo.png" 
                            alt="XYLO APPAREL" 
                            className="h-8 md:h-10 w-auto transition-opacity group-hover:opacity-60"
                        />
                    </Link>
                </div>

                {/* Center: Parent Tabs */}
                <nav className="flex-1 flex items-center justify-center space-x-10 md:space-x-14">
                    {categories.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={cat.slug === 'women' ? '/ph/en' : `/ph/en/${cat.slug}`}
                            className={`text-[10px] md:text-[11px] font-black tracking-[0.35em] uppercase transition-all relative py-1
                                ${isActive(cat.slug) ? 'text-black' : 'text-black/30 hover:text-black/60'}`}
                        >
                            {cat.label}
                            <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#E60012] transition-all duration-700
                                ${isActive(cat.slug) ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
                        </Link>
                    ))}
                </nav>

                {/* Right: Icons */}
                <div className="w-1/4 flex justify-end items-center space-x-6 md:space-x-8 shrink-0 text-black">
                    <button aria-label="Region" className="opacity-30 hover:opacity-100 transition-opacity hidden sm:block">
                        <GlobeIcon />
                    </button>
                    <Link href="#" aria-label="Favorites" className="opacity-30 hover:opacity-100 transition-opacity">
                        <HeartIcon />
                    </Link>
                    <Link href="/ph/en/login" aria-label="Cart" className="opacity-30 hover:opacity-100 transition-opacity relative">
                        <CartIcon />
                    </Link>
                </div>
            </div>
        </header>
    );
}

const GlobeIcon = () => (
    <svg className="w-[20px] h-[20px] stroke-[1.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
);
const HeartIcon = () => (
    <svg className="w-[20px] h-[20px] stroke-[1.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);
const CartIcon = () => (
    <svg className="w-[20px] h-[20px] stroke-[1.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);
