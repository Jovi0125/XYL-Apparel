import React, { useState, useEffect } from 'react';
import InventoryLayout from '../layouts/InventoryLayout';
import inventoryService from '../../services/inventoryService';

export default function StockReceivingPage() {
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ inventory_item_id: '', quantity: '', reference: '', notes: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        inventoryService.receivingList()
            .then(res => setRecent(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleReceive = async (e) => {
        e.preventDefault();
        try {
            const res = await inventoryService.receive({ ...form, quantity: parseInt(form.quantity) });
            setMessage(res.data.message);
            setForm({ inventory_item_id: '', quantity: '', reference: '', notes: '' });
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error receiving stock.');
        }
    };

    return (
        <InventoryLayout title="Stock Receiving">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Receiving Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-semibold text-gray-800 mb-4">Receive New Stock</h2>
                    {message && <div className="mb-4 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm">{message}</div>}
                    <form onSubmit={handleReceive} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Inventory Item ID</label>
                            <input type="number" value={form.inventory_item_id} onChange={e => setForm({...form, inventory_item_id: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <input type="number" min="1" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reference / PO Number</label>
                            <input type="text" value={form.reference} onChange={e => setForm({...form, reference: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition">
                            Receive Stock
                        </button>
                    </form>
                </div>

                {/* Recent Receivings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-semibold text-gray-800 mb-4">Recent Receivings</h2>
                    {loading ? <p className="text-gray-400">Loading...</p> : (
                        <div className="space-y-3">
                            {recent.map(txn => (
                                <div key={txn.id} className="flex justify-between items-center border-b border-gray-100 pb-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{txn.inventory_item?.product_variant?.product?.name || 'Item #' + txn.inventory_item_id}</p>
                                        <p className="text-xs text-gray-500">by {txn.user?.name || 'Unknown'} • {new Date(txn.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <span className="text-sm font-mono text-green-600">+{txn.quantity}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </InventoryLayout>
    );
}
