import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import LogisticsSidebar from '../partials/Sidebar';

export default function TrackingCreate() {
    const { shipmentId } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ status: 'in_transit', location: '', remarks: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/logistics/shipments/${shipmentId}/tracking`, form);
            navigate(`/logistics/shipments/${shipmentId}`);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add tracking update.');
        }
    };

    return (
        <DashboardLayout sidebar={<LogisticsSidebar />} pageTitle="Add Tracking Update">
            <div className="max-w-xl">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm">
                            <option value="picked_up">Picked Up</option>
                            <option value="in_transit">In Transit</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="returned">Returned</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                        <textarea value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                            rows="3" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">Submit Update</button>
                        <Link to={`/logistics/shipments/${shipmentId}`} className="px-6 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">Cancel</Link>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
