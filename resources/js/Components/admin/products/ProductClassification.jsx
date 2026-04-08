import React, { useMemo } from 'react';

export default function ProductClassification({ data, setData, categories, errors }) {
    const parentCategories = ['Men', 'Women', 'Unisex'];

    // Filter child categories to only show those belonging to the selected parent
    const filteredCategories = useMemo(() => {
        if (!data.parent_category) return [];
        return categories.filter(cat => 
            cat.parent_category && 
            cat.parent_category.toLowerCase() === data.parent_category.toLowerCase() &&
            cat.parent_id !== null
        );
    }, [categories, data.parent_category]);

    const handleParentChange = (e) => {
        const newParent = e.target.value;
        setData(prev => ({
            ...prev,
            parent_category: newParent,
            category_id: '', // Reset child category when parent changes
        }));
    };

    return (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-teal-500/5 pointer-events-none" />
            
            <div className="relative p-6 space-y-5">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </div>
                    Classification
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Parent Category <span className="text-rose-400">*</span>
                        </label>
                        <select
                            value={data.parent_category}
                            onChange={handleParentChange}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        >
                            <option value="">Select parent</option>
                            {parentCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        {errors.parent_category && <p className="mt-1 text-sm text-rose-400">{errors.parent_category}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Category <span className="text-rose-400">*</span>
                        </label>
                        <select
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            disabled={!data.parent_category}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <option value="">{data.parent_category ? 'Select category' : 'Select parent first'}</option>
                            {filteredCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {errors.category_id && <p className="mt-1 text-sm text-rose-400">{errors.category_id}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
