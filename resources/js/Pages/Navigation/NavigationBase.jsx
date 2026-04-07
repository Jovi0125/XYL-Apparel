import React from 'react';
import { Head } from '@inertiajs/react';
import TopHeader from '@/Components/navigation/TopHeader';
import CategoryGrid from '@/Components/navigation/CategoryGrid';
import SearchField from '@/Components/navigation/SearchField';
import NavBottomBar from '@/Components/navigation/NavBottomBar';

export default function NavigationBase({ categories, activeSection, children }) {
    return (
        <div className="relative min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white transition-opacity duration-700 animate-in fade-in">
            <Head title={`Search ${activeSection.toUpperCase()} | XYLO APPAREL`} />

            {/* Premium Unified Header */}
            <TopHeader activeSection={activeSection} />

            {/* Scrollable Content Area */}
            <main className="pt-24">
                {/* Results/Category Grid */}
                <div className="py-8">
                    <CategoryGrid categories={categories} />
                </div>

                {children}
            </main>

            {/* Interaction Layer */}
            <SearchField activeSection={activeSection} />
            <NavBottomBar activeCategory={activeSection} />

            {/* Hide main system scrollbar during search mode */}
            <style dangerouslySetInnerHTML={{ __html: `
                body { overflow-x: hidden; background: white; }
                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
            `}} />
        </div>
    );
}
