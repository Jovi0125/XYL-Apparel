import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import UserSidebar from '../partials/Sidebar';

export default function OrdersShow() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        axios.get(`/customer/orders/${id}`).then(res => {
            setOrder(res.data.order);
        }).catch(() => { });
    }, [id]);

    const handleCancel = () => {
        if (!confirm('Cancel this order?')) return;
        axios.patch(`/customer/orders/${id}/cancel`).then(() => {
            setOrder({ ...order, order_status: 'cancelled' });
        }).catch(err => alert(err.response?.data?.message || 'Failed to cancel order.'));
    };

    if (!order) return <DashboardLayout sidebar={<UserSidebar />} pageTitle="Order Details"><p className="text-gray-400">Loading...</p></DashboardLayout>;

    const statusSteps = ['pending', 'processing', 'ready_for_pickup', 'shipped', 'delivered'];
    const currentStep = statusSteps.indexOf(order.order_status);

    return (
        <DashboardLayout sidebar={<UserSidebar />} pageTitle={`Order #${order.order_number}`}>
            {/* Status Progress Bar */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    {statusSteps.map((step, i) => (
                        <div key={step} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= currentStep ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                {i + 1}
                            </div>
                            {i < statusSteps.length - 1 && <div className={`h-0.5 w-12 sm:w-20 ${i < currentStep ? 'bg-gray-900' : 'bg-gray-200'}`} />}
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                    {statusSteps.map((step) => <span key={step} className="capitalize">{step.replace('_', ' ')}</span>)}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Items & Tracking */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Order Items</h3>
                        <div className="space-y-3">
                            {(order.items || []).map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                        {item.product?.images?.[0] && <img src={`/storage/${item.product.images[0].path}`} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{item.product?.name}</p>
                                        <p className="text-xs text-gray-500">{item.variant?.name} × {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-medium">₱{Number(item.total_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tracking Timeline */}
                    {order.shipment?.tracking_events?.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Tracking</h3>
                            <div className="space-y-4">
                                {order.shipment.tracking_events.map((event, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-gray-900' : 'bg-gray-300'}`} />
                                            {i < order.shipment.tracking_events.length - 1 && <div className="w-0.5 h-full bg-gray-200" />}
                                        </div>
                                        <div className="pb-4">
                                            <p className="text-sm font-medium text-gray-900 capitalize">{event.status?.replace('_', ' ')}</p>
                                            <p className="text-xs text-gray-500">{event.location} &middot; {event.remarks}</p>
                                            <p className="text-xs text-gray-400 mt-1">{event.created_at ? new Date(event.created_at).toLocaleString() : ''}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-3">Payment Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₱{Number(order.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>₱{Number(order.shipping_fee || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                            {Number(order.discount_amount) > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₱{Number(order.discount_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>}
                            <div className="flex justify-between font-semibold border-t border-gray-100 pt-2"><span>Total</span><span>₱{Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                        </div>
                    </div>

                    {order.order_status === 'pending' && (
                        <button onClick={handleCancel} className="w-full px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition">
                            Cancel Order
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-4">
                <Link to="/orders" className="text-sm text-gray-600 hover:text-gray-900">&larr; Back to Orders</Link>
            </div>
        </DashboardLayout>
    );
}
