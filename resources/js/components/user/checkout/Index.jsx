import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import UserSidebar from '../partials/Sidebar';

export default function CheckoutIndex() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [form, setForm] = useState({
        shipping_name: '', shipping_phone: '', shipping_address: '', shipping_city: '', shipping_postal: '',
        discount_code: '', payment_method: 'cod', notes: '',
    });
    const [discountApplied, setDiscountApplied] = useState(null);

    useEffect(() => {
        axios.get('/customer/checkout').then(res => {
            setCartItems(res.data.cartItems || []);
        }).catch(() => {});
    }, []);

    const applyDiscount = () => {
        axios.post('/customer/checkout/apply-discount', { code: form.discount_code }).then(res => {
            if (res.data.success) {
                setDiscountApplied(res.data.discount);
                alert(res.data.message);
            } else {
                alert(res.data.message || 'Invalid discount code.');
            }
        }).catch(err => alert(err.response?.data?.message || 'Invalid discount code.'));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/customer/checkout', form);
            if (res.data.order) {
                navigate(`/orders/${res.data.order.id}`);
            } else {
                navigate('/orders');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to place order.');
        }
    };

    const getItemPrice = (item) => {
        if (item.variant && item.variant.price_override) return Number(item.variant.price_override);
        if (item.product?.sale_price && Number(item.product.sale_price) > 0) return Number(item.product.sale_price);
        return Number(item.product?.price || 0);
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);
    const shippingFee = 50;

    const discountAmount = discountApplied
        ? (discountApplied.type === 'percentage'
            ? Math.round(subtotal * (Number(discountApplied.value) / 100) * 100) / 100
            : Math.min(Number(discountApplied.value), subtotal))
        : 0;

    return (
        <DashboardLayout sidebar={<UserSidebar />} pageTitle="Checkout">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Shipping Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
                            <h3 className="text-base font-semibold text-gray-900">Shipping Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" value={form.shipping_name} onChange={(e) => setForm({ ...form, shipping_name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input type="text" value={form.shipping_phone} onChange={(e) => setForm({ ...form, shipping_phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea value={form.shipping_address} onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
                                    rows="2" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input type="text" value={form.shipping_city} onChange={(e) => setForm({ ...form, shipping_city: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                    <input type="text" value={form.shipping_postal} onChange={(e) => setForm({ ...form, shipping_postal: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Items by Seller */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Order Items</h3>
                            <div className="space-y-3">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{item.product?.name}</p>
                                            <p className="text-xs text-gray-500">{item.variant?.name} × {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-medium">₱{(getItemPrice(item) * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                rows="2" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Discount Code</h3>
                            <div className="flex gap-2">
                                <input type="text" value={form.discount_code} onChange={(e) => setForm({ ...form, discount_code: e.target.value })}
                                    placeholder="Enter code" className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                                <button type="button" onClick={applyDiscount} className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800">Apply</button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Payment</h3>
                            <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer">
                                <input type="radio" name="payment" value="cod" checked={form.payment_method === 'cod'} onChange={() => setForm({ ...form, payment_method: 'cod' })} />
                                <span className="text-sm text-gray-700">Cash on Delivery</span>
                            </label>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₱{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>₱{shippingFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                                {discountApplied && <div className="flex justify-between text-green-600"><span>Discount ({discountApplied.type === 'percentage' ? `${discountApplied.value}%` : 'Fixed'})</span><span>-₱{discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>}
                                <div className="flex justify-between font-semibold border-t border-gray-100 pt-2"><span>Total</span><span>₱{(subtotal + shippingFee - discountAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                            </div>
                            <button type="submit" className="w-full mt-4 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition">Place Order</button>
                        </div>
                    </div>
                </div>
            </form>
        </DashboardLayout>
    );
}
