import React from 'react';

export default function DiscountEmptyState() {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />
            
            <div className="relative px-8 py-16 flex flex-col items-center justify-center text-center">
                {/* Icon */}
                <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/20">
                        <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </div>
                    {/* Decorative rings */}
                    <div className="absolute inset-0 w-20 h-20 rounded-2xl border border-emerald-500/10 animate-ping" style={{ animationDuration: '3s' }} />
                </div>

                {/* Text */}
                <h3 className="text-xl font-semibold text-white mb-2">
                    No discount codes yet
                </h3>
                <p className="text-slate-400 max-w-sm">
                    Create your first discount code to offer promotional deals to your customers.
                </p>

                {/* Arrow pointing to form */}
                <div className="mt-8 flex items-center gap-2 text-emerald-400">
                    <svg className="w-5 h-5 animate-bounce-x" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-sm font-medium">Use the form to create one</span>
                </div>
            </div>

            <style jsx>{`
                @keyframes bounce-x {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(-5px); }
                }
                .animate-bounce-x {
                    animation: bounce-x 1s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
