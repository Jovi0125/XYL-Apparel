import React from 'react';

export default function ProductOptions({ data, setData, errors }) {
    const warrantyOptions = ['No Warranty', '7 Days', '30 Days', '1 Year'];
    const colorOptions = [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Red', hex: '#EF4444' },
        { name: 'Blue', hex: '#3B82F6' },
        { name: 'Green', hex: '#10B981' },
        { name: 'Yellow', hex: '#F59E0B' },
        { name: 'Pink', hex: '#EC4899' },
        { name: 'Purple', hex: '#8B5CF6' },
    ];
    const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    const toggleColor = (color) => {
        const exists = data.colors.includes(color);
        if (exists) {
            setData('colors', data.colors.filter(c => c !== color));
        } else {
            setData('colors', [...data.colors, color]);
        }
    };

    const toggleSize = (size) => {
        const exists = data.sizes.includes(size);
        if (exists) {
            setData('sizes', data.sizes.filter(s => s !== size));
        } else {
            setData('sizes', [...data.sizes, size]);
        }
    };

    const handleTagsInput = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            e.preventDefault();
            const tag = e.target.value.trim();
            if (!data.tags.includes(tag)) {
                setData('tags', [...data.tags, tag]);
            }
            e.target.value = '';
        }
    };

    const removeTag = (tag) => {
        setData('tags', data.tags.filter(t => t !== tag));
    };

    return (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5 pointer-events-none" />
            
            <div className="relative p-6 space-y-5">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                    </div>
                    Product Options
                </h3>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Warranty</label>
                    <select
                        value={data.warranty}
                        onChange={(e) => setData('warranty', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    >
                        {warrantyOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">Colors</label>
                    <div className="flex flex-wrap gap-3">
                        {colorOptions.map(color => (
                            <button
                                key={color.name}
                                type="button"
                                onClick={() => toggleColor(color.name)}
                                className={`group relative w-12 h-12 rounded-xl border-2 transition-all ${
                                    data.colors.includes(color.name)
                                        ? 'border-blue-500 scale-110'
                                        : 'border-slate-700 hover:border-slate-600'
                                }`}
                                title={color.name}
                            >
                                <div
                                    className="w-full h-full rounded-lg"
                                    style={{ backgroundColor: color.hex }}
                                />
                                {data.colors.includes(color.name) && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">Sizes</label>
                    <div className="flex flex-wrap gap-2">
                        {sizeOptions.map(size => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => toggleSize(size)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    data.sizes.includes(size)
                                        ? 'bg-blue-500/20 border-2 border-blue-500/50 text-blue-400'
                                        : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:border-slate-600/50'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Tags</label>
                    <input
                        type="text"
                        onKeyDown={handleTagsInput}
                        placeholder="Type and press Enter to add tags"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                    {data.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {data.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm text-blue-400"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-blue-300"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
