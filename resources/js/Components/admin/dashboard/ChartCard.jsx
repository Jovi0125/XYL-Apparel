import React from 'react';
import EmptyState from './EmptyState';

const ChartCard = ({ 
    title, 
    subtitle = null, 
    children, 
    isEmpty = false,
    emptyMessage = "No data available",
    emptyIcon = null,
    className = "",
    headerAction = null
}) => {
    return (
        <div className={`relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm ${className}`}>
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-teal-500/5 pointer-events-none" />
            
            {/* Header */}
            <div className="relative z-10 px-6 pt-6 pb-4 border-b border-slate-800/30">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-white tracking-tight">
                            {title}
                        </h3>
                        {subtitle && (
                            <p className="text-slate-500 text-sm mt-0.5">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {headerAction && (
                        <div>
                            {headerAction}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 p-6">
                {isEmpty ? (
                    <EmptyState 
                        message={emptyMessage} 
                        icon={emptyIcon}
                        className="min-h-[200px]"
                    />
                ) : (
                    children
                )}
            </div>
        </div>
    );
};

export default ChartCard;
