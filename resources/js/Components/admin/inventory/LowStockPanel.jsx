import React from 'react';

export default function LowStockPanel({ products = [], thresholds = { critical: 5, low: 15 } }) {
    return (
        <div className="bg-slate-900/80 border border-slate-800/50 rounded-2xl p-6 h-full backdrop-blur-sm relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Low Stock Alerts
                </h3>

                <div className="flex items-center gap-4 text-[10px] font-bold tracking-wider uppercase">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span className="text-slate-500">Critical ≤ {thresholds.critical}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span className="text-slate-500">Low ≤ {thresholds.low}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-slate-500">Healthy &gt; {thresholds.low}</span>
                    </div>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center mb-4 text-slate-500">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="text-sm text-slate-400">All inventory levels healthy</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {products.slice(0, 5).map((product) => (
                        <div key={product.id} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/30 flex items-center justify-between group hover:border-slate-600 transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-lg bg-slate-900 border border-slate-700/30 overflow-hidden shadow-inner flex-shrink-0">
                                     {product.main_image ? (
                                        <img src={product.main_image.image_url} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    ) : <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600 text-xs font-bold uppercase">X</div>}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-white truncate max-w-[140px] uppercase tracking-tight">{product.title}</p>
                                    <p className="text-[10px] text-slate-500 font-medium">{product.category?.name} • {product.total_stock} Units</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 flex-1 justify-end ml-4">
                                <div className="flex-1 max-w-[100px]">
                                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${product.stock_statusColor} transition-all duration-500`}
                                            style={{ width: `${Math.min(100, product.stock_percentageComputed || 0)}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 px-2 py-1 rounded border border-slate-800 min-w-[40px] text-center">
                                    <span className={`text-[10px] font-bold ${product.stock_statusLabel === 'Critical' ? 'text-rose-500' : 'text-amber-500'}`}>
                                        {Math.round(product.stock_percentageComputed || 0)}%
                                    </span>
                                </div>
                                <svg className="w-4 h-4 text-slate-700 group-hover:text-slate-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    ))}
                    {products.length > 5 && (
                        <p className="text-center text-[10px] font-bold text-slate-500 pt-2 hover:text-amber-400 transition-colors cursor-pointer uppercase tracking-widest">
                            + {products.length - 5} additional alerts below limit
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
