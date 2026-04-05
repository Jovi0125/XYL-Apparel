import React, { useEffect, useState } from 'react';

export default function SplashOverlay({ isActive, onComplete }) {
    const [render, setRender] = useState(isActive);

    useEffect(() => {
        if (!isActive) {
            const timeout = setTimeout(() => setRender(false), 1500); 
            return () => clearTimeout(timeout);
        }
    }, [isActive]);

    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 2200);
        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!render) return null;

    return (
        <div 
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-all duration-[1200ms] ease-[cubic-bezier(0.7,0,0.3,1)]
                ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}
            aria-hidden="true"
        >
            <div className="flex items-center gap-1 shrink-0 animate-pulse">
                <div className="bg-[#E60012] text-white font-bold text-3xl leading-none w-16 h-16 flex items-center justify-center select-none shadow-lg">
                    XY
                </div>
                <div className="bg-[#E60012] text-white font-bold text-3xl leading-none w-16 h-16 flex items-center justify-center select-none shadow-lg">
                    LO
                </div>
            </div>
        </div>
    );
}
