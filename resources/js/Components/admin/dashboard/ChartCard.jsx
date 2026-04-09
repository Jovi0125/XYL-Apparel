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
        <div className={`relative overflow-hidden rounded-xl bg-white border border-gray-100 ${className}`}>
            {/* Header */}
            <div className="relative z-10 px-6 pt-6 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-black tracking-tight uppercase">
                            {title}
                        </h3>
                        {subtitle && (
                            <p className="text-gray-400 text-xs mt-0.5">
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
