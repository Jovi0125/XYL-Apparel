import React from 'react';
import { useForm } from '@inertiajs/react';

export default function SystemInventorySettings({ thresholds }) {
    const { data, setData, post, processing } = useForm({
        critical_stock_threshold: thresholds.critical || 5,
        low_stock_threshold: thresholds.low || 15,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.inventory.updateThresholds'), {
            preserveScroll: true,
        });
    };

    return (
        <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100  h-full flex flex-col">
            <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-black">System Inventory Settings</h3>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between group cursor-pointer">
                            <label className="text-sm text-gray-600">Critical Stock Threshold</label>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-black">≤</span>
                                <input
                                    type="number"
                                    value={data.critical_stock_threshold}
                                    onChange={e => setData('critical_stock_threshold', e.target.value)}
                                    className="w-12 bg-transparent text-black text-right font-semibold focus:outline-none focus:ring-0 border-none p-0"
                                />
                                <span className="text-sm text-gray-400">Units</span>
                                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex items-center justify-between group cursor-pointer">
                            <label className="text-sm text-gray-600">Low Stock Threshold</label>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-black">≤</span>
                                <input
                                    type="number"
                                    value={data.low_stock_threshold}
                                    onChange={e => setData('low_stock_threshold', e.target.value)}
                                    className="w-12 bg-transparent text-black text-right font-semibold focus:outline-none focus:ring-0 border-none p-0"
                                />
                                <span className="text-sm text-gray-400">Units</span>
                                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-100/30 p-4 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-400 leading-relaxed">
                            These thresholds determine when stock is considered low or critical across all products.
                        </p>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 px-4 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl transition-all shadow-md disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
