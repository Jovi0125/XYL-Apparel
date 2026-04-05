import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import StorefrontHeader from '@/Components/storefront/StorefrontHeader';
import HeroMedia from '@/Components/storefront/HeroMedia';
import HeroContent from '@/Components/storefront/HeroContent';
import FloatingBottomNav from '@/Components/storefront/FloatingBottomNav';
import ScrollProgressIndicator from '@/Components/storefront/ScrollProgressIndicator';
import OpeningTransition from '@/Components/storefront/OpeningTransition';
import StorefrontCategoryOverlay from '@/Components/storefront/StorefrontCategoryOverlay';
import LoginRequiredModal from '@/Components/storefront/LoginRequiredModal';

export default function StorefrontIndex({ storefrontConfigs = [], initialActive, categoryGroups = {} }) {
    const [activeCategory, setActiveCategory] = useState(initialActive);
    const [isSplashActive, setIsSplashActive] = useState(true);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [scrollOpacity, setScrollOpacity] = useState(1);

    const handleHomeReset = () => {
        setIsSearchActive(false);
        setIsLoginModalOpen(false);
        if (window.location.pathname !== '/') {
            router.get('/');
        } else {
            setActiveCategory(storefrontConfigs[0]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

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

            <div className={`transition-opacity duration-1000 ease-out ${isSplashActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <StorefrontHeader categories={storefrontConfigs} />
                <ScrollProgressIndicator />

                <LoginRequiredModal 
                    isOpen={isLoginModalOpen} 
                    onClose={() => setIsLoginModalOpen(false)} 
                />

                <StorefrontCategoryOverlay 
                    isOpen={isSearchActive} 
                    onClose={() => setIsSearchActive(false)}
                    categoryGroups={categoryGroups}
                />

                <main className="fixed inset-0 w-full h-screen z-0">
                    <HeroMedia src={activeCategory.videoSrc} key={activeCategory.slug} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    <div 
                        className="absolute bottom-32 md:bottom-28 left-8 md:left-14 max-w-xl z-20 transition-all duration-1000"
                        style={{ 
                            opacity: (isSearchActive || isLoginModalOpen) ? 0 : scrollOpacity, 
                            pointerEvents: (isSearchActive || isLoginModalOpen) ? 'none' : 'auto',
                            transform: `translateY(${(1 - scrollOpacity) * 30}px)` 
                        }}
                    >
                        <HeroContent config={activeCategory} />
                    </div>
                </main>

                <div className="fixed bottom-12 inset-x-0 z-[200] flex justify-center pointer-events-none px-4">
                    <FloatingBottomNav 
                        isSearchActive={isSearchActive}
                        onSearchToggle={() => setIsSearchActive(!isSearchActive)}
                        onHomeClick={handleHomeReset}
                        onProfileClick={() => setIsLoginModalOpen(true)}
                    />
                </div>
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
