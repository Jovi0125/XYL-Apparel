import React from 'react';

const StatCard = ({ 
    title, 
    value, 
    icon, 
    trend = null, 
    trendLabel = "",
    emptyMessage = "No data at the moment",
    gradient = "from-blue-500/10 to-cyan-500/10"
}) => {
    const hasData = value !== null && value !== undefined;
    
    const getTrendColor = () => {
        if (!trend) return '';
        return trend > 0 ? 'text-emerald-400' : 'text-rose-400';
    };

    const getTrendIcon = () => {
        if (!trend) return null;
        return trend > 0 ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
        ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
        );
    };

    return (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-slate-700/50 hover:shadow-lg hover:shadow-blue-500/5 group">
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            {/* Subtle glow effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-400 text-sm font-medium tracking-wide uppercase">
                        {title}
                    </span>
                    <div className="p-2.5 rounded-xl bg-slate-800/50 text-slate-400 group-hover:text-blue-400 transition-colors">
                        {icon}
                    </div>
                </div>
                
                {/* Value */}
                {hasData ? (
                    <>
                        <div className="text-3xl font-bold text-white mb-2 tracking-tight">
                            {value}
                        </div>
                        
                        {/* Trend indicator */}
                        {trend !== null && (
                            <div className={`flex items-center gap-1.5 text-sm ${getTrendColor()}`}>
                                {getTrendIcon()}
                                <span className="font-semibold">{Math.abs(trend)}%</span>
                                {trendLabel && (
                                    <span className="text-slate-500 ml-1">{trendLabel}</span>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center h-14">
                        <span className="text-slate-500 text-sm">
                            {emptyMessage}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
