import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function StorefrontHeader({ categories }) {
    const { url } = usePage();

    // Helper to determine if a route is active
    const isActive = (slug) => {
        // Handle home route default to women
        if (url === '/' && slug === 'women') return true;
        return url.startsWith(`/${slug}`);
    };

    return (
        <header className="fixed top-0 inset-x-0 h-16 md:h-20 z-[100] px-6 md:px-10 flex items-center justify-between pointer-events-none">
            
            {/* 1. Refined Logo Size (Uniqlo Proportions) */}
            <div className="w-1/4 pointer-events-auto">
                <Link href="/" className="group flex items-center">
                    <span className="text-[14px] md:text-[16px] font-black tracking-[0.15em] uppercase text-white hover:text-white/80 transition-colors">
                        XYLO
                    </span>
                </Link>
            </div>

            {/* 2. Focused Category Navigation (Centered & Spaced) */}
            <nav className="flex items-center space-x-12 md:space-x-16 pointer-events-auto">
                {categories.map((cat) => (
                    <Link
                        key={cat.slug}
                        href={cat.slug === 'women' ? '/' : `/${cat.slug}`}
                        className={`text-[11px] font-bold tracking-[0.2em] uppercase transition-all relative py-1.5
                            ${isActive(cat.slug) ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                    >
                        {cat.label}
                        {/* 3. Subtle Underline Logic */}
                        <span className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-500 ease-in-out
                            ${isActive(cat.slug) ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
                    </Link>
                ))}
            </nav>

            {/* 4. Refined Icon Utility (Smaller & Balanced) */}
            <div className="w-1/4 flex justify-end items-center space-x-7 md:space-x-9 pointer-events-auto text-white/90">
                <button aria-label="Region & Language" className="hover:text-white transition-colors">
                    <GlobeIcon />
                </button>
                <Link href="#" aria-label="Favorites" className="hover:text-white transition-colors">
                    <HeartIcon />
                </Link>
                <Link href="/login" aria-label="Shopping Cart" className="hover:text-white transition-colors relative">
                    <CartIcon />
                    <span className="absolute -top-1.5 -right-2 text-[8px] font-bold bg-white text-black px-1 rounded-sm">0</span>
                </Link>
            </div>
        </header>
    );
}

const GlobeIcon = () => (
    <svg className="w-[18px] h-[18px] stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
);
const HeartIcon = () => (
    <svg className="w-[18px] h-[18px] stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);
const CartIcon = () => (
    <svg className="w-[18px] h-[18px] stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);
