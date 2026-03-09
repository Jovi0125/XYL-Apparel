import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import LogisticsSidebar from '../partials/Sidebar';

export default function ShipmentsShow() {
    const { id } = useParams();
    const [shipment, setShipment] = useState(null);

    useEffect(() => {
        axios.get(`/logistics/shipments/${id}`).then(res => {
            setShipment(res.data.shipment);
        }).catch(() => {});
    }, [id]);

    if (!shipment) return <DashboardLayout sidebar={<LogisticsSidebar />} pageTitle="Shipment"><p className="text-gray-400">Loading...</p></DashboardLayout>;

    return (
        <DashboardLayout sidebar={<LogisticsSidebar />} pageTitle={`Shipment #${shipment.tracking_number}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Shipment Details */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Details</h3>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div><dt className="text-gray-500">Order</dt><dd className="font-medium">#{shipment.order?.order_number}</dd></div>
                            <div><dt className="text-gray-500">Status</dt><dd className="font-medium capitalize">{shipment.status?.replace('_', ' ')}</dd></div>
                            <div><dt className="text-gray-500">Customer</dt><dd className="font-medium">{shipment.order?.shipping_name}</dd></div>
                            <div><dt className="text-gray-500">Phone</dt><dd className="font-medium">{shipment.order?.shipping_phone}</dd></div>
                            <div className="col-span-2"><dt className="text-gray-500">Address</dt><dd className="font-medium">{shipment.order?.shipping_address}, {shipment.order?.shipping_city}</dd></div>
                        </dl>
                    </div>

                    {/* Tracking Timeline */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold text-gray-900">Tracking Events</h3>
                            <Link to={`/logistics/tracking/create/${shipment.id}`} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Add Update</Link>
                        </div>
                        <div className="space-y-4">
                            {(shipment.tracking_events || []).map((event, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-gray-900' : 'bg-gray-300'}`} />
                                        {i < shipment.tracking_events.length - 1 && <div className="w-0.5 flex-1 bg-gray-200" />}
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
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <Link to={`/logistics/tracking/create/${shipment.id}`} className="block w-full px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition text-center">
                        Add Tracking Update
                    </Link>
                    {shipment.status !== 'delivered' && (
                        <Link to={`/logistics/pod/create/${shipment.id}`} className="block w-full px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition text-center">
                            Record Delivery (POD)
                        </Link>
                    )}
                </div>
            </div>

            <div className="mt-4">
                <Link to="/logistics/shipments" className="text-sm text-gray-600 hover:text-gray-900">&larr; Back to Shipments</Link>
            </div>
        </DashboardLayout>
    );
}
