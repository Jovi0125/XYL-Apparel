import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import InventoryOverview from '../../../Components/admin/inventory/InventoryOverview';
import StockManagementTable from '../../../Components/admin/inventory/StockManagementTable';
import LowStockPanel from '../../../Components/admin/inventory/LowStockPanel';

export default function Inventory({ overview, lowStockProducts }) {
    return (
        <AdminLayout title="Inventory Board" activeItem="inventory">
            <Head title="Xylo Apparel - Inventory" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Inventory Management</h1>
                        <p className="text-slate-400 text-sm">Real-time stock analytics and reorder tracking</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Tasks Container 1: Overview */}
                    <div className="lg:col-span-5">
                        <InventoryOverview data={overview} />
                    </div>

                    {/* Tasks Container 3: Low Stock List */}
                    <div className="lg:col-span-7">
                        <LowStockPanel products={lowStockProducts} />
                    </div>

                    {/* Tasks Container 2: Main Table */}
                    <div className="lg:col-span-12">
                        <StockManagementTable products={lowStockProducts} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
