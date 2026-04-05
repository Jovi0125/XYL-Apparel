import React from 'react';

export default function InventoryOverview({ data }) {
    const categories = data?.categories || [];
    const total = data?.totalItems || 0;

    if (categories.length === 0) {
        return (
            <div className="bg-slate-900/80 border border-slate-800/50 rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                </div>
                <h3 className="text-slate-300 font-medium">No inventory data yet</h3>
            </div>
        );
    }

    const colors = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

    return (
        <div className="bg-slate-900/80 border border-slate-800/50 rounded-2xl p-6 h-full backdrop-blur-sm relative overflow-hidden flex flex-col items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="w-full flex items-center justify-between mb-8">
                <h3 className="text-white text-sm font-bold tracking-widest uppercase flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Overview
                </h3>
                <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                    Real-time
                </div>
            </div>

            {/* Wheel Chart Container */}
            <div className="relative w-64 h-64 mb-8">
                {/* Decorative Outer Ring */}
                <div className="absolute inset-0 rounded-full border border-slate-800/50 scale-[1.02]" />
                <div className="absolute inset-0 rounded-full border border-slate-700/10 scale-105" />

                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="bg-slate-900 rounded-full w-40 h-40 flex flex-col items-center justify-center shadow-2xl border border-slate-800/80 relative overflow-hidden">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/5 to-transparent opacity-50" />
                        <span className="text-4xl font-black text-white tracking-tighter drop-shadow-lg">{total}</span>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black mt-1">Units</span>
                    </div>
                </div>

                <svg viewBox="0 0 32 32" className="w-full h-full transform -rotate-90">
                    {/* Gauge-like background circle */}
                    <circle
                        cx="16" cy="16" r="14"
                        fill="transparent"
                        stroke="rgba(255,255,255,0.02)"
                        strokeWidth="3"
                        className="pointer-events-none"
                    />
                    {categories.map((item, i) => {
                        const percentage = (item.count / total) * 100;
                        const offset = categories.slice(0, i).reduce((acc, curr) => acc + (curr.count / total) * 100, 0);
                        return (
                            <circle
                                key={i}
                                cx="16" cy="16" r="14"
                                fill="transparent"
                                stroke={colors[i % colors.length]}
                                strokeWidth="3"
                                strokeDasharray={`${percentage} 100`}
                                strokeDashoffset={-offset}
                                strokeLinecap="butt"
                                className="transition-all duration-1000 ease-in-out hover:opacity-80 cursor-pointer"
                            />
                        );
                    })}
                </svg>
            </div>

            <div className="w-full grid grid-cols-1 gap-5 px-4 mb-2">
                {categories.map((item, i) => (
                    <div key={i} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full shadow-lg shadow-current" style={{ color: colors[i % colors.length], backgroundColor: colors[i % colors.length] }} />
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-white uppercase tracking-wider group-hover:text-blue-400 transition-colors">{item.category}</span>
                                <span className="text-[10px] text-slate-500 font-bold tracking-widest">{item.count} UNITS</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-black text-white">{item.percentage}%</span>
                            <div className="w-16 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-current opacity-30" style={{ color: colors[i % colors.length], width: `${item.percentage}%` }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
