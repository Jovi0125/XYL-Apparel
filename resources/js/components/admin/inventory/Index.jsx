import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import AdminSidebar from "../partials/Sidebar";

export default function AdminInventoryIndex() {
    const [variants, setVariants] = useState([]);
    const [search, setSearch] = useState('');
    const [stockFilter, setStockFilter] = useState('');

    const fetchData = () => {
        const params = {};
        if (search) params.search = search;
        if (stockFilter) params.stock_filter = stockFilter;
        axios.get("/admin/inventory", { params }).then(res => setVariants(res.data.data || [])).catch(() => {});
    };

    useEffect(() => { fetchData(); }, [stockFilter]);

    const handleStockUpdate = (variantId, newStock) => {
        const notes = prompt("Admin reason for adjustment:");
        axios.put(`/admin/inventory/${variantId}`, { stock_quantity: parseInt(newStock), notes })
            .then(() => fetchData())
            .catch(() => alert("Error adjusting stock"));
    };

    return (
        <DashboardLayout sidebar={<AdminSidebar />}>
            <div className="admin-inventory-module">
                <div className="section-title">Global Inventory Overview</div>
                <div className="inventory-controls" style={{display:'flex',gap:'1rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
                    <form onSubmit={e => {e.preventDefault();fetchData();}} style={{display:'flex'}}>
                        <input type="text" placeholder="Search SKU or product..." value={search} onChange={e => setSearch(e.target.value)} style={{border:'1px solid #ccc',padding:'0.5rem',fontSize:'0.85rem',width:220}} />
                        <button type="submit" style={{background:'#111',color:'#fff',border:'none',padding:'0.5rem 1rem',cursor:'pointer',fontSize:'0.85rem'}}>Search</button>
                    </form>
                    <select value={stockFilter} onChange={e => setStockFilter(e.target.value)} style={{border:'1px solid #ccc',padding:'0.5rem',fontSize:'0.85rem'}}>
                        <option value="">All Stock</option>
                        <option value="low">Low Stock</option>
                        <option value="out">Out of Stock</option>
                    </select>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Seller</th>
                            <th>Product</th>
                            <th>Variant</th>
                            <th>SKU</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {variants.map(variant => (
                            <tr key={variant.id}>
                                <td>{variant.product?.seller_profile?.shop_name || '-'}</td>
                                <td>{variant.product?.name}</td>
                                <td>{variant.size} / {variant.color}</td>
                                <td style={{fontFamily:'monospace',fontSize:'0.8rem'}}>{variant.sku || '-'}</td>
                                <td style={{ fontWeight: 600, color: variant.stock_quantity <= 5 ? '#dc2626' : (variant.stock_quantity <= 10 ? '#d97706' : '#111') }}>
                                    {variant.stock_quantity}
                                </td>
                                <td>{variant.status}</td>
                                <td>
                                    <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        const newQ = prompt("Admin override stock:", variant.stock_quantity);
                                        if (newQ !== null && !isNaN(newQ)) handleStockUpdate(variant.id, newQ);
                                    }} style={{color:'#111',textDecoration:'underline',fontWeight:600}}>Adjust</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
