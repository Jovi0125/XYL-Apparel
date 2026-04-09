import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function DiscountForm({ editingDiscount, onCancelEdit }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
        type: 'percentage',
        value: '',
        code: '',
        description: '',
        usage_limit: '',
        expires_at: '',
        status: 'active',
    });

    useEffect(() => {
        if (editingDiscount) {
            setData({
                title: editingDiscount.title || '',
                type: editingDiscount.type || 'percentage',
                value: editingDiscount.value || '',
                code: editingDiscount.code || '',
                description: editingDiscount.description || '',
                usage_limit: editingDiscount.usage_limit || '',
                expires_at: editingDiscount.expires_at || '',
                status: editingDiscount.status || 'active',
            });
        } else {
            reset();
        }
    }, [editingDiscount]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingDiscount) {
            put(`/admin/discounts/${editingDiscount.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onCancelEdit();
                    reset();
                },
            });
        } else {
            post('/admin/discounts', {
                preserveScroll: true,
                onSuccess: () => reset(),
            });
        }
    };

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setData('code', code);
    };

    return (
        <div className="sticky top-6">
            <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 ">
                {/* Card Glow Effect */}
                <div className="absolute inset-0 bg-transparent pointer-events-none" />
                
                {/* Header */}
                <div className="relative px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-black shadow-md">
                            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-black">
                                {editingDiscount ? 'Edit Discount' : 'Create Discount'}
                            </h2>
                            <p className="text-sm text-gray-400">
                                {editingDiscount ? 'Update existing promotional code' : 'Add a new promotional code'}
                            </p>
                        </div>
                        {editingDiscount && (
                            <button
                                type="button"
                                onClick={onCancelEdit}
                                className="ml-auto p-2 text-gray-400 hover:text-black bg-gray-50 rounded-lg transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="relative p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Title <span className="text-rose-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="e.g. Summer Sale 2024"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-emerald-500/50 transition-all"
                        />
                        {errors.title && <p className="mt-1 text-sm text-rose-400">{errors.title}</p>}
                    </div>

                    {/* Discount Type & Value Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Discount Type <span className="text-rose-400">*</span>
                            </label>
                            <select
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-emerald-500/50 transition-all"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (₱)</option>
                            </select>
                            {errors.type && <p className="mt-1 text-sm text-rose-400">{errors.type}</p>}
                        </div>

                        {/* Value */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                {data.type === 'percentage' ? 'Percentage (%)' : 'Amount (₱)'} <span className="text-rose-400">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={data.value}
                                    onChange={(e) => setData('value', e.target.value)}
                                    placeholder={data.type === 'percentage' ? '10' : '100'}
                                    min="0"
                                    max={data.type === 'percentage' ? '100' : undefined}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-emerald-500/50 transition-all"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <span className="text-gray-400 text-sm">
                                        {data.type === 'percentage' ? '%' : '₱'}
                                    </span>
                                </div>
                            </div>
                            {errors.value && <p className="mt-1 text-sm text-rose-400">{errors.value}</p>}
                        </div>
                    </div>

                    {/* Discount Code */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Discount Code <span className="text-rose-400">*</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                placeholder="e.g. SUMMER10"
                                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-emerald-500/50 transition-all"
                            />
                            <button
                                type="button"
                                onClick={generateCode}
                                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 hover:text-black hover:border-emerald-500/50 transition-all"
                                title="Generate Code"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>
                        {errors.code && <p className="mt-1 text-sm text-rose-400">{errors.code}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Description <span className="text-gray-400">(Optional)</span>
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Describe what this discount is for..."
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-emerald-500/50 transition-all"
                        />
                    </div>

                    {/* Usage Limit & Expiration Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Usage Limit */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Usage Limit <span className="text-gray-400">(Optional)</span>
                            </label>
                            <input
                                type="number"
                                value={data.usage_limit}
                                onChange={(e) => setData('usage_limit', e.target.value)}
                                placeholder="Unlimited"
                                min="1"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-emerald-500/50 transition-all"
                            />
                        </div>

                        {/* Expiration Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Expires On <span className="text-gray-400">(Optional)</span>
                            </label>
                            <input
                                type="date"
                                value={data.expires_at}
                                onChange={(e) => setData('expires_at', e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-emerald-500/50 transition-all [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Status <span className="text-rose-400">*</span>
                        </label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setData('status', 'active')}
                                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                                    data.status === 'active'
                                        ? 'bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400'
                                        : 'bg-gray-50 border border-gray-200 text-gray-400 hover:border-gray-200/50'
                                }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${data.status === 'active' ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                                    Active
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setData('status', 'inactive')}
                                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                                    data.status === 'inactive'
                                        ? 'bg-gray-100 border-2 border-gray-300 text-gray-600'
                                        : 'bg-gray-50 border border-gray-200 text-gray-400 hover:border-gray-200/50'
                                }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${data.status === 'inactive' ? 'bg-gray-400' : 'bg-gray-500'}`} />
                                    Inactive
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full relative overflow-hidden group px-6 py-4 bg-black rounded-xl font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative flex items-center justify-center gap-2">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            {processing ? (editingDiscount ? 'Updating...' : 'Creating...') : (editingDiscount ? 'Update Discount' : 'Create Discount')}
                        </span>
                    </button>
                    {editingDiscount && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            disabled={processing}
                            className="w-full px-6 py-3 bg-gray-50 border border-gray-200 text-gray-400 hover:text-black rounded-xl font-semibold transition-all mt-3"
                        >
                            Cancel Editing
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}
