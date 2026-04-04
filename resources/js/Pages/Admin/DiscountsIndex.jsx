import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import DiscountForm from '../../Components/admin/DiscountForm';
import DiscountGrid from '../../Components/admin/DiscountGrid';

export default function DiscountsIndex({ discounts = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // Filter discounts based on search and filters
    const filteredDiscounts = discounts.filter(discount => {
        const matchesSearch = discount.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            discount.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            discount.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' || discount.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || discount.status === statusFilter;
        
        return matchesSearch && matchesType && matchesStatus;
    });

    return (
        <AdminLayout title="Discounts" activeItem="marketing">
            <Head title="Discount Codes" />

            {/* Page Background Gradient */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT: Discount Form */}
                    <div className="lg:col-span-1">
                        <DiscountForm />
                    </div>

                    {/* CENTER/RIGHT: Discounts Display */}
                    <div className="lg:col-span-2">
                        {/* Filters Bar */}
                        <div className="mb-6">
                            <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm p-6">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />
                                
                                <div className="relative z-10 space-y-4">
                                    {/* Search Bar */}
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search discounts by title or code..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                        />
                                    </div>

                                    {/* Filters */}
                                    <div className="flex flex-wrap gap-3">
                                        {/* Discount Type Filter */}
                                        <select
                                            value={typeFilter}
                                            onChange={(e) => setTypeFilter(e.target.value)}
                                            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                        >
                                            <option value="all">All Types</option>
                                            <option value="percentage">Percentage</option>
                                            <option value="fixed">Fixed Amount</option>
                                        </select>

                                        {/* Status Filter */}
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>

                                        {/* Results Count */}
                                        <div className="flex-1 flex items-center justify-end">
                                            <span className="text-sm text-slate-400">
                                                {filteredDiscounts.length} {filteredDiscounts.length === 1 ? 'discount' : 'discounts'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Discounts Grid */}
                        <DiscountGrid discounts={filteredDiscounts} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
