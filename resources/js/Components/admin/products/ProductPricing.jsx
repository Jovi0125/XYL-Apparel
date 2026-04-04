import React from 'react';

export default function ProductPricing({ data, setData, discounts, errors }) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5 pointer-events-none" />
            
            <div className="relative p-6 space-y-5">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    Pricing
                </h3>


                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Apply Discount Code <span className="text-slate-500">(Optional)</span>
                    </label>
                    <select
                        value={data.discount_code_id}
                        onChange={(e) => setData('discount_code_id', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    >
                        <option value="">No discount</option>
                        {discounts.map(discount => (
                            <option key={discount.id} value={discount.id}>
                                {discount.code} - {discount.formatted_value} OFF
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
