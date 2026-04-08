import React from 'react';
import { Link } from '@inertiajs/react';

export default function TopHeader({ activeSection }) {
    const tabs = [
        { id: 'women', label: 'WOMEN' },
        { id: 'men', label: 'MEN' },
        { id: 'unisex', label: 'UNISEX' }
    ];

    return (
        <header className="fixed top-0 inset-x-0 h-24 bg-white z-[300] border-b border-gray-100 flex items-center px-8 md:px-12">
            {/* Left: Logo */}
            <div className="w-1/4 flex justify-start">
                <Link href="/ph/en" className="transition-transform active:scale-95">
                    <img src="/images/xylo-logo.png" alt="XYLO" className="h-10 w-auto" />
                </Link>
            </div>

            {/* Center: Parent Tabs */}
            <div className="w-2/4 flex justify-center space-x-12">
                {tabs.map((tab) => (
                    <Link
                        key={tab.id}
                        href={`/ph/en/${tab.id}-navi`}
                        className={`text-[11px] font-black tracking-[0.35em] uppercase relative pb-2 transition-all duration-300
                            ${activeSection === tab.id ? 'text-black opacity-100' : 'text-black opacity-20 hover:opacity-100'}`}
                    >
                        {tab.label}
                        {activeSection === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#E60012] animate-in fade-in zoom-in-50" />
                        )}
                    </Link>
                ))}
            </div>

            {/* Right: Icons — matching StorefrontHeader */}
            <div className="w-1/4 flex justify-end items-center space-x-6 md:space-x-10">
                <button aria-label="Region" className="text-black opacity-30 hover:opacity-100 transition-opacity hidden sm:block">
                    <GlobeIcon />
                </button>
                <Link href="/ph/en/wishlist" className="text-black opacity-30 hover:opacity-100 transition-opacity">
                    <HeartIcon />
                </Link>
                <Link href="/ph/en/cart" className="text-black opacity-30 hover:opacity-100 transition-opacity relative">
                    <CartIcon />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E60012] text-white text-[8px] font-bold flex items-center justify-center rounded-full">0</span>
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
