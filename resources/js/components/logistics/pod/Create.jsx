import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import LogisticsSidebar from '../partials/Sidebar';

export default function PodCreate() {
    const { shipmentId } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ received_by: '', relationship: '', notes: '' });
    const [photo, setPhoto] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('received_by', form.received_by);
            formData.append('relationship', form.relationship);
            formData.append('notes', form.notes);
            if (photo) formData.append('photo', photo);
            await axios.post(`/logistics/shipments/${shipmentId}/pod`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate(`/logistics/shipments/${shipmentId}`);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to record delivery.');
        }
    };

    return (
        <DashboardLayout sidebar={<LogisticsSidebar />} pageTitle="Record Proof of Delivery">
            <div className="max-w-xl">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Received By</label>
                        <input type="text" value={form.received_by} onChange={(e) => setForm({ ...form, received_by: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Relationship to Customer</label>
                        <input type="text" value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Photo Proof</label>
                        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])}
                            className="w-full text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            rows="3" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">Record Delivery</button>
                        <Link to={`/logistics/shipments/${shipmentId}`} className="px-6 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">Cancel</Link>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
