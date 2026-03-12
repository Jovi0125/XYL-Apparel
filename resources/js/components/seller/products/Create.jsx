import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import SellerSidebar from '../partials/Sidebar';

export default function ProductsCreate() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        name: '', description: '', category_id: '', price: '', is_active: true,
    });
    const [variants, setVariants] = useState([{ name: '', sku: '', price: '', stock: '' }]);
    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        axios.get('/seller/products/create').then(res => {
            setCategories(res.data.categories || []);
        }).catch(() => {});
    }, []);

    const addVariant = () => setVariants([...variants, { name: '', sku: '', price: '', stock: '' }]);
    const removeVariant = (index) => setVariants(variants.filter((_, i) => i !== index));
    const updateVariant = (index, field, value) => {
        const updated = [...variants];
        updated[index][field] = value;
        setVariants(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const formData = new FormData();
        Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== '') formData.append(k, v); });
        formData.append('is_active', form.is_active ? '1' : '0');
        images.forEach(img => formData.append('images[]', img));
        variants.forEach((v, i) => {
            Object.entries(v).forEach(([k, val]) => formData.append(`variants[${i}][${k}]`, val));
        });
        try {
            await axios.post('/seller/products', formData);
            navigate('/seller/products');
        } catch (err) {
            if (err.response?.status === 422) setErrors(err.response.data.errors || {});
        }
    };

    return (
        <DashboardLayout sidebar={<SellerSidebar />} pageTitle="Add Product">
            <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h3 className="text-base font-semibold text-gray-900">Product Details</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" required>
                            <option value="">Select Category</option>
                            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows="4" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₱)</label>
                            <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded border-gray-300" />
                                <span className="text-sm text-gray-700">Active</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Images</h3>
                    <input type="file" accept="image/*" multiple onChange={(e) => setImages([...e.target.files])} className="text-sm" />
                </div>

                {/* Variants */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-900">Variants</h3>
                        <button type="button" onClick={addVariant} className="text-sm text-blue-600 hover:text-blue-800">+ Add Variant</button>
                    </div>
                    <div className="space-y-4">
                        {variants.map((v, i) => (
                            <div key={i} className="grid grid-cols-4 gap-3 items-end">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                                    <input type="text" value={v.name} onChange={(e) => updateVariant(i, 'name', e.target.value)}
                                        placeholder="e.g. Small / Red" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">SKU</label>
                                    <input type="text" value={v.sku} onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Price (₱)</label>
                                    <input type="number" step="0.01" value={v.price} onChange={(e) => updateVariant(i, 'price', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                                </div>
                                <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Stock</label>
                                        <input type="number" value={v.stock} onChange={(e) => updateVariant(i, 'stock', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                                    </div>
                                    {variants.length > 1 && (
                                        <button type="button" onClick={() => removeVariant(i)} className="px-2 py-2 text-red-500 hover:text-red-700">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button type="submit" className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">Create Product</button>
                    <button type="button" onClick={() => navigate('/seller/products')} className="px-6 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">Cancel</button>
                </div>
            </form>
        </DashboardLayout>
    );
}
