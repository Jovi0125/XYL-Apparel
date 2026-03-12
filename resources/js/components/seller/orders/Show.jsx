import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import SellerSidebar from '../partials/Sidebar';

export default function OrdersShow() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        axios.get(`/seller/orders/${id}`).then(res => setOrder(res.data.order)).catch(() => {});
    }, [id]);

    const handleStatusUpdate = (status) => {
        axios.patch(`/seller/orders/${id}/status`, { order_status: status }).then(() => {
            setOrder({ ...order, order_status: status });
        }).catch(err => alert(err.response?.data?.message || 'Failed to update status.'));
    };

    if (!order) return <DashboardLayout sidebar={<SellerSidebar />} pageTitle="Order Details"><p className="text-gray-400">Loading...</p></DashboardLayout>;

    return (
        <DashboardLayout sidebar={<SellerSidebar />} pageTitle={`Order #${order.order_number}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Actions */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Update Status</h3>
                        <div className="flex flex-wrap gap-2">
                            {order.order_status === 'pending' && (
                                <button onClick={() => handleStatusUpdate('processing')} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">Mark as Processing</button>
                            )}
                            {order.order_status === 'processing' && (
                                <button onClick={() => handleStatusUpdate('ready_for_pickup')} className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition">Ready for Pickup</button>
                            )}
                            {['pending', 'processing'].includes(order.order_status) && (
                                <button onClick={() => handleStatusUpdate('cancelled')} className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition">Cancel Order</button>
                            )}
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Order Items</h3>
                        <div className="space-y-3">
                            {(order.items || []).map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{item.product?.name}</p>
                                        <p className="text-xs text-gray-500">{item.variant?.name} × {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">₱{Number(item.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-3">Customer</h3>
                        <p className="text-sm text-gray-600">{order.customer?.name}</p>
                        <p className="text-sm text-gray-500">{order.customer?.email}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-3">Payment</h3>
                        <div className="text-sm space-y-1">
                            <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-medium">₱{Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <Link to="/seller/orders" className="text-sm text-gray-600 hover:text-gray-900">&larr; Back to Orders</Link>
            </div>
        </DashboardLayout>
    );
}
