import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import UserSidebar from '../partials/Sidebar';

export default function BrowseShow() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        axios.get(`/customer/products/${id}`).then(res => {
            setProduct(res.data.product);
            setIsWishlisted(res.data.isWishlisted || false);
            setRelatedProducts(res.data.relatedProducts || []);
            if (res.data.product?.variants?.length > 0) setSelectedVariant(res.data.product.variants[0]);
        }).catch(() => {});
    }, [id]);

    const handleAddToCart = () => {
        axios.post('/customer/cart', {
            product_id: product.id,
            product_variant_id: selectedVariant?.id || null,
            quantity,
        }).then(() => alert('Added to cart!')).catch(err => alert(err.response?.data?.message || 'Failed to add to cart.'));
    };

    const handleToggleWishlist = () => {
        axios.post(`/customer/wishlist/${product.id}`).then(res => {
            setIsWishlisted(res.data.wishlisted);
        }).catch(() => {});
    };

    if (!product) return <DashboardLayout sidebar={<UserSidebar />} pageTitle="Product"><p className="text-gray-400">Loading...</p></DashboardLayout>;

    return (
        <DashboardLayout sidebar={<UserSidebar />}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div>
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                        {product.images?.[activeImage] && (
                            <img src={`/storage/${product.images[activeImage].path}`} alt={product.name} className="w-full h-full object-contain" />
                        )}
                    </div>
                    {product.images?.length > 1 && (
                        <div className="flex gap-2">
                            {product.images.map((img, i) => (
                                <button key={img.id} onClick={() => setActiveImage(i)}
                                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${i === activeImage ? 'border-gray-900' : 'border-transparent'}`}>
                                    <img src={`/storage/${img.path}`} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <Link to={`/browse/shop/${product.seller_profile_id}`} className="text-sm text-gray-400 hover:text-gray-600">{product.seller?.shop_name}</Link>
                    <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
                    <div className="mt-4">
                        {product.sale_price && Number(product.sale_price) < Number(product.price) ? (
                            <div className="flex items-center gap-3">
                                <p className="text-2xl font-bold text-red-600">
                                    ₱{Number(selectedVariant?.price_override || product.sale_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-lg text-gray-400 line-through">
                                    ₱{Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                                    {Math.round((1 - Number(product.sale_price) / Number(product.price)) * 100)}% OFF
                                </span>
                            </div>
                        ) : (
                            <p className="text-2xl font-bold text-gray-900">
                                ₱{Number(selectedVariant?.price_override || product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        )}
                    </div>

                    {/* Variant Picker */}
                    {product.variants?.length > 0 && (
                        <div className="mt-6">
                            <p className="text-sm font-medium text-gray-700 mb-2">Select Variant</p>
                            <div className="flex flex-wrap gap-2">
                                {product.variants.map((v) => (
                                    <button key={v.id} onClick={() => setSelectedVariant(v)}
                                        className={`px-4 py-2 rounded-lg text-sm border transition ${selectedVariant?.id === v.id ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                                        {v.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="mt-6">
                        <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50">-</button>
                            <span className="text-sm font-medium w-8 text-center">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50">+</button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-8">
                        <button onClick={handleAddToCart} className="flex-1 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition">Add to Cart</button>
                        <button onClick={handleToggleWishlist} className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>

                    {/* Description */}
                    <div className="mt-8 border-t border-gray-100 pt-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-3">Description</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                    </div>
                </div>
            </div>

            <div className="mt-12 border-t border-gray-100 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Related Products</h3>
                {relatedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map(rp => (
                            <Link key={rp.id} to={`/browse/product/${rp.id}`} className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
                                <div className="aspect-square bg-gray-100">
                                    {rp.primary_image && <img src={`/storage/${rp.primary_image.path}`} alt={rp.name} className="w-full h-full object-cover" />}
                                </div>
                                <div className="p-4">
                                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{rp.name}</h4>
                                    <div className="flex items-center gap-2 mt-2">
                                        {rp.sale_price && Number(rp.sale_price) < Number(rp.price) ? (
                                            <>
                                                <p className="text-sm font-semibold text-red-600">₱{Number(rp.sale_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                                <p className="text-xs text-gray-400 line-through">₱{Number(rp.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                            </>
                                        ) : (
                                            <p className="text-sm font-semibold text-gray-900">₱{Number(rp.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : <p className="text-sm text-gray-400">No related products found.</p>}
            </div>
        </DashboardLayout>
    );
}
