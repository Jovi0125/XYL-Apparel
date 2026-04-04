import React from 'react';
import EmptyState from './EmptyState';

const TableCard = ({ 
    title, 
    subtitle = null,
    columns = [],
    data = [],
    emptyMessage = "No data available",
    emptyIcon = null,
    className = "",
    headerAction = null
}) => {
    const isEmpty = !data || data.length === 0;

    const emptyTableIcon = (
        <svg 
            className="w-12 h-12 text-slate-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
        >
            <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
            />
        </svg>
    );

    return (
        <div className={`relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm ${className}`}>
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-blue-500/5 pointer-events-none" />
            
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
            <div className="relative z-10">
                {isEmpty ? (
                    <EmptyState 
                        message={emptyMessage} 
                        icon={emptyIcon || emptyTableIcon}
                        className="min-h-[200px] py-12"
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800/30">
                                    {columns.map((col, index) => (
                                        <th 
                                            key={index}
                                            className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                                        >
                                            {col.header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/30">
                                {data.map((row, rowIndex) => (
                                    <tr 
                                        key={rowIndex}
                                        className="hover:bg-slate-800/30 transition-colors duration-150"
                                    >
                                        {columns.map((col, colIndex) => (
                                            <td 
                                                key={colIndex}
                                                className="px-6 py-4 whitespace-nowrap"
                                            >
                                                {col.render 
                                                    ? col.render(row[col.accessor], row) 
                                                    : row[col.accessor]
                                                }
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TableCard;
