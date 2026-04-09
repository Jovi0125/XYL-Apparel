import React from 'react';

const CategoryEmptyState = () => {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100  p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                </div>
                
                <h3 className="text-xl font-semibold text-black mb-2">
                    No categories yet
                </h3>
                <p className="text-gray-400 mb-6 max-w-sm">
                    Create your first category to start organizing your products.
                </p>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span>Use the form on the left to add a category</span>
                </div>
            </div>
        </div>
    );
};

export default CategoryEmptyState;
