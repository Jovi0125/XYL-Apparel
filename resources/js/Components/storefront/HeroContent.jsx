import React from 'react';

export default function HeroContent({ config }) {
    return (
        <div className="flex flex-col items-start space-y-4 animate-in fade-in slide-in-from-left duration-1000 fill-mode-both">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/50">
                {config.intro}
            </span>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-none text-white transition-all uppercase">
                {config.title}
            </h1>
            <p className="text-sm md:text-base font-light text-white/60 max-w-sm leading-relaxed tracking-wide">
                {config.description}
            </p>
            <div className="pt-6">
                <button className="px-10 py-3.5 border border-white/10 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-white hover:text-black hover:border-white transition-all duration-500">
                    Explore Now
                </button>
            </div>
        </div>
    );
}
