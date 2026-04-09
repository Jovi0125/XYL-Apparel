import React from 'react';

export default function ProductInventory({ data, setData, errors }) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 ">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent pointer-events-none" />
            
            <div className="relative p-6 space-y-4">
                <h3 className="text-lg font-semibold text-black">
                    Inventory
                </h3>

                {data.variants.length === 0 ? (
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Stock Quantity <span className="text-rose-400">*</span>
                        </label>
                        <input
                            type="number"
                            value={data.stock}
                            onChange={(e) => setData('stock', e.target.value)}
                            placeholder="0"
                            min="0"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        />
                        {errors.stock && <p className="mt-1 text-sm text-rose-400">{errors.stock}</p>}
                    </div>
                ) : (
                    <div className="p-4 bg-gray-100/30 rounded-xl border border-gray-100">
                        <p className="text-sm text-gray-400">
                            Stock is managed per variant. Total stock: {' '}
                            <span className="font-semibold text-black">
                                {data.variants.reduce((sum, v) => sum + (parseInt(v.stock) || 0), 0)} units
                            </span>
                        </p>
                    </div>
                )}

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <p className="text-sm text-gray-500">
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
