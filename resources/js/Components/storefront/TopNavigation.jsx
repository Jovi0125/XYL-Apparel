import React from 'react';
import { Link } from '@inertiajs/react';

export default function TopNavigation({ onSearchToggle, isSearchActive }) {
    return (
        <header className={`fixed top-0 inset-x-0 w-full bg-white z-[60] border-b border-gray-100 transition-transform duration-500 ${isSearchActive ? '-translate-y-full' : 'translate-y-0'}`}>
            <div className="max-w-[120rem] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                
                {/* Red Square Logo Pair (XYLO Branding) */}
                <div className="flex items-center gap-1 shrink-0 cursor-pointer" onClick={() => window.location.reload()}>
                    <div className="bg-[#E60012] text-white font-bold text-[14px] leading-none w-8 h-8 flex items-center justify-center select-none shadow-sm">
                        XY
                    </div>
                    <div className="bg-[#E60012] text-white font-bold text-[14px] leading-none w-8 h-8 flex items-center justify-center select-none shadow-sm">
                        LO
                    </div>
                </div>

                {/* Right Utility Icons */}
                <div className="flex items-center space-x-6 text-black shrink-0">
                    <button aria-label="Search Collection" onClick={onSearchToggle} className="hover:text-gray-500 transition-colors">
                        <svg className="w-6 h-6 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                    
                    <Link href="#" aria-label="Wishlist" className="hover:text-gray-500 transition-colors">
                        <svg className="w-6 h-6 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </Link>

                    <Link href="#" aria-label="Shopping Cart" className="hover:text-gray-500 transition-colors relative">
                        <svg className="w-6 h-6 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-white text-[8px] font-bold">0</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}

