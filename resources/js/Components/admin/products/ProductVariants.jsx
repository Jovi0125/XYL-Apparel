import React from 'react';

export default function ProductVariants({ data, setData, errors }) {
    const addVariant = () => {
        setData('variants', [
            ...data.variants,
            { size: '', stock: '', regular_price: '', sale_price: '' }
        ]);
    };

    const updateVariant = (index, field, value) => {
        const newVariants = [...data.variants];
        newVariants[index][field] = value;
        setData('variants', newVariants);
    };

    const removeVariant = (index) => {
        setData('variants', data.variants.filter((_, i) => i !== index));
    };

    return (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-teal-500/5 pointer-events-none" />
            
            <div className="relative p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                            </svg>
                        </div>
                        Product Variants
                    </h3>
                    <button
                        type="button"
                        onClick={addVariant}
                        className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm text-blue-400 hover:bg-blue-500/30 transition-all"
                    >
                        + Add Variant
                    </button>
                </div>

                {data.variants.length > 0 && (
                    <div className="space-y-3">
                        {data.variants.map((variant, index) => (
                            <div key={index} className="grid grid-cols-5 gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                                <select
                                    value={variant.size}
                                    onChange={(e) => updateVariant(index, 'size', e.target.value)}
                                    className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                >
                                    <option value="" disabled>Select Size</option>
                                    <option value="XS">XS</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                    <option value="XXL">XXL</option>
                                </select>
                                <input
                                    type="number"
                                    value={variant.stock}
                                    onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                                    placeholder="Stock"
                                    min="0"
                                    className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    value={variant.regular_price}
                                    onChange={(e) => updateVariant(index, 'regular_price', e.target.value)}
                                    placeholder="Regular Price"
                                    className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    value={variant.sale_price}
                                    onChange={(e) => updateVariant(index, 'sale_price', e.target.value)}
                                    placeholder="Sale Price (Opt)"
                                    className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeVariant(index)}
                                    className="px-3 py-2 bg-rose-500/20 border border-rose-500/30 rounded-lg text-rose-400 hover:bg-rose-500/30 transition-all"
                                >
                                    <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
