import React, { useState, useEffect } from 'react';

export default function ScrollProgressIndicator() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            setProgress(scrolled);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed right-6 md:right-12 top-1/2 -translate-y-1/2 z-[110] flex flex-col items-center space-y-4 pointer-events-none">
            {/* Minimal Boutique Rail */}
            <div className="flex flex-col items-center gap-2 opacity-20">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-[1.2px] h-[1.2px] bg-white rounded-full" />
                ))}
            </div>
            
            <div className="relative h-32 w-[1.2px] bg-white/5 rounded-full overflow-hidden">
                <div 
                    className="absolute top-0 left-0 w-full bg-white transition-all duration-100 ease-out" 
                    style={{ height: `${progress}%` }}
                />
            </div>

            <div className="flex flex-col items-center gap-2 opacity-20">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-[1.2px] h-[1.2px] bg-white rounded-full" />
                ))}
            </div>
            
            <span className="text-[9px] font-black tracking-[0.3em] uppercase rotate-90 mt-10 opacity-30 select-none">XYLO</span>
        </div>
    );
}
