import React from 'react';

export default function LowStockPanel({ products = [] }) {
    return (
        <div className="bg-slate-900/80 border border-slate-800/50 rounded-2xl p-6 h-full backdrop-blur-sm">
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Low Stock Alerts
            </h3>

            {products.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center opacity-50">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center mb-4 text-slate-500">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="text-sm text-slate-400">All inventory levels healthy</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {products.slice(0, 8).map((product) => (
                        <div key={product.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 flex items-center justify-between group hover:border-amber-500/30 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-900 overflow-hidden">
                                     {product.main_image ? (
                                        <img src={product.main_image.image_url} className="w-full h-full object-cover" />
                                    ) : <div className="w-full h-full bg-slate-900" />}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">{product.title}</p>
                                    <p className="text-[10px] text-slate-500">{product.category?.name}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-xs font-bold ${product.stock_percentage <= 20 ? 'text-rose-500' : 'text-amber-500'}`}>
                                    {Math.round(product.stock_percentage)}%
                                </p>
                                <p className="text-[10px] text-slate-600">{product.total_stock} Left</p>
                            </div>
                        </div>
                    ))}
                    {products.length > 8 && (
                        <p className="text-center text-[10px] text-slate-500 pt-2 hover:text-emerald-400 cursor-pointer">
                            + {products.length - 8} more alerts
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
