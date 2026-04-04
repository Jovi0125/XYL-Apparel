import React from 'react';

export default function ProductBasicInfo({ data, setData, errors }) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5 pointer-events-none" />
            
            <div className="relative p-6 space-y-5">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    Basic Information
                </h3>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Product Title <span className="text-rose-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Enter product name"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                    {errors.title && <p className="mt-1 text-sm text-rose-400">{errors.title}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Short Description <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                        value={data.short_description}
                        onChange={(e) => setData('short_description', e.target.value)}
                        placeholder="Brief product description (1-2 sentences)"
                        rows={2}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                    {errors.short_description && <p className="mt-1 text-sm text-rose-400">{errors.short_description}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Detailed Description <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                        value={data.detailed_description}
                        onChange={(e) => setData('detailed_description', e.target.value)}
                        placeholder="Complete product description with all details"
                        rows={6}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                    {errors.detailed_description && <p className="mt-1 text-sm text-rose-400">{errors.detailed_description}</p>}
                </div>
            </div>
        </div>
    );
}
