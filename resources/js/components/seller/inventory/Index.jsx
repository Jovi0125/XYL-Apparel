import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import Sidebar from "../partials/Sidebar";

export default function InventoryIndex() {
    const [variants, setVariants] = useState([]);
    const [search, setSearch] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const fetchData = () => {
        const params = {};
        if (search) params.search = search;
        if (stockFilter) params.stock_filter = stockFilter;
        if (statusFilter) params.status = statusFilter;
        axios.get("/seller/inventory", { params }).then(res => setVariants(res.data.data || [])).catch(() => {});
    };

    useEffect(() => { fetchData(); }, [stockFilter, statusFilter]);

    const handleStockUpdate = (variantId, newStock) => {
        const notes = prompt("Reason for adjustment:");
        axios.put(`/seller/inventory/${variantId}`, { stock_quantity: parseInt(newStock), notes })
            .then(() => fetchData())
            .catch(() => alert("Error updating stock"));
    };

    const handleToggleStatus = (variantId) => {
        axios.patch(`/seller/inventory/${variantId}/toggle-status`)
            .then(() => fetchData())
            .catch(() => alert("Error toggling status"));
    };

    return (
        <DashboardLayout sidebar={<Sidebar />}>
            <div className="inventory-module">
                <div className="inventory-header">
                    <h2>Inventory Management</h2>
                </div>
                <div className="inventory-controls">
                    <form onSubmit={e => { e.preventDefault(); fetchData(); }} className="inv-search">
                        <input type="text" placeholder="Search by SKU or product..." value={search} onChange={e => setSearch(e.target.value)} />
                        <button type="submit">Search</button>
                    </form>
                    <div className="inv-filters">
                        <select value={stockFilter} onChange={e => setStockFilter(e.target.value)}>
                            <option value="">All Stock</option>
                            <option value="low">Low Stock</option>
                            <option value="out">Out of Stock</option>
                        </select>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>SKU</th>
                            <th>Variant</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {variants.map(variant => (
                            <tr key={variant.id}>
                                <td>{variant.product?.name}</td>
                                <td style={{fontFamily:'monospace',fontSize:'0.8rem'}}>{variant.sku || '-'}</td>
                                <td>{variant.size} / {variant.color}</td>
                                <td>₱{variant.sale_price || variant.regular_price || variant.product?.price}</td>
                                <td>
                                    <span className={`stock-level ${variant.stock_quantity > 10 ? 'in-stock' : (variant.stock_quantity > 0 ? 'low-stock' : 'out-of-stock')}`}>
                                        {variant.stock_quantity}
                                    </span>
                                </td>
                                <td>
                                    <span className={`inv-status ${variant.status}`}>{variant.status}</span>
                                </td>
                                <td className="action-cell">
                                    <button className="btn-minimal btn-outline" onClick={() => {
                                        const newQ = prompt("New stock quantity:", variant.stock_quantity);
                                        if (newQ !== null && !isNaN(newQ)) handleStockUpdate(variant.id, newQ);
                                    }}>Update</button>
                                    <button className={`btn-minimal ${variant.status === 'active' ? 'btn-danger-outline' : ''}`} onClick={() => handleToggleStatus(variant.id)}>
                                        {variant.status === 'active' ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {variants.length === 0 && (
                            <tr><td colSpan="7" style={{textAlign: "center", padding: "2rem", color: '#999'}}>No inventory variants found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
