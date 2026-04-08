import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function LogisticsLayout({ children }) {
    const { auth } = usePage().props;
    const page = usePage();
    const currentUrl = page.url || '';

    const navLinks = [
        { 
            label: 'Dashboard', 
            href: '/logistics/dashboard', 
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-black flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col flex-shrink-0">
                <div className="p-6 border-b border-gray-100">
                    <Link href="/logistics/dashboard">
                        <h1 className="text-lg font-black tracking-[0.2em] uppercase">
                            XYLO<span className="text-[#E60012]">.</span>LOG
                        </h1>
                        <p className="text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase mt-1">Supply Chain Portal</p>
                    </Link>
                </div>
                
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navLinks.map((link) => {
                        const isActive = currentUrl.startsWith(link.href);
                        return (
                            <Link 
                                key={link.href}
                                href={link.href} 
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[11px] font-bold tracking-[0.15em] uppercase transition-all
                                    ${isActive 
                                        ? 'bg-black text-white shadow-sm' 
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                                    }`}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="px-4 py-3">
                        <p className="text-[11px] font-bold truncate">{auth?.user?.name}</p>
                        <p className="text-[9px] text-gray-400 truncate mt-0.5">{auth?.user?.email}</p>
                    </div>
                    <Link 
                        href="/logout" 
                        method="post" 
                        as="button" 
                        className="w-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#E60012] hover:bg-red-50 rounded-lg transition-colors text-left"
                    >
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-8 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Mobile Logo */}
                        <span className="md:hidden text-sm font-black tracking-[0.2em]">XYLO<span className="text-[#E60012]">.</span>LOG</span>
                        <span className="hidden md:block text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                            Logistics Management
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">{auth?.user?.name}</span>
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black">
                            {auth?.user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                    </div>
                </header>
                
                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
