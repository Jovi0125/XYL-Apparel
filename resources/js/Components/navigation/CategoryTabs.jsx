import React from 'react';
import { Link } from '@inertiajs/react';

export default function CategoryTabs({ activeSection }) {
    const tabs = [
        { id: 'women', label: 'WOMEN', route: 'store.women.navi' },
        { id: 'men', label: 'MEN', route: 'store.men.navi' },
        { id: 'unisex', label: 'UNISEX', route: 'store.unisex.navi' }
    ];

    return (
        <div className="flex justify-center space-x-10 md:space-x-14 py-8 bg-gray-50/50">
            {tabs.map((tab) => (
                <Link
                    key={tab.id}
                    href={`/ph/en/${tab.id}-navi`}
                    className={`text-[10px] md:text-[11px] font-black tracking-[0.4em] uppercase pb-2 relative transition-all duration-500 group
                        ${activeSection === tab.id ? 'text-black opacity-100' : 'text-black opacity-20 hover:opacity-100'}`}
                >
                    {tab.label}
                    <div className={`absolute bottom-0 left-0 h-[2px] bg-[#E60012] transition-all duration-500 ease-in-out
                        ${activeSection === tab.id ? 'w-full opacity-100 scale-x-100' : 'w-0 opacity-0 scale-x-0 group-hover:w-full group-hover:opacity-40 group-hover:scale-x-100'}`} 
                    />
                </Link>
            ))}
        </div>
    );
}
