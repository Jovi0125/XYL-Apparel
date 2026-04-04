import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AdminSidebar from '../Components/admin/AdminSidebar';

export default function AdminLayout({ children, title, activeItem = 'dashboard' }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(true)}
                className="fixed top-4 left-4 z-30 p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 lg:hidden transition-colors"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Sidebar - Desktop always visible, Mobile conditional */}
            <div className={`
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
                fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-out
            `}>
                <AdminSidebar activeItem={activeItem} />
                
                {/* Mobile Close Button */}
                {mobileMenuOpen && (
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white lg:hidden"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Main Content */}
            <div className="lg:pl-72">
                {/* Top Header Bar */}
                <header className="sticky top-0 z-20 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
                    <div className="flex items-center justify-between h-full px-4 lg:px-8">
                        {/* Page Title */}
                        <div className="flex items-center gap-4">
                            <div className="w-10 lg:hidden" /> {/* Spacer for mobile menu button */}
                            <h1 className="text-lg font-semibold text-white">{title || 'Dashboard'}</h1>
                        </div>

                        {/* Header Actions */}
                        <div className="flex items-center gap-2">
                            {/* Search */}
                            <button className="p-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </button>

                            {/* Notifications */}
                            <button className="relative p-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                </svg>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-violet-500 rounded-full ring-2 ring-slate-900"></span>
                            </button>

                            {/* Quick Actions */}
                            <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                <span>New Order</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
