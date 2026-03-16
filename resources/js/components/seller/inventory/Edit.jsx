import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Sidebar from "../partials/Sidebar";

export default function InventoryEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [variant, setVariant] = useState(null);
    const [form, setForm] = useState({ stock_quantity: 0, status: 'active', notes: '' });

    useEffect(() => {
        // Fetch specific variant data (assuming we want to edit it)
        // Since we built the inline adjuster in Index, this is a dedicated full-page edit view
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`/seller/inventory/${id}`, form)
            .then(res => navigate('/seller/inventory'))
            .catch(err => alert("Failed to update"));
    };

    return (
        <DashboardLayout sidebar={<Sidebar />}>
            <div className="inventory-module">
                <div className="inventory-header">
                    <h2>Edit Inventory Variant</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                            <input 
                                type="number" 
                                className="input-minimal mt-1" 
                                value={form.stock_quantity} 
                                onChange={e => setForm({...form, stock_quantity: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Notes / Reason for change</label>
                            <input 
                                type="text" 
                                className="input-minimal mt-1" 
                                value={form.notes} 
                                onChange={e => setForm({...form, notes: e.target.value})} 
                            />
                        </div>
                        <button type="submit" className="btn-minimal">Save Changes</button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
