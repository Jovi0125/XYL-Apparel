import React, { useState, useEffect } from 'react';
import InventoryLayout from '../layouts/InventoryLayout';
import inventoryService from '../../services/inventoryService';

export default function WarehousesPage() {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        inventoryService.warehouses()
            .then(res => setWarehouses(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <InventoryLayout title="Warehouses">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-gray-400">Loading...</p>
                ) : warehouses.length === 0 ? (
                    <p className="text-gray-400">No warehouses found.</p>
                ) : warehouses.map(wh => (
                    <div key={wh.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-800">{wh.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                wh.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                                {wh.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">{[wh.address, wh.city, wh.state, wh.zip].filter(Boolean).join(', ') || 'No address'}</p>
                        <p className="text-sm text-gray-500 mt-2">{wh.inventory_items_count || 0} inventory items</p>
                    </div>
                ))}
            </div>
        </InventoryLayout>
    );
}
