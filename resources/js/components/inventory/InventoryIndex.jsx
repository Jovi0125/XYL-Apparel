import React, { useState, useEffect } from 'react';
import InventoryLayout from '../layouts/InventoryLayout';
import inventoryService from '../../services/inventoryService';

export default function InventoryIndex() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        inventoryService.stockList()
            .then(res => setItems(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <InventoryLayout title="Stock Levels">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">Product</th>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">Variant</th>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">Warehouse</th>
                            <th className="text-right px-6 py-3 text-gray-600 font-medium">On Hand</th>
                            <th className="text-right px-6 py-3 text-gray-600 font-medium">Reserved</th>
                            <th className="text-right px-6 py-3 text-gray-600 font-medium">Reorder Lvl</th>
                            <th className="text-center px-6 py-3 text-gray-600 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
                        ) : items.length === 0 ? (
                            <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-400">No inventory items found.</td></tr>
                        ) : items.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 font-medium text-gray-800">{item.product_variant?.product?.name || '—'}</td>
                                <td className="px-6 py-3 text-gray-600">{item.product_variant?.name || '—'}</td>
                                <td className="px-6 py-3 text-gray-600">{item.warehouse?.name || '—'}</td>
                                <td className="px-6 py-3 text-right font-mono">{item.quantity_on_hand}</td>
                                <td className="px-6 py-3 text-right font-mono">{item.quantity_reserved}</td>
                                <td className="px-6 py-3 text-right font-mono">{item.reorder_level}</td>
                                <td className="px-6 py-3 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        item.quantity_on_hand <= item.reorder_level
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-green-100 text-green-700'
                                    }`}>
                                        {item.quantity_on_hand <= item.reorder_level ? 'Low' : 'OK'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </InventoryLayout>
    );
}
