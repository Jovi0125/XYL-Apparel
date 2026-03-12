import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import UserSidebar from '../partials/Sidebar';

export default function BrowseShop() {
    const { id } = useParams();
    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get(`/customer/shop/${id}`).then(res => {
            setShop(res.data.sellerProfile);
            const data = res.data.products;
            setProducts(Array.isArray(data) ? data : data.data || []);
        }).catch(() => {});
    }, [id]);

    if (!shop) return <DashboardLayout sidebar={<UserSidebar />} pageTitle="Shop"><p className="text-gray-400">Loading...</p></DashboardLayout>;

    return (
        <DashboardLayout sidebar={<UserSidebar />}>
            {/* Shop Banner */}
            <div className="relative rounded-2xl overflow-hidden mb-8">
                {shop.banner ? (
                    <img src={`/storage/${shop.banner}`} alt={shop.shop_name} className="w-full h-48 object-cover" />
                ) : (
                    <div className="w-full h-48 bg-gray-100" />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <div className="flex items-end gap-4">
                        {shop.logo && <img src={`/storage/${shop.logo}`} alt="" className="w-16 h-16 rounded-xl border-2 border-white object-cover" />}
                        <div>
                            <h1 className="text-xl font-bold text-white">{shop.shop_name}</h1>
                            <p className="text-sm text-white/80">{shop.city}</p>
                        </div>
                    </div>
                </div>
            </div>

            {shop.bio && <p className="text-sm text-gray-600 mb-8 max-w-2xl">{shop.bio}</p>}

            {/* Products Grid */}
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((p) => (
                    <Link key={p.id} to={`/browse/product/${p.id}`} className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
                        <div className="aspect-square bg-gray-100">
                            {p.images?.[0] && <img src={`/storage/${p.images[0].path}`} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                        </div>
                        <div className="p-4">
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{p.name}</h3>
                            <p className="text-sm font-semibold text-gray-900 mt-2">₱{Number(p.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </DashboardLayout>
    );
}
