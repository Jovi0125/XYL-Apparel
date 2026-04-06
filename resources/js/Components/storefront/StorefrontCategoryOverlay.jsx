import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function StorefrontCategoryOverlay({ isOpen, onClose, categoryGroups = {} }) {
    const { url } = usePage();
    const parentTabs = ['women', 'men', 'unisex'];
    
    // Initialize the active tab based on the current URL context
    const getInitialTab = () => {
        // Handle /ph/en/women-navi OR /ph/en/women
        const path = url.split('/')[3]; 
        const baseSlug = (path || '').replace('-navi', '');
        return parentTabs.includes(baseSlug) ? baseSlug : 'women';
    };

    const [activeTab, setActiveTab] = useState(getInitialTab);
    const [searchQuery, setSearchQuery] = useState('');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        router.get(`/ph/en/${tab}-navi`);
    };

    // Sync state if user navigates while overlay is closed
    useEffect(() => {
        if (!isOpen) setActiveTab(getInitialTab());
    }, [url, isOpen]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            // Already in -navi mode, just ensure we're on the right navi tab
            router.get(`/ph/en/${activeTab}-navi`);
        } else {
            // Keep search within localized context
            router.get(`/ph/en/${activeTab}?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const children = (categoryGroups[activeTab] || []).filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[250] bg-white flex flex-col animate-in fade-in slide-in-from-bottom duration-500 fill-mode-both overflow-hidden">
            {/* Header / Search Area */}
            <div className="h-20 border-b border-gray-100 flex items-center justify-between px-6 md:px-12 bg-white sticky top-0">
                <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl">
                    <input 
                        type="text" 
                        placeholder={`Search in ${activeTab.toUpperCase()}...`}
                        className="w-full border-none focus:ring-0 text-xl font-light placeholder-gray-300 bg-transparent text-black uppercase tracking-widest"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                </form>
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
                        onClick={() => handleTabChange(tab)}
                        className={`text-[10px] font-black tracking-[0.4em] uppercase pb-2 relative transition-all duration-500
                            ${activeTab === tab ? 'text-black opacity-100' : 'text-black opacity-20 hover:opacity-60'}`}
                    >
                        {tab}
                        <div className={`absolute bottom-0 left-0 h-[2px] bg-black transition-all duration-500 ease-in-out
                            ${activeTab === tab ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
                    </button>
                ))}
            </div>

            {/* Dynamic Child Grid Area */}
            <div className="flex-1 overflow-y-auto px-6 md:px-12 py-10 no-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10 max-w-6xl mx-auto pb-32">
                    {children.length > 0 ? children.map(cat => (
                        <Link 
                            key={cat.id} 
                            href={`/ph/en/${activeTab}-navi/${cat.slug}`}
                            className="group flex flex-col items-start border-b border-gray-50 pb-4 hover:border-black transition-all duration-500"
                        >
                            <span className="text-[11px] font-black tracking-[0.2em] text-gray-900 mb-1">
                                {cat.name.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-gray-400 font-light italic uppercase tracking-wider">
                                View Collection
                            </span>
                        </Link>
                    )) : (
                        <div className="col-span-full text-center py-20 text-gray-300 text-[10px] font-black uppercase tracking-[0.3em] italic">
                            No matching items in {activeTab}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
