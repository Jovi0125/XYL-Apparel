import React, { useState, useRef, useEffect } from 'react';

export default function DiscountCard({ discount, onEdit, onDelete }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const formatValue = () => {
        if (discount.type === 'percentage') {
            return `${discount.value}%`;
        }
        return `₱${parseFloat(discount.value).toLocaleString()}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const isExpired = () => {
        if (!discount.expires_at) return false;
        return new Date(discount.expires_at) < new Date();
    };

    const getStatusColor = () => {
        if (isExpired()) return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
        if (discount.status === 'active') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    };

    const getStatusText = () => {
        if (isExpired()) return 'Expired';
        return discount.status === 'active' ? 'Active' : 'Inactive';
    };

    const getTypeColor = () => {
        return discount.type === 'percentage'
            ? 'bg-teal-500/20 text-teal-400 border-teal-500/30'
            : 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    };

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            {/* Header */}
            <div className="relative p-5 border-b border-slate-800/50">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        {/* Title */}
                        <h3 className="text-lg font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                            {discount.title}
                        </h3>
                        
                        {/* Discount Code */}
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span className="text-sm font-mono font-semibold text-white tracking-wider">
                                {discount.code}
                            </span>
                        </div>
                    </div>

                    {/* Actions Dropdown */}
                    <div className="relative" ref={menuRef}>
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`p-2 rounded-lg transition-all ${
                                isMenuOpen ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>

                        {isMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-32 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                                <button 
                                    onClick={() => {
                                        onEdit(discount);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                                <button 
                                    onClick={() => {
                                        onDelete(discount.id);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors border-t border-slate-700/50"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Archive
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="relative p-5 space-y-4">
                {/* Value Display */}
                <div className="flex items-center justify-center py-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/20">
                    <span className="text-3xl font-bold text-emerald-400">
                        {formatValue()}
                    </span>
                    <span className="ml-2 text-sm text-slate-400">OFF</span>
                </div>

                {/* Badges Row */}
                <div className="flex flex-wrap gap-2">
                    {/* Type Badge */}
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getTypeColor()}`}>
                        {discount.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                    </span>
                    
                    {/* Status Badge */}
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor()}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            isExpired() ? 'bg-rose-400' : 
                            discount.status === 'active' ? 'bg-emerald-400' : 'bg-slate-400'
                        }`} />
                        {getStatusText()}
                    </span>
                </div>

                {/* Description */}
                {discount.description && (
                    <p className="text-sm text-slate-400 line-clamp-2">
                        {discount.description}
                    </p>
                )}

                {/* Meta Info */}
                <div className="pt-3 border-t border-slate-800/50 space-y-2">
                    {/* Usage Info */}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Usage
                        </span>
                        <span className="text-slate-300 font-medium">
                            {discount.times_used || 0}
                            {discount.usage_limit ? ` / ${discount.usage_limit}` : ' / ∞'}
                        </span>
                    </div>

                    {/* Expiration Info */}
                    {discount.expires_at && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {isExpired() ? 'Expired' : 'Expires'}
                            </span>
                            <span className={`font-medium ${isExpired() ? 'text-rose-400' : 'text-slate-300'}`}>
                                {formatDate(discount.expires_at)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
