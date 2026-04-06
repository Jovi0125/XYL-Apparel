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
                <img 
                    src="/images/xylo-logo.png" 
                    alt="XYLO APPAREL" 
                    className="h-16 md:h-24 w-auto animate-pulse"
                />
                <div className="w-12 h-[1px] bg-white/10 mt-12" />
            </div>
        </div>
    );
}
