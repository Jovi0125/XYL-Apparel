import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function ReviewsIndex({ reviews = [] }) {
    const toggleApproval = (id) => {
        router.post(`/admin/reviews/${id}/toggle`, {}, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Product Reviews" activeItem="reviews">
            <Head title="Reviews & Moderation | XYLO Admin" />
            <div className="max-w-[90rem] mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">Review Moderation</h1>
                    <p className="text-sm text-slate-400 mt-1">Moderate customer sentiments and scores.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.length > 0 ? reviews.map(review => (
                        <div key={review.id} className="bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent pointer-events-none" />
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-white font-medium text-sm">{review.buyer_name}</div>
                                    <div className="flex gap-1 text-amber-400 text-xs tracking-widest bg-amber-400/10 px-2 py-1 rounded-full border border-amber-400/20">
                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                    </div>
                                </div>
                                <div className="text-xs text-slate-400 mb-4 border-b border-slate-800/50 pb-3">
                                    Product: <span className="text-teal-400 font-medium">{review.product_title}</span>
                                </div>
                                <p className="text-sm text-slate-300 italic font-light">
                                    "{review.comment || 'No comment provided.'}"
                                </p>
                            </div>
                            
                            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800/50 relative z-10">
                                <span className="text-xs text-slate-500 font-mono">{review.date}</span>
                                <button 
                                    onClick={() => toggleApproval(review.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border ${review.is_approved ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'}`}
                                >
                                    {review.is_approved ? 'Hide' : 'Approve'}
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 text-center bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm rounded-2xl text-slate-500">
                            No product reviews have been gathered yet.
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
