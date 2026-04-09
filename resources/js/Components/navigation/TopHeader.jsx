import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function TopHeader({ activeSection }) {
    const { auth, cartCount = 0, wishlistCount = 0 } = usePage().props;

    const tabs = [
        { id: 'women', label: 'WOMEN' },
        { id: 'men', label: 'MEN' },
        { id: 'unisex', label: 'UNISEX' }
    ];

    return (
        <header className="fixed top-0 inset-x-0 h-24 bg-white z-[300] border-b border-gray-100 flex items-center px-8 md:px-12">
            {/* Left: Logo */}
            <div className="w-1/4 flex items-center">
                <Link href="/ph/en" className="transition-transform active:scale-95">
                    <img 
                        src="/images/xylo-logo.png" 
                        alt="XYLO" 
                        className="h-8 w-auto"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<span class="text-lg font-black tracking-[0.3em] italic">XYLO</span>';
                        }}
                    />
                </Link>
            </div>

            {/* Center: Section Tabs */}
            <div className="flex-1 flex justify-center items-center space-x-10 md:space-x-16">
                {tabs.map((tab) => (
                    <Link
                        key={tab.id}
                        href={`/ph/en/${tab.id}-navi`}
                        className={`text-[9px] md:text-[10px] font-black tracking-[0.35em] uppercase transition-colors
                            ${activeSection === tab.id ? 'text-black' : 'text-black/25 hover:text-black/60'}`}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>

            {/* Right: Icons — matching StorefrontHeader */}
            <div className="w-1/4 flex justify-end items-center space-x-6 md:space-x-10">
                <button aria-label="Region" className="text-black opacity-30 hover:opacity-100 transition-opacity hidden sm:block">
                    <GlobeIcon />
                </button>
                <Link href="/ph/en/wishlist" className="text-black opacity-30 hover:opacity-100 transition-opacity relative">
                    <HeartIcon />
                    {wishlistCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E60012] text-white text-[8px] font-bold flex items-center justify-center rounded-full">
                            {wishlistCount > 99 ? '99+' : wishlistCount}
                        </span>
                    )}
                </Link>
                <Link href={auth?.user ? '/ph/en/cart' : '/ph/en/login'} className="text-black opacity-30 hover:opacity-100 transition-opacity relative">
                    <CartIcon />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E60012] text-white text-[8px] font-bold flex items-center justify-center rounded-full">
                            {cartCount > 99 ? '99+' : cartCount}
                        </span>
                    )}
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
