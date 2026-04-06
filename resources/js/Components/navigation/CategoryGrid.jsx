import React from 'react';
import { Link } from '@inertiajs/react';

export default function CategoryGrid({ categories }) {
    if (!categories || categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="text-[10px] font-black uppercase text-gray-300 tracking-[0.3em] italic mb-2">Collection empty</span>
                <p className="text-[12px] text-gray-200">New items arriving soon.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-10 max-w-6xl mx-auto pb-64 px-8 md:px-14">
            {categories.map((cat) => (
                <Link 
                    key={cat.id} 
                    href="#" // Placeholder for specific collection route
                    className="group flex flex-col items-start border-b border-gray-50 pb-5 hover:border-black transition-all duration-700"
                >
                    <div className="flex flex-col items-start">
                        <span className="text-[11px] md:text-[12px] font-black tracking-[0.25em] text-gray-900 group-hover:text-black transition-colors mb-1 uppercase">
                            {cat.name}
                        </span>
                        <div className="flex items-center space-x-2">
                             <span className="text-[9px] md:text-[10px] text-gray-400 font-light italic uppercase tracking-widest group-hover:text-black/60 transition-colors">
                                View Collection
                            </span>
                            <div className="w-0 group-hover:w-6 h-[0.5px] bg-black/40 transition-all duration-700" />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
