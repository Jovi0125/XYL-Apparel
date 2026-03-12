import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import SellerSidebar from '../partials/Sidebar';

export default function ProductsIndex() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        axios.get('/seller/products', { params: { search } }).then(res => {
            const data = res.data.products;
            setProducts(Array.isArray(data) ? data : data.data || []);
        }).catch(() => {});
    }, [search]);

    const handleDelete = (id) => {
        if (!confirm('Delete this product?')) return;
        axios.delete(`/seller/products/${id}`).then(() => {
            setProducts(products.filter(p => p.id !== id));
        }).catch(err => alert(err.response?.data?.message || 'Failed to delete.'));
    };

    return (
        <DashboardLayout sidebar={<SellerSidebar />} pageTitle="My Products">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-80 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                <Link to="/seller/products/create" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">Add Product</Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Image</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Name</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Category</th>
                                <th className="text-right px-6 py-3 font-medium text-gray-500">Price</th>
                                <th className="text-right px-6 py-3 font-medium text-gray-500">Stock</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                                <th className="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.length > 0 ? products.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        {p.images?.[0] ? (
                                            <img src={`/storage/${p.images[0].path}`} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{p.category?.name || '—'}</td>
                                    <td className="px-6 py-4 text-right text-gray-900">₱{Number(p.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td className="px-6 py-4 text-right text-gray-600">{p.total_stock || 0}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {p.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link to={`/seller/products/${p.id}`} className="text-sm text-blue-600 hover:text-blue-800">View</Link>
                                        <Link to={`/seller/products/${p.id}/edit`} className="text-sm text-gray-600 hover:text-gray-800">Edit</Link>
                                        <button onClick={() => handleDelete(p.id)} className="text-sm text-red-600 hover:text-red-800">Delete</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-400">No products yet. <Link to="/seller/products/create" className="text-blue-600">Add your first product</Link></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
