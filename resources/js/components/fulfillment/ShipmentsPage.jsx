import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FulfillmentLayout from '../layouts/FulfillmentLayout';
import fulfillmentService from '../../services/fulfillmentService';

export default function ShipmentsPage() {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fulfillmentService.shipmentList()
            .then(res => setShipments(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <FulfillmentLayout title="Shipments">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">Shipment #</th>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">Order</th>
                            <th className="text-center px-6 py-3 text-gray-600 font-medium">Status</th>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">Created</th>
                            <th className="text-right px-6 py-3 text-gray-600 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
                        ) : shipments.map(s => (
                            <tr key={s.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 font-medium text-gray-800">#{s.id}</td>
                                <td className="px-6 py-3 text-gray-600">#{s.order_id}</td>
                                <td className="px-6 py-3 text-center">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{s.status}</span>
                                </td>
                                <td className="px-6 py-3 text-gray-500">{new Date(s.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-3 text-right">
                                    <Link to={`/fulfillment/shipments/${s.id}`} className="text-blue-600 hover:underline text-sm">View</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </FulfillmentLayout>
    );
}
