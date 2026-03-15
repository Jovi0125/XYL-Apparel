import React, { useState } from 'react';
import InventoryLayout from '../layouts/InventoryLayout';
import inventoryService from '../../services/inventoryService';

export default function StockAdjustPage() {
    const [form, setForm] = useState({ inventory_item_id: '', type: 'adjusted', quantity: '', reference: '', notes: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const res = await inventoryService.adjust({ ...form, quantity: parseInt(form.quantity) });
            setMessage(`Stock adjusted. New quantity: ${res.data.new_quantity}`);
            setForm({ ...form, quantity: '', reference: '', notes: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Adjustment failed.');
        }
    };

    return (
        <InventoryLayout title="Stock Adjustment">
            <div className="max-w-xl bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {message && <div className="mb-4 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm">{message}</div>}
                {error && <div className="mb-4 px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Inventory Item ID</label>
                        <input type="number" value={form.inventory_item_id} onChange={e => setForm({...form, inventory_item_id: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                            <option value="received">Received</option>
                            <option value="adjusted">Adjusted</option>
                            <option value="picked">Picked</option>
                            <option value="returned">Returned</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (positive = add, negative = subtract)</label>
                        <input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                        <input type="text" value={form.reference} onChange={e => setForm({...form, reference: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows="3" />
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition">
                        Adjust Stock
                    </button>
                </form>
            </div>
        </InventoryLayout>
    );
}
