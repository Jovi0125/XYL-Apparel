import React from 'react';
import { Link } from 'react-router-dom';

export default function SidebarLink({ href, active = false, children }) {
    return (
        <Link
            to={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                ${active
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
        >
            {children}
        </Link>
    );
}
