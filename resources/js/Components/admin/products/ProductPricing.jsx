import React from 'react';

export default function ProductPricing({ data, setData, discounts, errors }) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 ">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent pointer-events-none" />
            
            <div className="relative p-6 space-y-5">
                <h3 className="text-lg font-semibold text-black">
                    Pricing
                </h3>


                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Apply Discount Code <span className="text-gray-400">(Optional)</span>
                    </label>
                    <select
                        value={data.discount_code_id}
                        onChange={(e) => setData('discount_code_id', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
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
