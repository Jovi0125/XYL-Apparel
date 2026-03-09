import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ role, children, bottomItems }) {
    const navigate = useNavigate();

    const handleSignOut = () => {
        axios.post('/logout').then(() => {
            window.location.href = '/login';
        }).catch(() => {
            window.location.href = '/login';
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div>
                <div className="px-3 mb-4">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{role}</span>
                </div>
                <div className="space-y-1">
                    {children}
                </div>
            </div>
            <div className="mt-auto border-t border-gray-100 pt-4 space-y-1">
                {bottomItems}
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition w-full"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                </button>
            </div>
        </div>
    );
}
