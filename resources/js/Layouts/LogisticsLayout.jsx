import React from 'react';
import { usePage, router } from '@inertiajs/react';

export default function LogisticsLayout({ children, title }) {
    const { auth } = usePage().props;

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] font-sans text-slate-200">
            {/* Minimal Header */}
            <header className="bg-slate-900 border-b border-slate-800/50 sticky top-0 z-40 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none" />
                <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 relative z-10">
                        {/* Logo Left */}
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <span className="text-white font-bold text-lg">X</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-tight">XYLO</h1>
                                <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold -mt-0.5">Logistics Terminal</p>
                            </div>
                        </div>

                        {/* Title Bar Center */}
                        <div className="hidden lg:flex">
                            <span className="text-slate-400 text-sm">{title || 'Dashboard'}</span>
                        </div>

                        {/* Auth Right */}
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-semibold text-white">{auth?.user?.name}</div>
                                <div className="text-xs text-slate-500 capitalize">{auth?.user?.role || 'Logistics Staff'}</div>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/50 flex items-center justify-center text-blue-400 font-bold shadow-inner">
                                {auth?.user?.name?.charAt(0) || 'L'}
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-red-400 hover:bg-slate-800/50 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Page Content */}
            <main className="py-8">
                {children}
            </main>
        </div>
    );
}
