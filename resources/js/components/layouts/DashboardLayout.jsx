import React from 'react';

export default function DashboardLayout({ sidebar, pageTitle, children }) {
    const [mobileMenu, setMobileMenu] = React.useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between">
                <span className="text-lg font-bold tracking-[0.15em] uppercase text-gray-900">XYLO</span>
                <button onClick={() => setMobileMenu(!mobileMenu)} className="p-2 text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform duration-200
                ${mobileMenu ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <a href="/" className="flex items-center gap-2">
                        <span className="text-lg font-bold tracking-[0.15em] uppercase text-gray-900">XYLO</span>
                        <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">Apparel</span>
                    </a>
                </div>
                <nav className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
                    {sidebar}
                </nav>
            </aside>

            {/* Overlay */}
            {mobileMenu && (
                <div className="fixed inset-0 z-40 bg-black/20 lg:hidden" onClick={() => setMobileMenu(false)} />
            )}

            {/* Main Content */}
            <main className="lg:ml-64 pt-14 lg:pt-0">
                <div className="px-4 sm:px-6 lg:px-8 py-8">
                    {pageTitle && (
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">{pageTitle}</h1>
                    )}
                    {children}
                </div>
            </main>
        </div>
    );
}
