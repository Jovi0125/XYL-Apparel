import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import UserSidebar from '../partials/Sidebar';

export default function CartIndex() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        axios.get('/customer/cart').then(res => {
            setCartItems(res.data.cartItems || []);
        }).catch(() => {});
    }, []);

    const updateQuantity = (id, qty) => {
        axios.patch(`/customer/cart/${id}`, { quantity: qty }).then(res => {
            setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: qty } : item));
        }).catch(err => alert(err.response?.data?.message || 'Failed to update quantity.'));
    };

    const removeItem = (id) => {
        axios.delete(`/customer/cart/${id}`).then(() => {
            setCartItems(cartItems.filter(item => item.id !== id));
        }).catch(err => alert(err.response?.data?.message || 'Failed to remove item.'));
    };

    const getItemPrice = (item) => {
        if (item.variant && item.variant.price_override) return Number(item.variant.price_override);
        if (item.product?.sale_price && Number(item.product.sale_price) > 0) return Number(item.product.sale_price);
        return Number(item.product?.price || 0);
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);

    return (
        <DashboardLayout sidebar={<UserSidebar />} pageTitle="Shopping Cart">
            {cartItems.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    {item.product?.images?.[0] && <img src={`/storage/${item.product.images[0].path}`} alt="" className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium text-gray-900 truncate">{item.product?.name}</h3>
                                    <p className="text-xs text-gray-500">{item.variant?.name}</p>
                                    <p className="text-sm font-semibold text-gray-900 mt-1">₱{getItemPrice(item).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center text-sm">-</button>
                                    <span className="text-sm w-8 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center text-sm">+</button>
                                </div>
                                <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-fit">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Order Summary</h3>
                        <div className="space-y-2 text-sm mb-6">
                            <div className="flex justify-between"><span className="text-gray-500">Subtotal ({cartItems.length} items)</span><span className="font-medium text-gray-900">₱{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="text-gray-500">Calculated at checkout</span></div>
                        </div>
                        <Link to="/checkout" className="block w-full px-6 py-3 bg-gray-900 text-sm font-medium rounded-xl hover:bg-gray-800 transition text-center" style={{ color: '#ffffff' }}>
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-gray-400 mb-4">Your cart is empty.</p>
                    <Link to="/browse" className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">Browse Products</Link>
                </div>
            )}
        </DashboardLayout>
    );
}
