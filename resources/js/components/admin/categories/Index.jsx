import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import AdminSidebar from '../partials/Sidebar';

export default function CategoriesIndex() {
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        axios.get('/admin/categories').then(res => {
            const data = res.data.categories;
            setCategories(Array.isArray(data) ? data : data.data || []);
        }).catch(() => {});
    }, []);

    const filtered = categories.filter(cat =>
        cat.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        axios.delete(`/admin/categories/${id}`).then(() => {
            setCategories(categories.filter(c => c.id !== id));
        }).catch(err => {
            alert(err.response?.data?.message || 'Failed to delete category.');
        });
    };

    return (
        <DashboardLayout sidebar={<AdminSidebar />} pageTitle="Categories">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-80 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <Link to="/admin/categories/create" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">
                    Add Category
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Image</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Name</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Parent</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Products</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                                <th className="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length > 0 ? filtered.map((cat) => (
                                <tr key={cat.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        {cat.image ? (
                                            <img src={`/storage/${cat.image}`} alt={cat.name} className="w-10 h-10 rounded-lg object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">N/A</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{cat.parent?.name || '—'}</td>
                                    <td className="px-6 py-4 text-gray-600">{cat.products_count || 0}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cat.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {cat.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <Link to={`/admin/categories/${cat.id}/edit`} className="inline-flex items-center text-blue-600 hover:text-blue-800" title="Edit">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Link>
                                        <button onClick={() => handleDelete(cat.id)} className="inline-flex items-center text-red-600 hover:text-red-800" title="Delete">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">No categories found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
