import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import StorefrontHeader from '@/Components/storefront/StorefrontHeader';
import HeroMedia from '@/Components/storefront/HeroMedia';
import HeroContent from '@/Components/storefront/HeroContent';
import FloatingBottomNav from '@/Components/storefront/FloatingBottomNav';
import ScrollProgressIndicator from '@/Components/storefront/ScrollProgressIndicator';
import OpeningTransition from '@/Components/storefront/OpeningTransition';

export default function StorefrontIndex({ storefrontConfigs = [], initialActive }) {
    // Synchronize state with initialActive passed from Laravel
    const [activeCategory, setActiveCategory] = useState(initialActive);
    const [isSplashActive, setIsSplashActive] = useState(true);
    const [scrollOpacity, setScrollOpacity] = useState(1);

    // React to initialActive changes during inertial navigation
    useEffect(() => {
        setActiveCategory(initialActive);
    }, [initialActive]);

    useEffect(() => {
        const handleScroll = () => {
            const opacity = Math.max(0, 1 - window.scrollY / 500);
            setScrollOpacity(opacity);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative min-h-[400vh] bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-white/20">
            <Head title={`XYLO | ${activeCategory.label}`} />

            <OpeningTransition isActive={isSplashActive} onComplete={() => setIsSplashActive(false)} />

            <StorefrontHeader categories={storefrontConfigs} />

            <ScrollProgressIndicator />

            <main className="fixed inset-0 w-full h-screen z-0">
                {/* 
                   Forcing a unique key per source ensures the video 
                   reloads and transitions smoothly during route changes 
                */}
                <HeroMedia src={activeCategory.videoSrc} key={activeCategory.slug} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                <div 
                    className="absolute bottom-24 left-8 md:left-14 max-w-xl z-20 transition-all duration-1000"
                    style={{ opacity: scrollOpacity, transform: `translateY(${(1 - scrollOpacity) * 30}px)` }}
                >
                    <HeroContent config={activeCategory} />
                </div>
            </main>

            <div className="fixed bottom-12 inset-x-0 z-50 flex justify-center pointer-events-none">
                <FloatingBottomNav onHomeClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @media (min-width: 1024px) {
                    html { scrollbar-width: none; }
                    ::-webkit-scrollbar { display: none; }
                }
            `}} />
        </div>
    );
}
