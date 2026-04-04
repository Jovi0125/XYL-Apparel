import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AdminSidebar from '../Components/admin/layout/AdminSidebar';
import AdminHeader from '../Components/admin/layout/AdminHeader';

export default function AdminLayout({ children, title, activeItem = 'dashboard' }) {
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
            <div className="lg:pl-64 min-h-screen flex flex-col">
                {/* Top Header Bar */}
                <AdminHeader title={title} />

                {/* Page Content */}
                <main className="p-4 lg:p-8 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
