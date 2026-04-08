import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function NavBottomBar({ activeCategory }) {
    const { auth } = usePage().props;

    const handleCloseNav = () => {
        // Return to the corresponding base storefront page
        window.location.href = `/ph/en/${activeCategory === 'women' ? '' : activeCategory}`;
    };

    const profileHref = auth?.user ? '/ph/en/profile' : '/ph/en/login';

    return (
        <div className="fixed bottom-10 inset-x-0 z-[300] flex justify-center px-6 pointer-events-none">
            <div className="w-full max-w-sm bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-full h-20 flex items-center justify-between px-10 pointer-events-auto animate-in slide-in-from-bottom-5 duration-1000 fill-mode-both">
                
                {/* Home Icon: Symmetrically Left */}
                <Link 
                    href="/ph/en" 
                    className="p-2 transition-all hover:scale-110 active:scale-95 group"
                >
                    <svg className="w-6 h-6 text-black opacity-30 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                </Link>

                {/* X Button: Centered perfectly */}
                <button 
                    onClick={handleCloseNav}
                    className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform duration-300"
                    aria-label="Close search mode"
                >
                    <svg className="w-7 h-7 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Profile Icon: Symmetrically Right */}
                <Link 
                    href={profileHref}
                    className="p-2 transition-all hover:scale-110 active:scale-95 group"
                >
                    <svg className="w-6 h-6 text-black opacity-30 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
