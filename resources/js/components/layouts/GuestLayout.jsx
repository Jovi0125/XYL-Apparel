import React from 'react';

export default function GuestLayout({ title, children }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <a href="/" className="inline-flex items-center gap-2">
                        <span className="text-2xl font-bold tracking-[0.2em] uppercase text-gray-900">XYLO</span>
                        <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">Apparel</span>
                    </a>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    {title && <h2 className="text-xl font-semibold text-gray-900 mb-6">{title}</h2>}
                    {children}
                </div>
            </div>
        </div>
    );
}
