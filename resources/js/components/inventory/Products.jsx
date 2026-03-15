import React, { useState, useEffect } from 'react';
import InventoryLayout from '../layouts/InventoryLayout';
import productService from '../../services/productService';

export default function InventoryProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        productService.list()
            .then(res => setProducts(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <InventoryLayout title="Product Catalog (Inventory)">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-800">Master Catalog</h2>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition">
                        + New Product
                    </button>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">Product Name</th>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">Category</th>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">Base Price</th>
                            <th className="text-center px-6 py-3 text-gray-600 font-medium">Status</th>
                            <th className="text-right px-6 py-3 text-gray-600 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">No products found in catalog.</td></tr>
                        ) : products.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 font-medium text-gray-800">{p.name}</td>
                                <td className="px-6 py-3 text-gray-600">{p.category?.name || 'Uncategorized'}</td>
                                <td className="px-6 py-3 text-gray-600">₱{Number(p.price).toFixed(2)}</td>
                                <td className="px-6 py-3 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {p.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-right">
                                    <button className="text-emerald-600 hover:underline text-sm font-medium">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </InventoryLayout>
    );
}
