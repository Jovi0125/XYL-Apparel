import React from 'react';
import { usePage, router } from '@inertiajs/react';

export default function FloatingBottomNav({ onHomeClick, onSearchToggle, isSearchActive, onProfileClick }) {
    const { auth, url } = usePage().props;

    const isHome = (url === '/' || url === '') && !isSearchActive;

    const handleProfileInteraction = (e) => {
        // Shielded Interaction Logic
        if (!auth.user) {
            e.preventDefault();
            onProfileClick(); // Triggers Modal in Parent
        } else {
            const dashboardRoute = auth.user.role === 'admin' ? '/admin/dashboard' : '/buyer/dashboard';
            router.get(dashboardRoute);
        }
    };

    return (
        <nav className="flex items-center space-x-6 md:space-x-8 pointer-events-auto">
            
            <button 
                onClick={onHomeClick}
                className={`w-11 h-11 md:w-12 md:h-12 rounded-full bg-white text-black flex items-center justify-center transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.15)] active:scale-95
                    ${isHome ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-100'}`}
                aria-label="Home"
            >
                <svg className="w-4 h-4 md:w-5 md:h-5 stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </button>

            <button 
                onClick={onSearchToggle}
                className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-white text-black flex items-center justify-center transition-all duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.2)] active:scale-95
                    ${isSearchActive ? 'rotate-90 opacity-100' : 'opacity-100'}`}
                aria-label={isSearchActive ? 'Close Search' : 'Open Search'}
            >
                {isSearchActive ? (
                    <svg className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                )}
            </button>

            <button 
                onClick={handleProfileInteraction}
                className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white text-black flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 opacity-40 hover:opacity-100 active:scale-95"
                aria-label="Account Profile"
            >
                <svg className="w-4 h-4 md:w-5 md:h-5 stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
            </button>
        </nav>
    );
}
