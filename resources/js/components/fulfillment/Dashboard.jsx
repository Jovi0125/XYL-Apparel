import React, { useState, useEffect } from 'react';
import FulfillmentLayout from '../layouts/FulfillmentLayout';
import fulfillmentService from '../../services/fulfillmentService';

export default function FulfillmentDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fulfillmentService.dashboard()
            .then(res => setStats(res.data.stats))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const cards = stats ? [
        { label: 'Pending', value: stats.pending, color: 'bg-yellow-500' },
        { label: 'Picking', value: stats.picking, color: 'bg-blue-500' },
        { label: 'Packing', value: stats.packing, color: 'bg-indigo-500' },
        { label: 'Shipped', value: stats.shipped, color: 'bg-green-500' },
        { label: 'Delivered', value: stats.delivered, color: 'bg-emerald-500' },
        { label: 'My Active', value: stats.my_active, color: 'bg-purple-500' },
    ] : [];

    return (
        <FulfillmentLayout title="Fulfillment Dashboard">
            {loading ? (
                <div className="text-gray-500">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map(card => (
                        <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center text-white text-lg mb-3`}>
                                🚚
                            </div>
                            <p className="text-sm text-gray-500">{card.label}</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
                        </div>
                    ))}
                </div>
            )}
        </FulfillmentLayout>
    );
}
