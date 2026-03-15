import React from 'react';

export default function AuthLayout({ children, title }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-widest">XYLO APPAREL</h1>
                    <p className="text-gray-400 mt-2 text-sm">Modern Fashion Marketplace</p>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {title && <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">{title}</h2>}
                    {children}
                </div>
            </div>
        </div>
    );
}
