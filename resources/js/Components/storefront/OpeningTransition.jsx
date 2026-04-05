import React from 'react';

export default function OpeningTransition({ isActive, onComplete }) {
    React.useEffect(() => {
        if (isActive) {
            const timer = setTimeout(onComplete, 2200);
            return () => clearTimeout(timer);
        }
    }, [isActive]);

    return (
        <div className={`fixed inset-0 z-[1000] bg-[#050505] flex flex-col items-center justify-center transition-all duration-[1200ms] ease-in-out ${isActive ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
            <div className="flex flex-col items-center text-center">
                <span className="text-white text-[24px] md:text-[28px] font-black tracking-[1em] uppercase ml-[1em] animate-pulse">XYLO</span>
                <div className="w-8 h-[1px] bg-white/10 mt-10" />
            </div>
        </div>
    );
}
