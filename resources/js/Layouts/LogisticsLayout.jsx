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
            <aside className="w-56 bg-white border-r border-gray-100 hidden md:flex flex-col flex-shrink-0">
                <div className="p-5 border-b border-gray-100">
                    <Link href="/logistics/dashboard">
                        <h1 className="text-lg font-black text-black tracking-[0.15em] uppercase">
                            XYLO<span className="text-[#E60012]">.</span>
                        </h1>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold -mt-0.5">Apparel Logistics</p>
                    </Link>
                </div>
                
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navLinks.map((link) => {
                        const isActive = currentUrl.startsWith(link.href);
                        return (
                            <Link 
                                key={link.href}
                                href={link.href} 
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                                    ${isActive 
                                        ? 'bg-black text-white' 
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
                    <div className="flex items-center gap-3 px-2">
                        <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-bold text-black truncate">{auth?.user?.name}</p>
                            <p className="text-[10px] text-gray-400 truncate">{auth?.user?.email}</p>
                        </div>
                        <button 
                            onClick={() => router.post('/logout')}
                            className="p-2 rounded-lg text-gray-400 hover:text-[#E60012] hover:bg-red-50 transition-colors"
                            title="Sign Out"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="h-14 bg-white border-b border-gray-100 flex items-center px-6 md:px-8 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Mobile Logo */}
                        <span className="md:hidden text-sm font-black tracking-[0.15em]">XYLO<span className="text-[#E60012]">.</span></span>
                        <span className="hidden md:block text-xs font-semibold text-black uppercase tracking-wider">
                            Logistics Management
                        </span>
                    </div>
                </header>
                
                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
