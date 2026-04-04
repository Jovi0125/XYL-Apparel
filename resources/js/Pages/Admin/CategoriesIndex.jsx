import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import CategoryForm from '../../Components/admin/categories/CategoryForm';
import CategoryGrid from '../../Components/admin/categories/CategoryGrid';

export default function CategoriesIndex({ categories = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [parentFilter, setParentFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [editingCategory, setEditingCategory] = useState(null);

    const handleEdit = (category) => {
        setEditingCategory(category);
        // Scroll to form on mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to archive this category? It will be moved to the System Archive.')) {
            router.delete(`/admin/categories/${id}`, {
                preserveScroll: true,
            });
        }
    };

    // Filter categories based on search and filters
    const filteredCategories = categories.filter(category => {
        const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            category.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesParent = parentFilter === 'all' || category.parent_category === parentFilter;
        const matchesStatus = statusFilter === 'all' || category.status === statusFilter;
        
        return matchesSearch && matchesParent && matchesStatus;
    });

    return (
        <AdminLayout title="Categories" activeItem="catalog">
            <Head title="Categories" />

            {/* Page Background Gradient */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT: Category Form */}
                    <div className="lg:col-span-1">
                        <CategoryForm 
                            editingCategory={editingCategory} 
                            onCancelEdit={() => setEditingCategory(null)} 
                        />
                    </div>

                    {/* CENTER/RIGHT: Categories Display */}
                    <div className="lg:col-span-2">
                        {/* Filters Bar */}
                        <div className="mb-6">
                            <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm p-6">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-teal-500/5 pointer-events-none" />
                                
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
                                            placeholder="Search categories..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                        />
                                    </div>

                                    {/* Filters */}
                                    <div className="flex flex-wrap gap-3">
                                        {/* Parent Category Filter */}
                                        <select
                                            value={parentFilter}
                                            onChange={(e) => setParentFilter(e.target.value)}
                                            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                        >
                                            <option value="all">All Parents</option>
                                            <option value="Men">Men</option>
                                            <option value="Women">Women</option>
                                            <option value="Unisex">Unisex</option>
                                        </select>

                                        {/* Status Filter */}
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>

                                        {/* Results Count */}
                                        <div className="ml-auto flex items-center gap-2 text-sm text-slate-400">
                                            <span>{filteredCategories.length}</span>
                                            <span>categories</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Categories Grid */}
                        <CategoryGrid 
                            categories={filteredCategories} 
                            onEdit={handleEdit} 
                            onDelete={handleDelete} 
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
