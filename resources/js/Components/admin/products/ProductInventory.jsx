import React from 'react';

export default function ProductInventory({ data, setData, errors }) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-teal-500/5 pointer-events-none" />
            
            <div className="relative p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    Inventory
                </h3>

                {data.variants.length === 0 ? (
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Stock Quantity <span className="text-rose-400">*</span>
                        </label>
                        <input
                            type="number"
                            value={data.stock}
                            onChange={(e) => setData('stock', e.target.value)}
                            placeholder="0"
                            min="0"
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        />
                        {errors.stock && <p className="mt-1 text-sm text-rose-400">{errors.stock}</p>}
                    </div>
                ) : (
                    <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                        <p className="text-sm text-slate-400">
                            Stock is managed per variant. Total stock: {' '}
                            <span className="font-semibold text-white">
                                {data.variants.reduce((sum, v) => sum + (parseInt(v.stock) || 0), 0)} units
                            </span>
                        </p>
                    </div>
                )}

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <p className="text-sm text-blue-400">
                        <svg className="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Stock movements will be tracked automatically after product creation
                    </p>
                </div>
            </div>
        </div>
    );
}
