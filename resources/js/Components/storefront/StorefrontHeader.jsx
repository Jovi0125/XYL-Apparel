import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function StorefrontHeader({ categories }) {
    const { url } = usePage();

    const isActive = (slug) => {
        if (url === '/' && slug === 'women') return true;
        return url.startsWith(`/${slug}`);
    };

    return (
        <header className="fixed top-0 inset-x-0 h-20 md:h-28 z-[100] px-8 md:px-16 flex items-center justify-between pointer-events-none">
            
            <div className="hidden md:flex w-1/4 pointer-events-auto">
                <Link href="/" className="group">
                    <span className="text-[14px] font-black tracking-[0.6em] uppercase text-white transition-opacity group-hover:opacity-60 leading-none">
                        XYLO
                    </span>
                </Link>
            </div>

            <nav className="flex-1 md:flex-none flex items-center justify-start md:justify-center space-x-10 md:space-x-20 pointer-events-auto">
                {categories.map((cat) => (
                    <Link
                        key={cat.slug}
                        href={cat.slug === 'women' ? '/' : `/${cat.slug}`}
                        className={`text-[9px] md:text-[10px] font-black tracking-[0.4em] uppercase transition-all relative py-2
                            ${isActive(cat.slug) ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
                    >
                        {cat.label}
                        <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-white transition-all duration-700
                            ${isActive(cat.slug) ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
                    </Link>
                ))}
            </nav>

            <div className="w-auto md:w-1/4 flex justify-end items-center space-x-6 md:space-x-10 pointer-events-auto text-white/90">
                <button aria-label="Region" className="opacity-30 hover:opacity-100 transition-opacity hidden sm:block">
                    <GlobeIcon />
                </button>
                <Link href="#" aria-label="Favorites" className="opacity-30 hover:opacity-100 transition-opacity">
                    <HeartIcon />
                </Link>
                <Link href="/login" aria-label="Cart" className="opacity-30 hover:opacity-100 transition-opacity relative">
                    <CartIcon />
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
