import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export default function AdminLayout({ children, title }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: DashboardIcon, current: true },
        { name: 'Products', href: '#', icon: ProductsIcon, current: false },
        { name: 'Categories', href: '#', icon: CategoriesIcon, current: false },
        { name: 'Orders', href: '#', icon: OrdersIcon, current: false },
        { name: 'Shipments', href: '#', icon: ShipmentsIcon, current: false },
    ];

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                {/* Logo */}
                <div className="flex items-center justify-center h-16 bg-gray-900">
                    <span className="text-2xl font-bold text-white">
                        XYLO<span className="text-indigo-500">.</span>
                    </span>
                </div>

                {/* Navigation */}
                <nav className="mt-8 px-4">
                    <ul className="space-y-2">
                        {navigation.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                        item.current
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* User section at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                    {auth?.user?.name?.charAt(0) || 'A'}
                                </span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-white">{auth?.user?.name || 'Admin'}</p>
                                <p className="text-xs text-gray-400">Administrator</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
                            title="Logout"
                        >
                            <LogoutIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-gray-800 border-b border-gray-700 lg:px-8">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 text-gray-400 rounded-lg lg:hidden hover:bg-gray-700 hover:text-white"
                    >
                        <MenuIcon className="w-6 h-6" />
                    </button>
                    
                    <h1 className="text-xl font-semibold text-white">{title || 'Dashboard'}</h1>

                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white">
                            <BellIcon className="w-6 h-6" />
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

// Icon components
function DashboardIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    );
}

function ProductsIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    );
}

function CategoriesIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
    );
}

function OrdersIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
    );
}

function ShipmentsIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
    );
}

function MenuIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}

function BellIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    );
}

function LogoutIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    );
}
