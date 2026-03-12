import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import SellerSidebar from '../partials/Sidebar';

export default function ProductsShow() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        axios.get(`/seller/products/${id}`).then(res => setProduct(res.data.product)).catch(() => {});
    }, [id]);

    if (!product) return <DashboardLayout sidebar={<SellerSidebar />} pageTitle="Product Details"><p className="text-gray-400">Loading...</p></DashboardLayout>;

    return (
        <DashboardLayout sidebar={<SellerSidebar />} pageTitle={product.name}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Images */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    {product.images?.length > 0 && (
                        <div>
                            <img src={`/storage/${product.images[activeImage]?.path}`} alt={product.name} className="w-full h-80 object-contain rounded-lg mb-4" />
                            <div className="flex gap-2">
                                {product.images.map((img, i) => (
                                    <button key={img.id} onClick={() => setActiveImage(i)}
                                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${i === activeImage ? 'border-gray-900' : 'border-transparent'}`}>
                                        <img src={`/storage/${img.path}`} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="mt-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                    </div>
                    {/* Variants Table */}
                    {product.variants?.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-3">Variants</h3>
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-gray-100">
                                    <th className="text-left py-2 font-medium text-gray-500">Name</th>
                                    <th className="text-left py-2 font-medium text-gray-500">SKU</th>
                                    <th className="text-right py-2 font-medium text-gray-500">Price</th>
                                    <th className="text-right py-2 font-medium text-gray-500">Stock</th>
                                </tr></thead>
                                <tbody className="divide-y divide-gray-50">
                                    {product.variants.map((v) => (
                                        <tr key={v.id}>
                                            <td className="py-2 text-gray-900">{v.name}</td>
                                            <td className="py-2 text-gray-500">{v.sku}</td>
                                            <td className="py-2 text-right text-gray-900">₱{Number(v.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                            <td className="py-2 text-right text-gray-600">{v.stock}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Side Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium text-gray-900">{product.category?.name || '—'}</p>
                        <p className="text-sm text-gray-500 mt-3">Base Price</p>
                        <p className="font-medium text-gray-900">₱{Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        <p className="text-sm text-gray-500 mt-3">Status</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Link to={`/seller/products/${id}/edit`} className="flex-1 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition text-center">Edit</Link>
                        <Link to="/seller/products" className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition text-center">Back</Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
