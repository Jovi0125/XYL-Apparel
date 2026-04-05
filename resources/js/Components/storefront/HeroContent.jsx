import React from 'react';

export default function HeroContent({ config }) {
    return (
        <div className="flex flex-col items-start space-y-3 md:space-y-4 animate-in fade-in slide-in-from-left duration-1000 fill-mode-both">
            {/* Editorial Marker */}
            <span className="text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase text-white/50">
                {config.intro}
            </span>
            
            {/* Title: Fluid resizing for small screens */}
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold tracking-tighter leading-none text-white uppercase max-w-[12rem] sm:max-w-none">
                {config.title}
            </h1>
            
            {/* Description: Narrower on mobile for better stacking */}
            <p className="text-[12px] md:text-base font-light text-white/60 max-w-[15rem] md:max-w-sm leading-relaxed tracking-wide">
                {config.description}
            </p>
            
            <div className="pt-4 md:pt-6">
                <button className="px-7 md:px-10 py-3 md:py-3.5 border border-white/20 text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-white hover:text-black hover:border-white transition-all duration-500">
                    Explore Now
                </button>
            </div>
        </div>
    );
}
