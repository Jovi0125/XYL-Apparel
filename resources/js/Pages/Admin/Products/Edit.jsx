import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import ProductMediaUpload from '../../../Components/admin/products/ProductMediaUpload';
import ProductBasicInfo from '../../../Components/admin/products/ProductBasicInfo';
import ProductClassification from '../../../Components/admin/products/ProductClassification';
import ProductOptions from '../../../Components/admin/products/ProductOptions';
import ProductVariants from '../../../Components/admin/products/ProductVariants';
import ProductPricing from '../../../Components/admin/products/ProductPricing';
import ProductPaymentMethods from '../../../Components/admin/products/ProductPaymentMethods';
import ProductInventory from '../../../Components/admin/products/ProductInventory';

export default function EditProduct({ product, categories = [], discounts = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: product.title || '',
        short_description: product.short_description || '',
        detailed_description: product.detailed_description || '',
        category_id: product.category_id || '',
        parent_category: product.parent_category || '',
        warranty: product.warranty || 'No Warranty',
        colors: typeof product.colors === 'string' ? JSON.parse(product.colors) : (product.colors || []),
        tags: typeof product.tags === 'string' ? JSON.parse(product.tags) : (product.tags || []),
        images: [], // New images to upload
        existing_images: product.images || [], // Currently saved images
        payment_methods: typeof product.payment_methods === 'string' ? JSON.parse(product.payment_methods) : (product.payment_methods || []),
        discount_code_id: product.discount_code_id || '',
        variants: product.variants || [],
        stock: product.stock || '0',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Since we have files, we use POST with _method spoofing
        post(`/admin/products/${product.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Edit Product" activeItem="catalog">
            <Head title={`Edit Product - ${product.title}`} />

            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <div className="space-y-6">
                                <ProductMediaUpload
                                    images={data.images}
                                    existingImages={data.existing_images}
                                    onChange={(images) => setData('images', images)}
                                    onExistingChange={(existing) => setData('existing_images', existing)}
                                    errors={errors}
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <ProductBasicInfo
                                data={data}
                                setData={setData}
                                errors={errors}
                            />

                            <ProductClassification
                                data={data}
                                setData={setData}
                                categories={categories}
                                errors={errors}
                            />

                            <ProductOptions
                                data={data}
                                setData={setData}
                                errors={errors}
                            />

                            <ProductVariants
                                data={data}
                                setData={setData}
                                errors={errors}
                            />

                            <ProductPricing
                                data={data}
                                setData={setData}
                                discounts={discounts}
                                errors={errors}
                            />

                            <ProductPaymentMethods
                                data={data}
                                setData={setData}
                                errors={errors}
                            />

                            <ProductInventory
                                data={data}
                                setData={setData}
                                errors={errors}
                            />

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="px-6 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white hover:border-slate-600/50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-600 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-50"
                                >
                                    {processing ? 'Saving Changes...' : 'Update Product'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
