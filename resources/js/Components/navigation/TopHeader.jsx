import React from 'react';
import { Link } from '@inertiajs/react';

export default function TopHeader({ activeSection }) {
    const tabs = [
        { id: 'women', label: 'WOMEN' },
        { id: 'men', label: 'MEN' },
        { id: 'unisex', label: 'UNISEX' },
    ];

    return (
        <header className="fixed top-0 inset-x-0 bg-white z-[300] border-b border-gray-100">
            <div className="max-w-[120rem] mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
                {/* Left: Logo */}
                <div className="w-1/4 flex justify-start shrink-0">
                    <Link href="/ph/en" className="transition-transform active:scale-95">
                        <img src="/images/xylo-logo.png" alt="XYLO" className="h-8 w-auto" />
                    </Link>
                </div>

                {/* Center: Parent Category Tabs */}
                <nav className="flex-1 flex items-center justify-center space-x-10 md:space-x-14">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.id}
                            href={`/ph/en/${tab.id}-navi`}
                            className={`text-[10px] md:text-[11px] font-black tracking-[0.35em] uppercase relative pb-1 pt-1 transition-all duration-300 group
                                ${activeSection === tab.id
                                    ? 'text-black'
                                    : 'text-black/25 hover:text-black/70'
                                }`}
                        >
                            {tab.label}
                            {/* Active indicator — red bottom border */}
                            <span
                                className={`absolute bottom-0 left-0 h-[2px] bg-[#E60012] transition-all duration-400 ease-out
                                    ${activeSection === tab.id
                                        ? 'w-full opacity-100'
                                        : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-30'
                                    }`}
                            />
                        </Link>
                    ))}
                </nav>

                {/* Right: Utility Icons */}
                <div className="w-1/4 flex justify-end items-center space-x-6 md:space-x-8 shrink-0">
                    <Link href="/ph/en/wishlist" className="p-1 text-black hover:opacity-50 transition-opacity">
                        <svg className="w-[22px] h-[22px] stroke-[1.3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                    </Link>
                    <Link href="/ph/en/cart" className="p-1 text-black hover:opacity-50 transition-opacity relative">
                        <svg className="w-[22px] h-[22px] stroke-[1.3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E60012] text-white text-[8px] font-bold flex items-center justify-center rounded-full">0</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
