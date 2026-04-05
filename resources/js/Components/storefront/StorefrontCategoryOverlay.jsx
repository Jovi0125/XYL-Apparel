import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function StorefrontCategoryOverlay({ isOpen, onClose, categoryGroups = {} }) {
    const parentTabs = ['women', 'men', 'unisex'];
    const [activeTab, setActiveTab] = useState('women');
    const [searchQuery, setSearchQuery] = useState('');

    const children = (categoryGroups[activeTab] || []).filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] bg-white flex flex-col animate-in fade-in slide-in-from-bottom duration-500 fill-mode-both overflow-hidden">
            {/* Header / Search Area */}
            <div className="h-20 border-b border-gray-100 flex items-center justify-between px-6 md:px-12 bg-white sticky top-0">
                <div className="flex-1 max-w-xl">
                    <input 
                        type="text" 
                        placeholder="Search categories..."
                        className="w-full border-none focus:ring-0 text-xl font-light placeholder-gray-300 bg-transparent text-black"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                </div>
                <button onClick={onClose} className="p-2 hover:opacity-50 transition-opacity">
                    <svg className="w-8 h-8 text-black stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Parent Tabs Overlay Selector */}
            <div className="flex justify-center space-x-12 py-8 bg-gray-50/50">
                {parentTabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-[10px] font-[900] tracking-[0.3em] uppercase pb-2 relative transition-all
                            ${activeTab === tab ? 'text-black opacity-100' : 'text-black opacity-30 hover:opacity-100'}`}
                    >
                        {tab}
                        {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />}
                    </button>
                ))}
            </div>

            {/* Dynamic Child Grid Area */}
            <div className="flex-1 overflow-y-auto px-6 md:px-12 py-10 no-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10 max-w-6xl mx-auto pb-32">
                    {children.length > 0 ? children.map(cat => (
                        <Link 
                            key={cat.id} 
                            href={`/${activeTab}?cat=${cat.id}`}
                            className="group flex flex-col items-start border-b border-gray-50 pb-2 hover:border-black transition-all"
                        >
                            <span className="text-[12px] font-black tracking-widest text-gray-900 mb-1">
                                {cat.name.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-gray-400 font-light truncate w-full italic">
                                {cat.description}
                            </span>
                        </Link>
                    )) : (
                        <div className="col-span-full text-center py-20 text-gray-300 text-sm italic tracking-widest">
                            No matching collections found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
