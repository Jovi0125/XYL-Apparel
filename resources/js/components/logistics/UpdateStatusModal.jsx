import React, { useState } from 'react';
import axios from 'axios';

const FAILED_REASONS = [
    'Customer unavailable', 'Wrong address', 'Refused by customer',
    'No contact response', 'Weather issue', 'Damaged parcel',
];

export default function UpdateStatusModal({ shipment, onClose }) {
    const [form, setForm] = useState({
        delivery_status: '', location_text: '', remarks: '', failed_reason: '', receiver_name: '',
    });
    const [loading, setLoading] = useState(false);

    const statusOptions = [
        { value: 'picked_up', label: 'Picked Up' },
        { value: 'in_transit', label: 'In Transit' },
        { value: 'out_for_delivery', label: 'Out for Delivery' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'failed', label: 'Failed' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`/logistics/shipments/${shipment.id}/update-status`, form);
            alert('Status updated successfully.');
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed.');
        }
        setLoading(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Update Delivery Status</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <p className="modal-tracking">Shipment: <strong>{shipment.tracking_number}</strong></p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>New Status</label>
                        <div className="status-btn-group">
                            {statusOptions.map(opt => (
                                <button type="button" key={opt.value}
                                    className={`status-option ${form.delivery_status === opt.value ? 'selected' : ''}`}
                                    onClick={() => setForm({ ...form, delivery_status: opt.value })}>
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input type="text" value={form.location_text} onChange={e => setForm({ ...form, location_text: e.target.value })} placeholder="e.g. Manila Hub" />
                    </div>
                    <div className="form-group">
                        <label>Remarks</label>
                        <textarea value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} placeholder="Additional notes..." rows="2" />
                    </div>
                    {form.delivery_status === 'failed' && (
                        <div className="form-group">
                            <label>Failure Reason</label>
                            <select value={form.failed_reason} onChange={e => setForm({ ...form, failed_reason: e.target.value })}>
                                <option value="">Select reason</option>
                                {FAILED_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    )}
                    {form.delivery_status === 'delivered' && (
                        <div className="form-group">
                            <label>Receiver Name</label>
                            <input type="text" value={form.receiver_name} onChange={e => setForm({ ...form, receiver_name: e.target.value })} placeholder="Name of person who received" />
                        </div>
                    )}
                    <button type="submit" className="btn-primary full-width" disabled={!form.delivery_status || loading}>
                        {loading ? 'Updating...' : 'Confirm Update'}
                    </button>
                </form>
            </div>
        </div>
    );
}
