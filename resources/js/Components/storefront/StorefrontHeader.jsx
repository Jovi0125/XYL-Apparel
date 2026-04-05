import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function StorefrontHeader({ categories }) {
    const { url } = usePage();

    const isActive = (slug) => {
        if (url === '/' && slug === 'women') return true;
        return url.startsWith(`/${slug}`);
    };

    return (
        <header className="fixed top-0 inset-x-0 h-16 md:h-20 z-[100] px-4 md:px-10 flex items-center justify-between pointer-events-none">
            
            {/* 1. BRAND IDENTITY: Hidden on Mobile, Fixed for Desktop */}
            <div className="hidden md:flex w-1/4 pointer-events-auto">
                <Link href="/" className="group flex items-center">
                    <span className="text-[16px] font-black tracking-[0.15em] uppercase text-white">
                        XYLO
                    </span>
                </Link>
            </div>

            {/* 2. CATEGORY NAVIGATION: Centered on Desktop, Spaced Flex on Mobile */}
            <nav className="flex-1 md:flex-none flex items-center justify-start md:justify-center space-x-6 md:space-x-16 pointer-events-auto ml-2 md:ml-0">
                {categories.map((cat) => (
                    <Link
                        key={cat.slug}
                        href={cat.slug === 'women' ? '/' : `/${cat.slug}`}
                        className={`text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase transition-all relative py-1.5
                            ${isActive(cat.slug) ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                    >
                        {cat.label}
                        <span className={`absolute bottom-0 left-0 h-[1.5px] md:h-[2px] bg-white transition-all duration-500
                            ${isActive(cat.slug) ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
                    </Link>
                ))}
            </nav>

            {/* 3. ICON UTILITY: Scaled for Phone Interaction */}
            <div className="w-auto md:w-1/4 flex justify-end items-center space-x-5 md:space-x-9 pointer-events-auto text-white/90 pr-2 md:pr-0">
                <button aria-label="Region & Language" className="hover:text-white transition-opacity hidden sm:block">
                    <GlobeIcon />
                </button>
                <Link href="#" aria-label="Favorites" className="hover:text-white transition-opacity">
                    <HeartIcon />
                </Link>
                <Link href="/login" aria-label="Shopping Cart" className="hover:text-white transition-opacity relative">
                    <CartIcon />
                    <span className="absolute -top-1 -right-1.5 text-[7px] font-bold bg-white text-black px-1 rounded-sm">0</span>
                </Link>
            </div>
        </header>
    );
}

const GlobeIcon = () => (
    <svg className="w-[16px] md:w-[18px] h-[16px] md:h-[18px] stroke-[1.2] md:stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
);
const HeartIcon = () => (
    <svg className="w-[16px] md:w-[18px] h-[16px] md:h-[18px] stroke-[1.2] md:stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);
const CartIcon = () => (
    <svg className="w-[16px] md:w-[18px] h-[16px] md:h-[18px] stroke-[1.2] md:stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);
