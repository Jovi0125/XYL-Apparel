import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function RiderLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-black flex">
            {/* Sidebar */}
            <aside className="w-56 bg-white border-r border-gray-100 hidden md:flex flex-col flex-shrink-0">
                <div className="p-5 border-b border-gray-100">
                    <Link href="/rider/dashboard">
                        <h1 className="text-lg font-black text-black tracking-[0.15em] uppercase">
                            XYLO<span className="text-[#E60012]">.</span>
                        </h1>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold -mt-0.5">Rider Portal</p>
                    </Link>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    <Link
                        href="/rider/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium bg-black text-white"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                        </svg>
                        My Deliveries
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-2 mb-3">
                        {/* Rider ID badge */}
                        {auth?.user?.rider_number && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest bg-[#E60012]/10 text-[#E60012] border border-[#E60012]/20 uppercase">
                                {auth.user.rider_number}
                            </span>
                        )}
                    </div>
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
                <header className="h-14 bg-white border-b border-gray-100 flex items-center px-6 md:px-8 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="md:hidden text-sm font-black tracking-[0.15em]">XYLO<span className="text-[#E60012]">.</span></span>
                        <span className="hidden md:block text-xs font-semibold text-black uppercase tracking-wider">
                            Delivery Rider Portal
                        </span>
                    </div>
                    {auth?.user?.rider_number && (
                        <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest bg-[#E60012]/10 text-[#E60012] border border-[#E60012]/20 uppercase">
                            {auth.user.rider_number}
                        </span>
                    )}
                </header>

                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
