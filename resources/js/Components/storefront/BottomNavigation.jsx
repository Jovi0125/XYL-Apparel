import React from 'react';
import { Link } from '@inertiajs/react';

export default function BottomNavigation({ onHomeClick, onToggleSearch, isSearchActive }) {
    return (
        <nav 
            className="flex items-center gap-4 p-2 bg-transparent pointer-events-auto"
            aria-label="Floating Control Panel"
        >
            {/* Home Toggle Block */}
            <button 
                onClick={onHomeClick}
                className="flex items-center justify-center w-14 h-14 rounded-full bg-white text-black shadow-xl hover:scale-110 active:scale-95 transition-all focus:outline-none"
                aria-label="Back to Top"
            >
                <svg className="w-6 h-6 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </button>
            
            {/* Center Main Action Block (Search / Close toggle) */}
            <button 
                onClick={onToggleSearch}
                className={`flex items-center justify-center w-[4.5rem] h-[4.5rem] rounded-full text-white shadow-2xl hover:scale-110 active:scale-90 transition-all focus:outline-none
                    ${isSearchActive ? 'bg-[#111]' : 'bg-red-600'}`}
                aria-label={isSearchActive ? 'Close Search' : 'Open Search'}
            >
                {isSearchActive ? (
                    <svg className="w-8 h-8 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-8 h-8 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                )}
            </button>

            {/* Profile Block */}
            <Link 
                href="/ph/en/login" 
                className="flex items-center justify-center w-14 h-14 rounded-full bg-white text-black shadow-xl hover:scale-110 active:scale-95 transition-all focus:outline-none"
                aria-label="Account Profile"
            >
                <svg className="w-6 h-6 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </Link>
        </nav>
    );
}
