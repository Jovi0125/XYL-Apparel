import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import AdminSidebar from '../partials/Sidebar';

export default function OrdersShow() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        axios.get(`/admin/orders/${id}`).then(res => setOrder(res.data.order)).catch(() => {});
    }, [id]);

    if (!order) return <DashboardLayout sidebar={<AdminSidebar />} pageTitle="Order Details"><p className="text-gray-400">Loading...</p></DashboardLayout>;

    return (
        <DashboardLayout sidebar={<AdminSidebar />} pageTitle={`Order #${order.order_number}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Order Items</h3>
                    <div className="space-y-4">
                        {(order.items || []).map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <img src={`/storage/${item.product?.images?.[0]?.path}`} alt={item.product?.name} className="w-16 h-16 rounded-lg object-cover" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{item.product?.name}</p>
                                    <p className="text-xs text-gray-500">{item.variant?.name} × {item.quantity}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">₱{Number(item.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Info Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Customer</h3>
                        <p className="text-sm text-gray-600">{order.customer?.name}</p>
                        <p className="text-sm text-gray-500">{order.customer?.email}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Shipping</h3>
                        <p className="text-sm text-gray-600">{order.shipping_address}</p>
                        <p className="text-sm text-gray-500">{order.shipping_city}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="text-gray-900">₱{Number(order.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="text-gray-900">₱{Number(order.shipping_fee).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                            {order.discount > 0 && <div className="flex justify-between"><span className="text-gray-500">Discount</span><span className="text-green-600">-₱{Number(order.discount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>}
                            <div className="flex justify-between font-semibold border-t border-gray-100 pt-2"><span>Total</span><span>₱{Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <Link to="/admin/orders" className="text-sm text-gray-600 hover:text-gray-900">&larr; Back to Orders</Link>
            </div>
        </DashboardLayout>
    );
}
