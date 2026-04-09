import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import InventoryOverview from '../../../Components/admin/inventory/InventoryOverview';
import StockManagementTable from '../../../Components/admin/inventory/StockManagementTable';
import LowStockPanel from '../../../Components/admin/inventory/LowStockPanel';
import SystemInventorySettings from '../../../Components/admin/inventory/SystemInventorySettings';

export default function Inventory({ overview, lowStockProducts, allProducts }) {
    return (
        <AdminLayout title="Inventory Board" activeItem="inventory">
            <Head title="Xylo Apparel - Inventory" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-black tracking-tight">Inventory Management</h1>
                        <p className="text-gray-400 text-sm">Real-time stock analytics and reorder tracking</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Overview Card */}
                    <div className="lg:col-span-5">
                        <InventoryOverview data={overview} />
                    </div>

                    {/* Low Stock Alerts Card */}
                    <div className="lg:col-span-7">
                        <LowStockPanel products={lowStockProducts} thresholds={overview.thresholds} />
                    </div>

                    {/* Stock Management Card */}
                    <div className="lg:col-span-8">
                        <StockManagementTable products={allProducts} />
                    </div>

                    {/* Inventory Settings Card */}
                    <div className="lg:col-span-4">
                        <SystemInventorySettings thresholds={overview.thresholds} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
