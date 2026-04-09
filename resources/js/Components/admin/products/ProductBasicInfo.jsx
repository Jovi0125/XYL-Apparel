import React from 'react';

export default function ProductBasicInfo({ data, setData, errors }) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 ">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent pointer-events-none" />
            
            <div className="relative p-6 space-y-5">
                <h3 className="text-lg font-semibold text-black">
                    Basic Information
                </h3>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Product Title <span className="text-rose-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Enter product name"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                    {errors.title && <p className="mt-1 text-sm text-rose-400">{errors.title}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Short Description <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                        value={data.short_description}
                        onChange={(e) => setData('short_description', e.target.value)}
                        placeholder="Brief product description (1-2 sentences)"
                        rows={2}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                    {errors.short_description && <p className="mt-1 text-sm text-rose-400">{errors.short_description}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Detailed Description <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                        value={data.detailed_description}
                        onChange={(e) => setData('detailed_description', e.target.value)}
                        placeholder="Complete product description with all details"
                        rows={6}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                    {errors.detailed_description && <p className="mt-1 text-sm text-rose-400">{errors.detailed_description}</p>}
                </div>
            </div>
        </div>
    );
}
