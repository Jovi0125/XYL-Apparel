import React from 'react';
import { Link, usePage } from '@inertiajs/react';

/**
 * Reusable white/black/red navigation header for buyer pages
 * (Cart, Checkout, Profile, Orders, Product Detail, Product Listing)
 */
export default function BuyerNav({ title }) {
    const { auth, cartCount = 0, wishlistCount = 0 } = usePage().props;

    const tabs = [
        { id: 'women', label: 'WOMEN', href: '/ph/en/products/women' },
        { id: 'men', label: 'MEN', href: '/ph/en/products/men' },
        { id: 'unisex', label: 'UNISEX', href: '/ph/en/products/unisex' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
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

                {/* Center: Category Tabs */}
                <nav className="hidden md:flex items-center space-x-10">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.id}
                            href={tab.href}
                            className="text-[10px] font-black tracking-[0.35em] uppercase text-black/30 hover:text-black transition-colors relative py-2"
                        >
                            {tab.label}
                        </Link>
                    ))}
                </nav>

                {/* Right: Icons */}
                <div className="w-1/4 flex justify-end items-center space-x-6">
                    <Link 
                        href="/ph/en/profile" 
                        className="text-black/40 hover:text-black transition-colors"
                        aria-label="Profile"
                    >
                        <svg className="w-[18px] h-[18px] stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </Link>
                    <Link 
                        href={auth?.user ? '/ph/en/wishlist' : '/ph/en/login'} 
                        className="text-black/40 hover:text-black transition-colors relative"
                        aria-label="Wishlist"
                    >
                        <svg className="w-[18px] h-[18px] stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {wishlistCount > 0 && (
                            <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#E60012] text-white text-[7px] font-bold flex items-center justify-center rounded-full">
                                {wishlistCount > 99 ? '99+' : wishlistCount}
                            </span>
                        )}
                    </Link>
                    <Link 
                        href="/ph/en/cart" 
                        className="text-black/40 hover:text-black transition-colors relative"
                        aria-label="Cart"
                    >
                        <svg className="w-[18px] h-[18px] stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#E60012] text-white text-[7px] font-bold flex items-center justify-center rounded-full">
                                {cartCount > 99 ? '99+' : cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}
