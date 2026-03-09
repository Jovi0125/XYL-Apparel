import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import SellerSidebar from '../partials/Sidebar';

export default function ProductsEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: '', description: '', category_id: '', price: '', is_active: true });
    const [variants, setVariants] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);

    useEffect(() => {
        axios.get(`/seller/products/${id}/edit`).then(res => {
            const p = res.data.product;
            setForm({ name: p.name || '', description: p.description || '', category_id: p.category_id || '', price: p.price || '', is_active: !!p.is_active });
            setVariants(p.variants || []);
            setExistingImages(p.images || []);
            setCategories(res.data.categories || []);
        }).catch(() => {});
    }, [id]);

    const addVariant = () => setVariants([...variants, { name: '', sku: '', price: '', stock: '' }]);
    const removeVariant = (index) => setVariants(variants.filter((_, i) => i !== index));
    const updateVariant = (index, field, value) => { const u = [...variants]; u[index][field] = value; setVariants(u); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'PUT');
        Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== '') formData.append(k, v); });
        formData.append('is_active', form.is_active ? '1' : '0');
        newImages.forEach(img => formData.append('images[]', img));
        variants.forEach((v, i) => {
            Object.entries(v).forEach(([k, val]) => { if (val !== null && val !== undefined) formData.append(`variants[${i}][${k}]`, val); });
        });
        try {
            await axios.post(`/seller/products/${id}`, formData);
            navigate('/seller/products');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update product.');
        }
    };

    return (
        <DashboardLayout sidebar={<SellerSidebar />} pageTitle="Edit Product">
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

                {/* Existing Images */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Images</h3>
                    {existingImages.length > 0 && (
                        <div className="flex flex-wrap gap-3 mb-4">
                            {existingImages.map((img) => (
                                <div key={img.id} className="relative">
                                    <img src={`/storage/${img.path}`} alt="" className="w-20 h-20 rounded-lg object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                    <input type="file" accept="image/*" multiple onChange={(e) => setNewImages([...e.target.files])} className="text-sm" />
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
                                <div><label className="block text-xs font-medium text-gray-500 mb-1">Name</label><input type="text" value={v.name} onChange={(e) => updateVariant(i, 'name', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                                <div><label className="block text-xs font-medium text-gray-500 mb-1">SKU</label><input type="text" value={v.sku} onChange={(e) => updateVariant(i, 'sku', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                                <div><label className="block text-xs font-medium text-gray-500 mb-1">Price (₱)</label><input type="number" step="0.01" value={v.price} onChange={(e) => updateVariant(i, 'price', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                                <div className="flex items-end gap-2">
                                    <div className="flex-1"><label className="block text-xs font-medium text-gray-500 mb-1">Stock</label><input type="number" value={v.stock} onChange={(e) => updateVariant(i, 'stock', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                                    {variants.length > 1 && <button type="button" onClick={() => removeVariant(i)} className="px-2 py-2 text-red-500">✕</button>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button type="submit" className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">Update Product</button>
                    <button type="button" onClick={() => navigate('/seller/products')} className="px-6 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">Cancel</button>
                </div>
            </form>
        </DashboardLayout>
    );
}
