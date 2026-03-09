import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import UserSidebar from '../partials/Sidebar';

export default function BrowseIndex() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        const params = {};
        if (search) params.search = search;
        if (categoryFilter) params.category = categoryFilter;
        if (sortBy) params.sort = sortBy === 'newest' ? 'latest' : sortBy === 'price_low' ? 'price_low' : sortBy === 'price_high' ? 'price_high' : sortBy;
        axios.get('/customer/browse', { params }).then(res => {
            const data = res.data.products;
            setProducts(Array.isArray(data) ? data : data.data || []);
            setCategories(res.data.categories || []);
        }).catch(() => {});
    }, [search, categoryFilter, sortBy]);

    return (
        <DashboardLayout sidebar={<UserSidebar />} pageTitle="Browse Products">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-80 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="">All Categories</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="newest">Newest</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.length > 0 ? products.map((p) => (
                    <Link key={p.id} to={`/browse/product/${p.id}`} className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
                        <div className="aspect-square bg-gray-100">
                            {p.images?.[0] && <img src={`/storage/${p.images[0].path}`} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                        </div>
                        <div className="p-4">
                            <p className="text-xs text-gray-400 mb-1">{p.seller?.shop_name}</p>
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{p.name}</h3>
                            <p className="text-sm font-semibold text-gray-900 mt-2">₱{Number(p.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        </div>
                    </Link>
                )) : (
                    <div className="col-span-full text-center py-12 text-gray-400">No products found.</div>
                )}
            </div>
        </DashboardLayout>
    );
}
