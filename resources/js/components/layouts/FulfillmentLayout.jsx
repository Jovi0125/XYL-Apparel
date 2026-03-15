import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
    { label: 'Dashboard', path: '/fulfillment/dashboard', icon: '📊' },
    { label: 'Orders', path: '/fulfillment/orders', icon: '📋' },
    { label: 'Shipments', path: '/fulfillment/shipments', icon: '🚚' },
];

export default function FulfillmentLayout({ children, title }) {
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="w-64 bg-blue-900 text-white flex flex-col">
                <div className="px-6 py-5 border-b border-blue-700">
                    <h2 className="text-xl font-bold tracking-wide">XYLO Fulfillment</h2>
                </div>
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                                location.pathname.startsWith(item.path)
                                    ? 'bg-blue-600 text-white'
                                    : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                            }`}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="px-3 py-4 border-t border-blue-700">
                    <form method="POST" action="/logout">
                        <input type="hidden" name="_token" value={window.__INITIAL_DATA__?.csrfToken} />
                        <button type="submit" className="w-full text-left px-4 py-2 text-sm text-blue-300 hover:text-white transition">
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
