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

export default function CreateProduct({ categories = [], discounts = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        short_description: '',
        detailed_description: '',
        category_id: '',
        parent_category: '',
        warranty: 'No Warranty',
        colors: [],
        tags: [],
        images: [],
        payment_methods: [],
        discount_code_id: '',
        variants: [
            { size: '', stock: '', regular_price: '', sale_price: '' }
        ],
        stock: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/products', {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Create Product" activeItem="catalog">
            <Head title="Create Product" />

            <div className="relative z-10">
                {errors.error && (
                    <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm flex items-center gap-3">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <ProductMediaUpload
                                images={data.images}
                                onChange={(images) => setData('images', images)}
                                errors={errors}
                            />
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
                                    className="px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black hover:border-gray-200/50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-3 bg-black rounded-xl font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                    {processing ? 'Creating...' : 'Create Product'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
