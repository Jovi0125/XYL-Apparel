import React from 'react';

export default function InventoryOverview({ data = [] }) {
    if (!data || data.length === 0) {
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

    const total = data.reduce((acc, curr) => acc + curr.count, 0);
    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

    return (
        <div className="bg-slate-900/80 border border-slate-800/50 rounded-2xl p-6 h-full backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                </svg>
                Overview
            </h3>

            <div className="flex flex-col items-center gap-8">
                {/* Manual SVG Pie Chart */}
                <div className="relative w-40 h-40">
                    <svg viewBox="0 0 32 32" className="w-full h-full transform -rotate-90">
                        {data.map((item, i) => {
                            const offset = data.slice(0, i).reduce((acc, curr) => acc + (curr.count / total) * 100, 0);
                            return (
                                <circle
                                    key={i}
                                    cx="16" cy="16" r="16"
                                    fill="transparent"
                                    stroke={colors[i % colors.length]}
                                    strokeWidth="32"
                                    strokeDasharray={`${(item.count / total) * 100} 100`}
                                    strokeDashoffset={-offset}
                                />
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-slate-900 rounded-full w-28 h-28 flex flex-col items-center justify-center shadow-inner border border-slate-800/50">
                            <span className="text-2xl font-bold text-white">{total}</span>
                            <span className="text-[10px] uppercase tracking-wider text-slate-500">Items</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 flex-1 w-full">
                    {data.map((item, i) => (
                        <div key={i} className="flex items-center justify-between group">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: colors[i % colors.length] }} />
                                <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{item.category}</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-300">{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
