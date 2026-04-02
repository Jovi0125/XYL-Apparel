import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import LogisticsSidebar from "../partials/Sidebar";

export default function ShipmentsShow() {
    const { id } = useParams();
    const [shipment, setShipment] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        axios.get('/logistics/shipments/' + id).then(res => {
            setShipment(res.data.shipment);
        }).catch(() => {});
    }, [id]);

    const handleStatusUpdate = (status) => {
        setUpdating(true);
        axios.patch(`/logistics/shipments/${id}/status`, { delivery_status: status })
            .then(res => {
                if (res.data.success) {
                    setShipment(prev => ({
                        ...prev,
                        delivery_status: status,
                    }));
                }
            })
            .catch(err => {
                alert(err.response?.data?.message || "Failed to update status.");
            })
            .finally(() => {
                setUpdating(false);
            });
    };

    if (!shipment) return <DashboardLayout sidebar={<LogisticsSidebar />} pageTitle="Shipment Details"><p className="text-gray-400">Loading...</p></DashboardLayout>;

    const currentStatus = shipment.delivery_status || shipment.status || 'assigned';

    return (
        <DashboardLayout sidebar={<LogisticsSidebar />} pageTitle={`Shipment #${shipment.tracking_number}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Actions */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Update Status</h3>
                        <div className="flex flex-wrap gap-2">
                            {['assigned', 'pending_pickup', 'picked_up'].includes(currentStatus) && (
                                <button
                                    onClick={() => handleStatusUpdate('in_transit')}
                                    disabled={updating}
                                    className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
                                >
                                    {updating ? 'Updating...' : 'Mark as Shipped'}
                                </button>
                            )}
                            {['in_transit', 'out_for_delivery'].includes(currentStatus) && (
                                <button
                                    onClick={() => handleStatusUpdate('delivered')}
                                    disabled={updating}
                                    className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                                >
                                    {updating ? 'Updating...' : 'Mark as Delivered'}
                                </button>
                            )}
                            {currentStatus === 'delivered' && (
                                <p className="text-sm text-emerald-600 font-medium">✅ This shipment has been delivered.</p>
                            )}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Order Items</h3>
                        <div className="space-y-3">
                            {(shipment.order?.items || []).map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.product?.primary_image && <img src={`/storage/${item.product.primary_image.path}`} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{item.product?.name}</p>
                                        <p className="text-xs text-gray-500">× {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">₱{Number(item.subtotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>
                            ))}
                            {(!shipment.order?.items || shipment.order.items.length === 0) && (
                                <p className="text-sm text-gray-400">No items found.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-3">Customer</h3>
                        <p className="text-sm text-gray-600">{shipment.order?.shipping_name || shipment.order?.customer?.name || '—'}</p>
                        <p className="text-sm text-gray-500">{shipment.order?.customer?.email || '—'}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-3">Payment</h3>
                        <div className="text-sm space-y-1">
                            <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-medium">₱{Number(shipment.order?.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <Link to="/logistics/shipments" className="text-sm text-gray-600 hover:text-gray-900">&larr; Back to Shipments</Link>
            </div>
        </DashboardLayout>
    );
}
