import React, { useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function LoginRequiredModal({ isOpen, onClose }) {
    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 isolate">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Box */}
            <div className="relative w-full max-w-sm bg-white rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 fill-mode-both">
                
                {/* Header */}
                <div className="px-6 py-5 flex items-center justify-between border-b border-gray-50">
                    <h2 className="text-[12px] font-black tracking-[0.3em] uppercase text-black">
                        Login Required
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-50 rounded-full transition-colors text-black"
                        aria-label="Close modal"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body Area */}
                <div className="px-6 py-10 text-center">
                    <p className="text-[13px] text-gray-500 font-medium tracking-wide">
                        Please go to the login page.
                    </p>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0">
                    <button
                        onClick={() => router.get('/login')}
                        className="w-full py-4 bg-black text-white text-[10px] font-black tracking-[0.3em] uppercase hover:bg-gray-900 transition-all rounded-sm shadow-lg shadow-black/10 active:scale-[0.98]"
                        aria-label="Confirm login"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}
