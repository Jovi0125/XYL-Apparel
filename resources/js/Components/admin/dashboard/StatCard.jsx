import React from 'react';

const StatCard = ({ 
    title, 
    value, 
    icon, 
    trend = null, 
    trendLabel = "",
    emptyMessage = "No data at the moment",
    gradient = "from-transparent to-transparent"
}) => {
    const hasData = value !== null && value !== undefined;
    
    const getTrendColor = () => {
        if (!trend) return '';
        return trend > 0 ? 'text-emerald-600' : 'text-rose-500';
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
        <div className="relative overflow-hidden rounded-xl bg-white border border-gray-100 p-6 transition-all duration-300 hover:border-gray-200 hover:shadow-md group">
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-[10px] font-bold tracking-[0.15em] uppercase">
                        {title}
                    </span>
                    <div className="p-2 rounded-lg bg-gray-50 text-gray-400 group-hover:text-black transition-colors">
                        {icon}
                    </div>
                </div>
                
                {/* Value */}
                {hasData ? (
                    <>
                        <div className="text-3xl font-black text-black mb-2 tracking-tight">
                            {value}
                        </div>
                        
                        {/* Trend indicator — keeping green/red as requested */}
                        {trend !== null && (
                            <div className={`flex items-center gap-1.5 text-sm ${getTrendColor()}`}>
                                {getTrendIcon()}
                                <span className="font-semibold">{Math.abs(trend)}%</span>
                                {trendLabel && (
                                    <span className="text-gray-400 ml-1">{trendLabel}</span>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center h-14">
                        <span className="text-gray-400 text-sm">
                            {emptyMessage}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
