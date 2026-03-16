import React, { useState } from 'react';
import axios from 'axios';

export default function ProofOfDelivery({ shipmentId, onSubmitted }) {
    const [form, setForm] = useState({ receiver_name: '', notes: '' });
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        data.append('receiver_name', form.receiver_name);
        data.append('notes', form.notes || '');
        if (photo) data.append('photo', photo);

        try {
            await axios.post(`/logistics/shipments/${shipmentId}/proof-of-delivery`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Proof of delivery submitted.');
            if (onSubmitted) onSubmitted();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit POD.');
        }
        setLoading(false);
    };

    return (
        <div className="pod-form-card">
            <h4>Submit Proof of Delivery</h4>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Receiver Name</label>
                    <input type="text" value={form.receiver_name} onChange={e => setForm({ ...form, receiver_name: e.target.value })} required placeholder="Who received the parcel?" />
                </div>
                <div className="form-group">
                    <label>Delivery Photo</label>
                    <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} />
                </div>
                <div className="form-group">
                    <label>Notes</label>
                    <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Additional delivery notes..." rows="2" />
                </div>
                <button type="submit" className="btn-primary" disabled={loading || !form.receiver_name}>
                    {loading ? 'Submitting...' : 'Submit POD'}
                </button>
            </form>
        </div>
    );
}
