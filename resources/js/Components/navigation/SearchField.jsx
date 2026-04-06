import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function SearchField({ activeSection, initialQuery }) {
    const [query, setQuery] = useState(initialQuery || '');

    const handleSearch = (e) => {
        const val = e.target.value;
        setQuery(val);
        // Using {replace: true} prevents multiple history entries for each character
        router.get(`/ph/en/${activeSection}-navi`, { q: val }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    return (
        <div className="fixed bottom-32 inset-x-0 z-[250] px-12 flex justify-center pointer-events-none">
            <div className="w-full max-w-2xl bg-white shadow-2xl border border-gray-100 p-2 md:p-3 rounded-2xl pointer-events-auto flex items-center animate-in slide-in-from-bottom duration-500">
                <div className="flex-1 flex items-center px-4 space-x-4">
                    <svg className="w-5 h-5 text-gray-400 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input 
                        type="text" 
                        value={query}
                        onChange={handleSearch}
                        placeholder={`Search in ${activeSection.toUpperCase()} COLLECTION...`}
                        className="w-full bg-transparent border-none focus:ring-0 text-[13px] font-medium tracking-widest text-black placeholder-gray-300 uppercase italic"
                    />
                </div>
            </div>
        </div>
    );
}
