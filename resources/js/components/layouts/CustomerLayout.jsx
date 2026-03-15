import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
    { label: 'Dashboard', path: '/customer/dashboard', icon: '🏠' },
    { label: 'Shop', path: '/customer/browse', icon: '🛍️' },
    { label: 'Cart', path: '/customer/cart', icon: '🛒' },
    { label: 'Orders', path: '/customer/orders', icon: '📦' },
    { label: 'Wishlist', path: '/customer/wishlist', icon: '❤️' },
    { label: 'Profile', path: '/customer/profile', icon: '👤' },
];

export default function CustomerLayout({ children, title }) {
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="px-6 py-5 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 tracking-wide">XYLO APPAREL</h2>
                </div>
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                                location.pathname.startsWith(item.path)
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="px-3 py-4 border-t border-gray-200">
                    <form method="POST" action="/logout">
                        <input type="hidden" name="_token" value={window.__INITIAL_DATA__?.csrfToken} />
                        <button type="submit" className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:text-gray-800 transition">
                            🚪 Logout
                        </button>
                    </form>
                </div>
            </aside>

            <main className="flex-1 p-8">
                {title && <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>}
                {children}
            </main>
        </div>
    );
}
