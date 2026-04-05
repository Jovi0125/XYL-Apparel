import React from 'react';

export default function OpeningTransition({ isActive, onComplete }) {
    React.useEffect(() => {
        if (isActive) {
            const timer = setTimeout(onComplete, 2200);
            return () => clearTimeout(timer);
        }
    }, [isActive]);

    return (
        <div className={`fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center transition-all duration-[1200ms] ease-in-out ${isActive ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
            <div className="flex flex-col items-center">
                <span className="text-white text-3xl font-black tracking-[0.8em] uppercase ml-[0.8em] animate-pulse">XYLO</span>
                <div className="w-12 h-[1px] bg-white/20 mt-6" />
            </div>
        </div>
    );
}
