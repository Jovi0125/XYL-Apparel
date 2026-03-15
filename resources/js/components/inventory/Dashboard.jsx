import React, { useState, useEffect } from 'react';
import InventoryLayout from '../layouts/InventoryLayout';
import inventoryService from '../../services/inventoryService';

export default function InventoryDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        inventoryService.dashboard()
            .then(res => setStats(res.data.stats))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const cards = stats ? [
        { label: 'Total Products', value: stats.total_products, color: 'bg-blue-500' },
        { label: 'Low Stock Items', value: stats.low_stock_items, color: 'bg-red-500' },
        { label: 'Stock Value', value: `₱${Number(stats.total_stock_value).toLocaleString()}`, color: 'bg-green-500' },
        { label: 'Pending Orders', value: stats.pending_orders, color: 'bg-yellow-500' },
    ] : [];

    return (
        <InventoryLayout title="Inventory Dashboard">
            {loading ? (
                <div className="text-gray-500">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map(card => (
                        <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center text-white text-lg mb-3`}>
                                📦
                            </div>
                            <p className="text-sm text-gray-500">{card.label}</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
                        </div>
                    ))}
                </div>
            )}
        </InventoryLayout>
    );
}
