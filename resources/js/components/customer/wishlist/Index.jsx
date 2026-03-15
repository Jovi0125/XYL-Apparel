import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import UserSidebar from '../partials/Sidebar';

export default function WishlistIndex() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios.get('/customer/wishlist').then(res => {
            const data = res.data.wishlists;
            setItems(Array.isArray(data) ? data : data.data || []);
        }).catch(() => {});
    }, []);

    const removeFromWishlist = (id) => {
        axios.delete(`/customer/wishlist/${id}`).then(() => {
            setItems(items.filter(item => item.id !== id));
        }).catch(err => alert(err.response?.data?.message || 'Failed to remove from wishlist.'));
    };

    const addToCart = (item) => {
        axios.post('/customer/cart', { product_id: item.product_id || item.product?.id, quantity: 1 }).then(() => {
            alert('Added to cart!');
        }).catch(err => alert(err.response?.data?.message || 'Failed to add to cart.'));
    };

    return (
        <DashboardLayout sidebar={<UserSidebar />} pageTitle="My Wishlist">
            {items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <Link to={`/browse/product/${item.product?.id}`}>
                                <div className="aspect-square bg-gray-100">
                                    {item.product?.images?.[0] && <img src={`/storage/${item.product.images[0].path}`} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />}
                                </div>
                            </Link>
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.product?.name}</h3>
                                <p className="text-sm font-semibold text-gray-900 mt-2">₱{Number(item.product?.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                <div className="flex gap-2 mt-3">
                                    <button onClick={() => addToCart(item)} className="flex-1 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition">Add to Cart</button>
                                    <button onClick={() => removeFromWishlist(item.id)} className="px-3 py-1.5 border border-gray-200 text-gray-500 text-xs rounded-lg hover:bg-gray-50 transition">Remove</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-gray-400 mb-4">Your wishlist is empty.</p>
                    <Link to="/browse" className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">Browse Products</Link>
                </div>
            )}
        </DashboardLayout>
    );
}
