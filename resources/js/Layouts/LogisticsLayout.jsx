import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function LogisticsLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-[#0A0A0A] hidden md:flex flex-col">
                <div className="p-8">
                    <h1 className="text-xl font-black tracking-[0.3em] italic">XYLO<span className="text-white/20">.LOG</span></h1>
                </div>
                
                <nav className="flex-1 px-4 space-y-2">
                    <Link href="/logistics/dashboard" className="flex items-center space-x-3 px-4 py-3 bg-white/5 rounded-xl text-sm font-bold tracking-widest uppercase transition-all hover:bg-white/10">
                        Dashboard
                    </Link>
                </nav>

                <div className="p-8 border-t border-white/5">
                    <Link href="/logout" method="post" as="button" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
                        Logout
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8">
                    <h2 className="text-[10px] font-bold tracking-[0.4em] text-white/40 uppercase">Terminal Context / Dashboard</h2>
                    <div className="flex items-center space-x-4">
                        <span className="text-[10px] font-black uppercase tracking-widest">{auth.user.name}</span>
                    </div>
                </header>
                
                <div className="p-8 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
